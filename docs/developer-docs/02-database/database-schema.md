# Quland CMS — Database Schema Documentation

## 1. Overview

Quland uses **MySQL** as its primary database. The schema consists of **40+ tables** across the core application and 27 modules. Data is imported via `sql/database.sql`.

**Connection Configuration** (`.env`):
```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=test_database
DB_USERNAME=quland
DB_PASSWORD=Precode.1524
```

---

## 2. Core Application Tables

### 2.1 `users`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | bigint unsigned | No | auto_increment | PK |
| `name` | varchar(255) | No | — | |
| `email` | varchar(255) | No | — | Unique |
| `password` | varchar(255) | Yes | NULL | Nullable for social logins |
| `email_verified_at` | timestamp | Yes | NULL | |
| `remember_token` | varchar(100) | Yes | NULL | |
| `status` | varchar(255) | No | 'disable' | 'enable' / 'disable' |
| `is_banned` | varchar(255) | No | 'no' | 'yes' / 'no' |
| `username` | varchar(255) | Yes | NULL | |
| `phone` | varchar(255) | Yes | NULL | |
| `address` | text | Yes | NULL | |
| `zip` | varchar(255) | Yes | NULL | |
| `image` | varchar(255) | Yes | NULL | |
| `provider` | varchar(255) | Yes | NULL | 'google' / 'facebook' |
| `provider_id` | varchar(255) | Yes | NULL | OAuth provider user ID |
| `verification_token` | varchar(255) | Yes | NULL | Email verification token |
| `forget_password_token` | varchar(255) | Yes | NULL | Password reset token |
| `feez_status` | tinyint | No | 0 | 1 = frozen account |
| `online_status` | tinyint | No | 0 | |
| `online` | tinyint | No | 0 | |
| `country_id` | bigint unsigned | Yes | NULL | FK → countries |
| `state_id` | bigint unsigned | Yes | NULL | FK → states |
| `city_id` | bigint unsigned | Yes | NULL | FK → cities |
| `created_at` | timestamp | Yes | NULL | |
| `updated_at` | timestamp | Yes | NULL | |

**Supports:** User authentication, social login, profiles, location-based data, account freeze

---

### 2.2 `admins`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | bigint unsigned | No | auto_increment | PK |
| `name` | varchar(255) | No | — | |
| `email` | varchar(255) | No | — | Unique |
| `password` | varchar(255) | No | — | |
| `status` | varchar(255) | No | 'enable' | 'enable' / 'disable' |
| `admin_type` | varchar(255) | Yes | NULL | 'super_admin' |
| `image` | varchar(255) | Yes | NULL | |
| `phone` | varchar(255) | Yes | NULL | |
| `address` | text | Yes | NULL | |
| `about_me` | text | Yes | NULL | |
| `socials` | text | Yes | NULL | JSON social links |
| `created_at` | timestamp | Yes | NULL | |
| `updated_at` | timestamp | Yes | NULL | |

**Supports:** Admin authentication, profile management, blog authorship

---

### 2.3 `password_reset_tokens`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `email` | varchar(255) | No | — | PK |
| `token` | varchar(255) | No | — | |
| `created_at` | timestamp | Yes | NULL | |

---

### 2.4 `personal_access_tokens`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment | PK |
| `tokenable_type` | varchar(255) | No | — | Polymorphic |
| `tokenable_id` | bigint unsigned | No | — | Polymorphic |
| `name` | varchar(255) | No | — | |
| `token` | varchar(64) | No | — | Unique |
| `abilities` | text | Yes | NULL | |
| `last_used_at` | timestamp | Yes | NULL | |
| `expires_at` | timestamp | Yes | NULL | |
| `created_at` | timestamp | Yes | NULL | |
| `updated_at` | timestamp | Yes | NULL | |

**Supports:** Laravel Sanctum API token authentication

---

### 2.5 `failed_jobs`

Standard Laravel failed jobs table for queue monitoring.

---

### 2.6 `frontends`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | bigint unsigned | No | auto_increment | PK |
| `data_keys` | varchar(255) | No | — | e.g. `template_1_hero.content` |
| `data_values` | longText | No | — | JSON content data |
| `data_translations` | longText | Yes | NULL | JSON array of translations |
| `created_at` | timestamp | Yes | NULL | |
| `updated_at` | timestamp | Yes | NULL | |

**Supports:** CMS section builder — stores all theme-specific section content with multi-language translations

---

