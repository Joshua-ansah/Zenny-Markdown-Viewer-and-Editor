# Quland CMS — E-commerce Module

## 1. Overview

The Ecommerce module (`Modules/Ecommerce`) is the largest module in Quland, providing a full product catalog, shopping cart, checkout, payment processing, order management, reviews, and shipping configuration.

## 2. Module Structure

```
Modules/Ecommerce/
├── Config/config.php
├── Database/
│   ├── Migrations/
│   │   ├── create_products_table.php
│   │   ├── create_carts_table.php
│   │   ├── create_orders_table.php
│   │   ├── create_order_details_table.php
│   │   ├── create_reviews_table.php
│   │   └── create_shipping_methods_table.php
│   └── Seeders/
├── Entities/
│   ├── Product.php
│   ├── Cart.php
│   ├── Order.php
│   ├── OrderDetail.php
│   ├── Review.php
│   └── ShippingMethod.php
├── Http/
│   ├── Controllers/
│   │   ├── ProductController.php         (Admin CRUD)
│   │   ├── CartController.php            (Frontend cart)
│   │   ├── CheckoutController.php        (Checkout flow)
│   │   ├── EcommercePaymentController.php (Payment processing ~566 lines)
│   │   ├── OrderController.php           (Admin order management)
│   │   ├── ReviewController.php          (Admin review moderation)
│   │   └── ShippingMethodController.php  (Admin shipping config)
│   └── Requests/
├── Providers/EcommerceServiceProvider.php
├── Resources/views/
├── Routes/web.php
└── Tests/
```

## 3. Product Management

### 3.1 Product Model

**File:** `Modules/Ecommerce/Entities/Product.php`

```php
protected $fillable = [
    'name', 'slug', 'description', 'short_description',
    'price', 'discount_price', 'quantity', 'sku',
    'category_id', 'brand_id',
    'status', 'is_featured',
    'seo_title', 'seo_description',
    'image', 'gallery',
    'weight', 'dimensions',
];

protected $casts = [
    'gallery' => 'array',
];
```

**Computed Attribute — `finalPrice`:**
```php
public function getFinalPriceAttribute()
{
    if ($this->discount_price && $this->discount_price > 0) {
        return $this->discount_price;
    }
    return $this->price;
}
```

**Translation Accessors:**
```php
// NOTE: These all return 'name' field — potential bug
public function getDescriptionAttribute($value)
{
    return getTranslatedValue($this, 'name');
}
public function getSeoTitleAttribute($value)
{
    return getTranslatedValue($this, 'name');
}
public function getSeoDescriptionAttribute($value)
{
    return getTranslatedValue($this, 'name');
}
```

> **Known Issue:** `getDescriptionAttribute`, `getSeoTitleAttribute`, and `getSeoDescriptionAttribute` all call `getTranslatedValue($this, 'name')` instead of their respective fields. This means accessing `$product->description`, `$product->seo_title`, or `$product->seo_description` will always return the product name.

**Relationships:**
```php
public function category() { return $this->belongsTo(Category::class); }
public function brand() { return $this->belongsTo(Brand::class); }
public function reviews() { return $this->hasMany(Review::class); }
public function orderDetails() { return $this->hasMany(OrderDetail::class); }
```

### 3.2 Admin Product CRUD

**Controller:** `Modules/Ecommerce/Http/Controllers/ProductController.php`

**Routes:**
```
GET    /admin/products          → index()     Paginated product list
GET    /admin/product/create    → create()    Create form
POST   /admin/product           → store()     Store product
GET    /admin/product/{id}/edit → edit()      Edit form
PUT    /admin/product/{id}      → update()    Update product
DELETE /admin/product/{id}      → destroy()   Delete product
GET    /admin/product-status/{id} → status()  Toggle active/inactive
```

