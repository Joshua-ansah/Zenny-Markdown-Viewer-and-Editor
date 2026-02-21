# Quland CMS — Architecture Overview

## 1. Project Structure

Quland is a **Laravel 10** Content Management System built on a **modular monolith** architecture using the `nwidart/laravel-modules` package. The application follows MVC with 27 self-contained feature modules.

```
quland/
├── main_files/main_files/       # Main Laravel application root
│   ├── app/                     # Core application logic
│   │   ├── Console/Kernel.php   # Task scheduling
│   │   ├── Constants/Status.php # Global status constants
│   │   ├── Exceptions/          # Exception handlers
│   │   ├── Helper/              # Global helpers (helper.php, EmailHelper.php)
│   │   ├── Http/                # Controllers, Middleware, Requests, Kernel
│   │   ├── Mail/                # Mailable classes
│   │   ├── Models/              # Core Eloquent models
│   │   ├── Providers/           # Service providers
│   │   ├── Rules/               # Custom validation rules (Captcha)
│   │   └── Traits/              # Reusable traits (GlobalStatus)
│   ├── bootstrap/               # Framework bootstrap (app.php)
│   ├── config/                  # Configuration files (22 config files)
│   ├── database/                # Migrations, seeders, factories
│   ├── lang/                    # JSON translation files (en.json, esp.json)
│   ├── Modules/                 # Feature modules (27 modules)
│   ├── public/                  # Web root, compiled assets
│   ├── resources/               # Views (333 Blade files), CSS, JS, Sass
│   ├── routes/                  # Route definitions (web.php, api.php)
│   ├── storage/                 # Logs, cache, sessions
│   ├── stubs/                   # Module generation stubs
│   ├── tests/                   # PHPUnit tests
│   └── vendor/                  # Composer dependencies
├── sql/database.sql             # Database import file
└── documentation/               # Product documentation
```

## 2. MVC Breakdown

### Models Layer

**Core Models** (`app/Models/`):
| Model | Purpose |
|-------|---------|
| `Admin` | Admin user authentication (extends Authenticatable) |
| `User` | End-user authentication with Sanctum tokens |
| `Frontend` | CMS section content storage (key-value with JSON) |
| `ManageSection` | Section visibility/ordering per homepage theme |
| `Order` | Legacy order model (listing-based) |
| `Slider` | Homepage slider management |
| `Team` | Team member profiles |
| `Wishlist` | User product wishlist |

**Module Models** — Each of the 27 modules contains its own models under `Modules/{ModuleName}/App/Models/` or `Modules/{ModuleName}/Entities/`.

### Controllers Layer

**Core Controllers** (`app/Http/Controllers/`):
- `HomeController` — All public-facing frontend pages (home, about, blogs, services, projects, FAQ, contact, language/currency switcher)
- `Admin/DashboardController` — Admin dashboard with order metrics
- `Admin/FrontEndManagementController` — CMS section builder CRUD
- `Admin/SectionManageController` — Section visibility/ordering
- `Admin/UserController` — User management CRUD
- `Admin/OrderController` — Order management
- `Admin/ProfileController` — Admin profile management
- `Admin/OpenAi/OpenAIController` — OpenAI content generation
- `Auth/LoginController` — User login, social login (Google/Facebook), password reset
- `Auth/RegisterController` — User registration with email verification
- `User/ProfileController` — User dashboard, profile, orders, account deletion

**Module Controllers** — Each module contains admin and/or frontend controllers.

### Views Layer

**333 Blade template files** organized across:
- `resources/views/admin/` — Admin panel views (dashboard, sidebar, users, orders, sections, frontend management)
- `resources/views/auth/` — Authentication views (login, register, forgot password, reset)
- `resources/views/user/` — User dashboard views (dashboard, orders, profile, transactions)
- `resources/views/theme/` — 7 theme variations (`theme_1` through `theme_8`, skipping `theme_6`)
- `resources/views/frontend/` — Shared frontend components (shop, pricing, portfolio)
- `resources/views/components/` — Reusable Blade components
- `resources/views/mail/` — Email templates
- `resources/views/errors/` — Error pages (404)
- `resources/views/vendor/laravelpwa/` — PWA manifest/service worker

