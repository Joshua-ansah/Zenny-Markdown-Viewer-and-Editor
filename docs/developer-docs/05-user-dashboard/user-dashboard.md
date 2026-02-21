# Quland CMS — User Dashboard & Frontend Account

## 1. Overview

The user dashboard provides authenticated users with order management, profile settings, transaction history, wishlists, and support tickets. All user routes require `auth:web` guard authentication and are prefixed with `/user/*`.

## 2. User Routes

**File:** `routes/web.php`

```php
Route::group(['as' => 'user.', 'prefix' => 'user'], function () {
    // Public (guest) routes
    Route::get('login', [LoginController::class, 'custom_login_page'])->name('login');
    Route::post('store-login', [LoginController::class, 'store_login'])->name('store-login');
    Route::get('register', [RegisterController::class, 'seller_register_page'])->name('register');
    Route::post('store-register', [RegisterController::class, 'store_register'])->name('store-register');
    Route::get('register-verification', [RegisterController::class, 'register_verification'])->name('register-verification');
    Route::get('forget-password', [LoginController::class, 'forget_password'])->name('forget.password');
    Route::post('send-forget-password', [LoginController::class, 'send_custom_forget_pass'])->name('send.forget.password');
    Route::get('reset-password', [LoginController::class, 'custom_reset_password'])->name('reset.password');
    Route::post('store-reset-password/{token}', [LoginController::class, 'store_reset_password'])->name('store.reset.password');

    // Social login
    Route::get('login/google', [LoginController::class, 'redirect_to_google'])->name('login.google');
    Route::get('callback/google', [LoginController::class, 'google_callback'])->name('callback.google');
    Route::get('login/facebook', [LoginController::class, 'redirect_to_facebook'])->name('login.facebook');
    Route::get('callback/facebook', [LoginController::class, 'facebook_callback'])->name('callback.facebook');

    Route::get('logout', [LoginController::class, 'seller_logout'])->name('logout');

    // Protected routes
    Route::group(['middleware' => ['auth']], function () {
        Route::get('dashboard', [ProfileController::class, 'dashboard'])->name('dashboard');
        Route::get('edit-profile', [ProfileController::class, 'edit_profile'])->name('edit_profile');
        Route::post('profile-update', [ProfileController::class, 'profile_update'])->name('profile.update');
        Route::post('profile-password-update', [ProfileController::class, 'password_update'])->name('password.update');
        Route::get('orders', [ProfileController::class, 'order_list'])->name('order');
        Route::get('order-detail/{id}', [ProfileController::class, 'order_detail'])->name('order.detail');
        Route::get('transactions', [ProfileController::class, 'transaction'])->name('transaction');
        Route::post('user-delete', [ProfileController::class, 'user_delete'])->name('delete');

        // Ecommerce module routes
        // Wishlist module routes
        // Support ticket module routes
    });
});
```

## 3. Profile Controller

**File:** `app/Http/Controllers/User/ProfileController.php`

### 3.1 Dashboard (`dashboard()`)

```php
public function dashboard()
{
    $user = Auth::user();
    $orders = Order::where('user_id', $user->id);

    $data['total_order'] = $orders->count();
    $data['active_order'] = Order::where('user_id', $user->id)
        ->where('status', Status::ACTIVE_ORDER)->count();
    $data['complete_order'] = Order::where('user_id', $user->id)
        ->where('status', Status::COMPLETE_ORDER)->count();

    return view('user.dashboard', $data);
}
```

**Displays:**
- Total orders count
- Active orders count
- Completed orders count

### 3.2 Profile Editing (`edit_profile()` / `profile_update()`)

**Get Profile:**
```php
public function edit_profile()
{
    $profile = Auth::user();
    return view('user.edit_profile', compact('profile'));
}
```

**Update Profile:**
```php
public function profile_update(Request $request)
{
    $request->validate([
        'name' => 'required|min:3|max:100',
        'email' => 'required|email|max:100|unique:users,email,' . Auth::id(),
        'phone' => 'nullable|max:30',
        'address' => 'nullable|max:300',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,svg,webp|max:5120',
    ]);

    $user = Auth::user();
    $user->name = $request->name;
    $user->email = $request->email;
    $user->phone = $request->phone;
    $user->address = $request->address;

    if ($request->hasFile('image')) {
        // Delete old image
        $old_image = 'public/uploads/user/' . $user->image;
        if (File::exists($old_image)) {
            File::delete($old_image);
        }
        // Resize and save new image
        $image = $request->file('image');
        $fileName = uniqid() . '.webp';
        $image_resize = Image::make($image->getRealPath());
        $image_resize->encode('webp', 80);
        $image_resize->resize(200, 200);
        $image_resize->save(public_path('uploads/user/' . $fileName));
        $user->image = $fileName;
    }

    $user->save();
    return redirect()->back()->with('success', 'Profile updated successfully');
}
```