**Product Creation:**
```php
public function store(Request $request)
{
    $request->validate([
        'name' => 'required|max:255',
        'slug' => 'required|unique:products|max:255',
        'price' => 'required|numeric|min:0',
        'quantity' => 'required|integer|min:0',
        'category_id' => 'required|exists:categories,id',
        'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        'gallery.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
    ]);

    $product = Product::create($request->except('image', 'gallery'));

    // Main image upload
    if ($request->hasFile('image')) {
        $fileName = uniqid() . '.webp';
        $image = Image::make($request->file('image'));
        $image->encode('webp', 80)->save(public_path('uploads/products/' . $fileName));
        $product->image = $fileName;
    }

    // Gallery images
    if ($request->hasFile('gallery')) {
        $gallery = [];
        foreach ($request->file('gallery') as $file) {
            $galleryName = uniqid() . '.webp';
            Image::make($file)->encode('webp', 80)
                ->save(public_path('uploads/products/gallery/' . $galleryName));
            $gallery[] = $galleryName;
        }
        $product->gallery = $gallery;
    }

    // Multi-language translations
    $languages = Language::all();
    $translations = [];
    foreach ($languages as $lang) {
        $translations[$lang->code] = [
            'name' => $request->input("name_{$lang->code}"),
            'description' => $request->input("description_{$lang->code}"),
            'short_description' => $request->input("short_description_{$lang->code}"),
        ];
    }
    $product->translations = json_encode($translations);
    $product->save();
}
```

**Image Storage:**
- Main images: `public/uploads/products/`
- Gallery images: `public/uploads/products/gallery/`
- Format: WebP at 80% quality
- Old images deleted on update/delete

## 4. Shopping Cart

### 4.1 Cart Model

```php
protected $fillable = [
    'user_id', 'session_id', 'product_id', 'quantity', 'price',
];

// Dual identity — guests use session_id, users use user_id
```

**Static Helper:**
```php
public static function insertUserToCart($sessionId, $userId)
{
    Cart::where('session_id', $sessionId)->update(['user_id' => $userId]);
}
```

### 4.2 Cart Operations

| Operation | Route | Method |
|-----------|-------|--------|
| Add to cart | `POST /cart/add` | `add_to_cart()` |
| View cart | `GET /cart` | `cart_view()` |
| Update quantity | `POST /cart/update` | `cart_update()` |
| Remove item | `GET /cart/remove/{id}` | `cart_remove()` |

**Cart Item Resolution:**
```php
// For authenticated users
Cart::where('user_id', Auth::id())->with('product')->get();

// For guests
Cart::where('session_id', session()->getId())->with('product')->get();
```

### 4.3 Cart Count (Global)

Available in all views via `AppServiceProvider`:
```php
View::composer('*', function ($view) {
    $cart_count = Auth::check()
        ? Cart::where('user_id', Auth::id())->count()
        : Cart::where('session_id', session()->getId())->count();
    $view->with('cart_count', $cart_count);
});
```

## 5. Checkout & Payment

### 5.1 Checkout Flow

```
Cart Page → Checkout Page → Payment Gateway → Order Confirmation
```

**Checkout Data Stored in Session:**
```php
session(['checkout' => [
    'name' => $request->name,
    'email' => $request->email,
    'phone' => $request->phone,
    'address' => $request->address,
    'city' => $request->city,
    'state' => $request->state,
    'zip' => $request->zip,
    'country' => $request->country,
    'subtotal' => $subtotal,
    'shipping_cost' => $shipping,
    'discount' => $discount,
    'coupon_id' => $coupon_id,
    'total' => $total,
    'currency' => $currency,
    'shipping_method_id' => $request->shipping_method,
    'notes' => $request->notes,
]]);
```

### 5.2 Payment Gateway Integration

**File:** `Modules/Ecommerce/Http/Controllers/EcommercePaymentController.php`

Each gateway follows this pattern:
1. Load gateway credentials from `payment_gateways` table
2. Initialize SDK/API client
3. Create payment/charge
4. On success: call `create_order($method, 'paid', $transaction_id)`
5. On failure: redirect back with error