### 2.7 `manage_sections`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | bigint unsigned | No | auto_increment | PK |
| `page_name` | varchar(255) | No | — | e.g. `home_one`, `home_two` |
| `section_name` | varchar(255) | No | — | Human-readable section name |
| `component_name` | varchar(255) | Yes | NULL | Blade component reference |
| `status` | boolean | No | — | 1=visible, 0=hidden |
| `serial_number` | int | No | — | Display order |
| `created_at` | timestamp | Yes | NULL | |
| `updated_at` | timestamp | Yes | NULL | |

**Supports:** Section visibility management per homepage theme

---

### 2.8 `sliders`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `image` | varchar(255) | No | — |
| `url` | varchar(255) | Yes | NULL |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 2.9 `slider_translations`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `slider_id` | bigint unsigned | No | — |
| `lang_code` | varchar(255) | No | — |
| `title` | varchar(255) | Yes | NULL |
| `small_text` | text | Yes | NULL |
| `button_text` | varchar(255) | Yes | NULL |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

---

### 2.10 `wishlists`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `user_id` | bigint unsigned | No | — |
| `product_id` | bigint unsigned | No | — |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

---

## 3. Ecommerce Module Tables

### 3.1 `products`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | bigint unsigned | No | auto_increment | PK |
| `category_id` | bigint unsigned | Yes | NULL | FK → categories |
| `brand_id` | bigint unsigned | Yes | NULL | FK → brands |
| `slug` | varchar(255) | No | — | Unique URL slug |
| `price` | decimal(8,2) | No | — | Base price |
| `offer_price` | decimal(8,2) | Yes | NULL | Percentage discount |
| `thumbnail_image` | varchar(255) | Yes | NULL | |
| `tags` | text | Yes | NULL | JSON tags array |
| `status` | tinyint | No | 0 | Status::ENABLE/DISABLE |
| `created_at` | timestamp | Yes | NULL | |
| `updated_at` | timestamp | Yes | NULL | |

### 3.2 `product_translations`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `product_id` | bigint unsigned | No | — |
| `lang_code` | varchar(255) | No | — |
| `name` | varchar(255) | No | — |
| `description` | longText | Yes | NULL |
| `short_description` | text | Yes | NULL |
| `seo_title` | varchar(255) | Yes | NULL |
| `seo_description` | text | Yes | NULL |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 3.3 `product_galleries`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `product_id` | bigint unsigned | No | — |
| `image` | varchar(255) | No | — |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 3.4 `product_reviews`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `user_id` | bigint unsigned | No | — |
| `product_id` | bigint unsigned | No | — |
| `rating` | int | No | — |
| `reviews` | text | No | — |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 3.5 `carts`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | bigint unsigned | No | auto_increment | PK |
| `user_id` | bigint unsigned | Yes | NULL | For authenticated users |
| `session_id` | varchar(255) | Yes | NULL | For guest carts |
| `product_id` | bigint unsigned | No | — | FK → products |
| `quantity` | int | No | 1 | |
| `created_at` | timestamp | Yes | NULL | |
| `updated_at` | timestamp | Yes | NULL | |

**Design:** Dual-identity cart — uses `session_id` for guests, converts to `user_id` on login

### 3.6 `orders` (Ecommerce)

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | bigint unsigned | No | auto_increment | PK |
| `user_id` | bigint unsigned | No | — | FK → users |
| `order_id` | varchar(255) | No | — | Generated: `time() + randomNumber(5)` |
| `subtotal` | decimal(28,8) | No | — | |
| `shipping_charge` | decimal(28,8) | No | 0 | |
| `total` | decimal(28,8) | No | — | |
| `shipping_method_id` | bigint unsigned | Yes | NULL | FK → shipping_methods |
| `address` | text | Yes | NULL | JSON: {name, email, phone, address} |
| `payment_method` | varchar(255) | No | — | stripe/paypal/razorpay/etc. |
| `payment_status` | tinyint | No | 0 | 0=pending, 1=approved |
| `order_status` | tinyint | No | 0 | Uses Status constants |
| `transaction_id` | varchar(255) | Yes | NULL | Gateway transaction ref |
| `created_at` | timestamp | Yes | NULL | |
| `updated_at` | timestamp | Yes | NULL | |

**Order Status Values** (from `Status` constants):
- 0 = PENDING
- 1 = APPROVED
- 2 = REJECTED
- 3 = PROCESSING
- 4 = SHIPPED
- 5 = COMPLETED

