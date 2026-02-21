# Quland CMS — SEO Management

## 1. Overview

The SeoSetting module (`Modules/SeoSetting`) provides per-page SEO configuration including meta titles, descriptions, keywords, Open Graph tags, and canonical URLs. Individual content types (blogs, products) have their own SEO fields.

## 2. Module Structure

```
Modules/SeoSetting/
├── Entities/SeoSetting.php
├── Http/Controllers/SeoSettingController.php
├── Routes/web.php
└── Resources/views/
```

## 3. SeoSetting Model

```php
protected $fillable = [
    'page_name',        // e.g., "home", "about", "blogs", "contact"
    'seo_title',
    'seo_description',
    'seo_keywords',     // Comma-separated
    'og_title',
    'og_description',
    'og_image',
    'canonical_url',
];
```

## 4. Admin Management

**Routes:**
```
GET /admin/seo-settings          → index()    List all pages
GET /admin/seo-setting/{id}/edit → edit()     Edit SEO for a page
PUT /admin/seo-setting/{id}      → update()   Save SEO settings
```

## 5. Per-Content SEO Fields

### 5.1 Blog Posts

Each blog has:
- `seo_title` — Custom meta title
- `seo_description` — Custom meta description
- `tags` — JSON array (used as keywords)
- `slug` — URL path segment

### 5.2 Products

Each product has:
- `seo_title` — Custom meta title
- `seo_description` — Custom meta description
- `slug` — URL path segment

> **Known Issue:** Product model's `getSeoTitleAttribute` and `getSeoDescriptionAttribute` accessors incorrectly return the product `name` instead of their respective fields (see ecommerce.md §3.1).

### 5.3 Custom Pages

Each custom page has:
- `seo_title`
- `seo_description`
- `slug`

## 6. Frontend SEO Rendering

In theme layout files:
```blade
<head>
    <title>{{ $seo->seo_title ?? config('app.name') }}</title>
    <meta name="description" content="{{ $seo->seo_description ?? '' }}">
    <meta name="keywords" content="{{ $seo->seo_keywords ?? '' }}">

    <!-- Open Graph -->
    <meta property="og:title" content="{{ $seo->og_title ?? $seo->seo_title ?? '' }}">
    <meta property="og:description" content="{{ $seo->og_description ?? $seo->seo_description ?? '' }}">
    @if($seo->og_image)
        <meta property="og:image" content="{{ asset('uploads/seo/' . $seo->og_image) }}">
    @endif

    @if($seo->canonical_url)
        <link rel="canonical" href="{{ $seo->canonical_url }}">
    @endif
</head>
```

## 7. robots.txt

**File:** `public/robots.txt`

A static robots.txt file is present. It is not dynamically generated.

## 8. Sitemap

No sitemap generation is implemented. There is no `/sitemap.xml` route or generator package.
