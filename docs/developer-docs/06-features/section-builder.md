# Quland CMS — Section Builder CMS

## 1. Overview

The Section Builder is Quland's page composition system. It allows admins to manage, reorder, and toggle visibility of page sections for each theme without writing code. Content is stored in the `frontends` table and section layouts are defined in a JSON configuration file.

## 2. Architecture

```
┌──────────────────────────────────────────┐
│           settings.json                  │
│  (Section definitions: fields, types)    │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│     FrontEndManagementController         │
│  (CRUD: create, edit, store content)     │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│         frontends table                  │
│  (data_key, data_values JSON)            │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│     manage_sections table                │
│  (visibility, ordering per theme)        │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│       HomeController + getContent()      │
│  (Loads visible sections for rendering)  │
└──────────────────────────────────────────┘
```

## 3. Section Configuration

**File:** `resources/views/admin/settings.json` (1,347 lines)

### 3.1 Section Types

**Singleton (content):** One set of fields per section
```json
{
    "hero_section": {
        "title": "Hero Section",
        "subtitle": "Banner area content",
        "has_image": true,
        "content": {
            "heading": "text",
            "sub_heading": "textarea",
            "button_text": "text",
            "button_url": "text",
            "image": "image"
        },
        "element": false,
        "has_lang": true
    }
}
```

**Repeatable (element):** Multiple entries per section
```json
{
    "partner_section": {
        "title": "Partners",
        "subtitle": "Partner logos",
        "has_image": true,
        "content": false,
        "element": {
            "image": "image"
        },
        "has_lang": false
    }
}
```

### 3.2 Known Section Keys

The following sections are defined across all 7 themes:

| Key | Type | Has Lang | Description |
|-----|------|----------|-------------|
| `hero_section` | content | Yes | Main hero/banner |
| `about_section` | content | Yes | About section |
| `feature_section` | content+element | Yes | Feature cards |
| `service_section` | content+element | Yes | Service offerings |
| `team_section` | content | Yes | Team header |
| `testimonial_section` | content | Yes | Testimonial header |
| `blog_section` | content | Yes | Blog section header |
| `partner_section` | element | No | Partner logos |
| `counter_section` | content+element | Yes | Statistics counters |
| `cta_section` | content | Yes | Call-to-action |
| `faq_section` | content | Yes | FAQ header |
| `pricing_section` | content | Yes | Pricing header |
| `portfolio_section` | content | Yes | Portfolio header |
| `contact_section` | content | Yes | Contact info |
| `footer_section` | content | Yes | Footer content |
| `breadcrumb_section` | content | Yes | Breadcrumb config |

### 3.3 Field Types

| Type | Renders As | Storage |
|------|-----------|---------|
| `text` | `<input type="text">` | String in JSON |
| `textarea` | `<textarea>` | String in JSON |
| `icon` | Icon picker input | CSS class string |
| `image` | File upload | Filename string |

## 4. Data Storage

### 4.1 Frontends Table

```sql
CREATE TABLE frontends (
    id BIGINT PRIMARY KEY,
    data_key VARCHAR(255),       -- e.g., 'hero_section.content' or 'partner_section.element'
    data_values JSON,            -- Content fields + translations
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Singleton Content Example:**
```json
{
    "data_key": "hero_section.content",
    "data_values": {
        "heading": "Welcome to Quland",
        "sub_heading": "Best CMS Platform",
        "button_text": "Get Started",
        "button_url": "/contact",
        "image": "6504a3b2e1f23.webp",
        "esp": {
            "heading": "Bienvenido a Quland",
            "sub_heading": "Mejor Plataforma CMS",
            "button_text": "Empezar",
            "button_url": "/contact"
        }
    }
}
```

**Repeatable Element Example:**
```json
{
    "data_key": "partner_section.element",
    "data_values": {
        "image": "6504a3b2e1f24.webp"
    }
}
```

### 4.2 ManageSection Table

```sql
CREATE TABLE manage_sections (
    id BIGINT PRIMARY KEY,
    section_key VARCHAR(255),    -- e.g., 'hero_section'
    section_name VARCHAR(255),   -- Display name
    theme VARCHAR(50),           -- 'theme_one', 'theme_two', etc.
    status TINYINT DEFAULT 1,    -- 1 = visible, 0 = hidden
    position INT DEFAULT 0,      -- Display order
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 5. Content Loading (Frontend)

### 5.1 getContent() Helper

**File:** `app/Helper/helper.php`

```php
function getContent($key, $type = 'content', $single = true)
{
    if ($type === 'content') {
        return Frontend::where('data_key', $key . '.content')
            ->where('status', 1)
            ->first();
    }

    if ($type === 'element') {
        return Frontend::where('data_key', $key . '.element')
            ->where('status', 1)
            ->get();
    }
}
```

### 5.2 HomeController Usage

```php
public function index()
{
    $activeTheme = cache('settings')['active_theme'] ?? 'theme_one';

    // Load visible sections for the active theme
    $sections = ManageSection::where('theme', $activeTheme)
        ->where('status', 1)
        ->orderBy('position')
        ->get();

    // Load content for each section
    foreach ($sections as $section) {
        $data[$section->section_key] = getContent($section->section_key);
        // For sections with elements, also load element entries
        $data[$section->section_key . '_elements'] = getContent($section->section_key, 'element', false);
    }

    return view("{$activeTheme}.index", $data);
}
```

### 5.3 Theme-Specific Section Rendering

Each theme (theme_one through theme_seven) has its own `index.blade.php` that renders sections:

```blade
{{-- resources/views/theme_one/index.blade.php --}}
@if(isset($hero_section))
    @include('theme_one.sections.hero', ['content' => $hero_section])
@endif

@if(isset($about_section))
    @include('theme_one.sections.about', ['content' => $about_section])
@endif

{{-- Sections rendered in order defined by manage_sections.position --}}
```

## 6. Admin CMS Workflow

1. **Theme Selection** — Admin selects active theme (1–7)
2. **Section Seeding** — System creates `manage_sections` entries for the theme's sections
3. **Section Ordering** — Admin drags to reorder sections on the manage page
4. **Section Visibility** — Admin toggles sections on/off
5. **Content Editing** — Admin clicks a section to edit its content/elements
6. **Translation** — For `has_lang` sections, admin fills in translations per language
7. **Image Upload** — For `has_image` sections, admin uploads images (stored in `public/uploads/frontend_images/`)
8. **Preview** — Changes reflect immediately on frontend (no publish workflow)

## 7. Image Handling

```php
// Upload path
public_path('uploads/frontend_images/')

// Old image cleanup
if (isset($old->data_values->image)) {
    @unlink(public_path('uploads/frontend_images/' . $old->data_values->image));
}

// Save new image
$fileName = uniqid() . '.' . $file->getClientOriginalExtension();
$file->move(public_path('uploads/frontend_images/'), $fileName);
```

> **Note:** Unlike product/blog images, section images are NOT converted to WebP. They retain their original format.

## 8. Database Clear Impact

The `GlobalSettingController::database_clear()` method truncates both `frontends` and `manage_sections` tables, destroying all CMS content. This requires re-seeding section definitions for the active theme.