## 3. Modular Architecture

### Module System: nwidart/laravel-modules v10

Each module is a **self-contained feature package** with:

```
Modules/{ModuleName}/
├── App/ or root level
│   ├── Http/Controllers/     # Module controllers
│   ├── Http/Requests/        # Form request validation
│   ├── Models/ or Entities/  # Eloquent models
│   ├── Providers/            # Service & Route providers
│   ├── Emails/               # Module-specific mailables
│   └── ...
├── Config/config.php         # Module configuration
├── Database/
│   ├── Migrations/           # Module database migrations
│   └── Seeders/              # Module data seeders
├── Resources/views/          # Module Blade views
├── Routes/
│   ├── web.php               # Web routes
│   └── api.php               # API routes (mostly empty)
├── Services/                 # Service classes (e.g., MenuService)
├── Console/Commands/         # Artisan commands (e.g., ClearMenuCache)
├── module.json               # Module metadata
└── composer.json             # Module dependencies
```

### Module Registry

All module statuses tracked in `modules_statuses.json`:

| Module | Status | Directory Exists |
|--------|--------|-----------------|
| Blog | enabled | Yes |
| Brand | enabled | Yes |
| Category | enabled | Yes |
| City | enabled | Yes |
| ContactMessage | enabled | Yes |
| Country | enabled | Yes |
| Coupon | enabled | Yes |
| Currency | enabled | Yes |
| Ecommerce | enabled | Yes |
| EmailSetting | enabled | Yes |
| FAQ | enabled | Yes |
| GlobalSetting | enabled | Yes |
| Language | enabled | Yes |
| Listing | enabled | Yes |
| Menu | enabled | Yes |
| Newsletter | enabled | Yes |
| Page | enabled | Yes |
| Partner | enabled | Yes |
| PaymentGateway | enabled | Yes |
| Project | enabled | Yes |
| SeoSetting | enabled | Yes |
| State | enabled | Yes |
| Subscription | enabled | Yes |
| SupportTicket | enabled | Yes |
| Team | enabled | Yes |
| Testimonial | enabled | Yes |
| Wishlist | enabled | Yes |
| JobPost | enabled | **No** (registered but missing) |
| PaymentWithdraw | enabled | **No** (registered but missing) |
| Wallet | enabled | **No** (registered but missing) |
| LiveChat | enabled | **No** (registered but missing) |
| Refund | enabled | **No** (registered but missing) |
| KYC | enabled | **No** (registered but missing) |

> **Note:** 6 modules are registered in `modules_statuses.json` but have no corresponding directory — likely planned for future releases.

## 4. Request Lifecycle

```
HTTP Request
    │
    ▼
Global Middleware Stack (Kernel.php)
    ├── TrustProxies
    ├── HandleCors
    ├── PreventRequestsDuringMaintenance
    ├── ValidatePostSize
    ├── TrimStrings
    └── ConvertEmptyStringsToNull
    │
    ▼
Web Middleware Group
    ├── EncryptCookies
    ├── AddQueuedCookiesToResponse
    ├── StartSession
    ├── ShareErrorsFromSession
    ├── VerifyCsrfToken
    ├── SubstituteBindings
    ├── DemoMode              ← Blocks mutations in DEMO mode
    ├── XSSProtect            ← Strips dangerous HTML tags
    └── CurrencyLanguage      ← Sets session language & currency
    │
    ▼
Route-level Middleware
    ├── 'MaintenanceMode'     ← Shows maintenance page if enabled
    ├── 'HtmlSpecialchars'    ← Additional XSS sanitization
    ├── 'auth:web'            ← User authentication guard
    ├── 'auth:admin'          ← Admin authentication guard
    └── 'admin.redirect'      ← Redirects /admin to login or dashboard
    │
    ▼
Controller → Model → Database → Response (Blade View or JSON)
```

## 5. Theme Switching Architecture

Quland supports **7 unique themes**, stored as a `selected_theme` key in `global_settings` table:

