# Quland CMS — Authentication & Authorization

## 1. Overview

Quland implements a **dual-guard authentication system** separating admin and user authentication entirely. Both use session-based authentication with separate Eloquent user providers.

## 2. Guard Configuration

**File:** `config/auth.php`

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'admin' => [
        'driver' => 'session',
        'provider' => 'admins',
    ],
],

'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\Models\User::class,
    ],
    'admins' => [
        'driver' => 'eloquent',
        'model' => App\Models\Admin::class,
    ],
],

'passwords' => [
    'users' => [
        'provider' => 'users',
        'table' => 'password_reset_tokens',
        'expire' => 60,
        'throttle' => 60,
    ],
    'admins' => [
        'provider' => 'admins',
        'table' => 'password_reset_tokens',
        'expire' => 60,
        'throttle' => 60,
    ],
],
```

## 3. Admin Authentication

### 3.1 Login Flow

**Controller:** `app/Http/Controllers/Admin/Auth/LoginController.php`

**Route:**
```
GET  /admin/login     → LoginController::custom_login_page()
POST /admin/store-login → LoginController::store_login()
POST /admin/logout    → LoginController::admin_logout()
```

**Login Process:**
1. Validates email and password (no reCAPTCHA for admin)
2. Finds Admin by email
3. Checks `status === 'enable'`
4. Verifies password with `Hash::check()`
5. Attempts `Auth::guard('admin')->attempt($credentials, $remember)`
6. Redirects to `admin.dashboard`

**View:** `resources/views/admin/auth/login.blade.php`

### 3.2 Admin Registration (First-Time Setup)

**Route:** `POST /admin/store-register` → `LoginController::store_register()`

**Process:**
1. Checks if any admin exists (`Admin::exists()`)
2. If no admin exists, allows registration of the first super admin
3. Creates admin with `admin_type = 'super_admin'`
4. Auto-logs in the new admin

**Validation:**
```php
'name' => ['required', 'string', 'max:255'],
'email' => ['required', 'string', 'email', 'max:255', 'unique:admins'],
'password' => ['required', 'confirmed', 'min:4', 'max:100']
```

### 3.3 Admin Middleware Protection

All admin routes are wrapped with `'middleware' => ['auth:admin']`:

```php
Route::group(['as' => 'admin.', 'prefix' => 'admin'], function () {
    // Public: login, register, logout
    Route::group(['middleware' => ['auth:admin']], function () {
        // All protected admin routes
    });
});
```

### 3.4 Admin Redirect Middleware

**File:** `app/Http/Middleware/AdminRedirectMiddleware.php`

```php
public function handle(Request $request, Closure $next): Response
{
    if (Auth::guard('admin')->check()) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('admin.login');
}
```

Registered as `'admin.redirect'` — applied to bare `/admin` URL.

## 4. User Authentication

### 4.1 Registration Flow

**Controller:** `app/Http/Controllers/Auth/RegisterController.php`

**Routes:**
```
GET  /user/register       → RegisterController::seller_register_page()
POST /user/store-register → RegisterController::store_register()
GET  /user/register-verification → RegisterController::register_verification()
```

**Registration Process:**
1. Validates name, email (unique), password (confirmed, min 4), reCAPTCHA
2. Creates `User` with:
   - `status = 'enable'`
   - `is_banned = 'no'`
   - `verification_token = Str::random(100)`
   - `email_verified_at = null` (unverified)
3. Configures SMTP via `EmailHelper::mail_setup()`
4. Generates verification link: `route('user.register-verification') + ?verification_link={token}&email={email}`
5. Sends verification email using `EmailTemplate` #4 with `UserRegistration` mailable
6. Redirects back with success message

### 4.2 Email Verification

**Route:** `GET /user/register-verification` → `RegisterController::register_verification()`

**Process:**
1. Finds user by `verification_token` + `email`
2. If already verified, redirects with error
3. Sets `email_verified_at = date('Y-m-d H:i:s')`
4. Clears `verification_token = null`
5. Redirects to login page

### 4.3 Login Flow

**Controller:** `app/Http/Controllers/Auth/LoginController.php`

**Routes:**
```
GET  /user/login       → LoginController::custom_login_page()
POST /user/store-login → LoginController::store_login()
GET  /user/logout      → LoginController::seller_logout()
```

**Login Process:**
1. Validates email, password, reCAPTCHA
2. Finds user by email
3. Status checks:
   - `status === 'enable'` AND `is_banned === 'no'`
   - `email_verified_at !== null` (email must be verified)
   - `provider` must be null (social login users can't use password login)
   - `feez_status !== 1` (account not frozen)
4. Verifies password with `Hash::check()`
5. Captures `session()->getId()` BEFORE login
6. Attempts `Auth::guard('web')->attempt($credentials, $remember)`
7. **Guest Cart Migration:** Converts session-based cart items to user cart:
   ```php
   Cart::where('session_id', $sessionId)->update(['user_id' => $user->id]);
   ```
8. Redirects to `user.dashboard`

**Logout:**
1. Sets `user->online = 0`
2. Calls `Auth::guard('web')->logout()`
3. Redirects to login page

### 4.4 Password Reset

**Routes:**
```
GET  /user/forget-password       → LoginController::forget_password()
POST /user/send-forget-password  → LoginController::send_custom_forget_pass()
GET  /user/reset-password        → LoginController::custom_reset_password()
POST /user/store-reset-password/{token} → LoginController::store_reset_password()
```

**Process:**
1. User submits email + reCAPTCHA
2. System generates `forget_password_token = Str::random(100)`
3. Builds reset link: `route('user.reset-password') + ?token={token}&email={email}`
4. Sends email using `EmailTemplate` #1 via `UserForgetPassword` mailable
5. User clicks link → finds user by token + email
6. User submits new password (validated: confirmed, min 4, max 100, reCAPTCHA)
7. Updates password, clears `forget_password_token = null`

> **Note:** The system uses custom token-based password reset, NOT Laravel's built-in `password.email` / `password.reset` routes.

## 5. Social Login (OAuth)

**Package:** `laravel/socialite` v5.15

**Supported Providers:** Google, Facebook

### 5.1 Google Login

**Routes:**
```
GET /user/login/google    → LoginController::redirect_to_google()
GET /user/callback/google → LoginController::google_callback()
```

**Process:**
1. Loads OAuth credentials from `global_settings` table (NOT from config/services.php)
2. Dynamically sets config:
   ```php
   Config::set('services.google.client_id', $gmail_client_id->value);
   Config::set('services.google.client_secret', $gmail_secret_id->value);
   Config::set('services.google.redirect', $gmail_redirect_url->value);
   ```
3. Redirects to Google OAuth
4. On callback: retrieves user info from Google
5. Calls `create_user($get_info, 'google')`:
   - If user with email exists → returns existing user
   - If new → creates user with `provider='google'`, `email_verified_at` set, no password
6. Migrates guest cart: `Cart::where('session_id', $sessionId)->update(['user_id' => $user->id])`
7. Logs in user via `auth()->login($user)`

### 5.2 Facebook Login

**Routes:**
```
GET /user/login/facebook    → LoginController::redirect_to_facebook()
GET /user/callback/facebook → LoginController::facebook_callback()
```

Identical flow to Google, using `facebook_client_id`, `facebook_secret_id`, `facebook_redirect_url` from `global_settings`.

### 5.3 Social Login Configuration

Managed via admin panel at `GlobalSettingController::social_login_update()`:
- Facebook: client_id, secret_id, redirect_url, login_status
- Gmail: client_id, secret_id, redirect_url, login_status

## 6. Middleware Stack

### 6.1 Global Middleware (Applied to ALL requests)

| Middleware | File | Purpose |
|-----------|------|---------|
| `TrustProxies` | `app/Http/Middleware/TrustProxies.php` | Reverse proxy handling |
| `HandleCors` | Laravel built-in | CORS headers |
| `PreventRequestsDuringMaintenance` | `app/Http/Middleware/PreventRequestsDuringMaintenance.php` | Laravel maintenance mode |
| `ValidatePostSize` | Laravel built-in | POST size limit |
| `TrimStrings` | `app/Http/Middleware/TrimStrings.php` | Trim whitespace |
| `ConvertEmptyStringsToNull` | Laravel built-in | Empty strings → null |

### 6.2 Web Middleware Group

| Middleware | File | Purpose |
|-----------|------|---------|
| `EncryptCookies` | Standard | Cookie encryption |
| `AddQueuedCookiesToResponse` | Standard | Cookie management |
| `StartSession` | Standard | Session initialization |
| `ShareErrorsFromSession` | Standard | Validation errors |
| `VerifyCsrfToken` | Standard | CSRF protection |
| `SubstituteBindings` | Standard | Route model binding |
| `DemoMode` | `app/Http/Middleware/DemoMode.php` | Blocks mutations in demo mode |
| `XSSProtect` | `app/Http/Middleware/XSSProtect.php` | Strips dangerous tags |
| `CurrencyLangauge` | `app/Http/Middleware/CurrencyLangauge.php` | Sets session language & currency |

### 6.3 Custom Middleware Aliases

| Alias | Class | Purpose |
|-------|-------|---------|
| `auth` | `Authenticate` | Authentication check |
| `guest` | `RedirectIfAuthenticated` | Guest-only access |
| `MaintenanceMode` | `MaintenanceMode` | Custom maintenance mode |
| `HtmlSpecialchars` | `HtmlSpecialchars` | Additional XSS sanitization |
| `admin.redirect` | `AdminRedirectMiddleware` | Admin URL redirect logic |

### 6.4 DemoMode Middleware

```php
// Allows: login, logout, cart operations
if (Route::is('user.store-login') || Route::is('admin.store-login') || ...) {
    return $next($request);
}
// Blocks ALL POST/PUT/DELETE/PATCH when APP_MODE=DEMO
if (env('APP_MODE') == 'DEMO') {
    if ($request->isMethod('post') || $request->isMethod('delete') || ...) {
        return response 403 or redirect with error
    }
}
```

### 6.5 XSSProtect Middleware

```php
// Strips all HTML tags EXCEPT a whitelist:
$allowedTags = '<span><p><a><b><i><u><strong><br><hr><table><tr><th><td>
               <ul><ol><li><h1><h2><h3><h4><h5><h6><del><ins><sup><sub>
               <pre><address><img><figure><embed><iframe><video><style>';