### 3.7 `order_details`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `order_id` | bigint unsigned | No | — |
| `product_id` | bigint unsigned | No | — |
| `quantity` | int | No | — |
| `price` | decimal(28,8) | No | — |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 3.8 `shipping_methods`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `name` | varchar(40) | No | — |
| `price` | decimal(28,8) | No | — |
| `status` | tinyint | No | 1 | |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

---

## 4. Blog Module Tables

### 4.1 `blogs`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `slug` | varchar(255) | No | — |
| `image` | varchar(255) | Yes | NULL |
| `admin_id` | bigint unsigned | No | — |
| `blog_category_id` | bigint unsigned | No | — |
| `views` | int | No | 0 |
| `status` | tinyint | No | 0 |
| `show_homepage` | tinyint | No | 0 |
| `is_popular` | tinyint | No | 0 |
| `tags` | text | Yes | NULL |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 4.2 `blog_translations`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `blog_id` | bigint unsigned | No | — |
| `lang_code` | varchar(255) | No | — |
| `title` | varchar(255) | No | — |
| `description` | longText | Yes | NULL |
| `seo_title` | varchar(255) | Yes | NULL |
| `seo_description` | text | Yes | NULL |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 4.3 `blog_categories` / `blog_category_translations`

Standard category with slug, status + translation table with `name` per `lang_code`.

### 4.4 `blog_comments`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `blog_id` | bigint unsigned | No | — |
| `name` | varchar(255) | No | — |
| `email` | varchar(255) | No | — |
| `comment` | text | No | — |
| `status` | tinyint | No | 0 |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

---

## 5. Configuration & Settings Tables

### 5.1 `global_settings`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `key` | varchar(255) | No | — |
| `value` | text | Yes | NULL |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

**Key-value pairs stored include:**
- `selected_theme`, `app_name`, `timezone`, `preloader_status`
- `logo`, `white_logo`, `footer_logo`, `favicon`
- `recaptcha_site_key`, `recaptcha_secret_key`, `recaptcha_status`
- `tawk_chat_link`, `tawk_status`
- `openai_api_key`, `openai_organization`
- `google_analytic_id`, `google_analytic_status`
- `pixel_app_id`, `pixel_status`
- `cookie_consent_message`, `cookie_status`
- `maintenance_status`, `maintenance_text`, `maintenance_image`
- `error_image`, `login_image`, `admin_login_image`, `breadcrumb_image`
- `facebook_login_status`, `facebook_client_id`, `facebook_secret_id`, `facebook_redirect_url`
- `gmail_login_status`, `gmail_client_id`, `gmail_secret_id`, `gmail_redirect_url`
- `default_avatar`
- `contact_message_mail`

### 5.2 `payment_gateways`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `key` | varchar(255) | No | — |
| `value` | text | Yes | NULL |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

**Key-value pairs for 8 gateways:** stripe_key, stripe_secret, stripe_currency_id, stripe_status, paypal_client_id, paypal_secret_id, paypal_mode, paypal_currency_id, paypal_status, razorpay_key, razorpay_secret, razorpay_currency_id, bank_status, bank_account_info, flutterwave_*, mollie_*, paystack_*, instamojo_*, etc.

### 5.3 `email_settings`

Key-value store for SMTP configuration: `mail_host`, `mail_port`, `mail_encryption`, `smtp_username`, `smtp_password`, `email`, `sender_name`.

### 5.4 `email_templates`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | bigint unsigned | No | auto_increment | |
| `name` | varchar(255) | No | — | Template identifier |
| `subject` | varchar(255) | No | — | Email subject |
| `description` | longText | No | — | Email body with placeholders |
| `created_at` | timestamp | Yes | NULL | |
| `updated_at` | timestamp | Yes | NULL | |

**Templates (by ID):**
1. Password Reset (`{{user_name}}`, `{{reset_link}}`)
2. Contact Message
3. Newsletter
4. User Registration (`{{user_name}}`, `{{varification_link}}`)
5. Order Success
6. Subscription Purchase

### 5.5 `seo_settings`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `page_name` | varchar(255) | No | — |
| `seo_title` | varchar(255) | Yes | NULL |
| `seo_description` | text | Yes | NULL |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

**Page IDs:** 1=Home, 2=Blog, 3=About, 4=Contact, 5=FAQ, 6=Terms, 9=Privacy, 10=Services, 11=Teams

---

## 6. Listing / Service Module Tables

