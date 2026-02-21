# Quland CMS — Email System

## 1. Overview

Quland uses a dynamic SMTP email system where SMTP credentials are stored in the database and configured at runtime. Email templates are also database-driven, allowing admin customization without code changes.

## 2. EmailSetting Module

### 2.1 Structure

```
Modules/EmailSetting/
├── Entities/
│   ├── EmailSetting.php
│   └── EmailTemplate.php
├── Http/Controllers/
│   └── EmailSettingController.php
├── Routes/web.php
└── Resources/views/
```

### 2.2 EmailSetting Model

```php
protected $fillable = [
    'mail_driver',      // smtp
    'mail_host',        // e.g., smtp.gmail.com
    'mail_port',        // e.g., 587
    'mail_username',    // SMTP username
    'mail_password',    // SMTP password
    'mail_encryption',  // tls, ssl, null
    'mail_from_address',
    'mail_from_name',
];
```

### 2.3 EmailTemplate Model

```php
protected $fillable = [
    'name',      // Template identifier
    'subject',   // Email subject line
    'body',      // HTML body with placeholders
    'status',    // 1 = active
];
```

## 3. Dynamic SMTP Configuration

**File:** `app/Helper/EmailHelper.php`

```php
class EmailHelper
{
    public static function mail_setup()
    {
        $setting = EmailSetting::first();

        if ($setting) {
            Config::set('mail.default', 'smtp');
            Config::set('mail.mailers.smtp.host', $setting->mail_host);
            Config::set('mail.mailers.smtp.port', $setting->mail_port);
            Config::set('mail.mailers.smtp.username', $setting->mail_username);
            Config::set('mail.mailers.smtp.password', $setting->mail_password);
            Config::set('mail.mailers.smtp.encryption', $setting->mail_encryption);
            Config::set('mail.from.address', $setting->mail_from_address);
            Config::set('mail.from.name', $setting->mail_from_name);
        }
    }
}
```

**Usage:** Called before EVERY mail send operation:
```php
EmailHelper::mail_setup();
Mail::to($user->email)->send(new SomeMailable($data));
```

## 4. Email Templates

### 4.1 Template Placeholders

Templates use placeholders that are replaced at send time:

| Template ID | Purpose | Placeholders |
|-------------|---------|-------------|
| 1 | Password Reset | `{{name}}`, `{{reset_link}}` |
| 2 | Order Confirmation | `{{name}}`, `{{order_id}}`, `{{total}}` |
| 3 | Order Status Update | `{{name}}`, `{{order_id}}`, `{{status}}` |
| 4 | User Registration Verification | `{{name}}`, `{{verification_link}}` |

### 4.2 Admin Management

**Routes:**
```
GET /admin/email-settings         → index()        SMTP configuration
PUT /admin/email-setting          → update()       Update SMTP
GET /admin/email-templates        → templates()     Template listing
GET /admin/email-template/{id}/edit → edit_template() Edit template
PUT /admin/email-template/{id}    → update_template() Save template
```

## 5. Mailable Classes

Located in `app/Mail/`:

| Mailable | Used For |
|----------|----------|
| `UserForgetPassword` | Password reset link |
| `UserRegistration` | Email verification link |
| `OrderConfirmation` | Order placed confirmation |
| `OrderStatusUpdate` | Order status change notification |
| `BulkNewsletter` | Newsletter bulk email |

## 6. Email Sending Locations

| Location | Trigger | Template |
|----------|---------|----------|
| `Auth/RegisterController` | User registration | #4 |
| `Auth/LoginController` | Password reset | #1 |
| `EcommercePaymentController` | Order placed | #2 |
| `OrderController` | Status change | #3 |
| `NewsletterController` | Bulk send | Dynamic |
| `ContactMessageController` | Contact reply | Dynamic |

## 7. Important Notes

- All emails are sent **synchronously** (queue driver is `sync`)
- SMTP credentials in database are stored as **plain text** (no encryption at rest)
- `mail_setup()` re-configures Laravel's mailer on every call — this is necessary because config is loaded from DB, not `.env`
- No email logging or bounce tracking
- No retry mechanism for failed sends
