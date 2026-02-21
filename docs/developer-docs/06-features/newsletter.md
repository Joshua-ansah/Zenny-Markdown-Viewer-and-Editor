# Quland CMS — Newsletter Module

## 1. Overview

The Newsletter module (`Modules/Newsletter`) provides email subscription with verification, subscriber management, and bulk email sending from the admin panel.

## 2. Module Structure

```
Modules/Newsletter/
├── Entities/Newsletter.php
├── Http/Controllers/NewsletterController.php
├── Routes/web.php
└── Resources/views/
```

## 3. Newsletter Model

```php
protected $fillable = [
    'email',
    'verification_token',
    'email_verified_at',
    'status',    // 1 = active, 0 = inactive
];
```

## 4. Subscription Flow

### 4.1 Frontend Subscribe

**Route:** `POST /newsletter/subscribe`

```php
public function subscribe(Request $request)
{
    $request->validate([
        'email' => 'required|email|unique:newsletters,email',
    ]);

    $newsletter = Newsletter::create([
        'email' => $request->email,
        'verification_token' => Str::random(100),
        'status' => 1,
    ]);

    // Send verification email
    EmailHelper::mail_setup();
    $verificationLink = route('newsletter.verify') . '?token=' . $newsletter->verification_token . '&email=' . $newsletter->email;
    // Mail::to($newsletter->email)->send(new NewsletterVerification($verificationLink));
}
```

### 4.2 Email Verification

**Route:** `GET /newsletter/verify`

```php
public function verify(Request $request)
{
    $subscriber = Newsletter::where('verification_token', $request->token)
        ->where('email', $request->email)
        ->first();

    if ($subscriber) {
        $subscriber->email_verified_at = now();
        $subscriber->verification_token = null;
        $subscriber->save();
    }
}
```

## 5. Admin Management

### 5.1 Routes

```
GET    /admin/newsletters       → index()      Subscriber listing
DELETE /admin/newsletter/{id}   → destroy()     Remove subscriber
GET    /admin/newsletter-send   → send_form()   Bulk email form
POST   /admin/newsletter-send   → send_email()  Send bulk email
```

### 5.2 Bulk Email Sending

```php
public function send_email(Request $request)
{
    $request->validate([
        'subject' => 'required|max:255',
        'message' => 'required',
    ]);

    EmailHelper::mail_setup();
    $subscribers = Newsletter::where('status', 1)
        ->whereNotNull('email_verified_at')
        ->get();

    foreach ($subscribers as $subscriber) {
        Mail::to($subscriber->email)->send(
            new BulkNewsletter($request->subject, $request->message)
        );
    }
}
```

> **Note:** Emails are sent synchronously in a loop. For large subscriber lists, this can timeout. No queue dispatch is used.