### 6.1 `listings`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `category_id` | bigint unsigned | Yes | NULL |
| `sub_category_id` | bigint unsigned | Yes | NULL |
| `thumb_image` | varchar(255) | Yes | NULL |
| `background_image` | varchar(255) | Yes | NULL |
| `slug` | varchar(255) | No | — |
| `features` | text | Yes | NULL |
| `purpose` | text | Yes | NULL |
| `total_view` | int | No | 0 |
| `regular_price` | decimal(8,2) | Yes | NULL |
| `offer_price` | decimal(8,2) | Yes | NULL |
| `status` | varchar(255) | No | 'enable' |
| `icon` | varchar(255) | Yes | NULL |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 6.2 `listing_translations`

Translation table with `listing_id`, `lang_code`, `title`, `description`, `short_description`.

### 6.3 `listing_galleries`

Gallery images per listing: `listing_id`, `image`.

---

## 7. Category & Brand Tables

### 7.1 `categories` / `category_translations`

Categories with `slug`, `icon`, `image`, `status` + translations (`name`, `description`).

### 7.2 `brands` / `brand_translations`

Brands with `slug`, `image`, `status` + translations (`name`).

---

## 8. Location Tables

### 8.1 `countries`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `name` | varchar(255) | No | — |
| `status` | varchar(255) | No | 'enable' |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 8.2 `states` / `state_translations`

States with `country_id` FK, status + translations.

### 8.3 `cities` / `city_translations`

Cities with `state_id` FK, status + translations.

---

## 9. Subscription Tables

### 9.1 `subscription_plans`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `plan_name` | varchar(255) | No | — |
| `plan_price` | decimal(8,2) | No | — |
| `expiration_date` | varchar(255) | Yes | NULL |
| `short_description` | text | Yes | NULL |
| `features` | text | Yes | NULL |
| `status` | varchar(255) | No | 'enable' |
| `serial` | int | No | 0 |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 9.2 `subscription_histories`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `order_id` | varchar(255) | No | — |
| `user_id` | bigint unsigned | No | — |
| `subscription_plan_id` | bigint unsigned | No | — |
| `plan_name` | varchar(255) | No | — |
| `plan_price` | decimal(8,2) | No | — |
| `plan_info` | json | Yes | NULL |
| `expiration_date` | varchar(255) | Yes | NULL |
| `expiration` | varchar(255) | Yes | NULL |
| `status` | varchar(255) | No | 'pending' |
| `payment_method` | varchar(255) | No | — |
| `payment_status` | varchar(255) | No | 'pending' |
| `transaction` | varchar(255) | Yes | NULL |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

---

## 10. Support Ticket Tables

### 10.1 `support_tickets`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `user_id` | bigint unsigned | No | — |
| `user_type` | varchar(255) | No | — | 'admin' / 'user' |
| `ticket_id` | varchar(255) | No | — | Unique ticket reference |
| `subject` | varchar(255) | No | — |
| `status` | enum | No | 'open' | 'open','in_progress','resolved','closed' |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 10.2 `support_ticket_messages`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `support_ticket_id` | bigint unsigned | No | — |
| `message_user_id` | bigint unsigned | No | — |
| `send_by` | varchar(255) | No | — | 'user' / 'admin' |
| `message` | text | No | — |
| `is_seen` | boolean | No | 0 |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 10.3 `message_documents`

File attachments for support ticket messages.

---

## 11. Menu Tables

### 11.1 `menus`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `name` | varchar(255) | No | — |
| `location` | varchar(255) | No | 'header' | 'header'/'footer'/'sidebar' |
| `is_active` | boolean | No | 1 |
| `sort_order` | int | No | 0 |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 11.2 `menu_items`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `menu_id` | bigint unsigned | No | — | FK → menus (cascade) |
| `parent_id` | bigint unsigned | Yes | NULL | FK → menu_items (self-referential) |
| `title` | varchar(255) | No | — |
| `url` | varchar(255) | Yes | NULL |
| `target` | varchar(255) | No | '_self' | '_self' / '_blank' |
| `icon` | varchar(255) | Yes | NULL |
| `css_class` | varchar(255) | Yes | NULL |
| `sort_order` | int | No | 0 |
| `is_active` | boolean | No | 1 |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 11.3 `menu_translations` / `menu_item_translations`

Multi-language support for menu names and item titles.

---

## 12. Other Module Tables

