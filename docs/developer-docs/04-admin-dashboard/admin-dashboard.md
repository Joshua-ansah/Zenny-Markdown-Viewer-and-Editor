# Quland CMS — Admin Dashboard & Panel

## 1. Overview

The admin panel is a comprehensive backend management interface accessible at `/admin/*`. It requires `auth:admin` guard authentication and provides full CMS control: site settings, content management, user management, order processing, and module configuration.

## 2. Admin Routes Structure

**File:** `routes/web.php`

```php
Route::group(['as' => 'admin.', 'prefix' => 'admin'], function () {
    // Public: login, register, logout
    Route::get('login', [AdminLoginController::class, 'custom_login_page'])->name('login');
    Route::post('store-login', [AdminLoginController::class, 'store_login'])->name('store.login');
    Route::post('store-register', [AdminLoginController::class, 'store_register'])->name('store.register');
    Route::post('logout', [AdminLoginController::class, 'admin_logout'])->name('logout');

    // Protected routes
    Route::group(['middleware' => ['auth:admin']], function () {
        // Dashboard
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // User management
        Route::get('users', [UserController::class, 'all_user'])->name('user');
        Route::get('user/ban/{user_id}', [UserController::class, 'ban_user'])->name('ban.user');
        Route::get('user/delete/{user_id}', [UserController::class, 'delete_user'])->name('delete.user');
        Route::get('user/show/{user_id}', [UserController::class, 'show_user'])->name('show.user');

        // Frontend section management
        Route::get('frontend/{key}', [FrontEndManagementController::class, 'index'])->name('front-end.index');
        Route::post('frontend', [FrontEndManagementController::class, 'store'])->name('front-end.store');
        Route::put('frontend/{id}', [FrontEndManagementController::class, 'update'])->name('front-end.update');
        Route::get('frontend-edit/{id}', [FrontEndManagementController::class, 'edit'])->name('front-end.edit');
        Route::delete('frontend/{id}', [FrontEndManagementController::class, 'destroy'])->name('front-end.destroy');
        Route::get('frontend-status/{id}', [FrontEndManagementController::class, 'status_update'])->name('front-end.status');

        // Section ordering
        Route::get('manage-section', [SectionManageController::class, 'manage_section'])->name('manage.section');
        Route::put('manage-section/{id}', [SectionManageController::class, 'manage_update'])->name('manage.section.update');
        Route::get('manage-section-status/{id}/{status}', [SectionManageController::class, 'manage_status'])->name('manage.section.status');

        // OpenAI
        Route::post('open-ai', [OpenAIController::class, 'text_generate'])->name('openai.text');

        // Module routes (each module registers its own admin routes)
    });
});
```

## 3. Dashboard Controller

**File:** `app/Http/Controllers/Admin/DashboardController.php`

### 3.1 Dashboard View (`index()`)

Returns key business metrics:

```php
public function index()
{
    $data['active_order'] = Order::where('status', Status::ACTIVE_ORDER)->count();
    $data['complete_order'] = Order::where('status', Status::COMPLETE_ORDER)->count();
    $data['cancel_order'] = Order::where('status', Status::CANCEL_ORDER)->count();
    $data['total_order'] = Order::where('status', '!=', 0)->count();

    // Daily revenue chart data for current month
    $data['days'] = [];
    $data['total_amount_per_day'] = [];
    $start = Carbon::now()->startOfMonth();
    $end = Carbon::now()->endOfMonth();
    $currentDate = $start->copy();
    while ($currentDate->lte($end)) {
        $data['days'][] = $currentDate->format('M-d');
        $data['total_amount_per_day'][] = Order::whereDate('created_at', $currentDate)
            ->where('status', '!=', 0)
            ->sum('total');
        $currentDate->addDay();
    }

    return view('admin.dashboard', $data);
}
```

**Dashboard Displays:**
- Active orders count
- Completed orders count
- Cancelled orders count
- Total orders count
- Daily revenue line chart for current month

## 4. User Management

