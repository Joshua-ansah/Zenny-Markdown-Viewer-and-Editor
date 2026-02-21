# Quland CMS — Payment Gateway Integration

## 1. Overview

Quland supports 8 payment gateways managed through the PaymentGateway module. All gateway credentials are stored in the `payment_gateways` database table and configured through the admin panel.

## 2. Supported Gateways

| Gateway | Package | Config Source |
|---------|---------|---------------|
| Stripe | `stripe/stripe-php` | `payment_gateways` table |
| PayPal | `srmklive/paypal ^3.0` | `payment_gateways` table |
| Razorpay | `razorpay/razorpay ^2.9` | `payment_gateways` table |
| Flutterwave | Direct API (cURL) | `payment_gateways` table |
| Mollie | `mollie/laravel-mollie 2.25` | `payment_gateways` table |
| Paystack | Direct API (cURL) | `payment_gateways` table |
| Instamojo | Direct API (cURL) | `payment_gateways` table |
| Bank Transfer | Manual (no API) | `payment_gateways` table |

## 3. PaymentGateway Module

### 3.1 Structure

```
Modules/PaymentGateway/
├── Entities/PaymentGateway.php
├── Http/Controllers/PaymentGatewayController.php
├── Routes/web.php
└── Resources/views/
```

### 3.2 PaymentGateway Model

```php
protected $fillable = [
    'name',           // stripe, paypal, razorpay, etc.
    'credentials',    // JSON-encoded credentials
    'currency',       // Gateway currency (USD, EUR, etc.)
    'status',         // 1 = active, 0 = inactive
    'image',          // Gateway logo
];

protected $casts = [
    'credentials' => 'array',
];
```

### 3.3 Admin Management

**Routes:**
```
GET /admin/payment-gateways           → index()         List all gateways
GET /admin/payment-gateway/{id}/edit  → edit()          Edit credentials form
PUT /admin/payment-gateway/{id}       → update()        Save credentials
GET /admin/payment-gateway-status/{id} → status_update() Toggle active/inactive
```

### 3.4 Credential Structures

**Stripe:**
```json
{
    "stripe_key": "pk_...",
    "stripe_secret": "sk_..."
}
```

**PayPal:**
```json
{
    "paypal_client_id": "...",
    "paypal_secret": "...",
    "paypal_mode": "sandbox|live"
}
```

**Razorpay:**
```json
{
    "razorpay_key": "rzp_...",
    "razorpay_secret": "..."
}
```

**Flutterwave:**
```json
{
    "flutterwave_public_key": "FLWPUBK-...",
    "flutterwave_secret_key": "FLWSECK-...",
    "flutterwave_encryption_key": "..."
}
```

**Mollie:**
```json
{
    "mollie_key": "test_..."
}
```

**Paystack:**
```json
{
    "paystack_public_key": "pk_...",
    "paystack_secret_key": "sk_..."
}
```

**Instamojo:**
```json
{
    "instamojo_api_key": "...",
    "instamojo_auth_token": "...",
    "instamojo_mode": "sandbox|live"
}
```

**Bank Transfer:**
```json
{
    "bank_name": "...",
    "account_name": "...",
    "account_number": "...",
    "routing_number": "...",
    "branch_name": "...",
    "instructions": "..."
}
```

## 4. Payment Processing Flow

**Controller:** `Modules/Ecommerce/Http/Controllers/EcommercePaymentController.php`

### 4.1 Common Flow

```
1. Checkout stores data in session
2. User selects payment gateway
3. Frontend submits to gateway-specific route
4. Controller loads credentials from payment_gateways table
5. Initializes SDK with dynamic credentials
6. Processes payment
7. On success → create_order() → redirect to success
8. On failure → redirect back with error
```

### 4.2 Stripe Implementation

```php
public function stripe_payment(Request $request)
{
    $gateway = PaymentGateway::where('name', 'stripe')->first();
    $credentials = json_decode($gateway->credentials);

    $stripe = new \Stripe\StripeClient($credentials->stripe_secret);
    $charge = $stripe->charges->create([
        'amount' => intval(session('checkout.total') * 100),
        'currency' => strtolower($gateway->currency),
        'source' => $request->stripeToken,
        'description' => 'Order from ' . config('app.name'),
    ]);

    if ($charge->status === 'succeeded') {
        $order = $this->create_order('stripe', 'paid', $charge->id);
        return redirect()->route('order.success', $order->id);
    }
}
```

### 4.3 PayPal Implementation

```php
public function paypal_payment(Request $request)
{
    $gateway = PaymentGateway::where('name', 'paypal')->first();
    $credentials = json_decode($gateway->credentials);

    $provider = new PayPalClient;
    $provider->setApiCredentials([
        'mode' => $credentials->paypal_mode,
        'sandbox' => [
            'client_id' => $credentials->paypal_client_id,
            'client_secret' => $credentials->paypal_secret,
        ],
        'live' => [
            'client_id' => $credentials->paypal_client_id,
            'client_secret' => $credentials->paypal_secret,
        ],
    ]);
    $provider->getAccessToken();

    $response = $provider->createOrder([
        'intent' => 'CAPTURE',
        'purchase_units' => [[
            'amount' => [
                'currency_code' => $gateway->currency,
                'value' => session('checkout.total'),
            ]
        ]]
    ]);

    // Redirect to PayPal for approval
    // Callback route captures payment on return
}
```

### 4.4 Razorpay Implementation

```php
public function razorpay_payment(Request $request)
{
    $gateway = PaymentGateway::where('name', 'razorpay')->first();
    $credentials = json_decode($gateway->credentials);

    $api = new Api($credentials->razorpay_key, $credentials->razorpay_secret);
    $payment = $api->payment->fetch($request->razorpay_payment_id);
    $payment->capture([
        'amount' => intval(session('checkout.total') * 100),
        'currency' => $gateway->currency,
    ]);

    $order = $this->create_order('razorpay', 'paid', $payment->id);
}
```

### 4.5 Bank Transfer Implementation

```php
public function bank_payment(Request $request)
{
    // No external API call — stores order with pending status
    $order = $this->create_order('bank_transfer', 'pending');
    return redirect()->route('order.success', $order->id);
}
```

## 5. Currency Handling

- Each gateway has its own `currency` field
- Checkout uses the gateway's configured currency for payment
- Currency conversion is NOT handled automatically
- Admin must ensure gateway currency matches site pricing or configure appropriately

## 6. Gateway Activation

Gateways can be toggled active/inactive:
```php
public function status_update($id)
{
    $gateway = PaymentGateway::findOrFail($id);
    $gateway->status = $gateway->status == 1 ? 0 : 1;
    $gateway->save();
}
```

Only active gateways (`status = 1`) are shown on the checkout page.

## 7. Security Considerations

- All gateway secrets are stored in the database (not .env or config files)
- Credentials are JSON-encoded in a single column
- No encryption at rest for credentials (stored as plain text in DB)
- CSRF protection on all payment form submissions
- Callback URLs use signed routes where applicable (PayPal, Flutterwave, Mollie)
- Stripe uses tokenized card data (PCI-compliant via Stripe.js)