**Gateway Credential Loading:**
```php
$gateway = PaymentGateway::where('name', 'stripe')->first();
$credentials = json_decode($gateway->credentials);
$stripe_key = $credentials->stripe_key;
$stripe_secret = $credentials->stripe_secret;
```

### 5.3 Order Creation

The `create_order()` method (documented in user-dashboard.md §4.4) handles:
1. Unique order ID generation (`ORD-XXXXXXXXXX`)
2. Order record creation with shipping/billing details
3. Order detail records for each cart item
4. Product stock decrement
5. Coupon usage increment
6. Cart clearing
7. Order confirmation email
8. Session cleanup

## 6. Order Management (Admin)

**Controller:** `Modules/Ecommerce/Http/Controllers/OrderController.php`

**Routes:**
```
GET /admin/orders              → index()        Order listing with filters
GET /admin/order/{id}          → show()         Order detail
GET /admin/order-status/{id}   → status_update() Change order status
```

**Order Listing:**
- Paginated (15 per page)
- Searchable by order_id
- Filterable by status (active, complete, cancel)

**Status Update:**
```php
public function status_update(Request $request, $id)
{
    $order = Order::findOrFail($id);
    $order->status = $request->status;
    $order->save();

    // Send status update email to user
    EmailHelper::mail_setup();
    $template = EmailTemplate::find(3);  // Order status template
    Mail::to($order->email)->send(new OrderStatusUpdate($order, $template));
}
```

## 7. Reviews

**Controller:** `Modules/Ecommerce/Http/Controllers/ReviewController.php`

**Frontend Route:** `POST /review/store` (authenticated users only)

**Admin Routes:**
```
GET /admin/reviews            → index()       All reviews
GET /admin/review-status/{id} → status()      Approve/reject
DELETE /admin/review/{id}     → destroy()     Delete review
```

**Review Model:**
```php
protected $fillable = [
    'user_id', 'product_id', 'rating', 'comment', 'status',
];
// status: 0 = pending, 1 = approved
```

## 8. Shipping Methods

**Controller:** `Modules/Ecommerce/Http/Controllers/ShippingMethodController.php`

**Admin Routes:**
```
GET    /admin/shipping-methods          → CRUD listing
POST   /admin/shipping-method           → Create
PUT    /admin/shipping-method/{id}      → Update
DELETE /admin/shipping-method/{id}      → Delete
GET    /admin/shipping-method-status/{id} → Toggle
```

**Model Fields:**
```php
protected $fillable = [
    'name', 'cost', 'estimated_days', 'status',
];
```

## 9. Coupon Integration

**Table:** `coupons`

| Column | Type | Description |
|--------|------|-------------|
| `code` | string | Unique coupon code |
| `type` | enum | `percentage` or `fixed` |
| `value` | decimal | Discount amount or percentage |
| `min_order` | decimal | Minimum order amount |
| `max_uses` | integer | Maximum total uses |
| `used_count` | integer | Current usage count |
| `start_date` | date | Coupon start date |
| `end_date` | date | Coupon expiration date |
| `status` | boolean | Active/inactive |

**Coupon Validation (during checkout):**
```php
$coupon = Coupon::where('code', $request->coupon_code)
    ->where('status', 1)
    ->where('start_date', '<=', now())
    ->where('end_date', '>=', now())
    ->where('used_count', '<', DB::raw('max_uses'))
    ->first();

if ($coupon && $subtotal >= $coupon->min_order) {
    $discount = $coupon->type === 'percentage'
        ? ($subtotal * $coupon->value / 100)
        : $coupon->value;
}
```

## 10. File Storage Paths

| Content | Path | Format |
|---------|------|--------|
| Product images | `public/uploads/products/` | WebP |
| Product gallery | `public/uploads/products/gallery/` | WebP |
| Review attachments | `public/uploads/reviews/` | Mixed |

## 11. Email Notifications

| Event | Template ID | Mailable Class |
|-------|-------------|----------------|
| Order Confirmation | 2 | `OrderConfirmation` |
| Order Status Update | 3 | `OrderStatusUpdate` |