**Controller:** `app/Http/Controllers/Admin/UserController.php`

### 4.1 User Listing

```
GET /admin/users → all_user()
```
- Paginated user list (15 per page)
- Search by name or email (`LIKE %query%`)

### 4.2 Ban User

```
GET /admin/user/ban/{user_id} → ban_user()
```
- Toggles `is_banned` between `'yes'` and `'no'`
- Returns JSON response with new status

### 4.3 Delete User

```
GET /admin/user/delete/{user_id} → delete_user()
```
- Deletes user and associated profile image
- Cascading deletes handled at application level

### 4.4 Show User

```
GET /admin/user/show/{user_id} → show_user()
```
- Displays user profile with order history
- Shows orders paginated (15 per page)
- Includes order details with product images

## 5. Frontend Section Builder (CMS)

### 5.1 Architecture

The Section Builder is the core CMS feature. It manages all frontend content dynamically.

**Components:**
1. **Section Definitions** — `resources/views/admin/settings.json` (1,347 lines)
2. **Section Manager** — `manage_sections` table controls visibility & ordering
3. **Content Storage** — `frontends` table stores all section content
4. **Admin UI** — `FrontEndManagementController` provides CRUD

### 5.2 Section Configuration File

**File:** `resources/views/admin/settings.json`

Each section is defined with a unique key and specifies its data structure:

```json
{
    "hero_section": {
        "title": "Hero Section",
        "subtitle": "Section for the hero/banner area",
        "has_image": true,
        "content": {
            "heading": "text",
            "sub_heading": "textarea",
            "button_text": "text",
            "button_url": "text",
            "image": "image"
        },
        "element": false,
        "has_lang": true
    }
}
```

**Field Types:**
- `text` — Single-line text input
- `textarea` — Multi-line text area
- `icon` — Icon picker input
- `image` — Image upload field

**Section Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | string | Display name in admin UI |
| `subtitle` | string | Description of the section |
| `has_image` | boolean | Whether the section has image uploads |
| `content` | object | Fixed content fields for the section |
| `element` | object/false | Repeatable element fields (false = not repeatable) |
| `has_lang` | boolean | Whether content supports multi-language |

### 5.3 Frontend Management Controller

**File:** `app/Http/Controllers/Admin/FrontEndManagementController.php`

#### `index($key)` — Section Content Listing

1. Reads section definition from `settings.json` using `$key`
2. Determines if section has `content` (singleton) or `element` (repeatable)
3. Loads existing content from `frontends` table:
   ```php
   Frontend::where('data_key', $key . '.content')->first()
   // or for elements:
   Frontend::where('data_key', $key . '.element')->latest()->get()
   ```
4. Returns appropriate admin view (content form or element CRUD table)

#### `store(Request $request)` — Create/Update Content

1. Reads field definitions from `settings.json`
2. For **content** (singleton):
   - Uses `updateOrCreate` on `data_key`
   - Builds `data_values` JSON from form fields + language translations
   - Handles image upload (saves to `public/uploads/frontend_images/`)
3. For **elements** (repeatable):
   - Creates new `Frontend` record
   - Each element gets the same `data_key` (e.g., `partner.element`)

#### Multi-Language Content Handling

For sections with `has_lang: true`:
```php
// Default language values stored in main field
$data_values['heading'] = $request->heading;

// Translated values stored in language-keyed sub-object
foreach ($languages as $lang) {
    $data_values[$lang->code]['heading'] = $request->input("heading_{$lang->code}");
}
```

#### Image Upload Process

```php
if ($request->hasFile('image')) {
    // Delete old image
    if (isset($old_data->data_values->image)) {
        @unlink(public_path('uploads/frontend_images/' . $old_data->data_values->image));
    }
    // Save new image
    $fileName = uniqid() . '.' . $file->getClientOriginalExtension();
    $file->move(public_path('uploads/frontend_images/'), $fileName);
    $data_values['image'] = $fileName;
}
```

### 5.4 Section Management Controller

