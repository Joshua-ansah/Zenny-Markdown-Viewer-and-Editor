# Quland CMS — API Documentation

## 1. Overview

Quland's API routes file (`routes/api.php`) is **empty**. No REST API endpoints are implemented.

## 2. routes/api.php

**File:** `routes/api.php`

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// No routes defined
```

## 3. API Infrastructure

Despite having no API routes, the following API-related infrastructure exists:

### 3.1 Laravel Sanctum

- **Package:** `laravel/sanctum ^3.3`
- **User Model:** Uses `HasApiTokens` trait
- **Config:** `config/sanctum.php` present
- **Middleware:** `EnsureFrontendRequestsAreStateful` registered in Kernel
- **Status:** Installed but unused

### 3.2 API Middleware Group

```php
// app/Http/Kernel.php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

### 3.3 CORS Configuration

**File:** `config/cors.php`

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

## 4. Internal AJAX Endpoints

While there are no formal API routes, several admin endpoints return JSON and are consumed via AJAX:

| Endpoint | Method | Response | Purpose |
|----------|--------|----------|---------|
| `/admin/open-ai` | POST | JSON | OpenAI text generation |
| `/admin/user/ban/{id}` | GET | JSON | Toggle user ban status |
| Various status toggles | GET | JSON/Redirect | Module status updates |

## 5. Potential API Development

If building an API on this codebase, consider:

1. **Authentication:** Sanctum is already installed — use `$user->createToken('token-name')` for API tokens
2. **Models:** All Eloquent models are available for API resource transformations
3. **Middleware:** API throttle group is pre-configured
4. **CORS:** Already configured for `api/*` paths
5. **Routes:** Add endpoints to `routes/api.php` with `auth:sanctum` middleware
