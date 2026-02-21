# Quland CMS — Contact Messages

## 1. Overview

The ContactMessage module handles the public contact form submissions and admin management of received messages.

## 2. Module Structure

```
Modules/ContactMessage/
├── Entities/ContactMessage.php
├── Http/Controllers/ContactMessageController.php
├── Routes/web.php
└── Resources/views/
```

## 3. Contact Form (Frontend)

**Route:** `POST /contact-message` → `HomeController::contact_message_store()`

```php
public function contact_message_store(Request $request)
{
    $request->validate([
        'name' => 'required|max:100',
        'email' => 'required|email|max:100',
        'phone' => 'nullable|max:30',
        'subject' => 'required|max:255',
        'message' => 'required|max:2000',
        'g-recaptcha-response' => [new Captcha()],
    ]);

    ContactMessage::create($request->only('name', 'email', 'phone', 'subject', 'message'));
}
```

## 4. Admin Management

**Routes:**
```
GET    /admin/contact-messages    → index()     Message listing
GET    /admin/contact-message/{id} → show()     View message
DELETE /admin/contact-message/{id} → destroy()  Delete message
POST   /admin/contact-message/reply → reply()   Reply via email
```

## 5. ContactMessage Model

```php
protected $fillable = [
    'name', 'email', 'phone', 'subject', 'message',
    'is_seen',   // 0 = unread, 1 = read
];
```

---

# Quland CMS — FAQ Module

## 1. Overview

The FAQ module provides a simple CRUD for frequently asked questions displayed on the frontend FAQ page.

## 2. Admin Routes

```
GET    /admin/faqs           → index()
POST   /admin/faq            → store()
PUT    /admin/faq/{id}       → update()
DELETE /admin/faq/{id}       → destroy()
GET    /admin/faq-status/{id} → status()
```

## 3. FAQ Model

```php
protected $fillable = ['question', 'answer', 'status'];
```

Supports multi-language translations via the standard translation pattern.

## 4. Frontend Display

**Route:** `GET /faq` → `HomeController::faq()`

```php
public function faq()
{
    $faqs = FAQ::where('status', 1)->get();
    return view("{$activeTheme}.faq", compact('faqs'));
}
```

---

# Quland CMS — Testimonial Module

## Admin Routes

```
GET    /admin/testimonials           → index()
POST   /admin/testimonial            → store()
PUT    /admin/testimonial/{id}       → update()
DELETE /admin/testimonial/{id}       → destroy()
```

## Model

```php
protected $fillable = [
    'name', 'designation', 'comment', 'image', 'rating', 'status',
];
```

Images stored in `public/uploads/testimonials/`.

---

# Quland CMS — Team Module

## Admin Routes

```
GET    /admin/teams            → index()
POST   /admin/team             → store()
PUT    /admin/team/{id}        → update()
DELETE /admin/team/{id}        → destroy()
```

## Model

```php
protected $fillable = [
    'name', 'designation', 'image',
    'facebook', 'twitter', 'linkedin', 'instagram',
    'status',
];
```

Images stored in `public/uploads/teams/`.

Frontend: `GET /teams` → `HomeController::teams()`

---

# Quland CMS — Partner Module

## Admin Routes

```
GET    /admin/partners          → index()
POST   /admin/partner           → store()
PUT    /admin/partner/{id}      → update()
DELETE /admin/partner/{id}      → destroy()
```

## Model

```php
protected $fillable = ['image', 'status'];
```

Partner logos displayed in the partner section of the frontend.

---

# Quland CMS — Custom Pages Module

## Admin Routes

```
GET    /admin/pages            → index()
POST   /admin/page             → store()
GET    /admin/page/{id}/edit   → edit()
PUT    /admin/page/{id}        → update()
DELETE /admin/page/{id}        → destroy()
```

## Model

```php
protected $fillable = [
    'title', 'slug', 'description', 'seo_title', 'seo_description', 'status',
];
```

Frontend: `GET /page/{slug}` → `HomeController::custom_page()`

Multi-language support via translations JSON field.

---

# Quland CMS — Subscription Module

## Admin Routes

```
GET    /admin/subscriptions           → index()
POST   /admin/subscription            → store()
GET    /admin/subscription/{id}/edit  → edit()
PUT    /admin/subscription/{id}       → update()
DELETE /admin/subscription/{id}       → destroy()
```

## Model

```php
protected $fillable = [
    'name', 'price', 'duration', 'features', 'status',
];

protected $casts = [
    'features' => 'array',
];
```

---

# Quland CMS — Location Modules (Country/State/City)

## Structure

Three separate modules managing geographic hierarchy:
- `Modules/Country/` — Countries
- `Modules/State/` — States (belongs to Country)
- `Modules/City/` — Cities (belongs to State)

## Relationships

```php
// Country
public function states() { return $this->hasMany(State::class); }

// State
public function country() { return $this->belongsTo(Country::class); }
public function cities() { return $this->hasMany(City::class); }

// City
public function state() { return $this->belongsTo(State::class); }
```

## Admin Routes

Each module provides standard CRUD:
```
GET    /admin/{module}s          → index()
POST   /admin/{module}           → store()
PUT    /admin/{module}/{id}      → update()
DELETE /admin/{module}/{id}      → destroy()
```

---

# Quland CMS — Coupon Module

## Admin Routes

```
GET    /admin/coupons           → index()
POST   /admin/coupon            → store()
GET    /admin/coupon/{id}/edit  → edit()
PUT    /admin/coupon/{id}       → update()
DELETE /admin/coupon/{id}       → destroy()
GET    /admin/coupon-status/{id} → status()
```

## Model

```php
protected $fillable = [
    'code', 'type', 'value', 'min_order',
    'max_uses', 'used_count',
    'start_date', 'end_date', 'status',
];
```

See ecommerce.md §9 for coupon validation logic.

---

# Quland CMS — Wishlist Module

## User Routes

```
GET  /user/wishlists           → index()
POST /wishlist/toggle          → toggle()    Add or remove
```

## Model

```php
protected $fillable = ['user_id', 'product_id'];

public function product() { return $this->belongsTo(Product::class); }
public function user() { return $this->belongsTo(User::class); }
```

Toggle behavior: clicking wishlist on an already-wishlisted product removes it.

---

# Quland CMS — Listing Module

## Admin Routes

```
GET    /admin/listings           → index()
POST   /admin/listing            → store()
GET    /admin/listing/{id}/edit  → edit()
PUT    /admin/listing/{id}       → update()
DELETE /admin/listing/{id}       → destroy()
```

Multi-language support via translations. Used for directory/listing type content.

---

# Quland CMS — Project Module

## Admin Routes

```
GET    /admin/projects           → index()
POST   /admin/project            → store()
GET    /admin/project/{id}/edit  → edit()
PUT    /admin/project/{id}       → update()
DELETE /admin/project/{id}       → destroy()
```

Frontend: `GET /projects` and `GET /project/{slug}` → `HomeController::projects()` / `project_detail()`

Images stored in `public/uploads/projects/`.