**File:** `app/Http/Controllers/Admin/SectionManageController.php`

Controls which sections appear on the frontend and their display order.

#### `manage_section()` — List Sections

- Returns all `ManageSection` entries sorted by `position`
- Each entry has: `section_key`, `section_name`, `theme`, `status`, `position`

#### `manage_update($id)` — Reorder Section

```php
public function manage_update(Request $request, $id)
{
    ManageSection::find($id)->update([
        'position' => $request->position
    ]);
}
```

#### `manage_status($id, $status)` — Toggle Visibility

```php
public function manage_status($id, $status)
{
    ManageSection::find($id)->update(['status' => $status]);
}
```

## 6. Global Settings Management

**Controller:** `Modules/GlobalSetting/Http/Controllers/GlobalSettingController.php` (~749 lines)

### 6.1 Settings Categories

| Setting Category | Route | Description |
|-----------------|-------|-------------|
| General | `admin.general.setting` | Site name, logo, favicon, timezone, phone, email, address |
| Social Login | `admin.social.login.setting` | Google & Facebook OAuth credentials |
| Recaptcha | `admin.recaptcha.setting` | Google reCAPTCHA site key & secret |
| Analytics | `admin.analytics.setting` | Google Analytics tracking ID |
| Facebook Pixel | `admin.pixel.setting` | Facebook Pixel ID |
| Tawk Chat | `admin.tawk.setting` | Tawk.to live chat widget ID |
| Maintenance | `admin.maintenance.setting` | Maintenance mode toggle & message |
| Cookie Consent | `admin.cookie.setting` | Cookie consent banner text/status |
| Color Theme | `admin.color.setting` | Primary/secondary colors per theme |
| Theme Selection | `admin.theme.select` | Active theme (1–7) |
| Breadcrumb | `admin.breadcrumb.setting` | Breadcrumb background image |

### 6.2 Settings Storage Pattern

All settings use key-value pattern in `global_settings` table:

```php
public function general_setting_update(Request $request)
{
    $fields = ['site_name', 'site_email', 'site_phone', 'site_address', 'timezone'];
    foreach ($fields as $field) {
        GlobalSetting::updateOrCreate(
            ['key' => $field],
            ['value' => $request->$field]
        );
    }
    // Handle file uploads (logo, favicon) separately
}
```

### 6.3 Theme Selection

```php
public function theme_select_update(Request $request)
{
    GlobalSetting::updateOrCreate(
        ['key' => 'active_theme'],
        ['value' => $request->theme]  // Values: 'theme_one' through 'theme_seven'
    );
    cache()->forget('settings');
    // Also seeds ManageSection entries for the selected theme
}
```

### 6.4 Database Clear Feature

**CRITICAL:** This is a destructive operation:

```php
public function database_clear()
{
    // Truncates ALL content tables:
    Frontend::query()->truncate();
    ManageSection::query()->truncate();
    Category::query()->truncate();
    Product::query()->truncate();
    Brand::query()->truncate();
    // ... ~20 more models
    Coupon::query()->truncate();
    Blog::query()->truncate();
    Order::query()->truncate();
    // Re-seeds default data
}
```

**Route:** `GET /admin/global-setting/database-clear`

## 7. Admin Module Routes

Each module registers admin routes in `Modules/{Module}/Routes/web.php`. Below is the complete registry:

### 7.1 Blog Module

```
admin/blogs         → CRUD listing
admin/blog/create   → Create blog
admin/blog/{id}/edit → Edit blog
admin/blog/{id}     → Delete blog
admin/blog-comment  → Comment moderation
admin/blog-category → Category CRUD
```

### 7.2 Ecommerce Module

```
admin/products          → Product listing
admin/product/create    → Create product (multi-lang, gallery)
admin/product/{id}/edit → Edit product
admin/product/{id}      → Delete product
admin/orders            → Order listing
admin/order/{id}        → Order detail
admin/order-status/{id} → Update order status
admin/shipping-method   → Shipping method CRUD
admin/reviews           → Review moderation
```