**Key Implementation Details:**
- Profile images are resized to 200×200 pixels
- Converted to WebP format at 80% quality
- Stored in `public/uploads/user/`
- Old image is deleted on update

### 3.3 Password Change (`password_update()`)

```php
public function password_update(Request $request)
{
    $request->validate([
        'current_password' => 'required|min:4|max:100',
        'password' => 'required|confirmed|min:4|max:100',
    ]);

    $user = Auth::user();
    if (!Hash::check($request->current_password, $user->password)) {
        return redirect()->back()->with('error', 'Current password does not match');
    }

    $user->password = Hash::make($request->password);
    $user->save();
}
```

### 3.4 Order List (`order_list()`)

```php
public function order_list(Request $request)
{
    $orders = Order::where('user_id', Auth::id())
        ->where('status', '!=', 0)
        ->when($request->search, function ($query) use ($request) {
            $query->where('order_id', 'LIKE', '%' . $request->search . '%');
        })
        ->latest()
        ->paginate(15);

    return view('user.order', compact('orders'));
}
```

### 3.5 Order Detail (`order_detail($id)`)

```php
public function order_detail($id)
{
    $order = Order::where('user_id', Auth::id())->findOrFail($id);
    $order_details = OrderDetail::where('order_id', $order->id)
        ->with('product')
        ->get();

    return view('user.order_detail', compact('order', 'order_details'));
}
```

### 3.6 Transaction History (`transaction()`)

```php
public function transaction(Request $request)
{
    $transactions = Order::where('user_id', Auth::id())
        ->where('status', '!=', 0)
        ->when($request->search, function ($query) use ($request) {
            $query->where('order_id', 'LIKE', '%' . $request->search . '%');
        })
        ->latest()
        ->paginate(15);

    return view('user.transaction', compact('transactions'));
}
```

### 3.7 Account Deletion (`user_delete()`)

**IMPORTANT:** This is a full cascade delete wrapped in a DB transaction:

```php
public function user_delete(Request $request)
{
    $request->validate([
        'password' => 'required',
    ]);

    $user = Auth::user();

    if (!Hash::check($request->password, $user->password)) {
        return redirect()->back()->with('error', 'Password does not match');
    }

    DB::beginTransaction();
    try {
        // Delete profile image
        $old_image = 'public/uploads/user/' . $user->image;
        if (File::exists($old_image)) {
            File::delete($old_image);
        }

        // Cascade deletes
        Review::where('user_id', $user->id)->delete();
        Order::where('user_id', $user->id)->delete();
        Wishlist::where('user_id', $user->id)->delete();
        Cart::where('user_id', $user->id)->delete();

        // Delete user
        $user->delete();

        DB::commit();
        Auth::guard('web')->logout();
        return redirect()->route('user.login')->with('success', 'Account deleted');
    } catch (\Exception $e) {
        DB::rollBack();
        return redirect()->back()->with('error', 'Something went wrong');
    }
}
```

**Cascade Order:**
1. Delete profile image from disk
2. Delete all user reviews
3. Delete all user orders (and implicitly order details)
4. Delete all wishlists
5. Delete all cart items
6. Delete user record
7. Logout and redirect

## 4. E-commerce User Flow

### 4.1 Cart Management

**Controller:** `Modules/Ecommerce/Http/Controllers/CartController.php`

**Routes:**
```
POST /cart/add           → add_to_cart()
GET  /cart               → cart_view()
POST /cart/update        → cart_update()
GET  /cart/remove/{id}   → cart_remove()
```

**Dual-Identity Cart System:**

The cart uses a hybrid session/user identification:

