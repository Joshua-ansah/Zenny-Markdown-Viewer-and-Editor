# Quland CMS — Multi-Language System

## 1. Overview

Quland implements a multi-language system using JSON translation files, database-stored content translations, and a session-based language switcher. Languages are managed through the Language module.

## 2. Language Module

### 2.1 Structure

```
Modules/Language/
├── Entities/Language.php
├── Http/Controllers/LanguageController.php
├── Routes/web.php
└── Resources/views/
```

### 2.2 Language Model

```php
protected $fillable = [
    'name',       // e.g., "English"
    'code',       // e.g., "en"
    'direction',  // "ltr" or "rtl"
    'status',     // 1 = active, 0 = inactive
    'is_default', // 1 = default language
];
```

### 2.3 Admin Language CRUD

**Routes:**
```
GET    /admin/languages         → index()
POST   /admin/language          → store()  ← Clones all translations from default
PUT    /admin/language/{id}     → update()
DELETE /admin/language/{id}     → destroy()
GET    /admin/language-status/{id} → status()
GET    /admin/language-default/{id} → set_default()
GET    /admin/language-editor/{code} → editor()  ← JSON translation editor
POST   /admin/language-editor-update → editor_update()
```

### 2.4 Language Creation (Clone Process)

When a new language is created, it clones all translation-aware content from the default language:

```php
public function store(Request $request)
{
    $language = Language::create($request->all());

    // Clone JSON translation file
    $defaultLang = Language::where('is_default', 1)->first();
    $defaultFile = lang_path($defaultLang->code . '.json');
    $newFile = lang_path($language->code . '.json');
    File::copy($defaultFile, $newFile);

    // Clone translations across 15+ content types:
    // Blogs, Products, Categories, Pages, FAQs, Teams,
    // Testimonials, Services, Projects, etc.
    // Each model's records get new translation entries for the new language
}
```

### 2.5 Translation File Editor

Admin can edit translation strings directly in the JSON file:

**Route:** `GET /admin/language-editor/{code}`

```php
public function editor($code)
{
    $filePath = lang_path($code . '.json');
    $translations = json_decode(File::get($filePath), true);
    return view('language::editor', compact('translations', 'code'));
}

public function editor_update(Request $request)
{
    $translations = [];
    foreach ($request->keys as $index => $key) {
        $translations[$key] = $request->values[$index];
    }
    File::put(lang_path($request->code . '.json'), json_encode($translations, JSON_PRETTY_PRINT));
}
```

## 3. Translation Architecture

### 3.1 Static Translations (UI Strings)

**Storage:** `lang/{code}.json` (e.g., `lang/en.json`, `lang/esp.json`)

**Format:**
```json
{
    "Home": "Home",
    "About Us": "About Us",
    "Contact": "Contact",
    "Add to Cart": "Add to Cart",
    "Search": "Search"
}
```

**Usage in Blade:**
```blade
{{ __('Home') }}
{{ __('Add to Cart') }}
```

### 3.2 Dynamic Translations (Database Content)

Content models store translations as JSON:

```php
// Product model translation storage
$product->translations = json_encode([
    'en' => ['name' => 'Blue Shirt', 'description' => 'A nice shirt'],
    'esp' => ['name' => 'Camisa Azul', 'description' => 'Una camisa bonita'],
]);
```

**Retrieval via `getTranslatedValue()` helper:**

```php
// app/Helper/helper.php
function getTranslatedValue($model, $field)
{
    $currentLang = session('lang', 'en');
    $translations = json_decode($model->translations, true);

    if ($currentLang !== 'en' && isset($translations[$currentLang][$field])) {
        return $translations[$currentLang][$field];
    }

    return $model->getAttributes()[$field] ?? '';
}
```

### 3.3 CMS Content Translations (Frontend Sections)

Section builder content stores translations within `data_values` JSON:

```json
{
    "heading": "Welcome to Quland",
    "sub_heading": "Best CMS Platform",
    "esp": {
        "heading": "Bienvenido a Quland",
        "sub_heading": "Mejor Plataforma CMS"
    },
    "fr": {
        "heading": "Bienvenue à Quland",
        "sub_heading": "Meilleure Plateforme CMS"
    }
}
```

**Retrieval in Blade:**
```blade
@php
    $lang = session('lang', 'en');
    $heading = ($lang !== 'en' && isset($section->data_values->$lang))
        ? $section->data_values->$lang->heading
        : $section->data_values->heading;
@endphp
{{ $heading }}
```

## 4. Language Switching

### 4.1 Frontend Switcher

**Route:** `GET /language-switcher/{code}` → `HomeController::language_switcher()`

```php
public function language_switcher($code)
{
    $language = Language::where('code', $code)->where('status', 1)->first();
    if ($language) {
        session(['lang' => $code]);
        app()->setLocale($code);
    }
    return redirect()->back();
}
```

### 4.2 Session Persistence via Middleware

**File:** `app/Http/Middleware/CurrencyLangauge.php`

```php
public function handle(Request $request, Closure $next): Response
{
    // Set language
    if (session()->has('lang')) {
        app()->setLocale(session('lang'));
    } else {
        $defaultLang = Language::where('is_default', 1)->first();
        if ($defaultLang) {
            session(['lang' => $defaultLang->code]);
            app()->setLocale($defaultLang->code);
        }
    }

    // Set currency (see multi-currency docs)
    // ...

    return $next($request);
}
```

> **Note:** The middleware class is named `CurrencyLangauge` (misspelled "Language").

### 4.3 Translation String Discovery

**Helper:** `getAllWrapperLang()` in `app/Helper/helper.php`

Scans the entire codebase for `__('...')` calls to auto-discover translation strings:

```php
function getAllWrapperLang()
{
    $allFiles = File::allFiles(resource_path('views'));
    $allFiles = array_merge($allFiles, File::allFiles(base_path('Modules')));
    $strings = [];

    foreach ($allFiles as $file) {
        preg_match_all("/__\('([^']+)'\)/", $file->getContents(), $matches);
        if (!empty($matches[1])) {
            $strings = array_merge($strings, $matches[1]);
        }
    }

    return array_unique($strings);
}
```

This is used by the language editor to show all translatable strings with their current values.

## 5. RTL Support

Languages with `direction = 'rtl'` trigger RTL CSS loading:

```blade
@if(session('lang_direction') === 'rtl')
    <link rel="stylesheet" href="{{ asset('frontend/css/rtl.css') }}">
@endif
```

## 6. Default Language Files

```
lang/
├── en.json    (English — default)
└── esp.json   (Spanish)
```

Additional language files are created dynamically when new languages are added through the admin panel.