### 12.1 `coupons`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `name` | varchar(255) | No | — |
| `code` | varchar(255) | No | — |
| `expired_date` | date | No | — |
| `min_purchase_price` | decimal(8,2) | No | — |
| `discount_type` | varchar(255) | No | — | 'percentage' / 'amount' |
| `discount_amount` | decimal(8,2) | No | — |
| `status` | varchar(255) | No | 'enable' |
| `restaurant_id` | bigint unsigned | Yes | NULL |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 12.2 `coupon_histories`

Tracks coupon usage: `user_id`, `coupon_code`, `coupon_id`, `discount_amount`.

### 12.3 `newsletters`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `email` | varchar(255) | No | — |
| `verified_token` | varchar(255) | Yes | NULL |
| `is_verified` | tinyint | No | 0 |
| `status` | tinyint | No | 0 |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 12.4 `contact_messages`

Stores contact form submissions.

### 12.5 `languages`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `lang_name` | varchar(255) | No | — |
| `lang_code` | varchar(255) | No | — |
| `lang_direction` | varchar(255) | No | — | 'left_to_right' / 'right_to_left' |
| `is_default` | varchar(255) | No | 'No' |
| `status` | tinyint | No | 1 |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 12.6 `currencies`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | bigint unsigned | No | auto_increment |
| `currency_name` | varchar(255) | No | — |
| `currency_code` | varchar(255) | No | — |
| `country_code` | varchar(255) | No | — |
| `currency_icon` | varchar(255) | No | — |
| `is_default` | varchar(255) | No | 'no' |
| `currency_rate` | decimal(8,4) | No | — |
| `currency_position` | varchar(255) | No | — |
| `status` | varchar(255) | No | 'active' |
| `created_at` | timestamp | Yes | NULL |
| `updated_at` | timestamp | Yes | NULL |

### 12.7 Other Tables

- `testimonials` / `testimonial_translations` — Client testimonials with rating
- `teams` / `team_translations` — Team member profiles
- `projects` / `project_translations` / `project_galleries` — Portfolio projects
- `partners` — Client/partner logos
- `faqs` / `faq_translations` — FAQ entries
- `custom_pages` / `custom_page_translations` — Dynamic CMS pages
- `term_and_conditions` — Terms & Conditions content
- `privacy_policies` — Privacy Policy content
- `footers` / `footer_translations` — Footer configuration

---

## 13. Relationship Mapping

```
users ─────────────────┬── orders (Ecommerce)
                       ├── carts
                       ├── wishlists
                       ├── product_reviews
                       ├── support_tickets
                       └── subscription_histories

admins ────────────────┬── blogs (author)
                       └── support_tickets

products ──────────────┬── product_translations
                       ├── product_galleries
                       ├── product_reviews
                       ├── carts
                       ├── order_details
                       ├── wishlists
                       ├── categories (belongsTo)
                       └── brands (belongsTo)

orders ────────────────┬── order_details
                       ├── users (belongsTo)
                       └── shipping_methods (belongsTo)

blogs ─────────────────┬── blog_translations
                       ├── blog_comments
                       ├── blog_categories (belongsTo)
                       └── admins (belongsTo as author)

listings ──────────────┬── listing_translations
                       ├── listing_galleries
                       └── categories (belongsTo)

menus ─────────────────┬── menu_items
                       └── menu_translations

menu_items ────────────┬── menu_items (self-referential: parent/children)
                       ├── menus (belongsTo)
                       └── menu_item_translations

support_tickets ───────┬── support_ticket_messages
                       └── message_documents

countries ─────────────┬── states
states ────────────────┬── cities
                       └── users (via state_id)
```

## 14. Translation Pattern

Most content tables follow a dual-table translation pattern:

```
{entity} table (language-neutral data: slug, image, status)
    └── {entity}_translations table
            ├── {entity}_id (FK)
            ├── lang_code (e.g., 'en', 'esp')
            └── translatable fields (name, description, etc.)
```

This pattern is used by: products, blogs, blog_categories, categories, brands, listings, testimonials, teams, projects, FAQs, custom_pages, footers, sliders, menus, menu_items, states, cities.

## 15. Migration Patterns

- **Timestamps:** All tables include `created_at` and `updated_at`
- **Soft Deletes:** Not used in any table
- **Auto-increment:** All tables use `id` as bigint unsigned auto_increment primary key
- **Foreign Keys:** Menu items have explicit FK constraints; most other tables use implicit relationships via Eloquent
- **Incremental Migrations:** Multiple `add_*_to_*_table` migrations show iterative schema evolution

