# Quland CMS — Multi-Currency System

## 1. Overview

Quland supports multiple currencies with a session-based currency switcher. Currencies are managed through the Currency module and displayed site-wide using a global helper function.

## 2. Currency Module

### 2.1 Structure

```
Modules/Currency/
├── Entities/Currency.php
├── Http/Controllers/CurrencyController.php
├── Routes/web.php
└── Resources/views/
```

### 2.2 Currency Model

```php
protected $fillable = [
    'name',         // e.g., "US Dollar"
    'code',         // e.g., "USD"
    'symbol',       // e.g., "$"
    'rate',         // Exchange rate relative to base currency
    'status',       // 1 = active, 0 = inactive
    'is_default',   // 1 = base currency
];
```

### 2.3 Admin Currency CRUD

**Routes:**
```
GET    /admin/currencies           → index()
POST   /admin/currency             → store()
PUT    /admin/currency/{id}        → update()
DELETE /admin/currency/{id}        → destroy()
GET    /admin/currency-status/{id} → status()
GET    /admin/currency-default/{id} → set_default()
```

**Deletion Protection:**
```php
public function destroy($id)
{
    $currency = Currency::findOrFail($id);

    // Cannot delete default currency
    if ($currency->is_default) {
        return redirect()->back()->with('error', 'Cannot delete default currency');
    }

    // Cannot delete if used by any payment gateway
    $gatewayUsing = PaymentGateway::where('currency', $currency->code)->first();
    if ($gatewayUsing) {
        return redirect()->back()->with('error', 'Currency is used by payment gateway');
    }

    $currency->delete();
}
```

## 3. Currency Switching

### 3.1 Frontend Switcher

**Route:** `GET /currency-switcher/{code}` → `HomeController::currency_switcher()`

```php
public function currency_switcher($code)
{
    $currency = Currency::where('code', $code)->where('status', 1)->first();
    if ($currency) {
        session([
            'currency_code' => $currency->code,
            'currency_symbol' => $currency->symbol,
            'currency_rate' => $currency->rate,
        ]);
    }
    return redirect()->back();
}
```

### 3.2 Session Persistence

**File:** `app/Http/Middleware/CurrencyLangauge.php`

```php
// In handle() method:
if (!session()->has('currency_code')) {
    $defaultCurrency = Currency::where('is_default', 1)->first();
    if ($defaultCurrency) {
        session([
            'currency_code' => $defaultCurrency->code,
            'currency_symbol' => $defaultCurrency->symbol,
            'currency_rate' => $defaultCurrency->rate,
        ]);
    }
}
```

## 4. Currency Display Helper

**File:** `app/Helper/helper.php`

```php
function currency($amount)
{
    $symbol = session('currency_symbol', '$');
    $rate = session('currency_rate', 1);

    $converted = $amount * $rate;
    return $symbol . number_format($converted, 2);
}
```

**Usage in Blade:**
```blade
{{ currency($product->finalPrice) }}
{{ currency($order->total) }}
```

## 5. Currency Availability in Views

Provided globally via `AppServiceProvider`:

```php
View::composer('*', function ($view) {
    $currencies = Currency::where('status', 1)->get();
    $view->with('currencies', $currencies);
});
```

## 6. Important Notes

- **No automatic exchange rate updates** — rates are set manually by admin
- **Display-only conversion** — actual payment processing uses the gateway's configured currency
- Products are priced in the base currency; display prices are converted using session rate
- Currency code, symbol, and rate are all stored in session for performance
- Default currency is loaded on first request if no session exists