| Theme Key | Display Name | View Directory |
|-----------|-------------|----------------|
| `theme_one` | Business Consulting | `theme/theme_5/` |
| `theme_two` | SEO Agency | `theme/theme_2/` |
| `theme_three` | Creative Agency | `theme/theme_3/` |
| `theme_four` | AI Software | `theme/theme_4/` |
| `theme_five` | Digital Marketing | `theme/theme_1/` |
| `theme_six` | IT Business | `theme/theme_7/` |
| `theme_seven` | SaaS | `theme/theme_8/` |

> **Implementation Note:** There is an intentional mismatch between theme keys and view directories (e.g., `theme_one` renders `theme_5`, `theme_five` renders `theme_1`). This is by design — theme numbering reflects business naming, not directory structure.

**Theme selection flow:**
1. Admin selects theme via `GlobalSettingController::update_general_setting()`
2. Theme value stored in `global_settings` table (`key='selected_theme'`)
3. `HomeController::index()` reads the theme from settings
4. Conditional rendering dispatches to the correct Blade template
5. Each theme has its own CMS sections defined in `resources/views/admin/settings.json`

## 6. Section Builder Architecture

The Section Builder is a CMS system that allows admins to manage content sections per theme:

### Data Flow:
1. **Section Definitions** — `resources/views/admin/settings.json` defines all available sections with their fields, image slots, and metadata
2. **Section Content** — Stored in `frontends` table (`data_keys`, `data_values` as JSON, `data_translations` for multi-language)
3. **Section Visibility** — `manage_sections` table controls which sections appear on which homepage and their order
4. **Controller** — `FrontEndManagementController` handles reading JSON config, CRUD operations, image uploads, and multi-language translation management
5. **Frontend Rendering** — `HomeController::index()` loads section content via `getContent()` helper and passes to theme-specific Blade views

### Content Storage Pattern:
```
frontends table:
├── data_keys: "template_1_hero.content"
├── data_values: {"title": "...", "description": "...", "images": {...}}
└── data_translations: [{"language_code": "esp", "values": {...}}]
```

## 7. Caching System

- **Driver:** File (`CACHE_DRIVER=file`)
- **Global Settings Cache:** `AppServiceProvider::boot()` uses `Cache::rememberForever('setting', ...)` to cache all `global_settings` records as a keyed object
- **Cache Invalidation:** `GlobalSettingController::set_cache_setting()` reloads and recaches on any settings change
- **Cache Clear:** Admin can clear all application cache via `Artisan::call('optimize:clear')` from the dashboard
- **Menu Cache:** `Modules/Menu/Console/Commands/ClearMenuCache.php` provides a dedicated menu cache clear command

## 8. Queue System

- **Driver:** Synchronous (`QUEUE_CONNECTION=sync`)
- All operations execute inline — emails, order processing, etc.
- No background workers configured by default

## 9. Event System

- `EventServiceProvider` is registered but contains no custom event-listener mappings
- The application relies on direct controller-to-service flow rather than event-driven architecture

## 10. Translation Architecture

- **JSON-based:** Translation files in `lang/{lang_code}.json`
- **Database translations:** Most modules use a `*_translations` table pattern with `lang_code` column
- **Frontend CMS:** `frontends.data_translations` stores per-language overrides
- **Helper functions:** `getAllWrapperLang()` scans all Blade templates and PHP files for `trans()`, `__()`, `@lang()` calls and generates JSON translation keys
- **Middleware:** `CurrencyLangauge` middleware sets `front_lang` session on every request

## 11. Security Architecture

| Layer | Implementation |
|-------|---------------|
| XSS Protection | `XSSProtect` middleware strips dangerous tags; `HtmlSpecialchars` middleware |
| CSRF | Laravel default `VerifyCsrfToken` middleware |
| SQL Injection | Eloquent ORM parameterized queries |
| Authentication | Dual-guard system (web + admin) with session driver |
| reCAPTCHA | Google reCAPTCHA v2 integration via custom `Captcha` rule |
| Demo Mode | `DemoMode` middleware blocks all POST/PUT/DELETE in demo environment |
| Password Hashing | bcrypt via `Hash::make()` |
| Input Sanitization | `strip_tags()` with allowed HTML whitelist |