```

### 6.6 MaintenanceMode Middleware

```php
public function handle(Request $request, Closure $next): Response
{
    $maintenance_status = GlobalSetting::where('key', 'maintenance_status')->first();
    if ($maintenance_status->value == 1) {
        return response()->view('maintenance');
    }
    return $next($request);
}
```

Applied to all frontend routes via `Route::group(['middleware' => ['MaintenanceMode']])`.

## 7. Role & Permission Model

Quland uses a **simple dual-role model** without a dedicated RBAC package:

| Role | Guard | Model | Access |
|------|-------|-------|--------|
| Admin (Super Admin) | `admin` | `App\Models\Admin` | Full admin panel access |
| User | `web` | `App\Models\User` | Frontend + user dashboard |

- **No Policies** are implemented
- **No permissions table** exists
- Access control is purely guard-based (admin vs web)
- Admin has `admin_type = 'super_admin'` but this is not used for granular permissions

## 8. Account Security Features

| Feature | Implementation |
|---------|---------------|
| Account Freeze | `users.feez_status = 1` prevents login |
| Account Ban | `users.is_banned = 'yes'` prevents login |
| Account Disable | `users.status = 'disable'` prevents login |
| Account Deletion | Full cascade delete of orders, reviews, wishlists, carts, image |
| Password Requirements | Minimum 4 characters, maximum 100, must be confirmed |
| Session Management | File-based sessions, 120-minute lifetime |

## 9. reCAPTCHA Integration

**Rule Class:** `app/Rules/Captcha.php`

```php
public function validate(string $attribute, mixed $value, Closure $fail): void
{
    $google_recaptcha = GlobalSetting::where('key', 'recaptcha_secret_key')->first();
    $recaptcha = new ReCaptcha($google_recaptcha->value);
    $response = $recaptcha->verify($value, $_SERVER['REMOTE_ADDR']);
    if (!$response->isSuccess()) {
        $fail('Please complete the recaptcha to submit the form');
    }
}
```

Applied to: user login, user registration, password reset, blog comments, contact form.