```php
public function add_to_cart(Request $request)
{
    $cartData = [
        'product_id' => $request->product_id,
        'quantity' => $request->quantity ?? 1,
        'price' => $product->finalPrice,
    ];

    if (Auth::check()) {
        $cartData['user_id'] = Auth::id();
    } else {
        $cartData['session_id'] = session()->getId();
    }

    // Check if product already in cart
    $existingCart = Cart::where('product_id', $request->product_id)
        ->where(function ($q) {
            if (Auth::check()) {
                $q->where('user_id', Auth::id());
            } else {
                $q->where('session_id', session()->getId());
            }
        })->first();

    if ($existingCart) {
        $existingCart->quantity += $request->quantity ?? 1;
        $existingCart->save();
    } else {
        Cart::create($cartData);
    }
}
```

**Guest → User Cart Migration:** On login, all session-based cart items are transferred:
```php
Cart::where('session_id', $sessionId)->update(['user_id' => $user->id]);
```

### 4.2 Checkout Flow

**Controller:** `Modules/Ecommerce/Http/Controllers/CheckoutController.php`

**Routes:**
```
GET  /checkout          → checkout_page()
POST /checkout/process  → checkout_process()
```

**Checkout Process:**
1. Loads cart items for authenticated user
2. Validates shipping address fields
3. Applies coupon if provided
4. Calculates subtotal, shipping, discount, tax, total
5. Stores checkout data in session for payment processing
6. Redirects to payment gateway

### 4.3 Payment Processing

**Controller:** `Modules/Ecommerce/Http/Controllers/EcommercePaymentController.php` (~566 lines)

**Payment Gateway Routes:**

| Gateway | Route Pattern |
|---------|--------------|
| Stripe | `POST /payment/stripe` |
| PayPal | `POST /payment/paypal` → callback at `/payment/paypal/success` |
| Razorpay | `POST /payment/razorpay` |
| Flutterwave | `POST /payment/flutterwave` → callback |
| Mollie | `POST /payment/mollie` → callback |
| Paystack | `POST /payment/paystack` → callback |
| Instamojo | `POST /payment/instamojo` → callback |
| Bank Transfer | `POST /payment/bank` |

**Core Order Creation (`create_order()`):**

```php
private function create_order($payment_method, $payment_status, $transaction_id = null)
{
    $checkout = session('checkout');
    $user = Auth::user();

    // Generate unique order ID
    $order_id = 'ORD-' . strtoupper(Str::random(10));

    $order = Order::create([
        'order_id' => $order_id,
        'user_id' => $user->id,
        'name' => $checkout['name'],
        'email' => $checkout['email'],
        'phone' => $checkout['phone'],
        'address' => $checkout['address'],
        'city' => $checkout['city'],
        'state' => $checkout['state'],
        'zip' => $checkout['zip'],
        'country' => $checkout['country'],
        'subtotal' => $checkout['subtotal'],
        'shipping_cost' => $checkout['shipping_cost'],
        'discount' => $checkout['discount'],
        'coupon_id' => $checkout['coupon_id'],
        'total' => $checkout['total'],
        'payment_method' => $payment_method,
        'payment_status' => $payment_status,
        'transaction_id' => $transaction_id,
        'status' => Status::ACTIVE_ORDER,
        'currency' => $checkout['currency'],
    ]);

    // Create order details for each cart item
    $cart_items = Cart::where('user_id', $user->id)->get();
    foreach ($cart_items as $item) {
        OrderDetail::create([
            'order_id' => $order->id,
            'product_id' => $item->product_id,
            'quantity' => $item->quantity,
            'price' => $item->price,
        ]);
        // Update product stock
        Product::find($item->product_id)->decrement('quantity', $item->quantity);
    }

    // Apply coupon usage
    if ($checkout['coupon_id']) {
        Coupon::find($checkout['coupon_id'])->increment('used_count');
    }

    // Clear cart
    Cart::where('user_id', $user->id)->delete();

    // Send order confirmation email
    EmailHelper::mail_setup();
    $template = EmailTemplate::find(2);  // Order confirmation template
    Mail::to($user->email)->send(new OrderConfirmation($order, $template));

    session()->forget('checkout');
    return $order;
}
```

### 4.4 Payment Gateway Implementations

#### Stripe

```php
public function stripe_payment(Request $request)
{
    $stripe = new \Stripe\StripeClient($stripe_secret);
    $charge = $stripe->charges->create([
        'amount' => $total * 100,  // Stripe uses cents
        'currency' => $currency,
        'source' => $request->stripeToken,
        'description' => 'Order payment',
    ]);
    $order = $this->create_order('stripe', 'paid', $charge->id);
}
```

