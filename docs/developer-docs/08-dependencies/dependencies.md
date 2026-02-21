# Quland CMS — Dependencies

## 1. PHP Dependencies (Composer)

### 1.1 Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `php` | `^8.1\|^8.2` | Runtime requirement |
| `laravel/framework` | `^10.0` | Core Laravel framework |
| `laravel/sanctum` | `^3.3` | API token authentication (installed, not actively used) |
| `laravel/tinker` | `^2.8` | REPL for debugging |

### 1.2 Authentication & Social

| Package | Version | Purpose |
|---------|---------|---------|
| `laravel/socialite` | `^5.15` | OAuth social login (Google, Facebook) |
| `google/recaptcha` | `^1.3` | Google reCAPTCHA v2 verification |

### 1.3 Payment Gateways

| Package | Version | Purpose |
|---------|---------|---------|
| `stripe/stripe-php` | `*` | Stripe payment processing |
| `srmklive/paypal` | `^3.0` | PayPal payment processing |
| `razorpay/razorpay` | `^2.9` | Razorpay payment processing |
| `mollie/laravel-mollie` | `2.25` | Mollie payment processing |

> Flutterwave, Paystack, and Instamojo use direct API calls (no packages).

### 1.4 Content & Media

| Package | Version | Purpose |
|---------|---------|---------|
| `intervention/image` | `^2.7` | Image manipulation (resize, WebP conversion) |
| `mews/purifier` | `^3.4` | HTML purification (XSS prevention) |

### 1.5 Architecture

| Package | Version | Purpose |
|---------|---------|---------|
| `nwidart/laravel-modules` | `^10.0` | Modular architecture (27 modules) |

### 1.6 AI & External Services

| Package | Version | Purpose |
|---------|---------|---------|
| `openai-php/laravel` | `*` | OpenAI GPT integration |

### 1.7 PWA

| Package | Version | Purpose |
|---------|---------|---------|
| `silviolleite/laravelpwa` | `^2.0` | Progressive Web App support |

### 1.8 Development Only

| Package | Version | Purpose |
|---------|---------|---------|
| `barryvdh/laravel-debugbar` | `*` | Debug toolbar |
| `fakerphp/faker` | `^1.9.1` | Test data generation |
| `laravel/pint` | `^1.0` | Code style fixer |
| `laravel/sail` | `^1.18` | Docker development environment |
| `mockery/mockery` | `^1.4.4` | Test mocking |
| `nunomaduro/collision` | `^7.0` | Error reporting |
| `phpunit/phpunit` | `^10.1` | Unit testing |
| `spatie/laravel-ignition` | `^2.0` | Error page |

## 2. JavaScript Dependencies (NPM)

### 2.1 Build Tools

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | `^4.0.0` | Build tool / asset bundler |
| `laravel-vite-plugin` | `^0.7.2` | Laravel + Vite integration |
| `postcss` | `^8.4.31` | CSS processing |
| `autoprefixer` | `^10.4.16` | CSS vendor prefixes |

### 2.2 Frontend Frameworks

| Package | Version | Purpose |
|---------|---------|---------|
| `vue` | `^3.2.36` | Vue.js 3 (dev dependency) |
| `@vitejs/plugin-vue` | `^4.0.0` | Vue + Vite integration |
| `bootstrap` | `^5.2.3` | CSS framework |
| `tailwindcss` | `^3.3.5` | Utility CSS framework |
| `sass` | `^1.56.1` | CSS preprocessor |

### 2.3 JavaScript Libraries

| Package | Version | Purpose |
|---------|---------|---------|
| `axios` | `^1.1.2` | HTTP client |
| `lodash` | `^4.17.19` | Utility library |

## 3. PHP Extensions Required

Based on dependencies and `composer.json`:

| Extension | Required By |
|-----------|-------------|
| `ext-json` | Laravel, all JSON operations |
| `ext-mbstring` | Laravel string handling |
| `ext-openssl` | Encryption, HTTPS |
| `ext-pdo` | Database connectivity |
| `ext-pdo_mysql` | MySQL driver |
| `ext-xml` | Various packages |
| `ext-ctype` | Laravel validation |
| `ext-fileinfo` | File upload handling |
| `ext-gd` or `ext-imagick` | Intervention Image |
| `ext-curl` | HTTP clients (payment gateways) |
| `ext-tokenizer` | Laravel framework |

## 4. External Services

| Service | Requirement | Configuration |
|---------|-------------|---------------|
| MySQL 5.7+ / 8.0 | Required | `.env` DB credentials |
| SMTP Server | Required for emails | Database `email_settings` table |
| Google OAuth | Optional | Database `global_settings` |
| Facebook OAuth | Optional | Database `global_settings` |
| Stripe Account | Optional | Database `payment_gateways` |
| PayPal Account | Optional | Database `payment_gateways` |
| Razorpay Account | Optional | Database `payment_gateways` |
| Mollie Account | Optional | Database `payment_gateways` |
| Flutterwave Account | Optional | Database `payment_gateways` |
| Paystack Account | Optional | Database `payment_gateways` |
| Instamojo Account | Optional | Database `payment_gateways` |
| OpenAI API Key | Optional | Database `global_settings` |
| Google reCAPTCHA | Optional | Database `global_settings` |
| Google Analytics | Optional | Database `global_settings` |
| Facebook Pixel | Optional | Database `global_settings` |
| Tawk.to | Optional | Database `global_settings` |

## 5. Version Compatibility Matrix

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| PHP | 8.1 | 8.2 |
| MySQL | 5.7 | 8.0 |
| Node.js | 16.x | 18.x+ |
| NPM | 8.x | 9.x+ |
| Composer | 2.x | 2.6+ |
| Apache / Nginx | 2.4 / 1.18 | Latest stable |

## 6. Autoloading

**File:** `composer.json`

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "app/",
            "Database\\Factories\\": "database/factories/",
            "Database\\Seeders\\": "database/seeders/",
            "Modules\\": "Modules/"
        },
        "files": [
            "app/Helper/helper.php"
        ]
    }
}
```

Key points:
- `app/Helper/helper.php` is auto-loaded globally (provides `currency()`, `getContent()`, `getTranslatedValue()`, etc.)
- Modules namespace registered under `Modules\\`
- Standard Laravel PSR-4 autoloading for `App\\`
