# Quland CMS — Social Login (OAuth)

## 1. Overview

Quland supports social login via Google and Facebook using Laravel Socialite. OAuth credentials are stored in the database (not `.env`) and configured dynamically at runtime.

## 2. Package

- **Laravel Socialite:** `laravel/socialite ^5.15`

## 3. Supported Providers

| Provider | Login Route | Callback Route |
|----------|-------------|----------------|
| Google | `GET /user/login/google` | `GET /user/callback/google` |
| Facebook | `GET /user/login/facebook` | `GET /user/callback/facebook` |

## 4. Dynamic Configuration

Credentials are loaded from `global_settings` table and set at runtime:

```php
// Google
$gmail_client_id = GlobalSetting::where('key', 'gmail_client_id')->first();
$gmail_secret_id = GlobalSetting::where('key', 'gmail_secret_id')->first();
$gmail_redirect_url = GlobalSetting::where('key', 'gmail_redirect_url')->first();

Config::set('services.google.client_id', $gmail_client_id->value);
Config::set('services.google.client_secret', $gmail_secret_id->value);
Config::set('services.google.redirect', $gmail_redirect_url->value);

// Facebook
$facebook_client_id = GlobalSetting::where('key', 'facebook_client_id')->first();
// ... same pattern
Config::set('services.facebook.client_id', $facebook_client_id->value);
Config::set('services.facebook.client_secret', $facebook_secret_id->value);
Config::set('services.facebook.redirect', $facebook_redirect_url->value);
```

## 5. Login Flow

### 5.1 Redirect to Provider

```php
public function redirect_to_google()
{
    // Load credentials from DB, set config
    return Socialite::driver('google')->redirect();
}
```

### 5.2 Handle Callback

```php
public function google_callback()
{
    $get_info = Socialite::driver('google')->user();
    $sessionId = session()->getId();  // Capture before login

    $user = $this->create_user($get_info, 'google');

    // Migrate guest cart
    Cart::where('session_id', $sessionId)->update(['user_id' => $user->id]);

    auth()->login($user);
    return redirect()->route('user.dashboard');
}
```

### 5.3 Create or Find User

```php
private function create_user($get_info, $provider)
{
    $user = User::where('email', $get_info->getEmail())->first();

    if ($user) {
        return $user;
    }

    return User::create([
        'name' => $get_info->getName(),
        'email' => $get_info->getEmail(),
        'provider' => $provider,
        'provider_id' => $get_info->getId(),
        'email_verified_at' => now(),
        'status' => 'enable',
        'is_banned' => 'no',
    ]);
}
```

**Key Behaviors:**
- If email already exists → returns existing user (regardless of provider)
- New social users have `email_verified_at` set immediately (no verification needed)
- No password is set for social login users
- Social login users **cannot** use password login (checked in `store_login()` via `provider !== null`)

## 6. Admin Configuration

Settings are managed via Admin → Settings → Social Login:

```
GET  /admin/social-login-setting → show form
POST /admin/social-login-setting-update → save credentials
```

**Configurable per provider:**
- Client ID
- Client Secret
- Redirect URL
- Login Status (enable/disable)

## 7. Frontend Toggle

Social login buttons are conditionally shown:

```blade
@if($settings['gmail_login_status'] ?? false)
    <a href="{{ route('user.login.google') }}" class="btn btn-google">
        <i class="fab fa-google"></i> Login with Google
    </a>
@endif

@if($settings['facebook_login_status'] ?? false)
    <a href="{{ route('user.login.facebook') }}" class="btn btn-facebook">
        <i class="fab fa-facebook"></i> Login with Facebook
    </a>
@endif
```

## 8. Security Notes

- OAuth credentials stored in database as plain text
- Redirect URL must match exactly in Google/Facebook developer console
- No state parameter validation beyond Socialite's built-in handling
- Social users cannot set a password through the profile (no conversion to local auth)
