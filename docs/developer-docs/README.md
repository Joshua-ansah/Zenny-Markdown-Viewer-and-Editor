# Quland CMS — Developer Documentation

> Production-grade technical documentation for the Quland Laravel CMS.

## Documentation Index

### 1. Architecture
- [Architecture Overview](01-architecture/architecture.md) — Project structure, MVC breakdown, modular architecture, request lifecycle, caching, security

### 2. Database
- [Database Schema](02-database/database-schema.md) — All 40+ tables, column definitions, relationships, migration patterns

### 3. Authentication
- [Authentication & Authorization](03-authentication/authentication.md) — Dual guard system, login flows, social login, password reset, middleware, reCAPTCHA

### 4. Admin Dashboard
- [Admin Dashboard & Panel](04-admin-dashboard/admin-dashboard.md) — Admin routes, dashboard metrics, user management, section builder, OpenAI, module routes

### 5. User Dashboard
- [User Dashboard & Account](05-user-dashboard/user-dashboard.md) — Profile management, orders, transactions, cart, checkout, payment flow, wishlist, support tickets

### 6. Features
- [E-commerce](06-features/ecommerce.md) — Product CRUD, cart system, checkout, payment processing, orders, reviews, shipping
- [Blog Management](06-features/blog-management.md) — Blog CRUD, categories, comments, frontend display
- [Payment Gateways](06-features/payment-gateways.md) — 8 gateway integrations: Stripe, PayPal, Razorpay, Flutterwave, Mollie, Paystack, Instamojo, Bank
- [Multi-Language](06-features/multi-language.md) — JSON translations, database content translations, language switching, RTL
- [Multi-Currency](06-features/multi-currency.md) — Currency management, session-based switching, display formatting
- [Menu Builder](06-features/menu-builder.md) — Hierarchical menus, drag-drop ordering, multi-location, MenuService
- [Section Builder CMS](06-features/section-builder.md) — Page composition, settings.json, content management, theme sections
- [Theme Management](06-features/theme-management.md) — 7 themes, selection, color customization, view routing
- [Newsletter](06-features/newsletter.md) — Subscription, verification, bulk email
- [Support Ticket](06-features/support-ticket.md) — User-admin messaging, file attachments, seen tracking
- [OpenAI Integration](06-features/openai-integration.md) — GPT-4o-mini content generation
- [SEO Management](06-features/seo-management.md) — Per-page SEO, meta tags, Open Graph
- [Email System](06-features/email-system.md) — Dynamic SMTP, email templates, mailable classes
- [Admin Settings](06-features/admin-settings.md) — All global settings, database clear, maintenance mode
- [Social Login](06-features/social-login.md) — Google & Facebook OAuth via Socialite
- [User Management](06-features/user-management.md) — Admin user CRUD, ban/unban, status fields
- [Analytics & Integrations](06-features/analytics-integrations.md) — Google Analytics, Facebook Pixel, Tawk.to, reCAPTCHA, Cookie Consent, PWA
- [Other Modules](06-features/other-modules.md) — Contact, FAQ, Testimonial, Team, Partner, Pages, Subscription, Location, Coupon, Wishlist, Listing, Project

### 7. API
- [API Documentation](07-api/api-documentation.md) — Current API status (empty), Sanctum setup, AJAX endpoints

### 8. Dependencies
- [Dependencies](08-dependencies/dependencies.md) — Composer packages, NPM packages, PHP extensions, external services, version matrix

### 9. Deployment
- [Deployment Guide](09-deployment/deployment.md) — Server requirements, installation, web server config, security checklist, troubleshooting

---

## Quick Reference

| Aspect | Detail |
|--------|--------|
| **Framework** | Laravel 10 (PHP 8.1+) |
| **Architecture** | Modular (nwidart/laravel-modules v10) |
| **Modules** | 27 feature modules |
| **Database** | MySQL, 40+ tables |
| **Auth** | Dual guard (web/admin), Socialite, reCAPTCHA |
| **Payments** | 8 gateways (Stripe, PayPal, Razorpay, Flutterwave, Mollie, Paystack, Instamojo, Bank) |
| **Frontend** | 7 themes, Bootstrap 5, Vite, 333+ Blade templates |
| **AI** | OpenAI GPT-4o-mini integration |
| **i18n** | JSON translations + DB content translations |
| **Cache** | File-based, 1-hour settings cache |
| **Queue** | Sync (no async processing) |
| **API** | Not implemented (Sanctum installed) |

## Known Issues

1. **Product Model Translation Bug:** `getDescriptionAttribute`, `getSeoTitleAttribute`, and `getSeoDescriptionAttribute` all return the `name` field instead of their respective fields
2. **Missing Modules:** 6 modules registered in `modules_statuses.json` but have no directory (JobPost, PaymentWithdraw, Wallet, LiveChat, Refund, KYC)
3. **Middleware Typo:** `CurrencyLangauge` class name has misspelled "Language"
4. **No Email Queue:** All emails sent synchronously, which can timeout for bulk operations
5. **Plain Text Credentials:** Payment gateway secrets and SMTP passwords stored unencrypted in database