### 7.3 Subscription Module

```
admin/subscriptions → Plan CRUD
admin/subscription/create → Create plan
admin/subscription/{id}/edit → Edit plan
```

### 7.4 PaymentGateway Module

```
admin/payment-gateways → Gateway listing
admin/payment-gateway/{id}/edit → Edit credentials
admin/payment-gateway-status/{id} → Toggle gateway
```

### 7.5 Other Module Routes

| Module | Admin Route Prefix | Key Operations |
|--------|--------------------|----------------|
| Newsletter | `admin/newsletter` | Subscriber list, bulk email |
| SupportTicket | `admin/support-tickets` | Ticket listing, reply |
| Testimonial | `admin/testimonials` | CRUD |
| Team | `admin/teams` | CRUD |
| Partner | `admin/partners` | Logo CRUD |
| Brand | `admin/brands` | CRUD |
| FAQ | `admin/faqs` | CRUD |
| Category | `admin/categories` | CRUD with hierarchy |
| Menu | `admin/menus` | Menu builder, items, ordering |
| Page | `admin/pages` | Custom page CRUD |
| Country/State/City | `admin/countries`, etc. | Location CRUD |
| Language | `admin/languages` | Language CRUD, translation editor |
| Currency | `admin/currencies` | Currency CRUD |
| SEO Setting | `admin/seo-setting` | Meta titles, descriptions, OG tags |
| EmailSetting | `admin/email-settings` | SMTP config, email templates |
| Coupon | `admin/coupons` | Coupon CRUD |
| ContactMessage | `admin/contact-messages` | Read, reply, delete |
| Listing | `admin/listings` | Listing CRUD |
| Project | `admin/projects` | Project CRUD |
| Wishlist | `admin/wishlists` | View all wishlists |

## 8. OpenAI Integration

**Controller:** `app/Http/Controllers/Admin/OpenAIController.php`

**Route:** `POST /admin/open-ai` → `text_generate()`

```php
public function text_generate(Request $request)
{
    $open_ai_key = GlobalSetting::where('key', 'open_ai_secret_key')->first();
    Config::set('openai.api_key', $open_ai_key->value);

    $result = OpenAI::chat()->create([
        'model' => config('openai.model'),   // gpt-4o-mini
        'messages' => [
            ['role' => 'user', 'content' => $request->text_field],
        ],
        'max_tokens' => (int) config('openai.max_tokens'),  // 500
    ]);

    return response()->json([
        'response' => $result->choices[0]->message->content
    ]);
}
```

**Usage:** Called via AJAX from admin forms to auto-generate content (blog descriptions, product descriptions, SEO text).

## 9. Admin View Structure

```
resources/views/admin/
├── auth/
│   └── login.blade.php
├── dashboard.blade.php
├── user/
│   ├── all.blade.php
│   └── show.blade.php
├── frontend_management/
│   ├── index.blade.php
│   └── edit.blade.php
├── section_manage/
│   └── index.blade.php
├── settings/
│   ├── general.blade.php
│   ├── social_login.blade.php
│   ├── recaptcha.blade.php
│   ├── analytics.blade.php
│   ├── tawk.blade.php
│   ├── maintenance.blade.php
│   ├── cookie.blade.php
│   ├── color.blade.php
│   ├── theme.blade.php
│   └── breadcrumb.blade.php
└── settings.json           ← Section definitions (1,347 lines)
```

## 10. Admin Request Lifecycle

```
Request → Global Middleware → Web Middleware (DemoMode, XSS, Currency)
       → auth:admin Guard Check
       → Admin Controller
       → Database Query / Mutation
       → cache()->forget('settings')  ← Most mutations clear settings cache
       → return view() with flash message
```

### Cache Invalidation Pattern

Most admin operations clear the global settings cache:

```php
cache()->forget('settings');
return redirect()->back()->with('success', 'Updated successfully');
```

This ensures frontend picks up changes immediately since `AppServiceProvider::boot()` loads settings from cache via a view composer.
