# Quland CMS — Admin Settings & Configuration

## 1. Overview

The GlobalSetting module centralizes all site-wide configuration. Settings are stored as key-value pairs in the `global_settings` table and cached for performance.

## 2. Settings Categories

### 2.1 General Settings

| Key | Description | Example |
|-----|-------------|---------|
| `site_name` | Site name | "Quland" |
| `site_email` | Site email | "info@quland.com" |
| `site_phone` | Contact phone | "+1234567890" |
| `site_address` | Site address | "123 Main St" |
| `timezone` | PHP timezone | "UTC" |
| `site_logo` | Logo filename | "logo.png" |
| `site_favicon` | Favicon filename | "favicon.ico" |
| `footer_logo` | Footer logo | "footer_logo.png" |

### 2.2 Social Login

| Key | Description |
|-----|-------------|
| `facebook_client_id` | Facebook OAuth App ID |
| `facebook_secret_id` | Facebook OAuth Secret |
| `facebook_redirect_url` | Facebook Callback URL |
| `facebook_login_status` | Enable/disable (1/0) |
| `gmail_client_id` | Google OAuth Client ID |
| `gmail_secret_id` | Google OAuth Secret |
| `gmail_redirect_url` | Google Callback URL |
| `gmail_login_status` | Enable/disable (1/0) |

### 2.3 reCAPTCHA

| Key | Description |
|-----|-------------|
| `recaptcha_site_key` | Google reCAPTCHA v2 Site Key |
| `recaptcha_secret_key` | Google reCAPTCHA v2 Secret Key |
| `recaptcha_status` | Enable/disable (1/0) |

### 2.4 Analytics & Tracking

| Key | Description |
|-----|-------------|
| `google_analytics_id` | GA Tracking ID |
| `google_analytics_status` | Enable/disable (1/0) |
| `facebook_pixel_id` | FB Pixel ID |
| `facebook_pixel_status` | Enable/disable (1/0) |

### 2.5 Live Chat

| Key | Description |
|-----|-------------|
| `tawk_chat_id` | Tawk.to Widget ID |
| `tawk_chat_status` | Enable/disable (1/0) |

### 2.6 Maintenance Mode

| Key | Description |
|-----|-------------|
| `maintenance_status` | Enable/disable (1/0) |
| `maintenance_title` | Maintenance page title |
| `maintenance_description` | Maintenance page description |

### 2.7 Cookie Consent

| Key | Description |
|-----|-------------|
| `cookie_status` | Enable/disable (1/0) |
| `cookie_text` | Cookie consent banner text |
| `cookie_button_text` | Accept button text |

### 2.8 Theme & Colors

| Key | Description |
|-----|-------------|
| `active_theme` | Active theme (theme_one to theme_seven) |
| `primary_color` | Primary brand color (#hex) |
| `secondary_color` | Secondary brand color (#hex) |

### 2.9 Breadcrumb

| Key | Description |
|-----|-------------|
| `breadcrumb_image` | Background image for breadcrumb section |

### 2.10 OpenAI

| Key | Description |
|-----|-------------|
| `open_ai_secret_key` | OpenAI API Key |

## 3. Settings Cache Pattern

### 3.1 Loading Settings

**File:** `app/Providers/AppServiceProvider.php`

```php
View::composer('*', function ($view) {
    $settings = cache()->remember('settings', 3600, function () {
        return GlobalSetting::pluck('value', 'key')->toArray();
    });
    $view->with('settings', $settings);
});
```

### 3.2 Cache Invalidation

After any setting update:
```php
cache()->forget('settings');
```

### 3.3 Accessing Settings

In Blade templates:
```blade
{{ $settings['site_name'] ?? 'Default' }}
{{ $settings['site_email'] ?? '' }}
```

In Controllers/Helpers:
```php
$settings = cache('settings');
$siteName = $settings['site_name'] ?? 'Default';
```

## 4. Database Clear

**Route:** `GET /admin/global-setting/database-clear`

This is a **destructive** operation that truncates ALL content tables:

```php
public function database_clear()
{
    Frontend::query()->truncate();
    ManageSection::query()->truncate();
    Category::query()->truncate();
    Product::query()->truncate();
    Brand::query()->truncate();
    Blog::query()->truncate();
    BlogCategory::query()->truncate();
    BlogComment::query()->truncate();
    Team::query()->truncate();
    Testimonial::query()->truncate();
    Partner::query()->truncate();
    FAQ::query()->truncate();
    Page::query()->truncate();
    Menu::query()->truncate();
    MenuItem::query()->truncate();
    Slider::query()->truncate();
    Project::query()->truncate();
    Coupon::query()->truncate();
    Order::query()->truncate();
    OrderDetail::query()->truncate();
    Review::query()->truncate();
    Newsletter::query()->truncate();
    SupportTicket::query()->truncate();
    SupportTicketMessage::query()->truncate();
    ContactMessage::query()->truncate();

    // Re-seeds default settings/data
    cache()->forget('settings');
}
```

> **Warning:** There is no confirmation dialog or undo capability. This permanently destroys all content.

## 5. File Upload Paths

| Setting | Upload Path |
|---------|------------|
| Site Logo | `public/uploads/settings/` |
| Favicon | `public/uploads/settings/` |
| Footer Logo | `public/uploads/settings/` |
| Breadcrumb Image | `public/uploads/settings/` |
| OG Image | `public/uploads/seo/` |

## 6. Maintenance Mode

**Middleware:** `app/Http/Middleware/MaintenanceMode.php`

When `maintenance_status = 1`:
- All frontend routes return the maintenance view
- Admin panel remains accessible
- Applied to the `MaintenanceMode` middleware alias on frontend route group only

```php
// routes/web.php
Route::group(['middleware' => ['MaintenanceMode']], function () {
    // All public frontend routes
});
```