#### PayPal

Uses `srmklive/paypal` package:
```php
$provider = new PayPalClient;
$provider->setApiCredentials([...]);
$provider->getAccessToken();
$response = $provider->createOrder([...]);
// Redirect to PayPal approval URL
// On return: $provider->capturePaymentOrder($token)
```

#### Razorpay

```php
$api = new Api($razorpay_key, $razorpay_secret);
$payment = $api->payment->fetch($request->razorpay_payment_id);
$payment->capture(['amount' => $total * 100, 'currency' => $currency]);
```

#### Bank Transfer

Stores order with `payment_status = 'pending'`, no external API call.

## 5. Wishlist

**Controller:** `Modules/Wishlist/Http/Controllers/WishlistController.php`

**Routes:**
```
GET  /wishlists              → wishlist listing
POST /wishlist/add           → add product to wishlist
GET  /wishlist/remove/{id}   → remove from wishlist
```

**Logic:**
- Toggle behavior: if product already in wishlist, removes it; otherwise adds
- Requires authentication
- Stored in `wishlists` table with `user_id` and `product_id`

## 6. Support Tickets

**Controller:** `Modules/SupportTicket/Http/Controllers/UserSupportTicketController.php`

**Routes:**
```
GET  /user/support-tickets         → ticket listing
POST /user/support-ticket/create   → create ticket
GET  /user/support-ticket/{id}     → view ticket details
POST /user/support-ticket/reply    → reply to ticket
```

**Ticket Creation:**
```php
$ticket = SupportTicket::create([
    'user_id' => Auth::id(),
    'subject' => $request->subject,
    'priority' => $request->priority,  // low, medium, high
    'status' => 'open',
]);

// First message
SupportTicketMessage::create([
    'support_ticket_id' => $ticket->id,
    'message' => $request->message,
    'sender_type' => 'user',
    'file' => $uploadedFile,
]);
```

**Unseen Message Tracking:**
```php
// Messages have 'is_seen' field
// When admin replies, user sees unseen count
// When user views ticket, marks all admin messages as seen
SupportTicketMessage::where('support_ticket_id', $id)
    ->where('sender_type', 'admin')
    ->update(['is_seen' => 1]);
```

## 7. User View Structure

```
resources/views/user/
├── dashboard.blade.php
├── edit_profile.blade.php
├── order.blade.php
├── order_detail.blade.php
├── transaction.blade.php
├── wishlist.blade.php
└── support_ticket/
    ├── index.blade.php
    ├── create.blade.php
    └── show.blade.php
```

## 8. User Model Fields

**File:** `app/Models/User.php`

```php
protected $fillable = [
    'name',
    'email',
    'password',
    'phone',
    'address',
    'image',
    'status',           // enable / disable
    'is_banned',        // yes / no
    'online',           // 0 / 1
    'provider',         // null / google / facebook
    'provider_id',      // OAuth provider user ID
    'verification_token',
    'email_verified_at',
    'forget_password_token',
    'feez_status',      // 0 / 1 (account freeze)
];

protected $hidden = [
    'password',
    'remember_token',
];

protected $casts = [
    'email_verified_at' => 'datetime',
];
```

## 9. Order Status Flow

```
Status::ACTIVE_ORDER (1)   → Order placed, awaiting processing
Status::COMPLETE_ORDER (2) → Order fulfilled
Status::CANCEL_ORDER (3)   → Order cancelled

Admin can change: ACTIVE → COMPLETE or ACTIVE → CANCEL
```

**Status Badge Colors (GlobalStatus trait):**
```php
public function statusBadge(): string
{
    return match ($this->status) {
        1 => '<span class="badge bg-warning">Active</span>',
        2 => '<span class="badge bg-success">Complete</span>',
        3 => '<span class="badge bg-danger">Cancelled</span>',
        default => '<span class="badge bg-secondary">Pending</span>',
    };
}
```

## 10. User Request Lifecycle

```
GET /user/dashboard
  → Web Middleware Group (Session, CSRF, DemoMode, XSS, CurrencyLanguage)
  → auth middleware (checks Auth::guard('web'))
  → ProfileController::dashboard()
  → Query Order model with user_id filter
  → Return view('user.dashboard', $data)
  → View inherits global data from AppServiceProvider view composer
```
