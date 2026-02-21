# Quland CMS — Theme Management

## 1. Overview

Quland ships with 7 theme variations (`theme_one` through `theme_seven`). Each theme has its own set of Blade templates, section layouts, and visual styling. Theme switching is instant and managed through the admin panel.

## 2. Theme Configuration

### 2.1 Active Theme Setting

Stored in `global_settings` table:
```
key: active_theme
value: theme_one | theme_two | ... | theme_seven
```

### 2.2 Theme Selection (Admin)

**Controller:** `Modules/GlobalSetting/Http/Controllers/GlobalSettingController.php`

```php
public function theme_select_update(Request $request)
{
    GlobalSetting::updateOrCreate(
        ['key' => 'active_theme'],
        ['value' => $request->theme]
    );

    cache()->forget('settings');

    // Re-seed manage_sections for the new theme
    // Each theme has different section configurations
    ManageSection::where('theme', '!=', $request->theme)->delete();
    // Seed new section entries from theme definition
}
```

## 3. Theme Directory Structure

```
resources/views/
├── theme_one/
│   ├── index.blade.php         (Homepage)
│   ├── about.blade.php
│   ├── blogs.blade.php
│   ├── blog_detail.blade.php
│   ├── contact.blade.php
│   ├── faq.blade.php
│   ├── services.blade.php
│   ├── projects.blade.php
│   ├── teams.blade.php
│   ├── portfolio.blade.php
│   ├── custom_page.blade.php
│   ├── privacy_policy.blade.php
│   ├── terms_conditions.blade.php
│   ├── layouts/
│   │   ├── app.blade.php       (Master layout)
│   │   ├── header.blade.php
│   │   └── footer.blade.php
│   └── sections/
│       ├── hero.blade.php
│       ├── about.blade.php
│       ├── services.blade.php
│       ├── features.blade.php
│       ├── testimonials.blade.php
│       └── ...
├── theme_two/
│   └── (similar structure, different design)
├── theme_three/
├── theme_four/
├── theme_five/
├── theme_six/
└── theme_seven/
```

**Total:** ~333 Blade templates across all themes.

## 4. Theme Routing

**File:** `app/Http/Controllers/HomeController.php`

The HomeController dynamically routes to theme-specific views:

```php
public function index()
{
    $activeTheme = cache('settings')['active_theme'] ?? 'theme_one';

    // Load sections for active theme
    $sections = ManageSection::where('theme', $activeTheme)
        ->where('status', 1)
        ->orderBy('position')
        ->get();

    // Conditional section loading per theme
    if ($activeTheme == 'theme_one') {
        $data['hero'] = getContent('hero_section');
        $data['about'] = getContent('about_section');
        $data['services'] = getContent('service_section', 'element', false);
        // ... theme_one specific sections
    } elseif ($activeTheme == 'theme_two') {
        $data['slider'] = getContent('slider_section', 'element', false);
        $data['features'] = getContent('feature_section', 'element', false);
        // ... theme_two specific sections
    }
    // ... similar blocks for theme_three through theme_seven

    return view("{$activeTheme}.index", $data);
}
```

**Other page methods follow the same pattern:**
```php
public function about_us()
{
    $activeTheme = cache('settings')['active_theme'] ?? 'theme_one';
    // Load about page data
    return view("{$activeTheme}.about", $data);
}

public function blogs()
{
    $activeTheme = cache('settings')['active_theme'] ?? 'theme_one';
    // Load blog data
    return view("{$activeTheme}.blogs", $data);
}
```

## 5. Theme-Specific Sections

Different themes support different CMS sections:

| Section | T1 | T2 | T3 | T4 | T5 | T6 | T7 |
|---------|----|----|----|----|----|----|-----|
| Hero Banner | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| About | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Services | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Features | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Team | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Testimonials | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Blog | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Partners | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Counter/Stats | ✓ | ✓ | - | ✓ | ✓ | - | ✓ |
| CTA | ✓ | ✓ | ✓ | - | ✓ | ✓ | - |
| FAQ | ✓ | - | ✓ | ✓ | - | ✓ | ✓ |
| Pricing | - | ✓ | ✓ | - | ✓ | - | ✓ |
| Portfolio | ✓ | - | ✓ | ✓ | - | ✓ | - |
| Slider | - | ✓ | - | - | ✓ | - | ✓ |

> **Note:** Section availability varies by theme. When switching themes, the `manage_sections` table is re-seeded with the new theme's supported sections.

## 6. Color Customization

**Route:** `admin.color.setting`

Each theme supports custom primary/secondary colors:

```php
public function color_setting_update(Request $request)
{
    GlobalSetting::updateOrCreate(
        ['key' => 'primary_color'],
        ['value' => $request->primary_color]
    );
    GlobalSetting::updateOrCreate(
        ['key' => 'secondary_color'],
        ['value' => $request->secondary_color]
    );
    cache()->forget('settings');
}
```

Applied in layouts via inline CSS variables:
```blade
<style>
    :root {
        --primary-color: {{ cache('settings')['primary_color'] ?? '#0d6efd' }};
        --secondary-color: {{ cache('settings')['secondary_color'] ?? '#6c757d' }};
    }
</style>
```

## 7. Shared Frontend Assets

```
public/frontend/
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── theme-specific/
├── js/
│   ├── main.js
│   └── vendor/
├── images/
└── fonts/
```

## 8. Theme Switching Impact

When switching themes:
1. `active_theme` setting is updated
2. Settings cache is cleared
3. `manage_sections` is re-seeded for new theme
4. All frontend routes immediately render using new theme templates
5. **Content is preserved** — `frontends` table data persists across theme changes
6. Sections unique to the old theme become invisible (no manage_section entry)
7. Sections unique to the new theme start with default/empty content
