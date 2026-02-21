# Quland CMS — Menu Builder

## 1. Overview

The Menu module (`Modules/Menu`) provides a hierarchical drag-and-drop menu builder supporting multiple menu locations (header, footer, sidebar), parent-child relationships, and a `MenuService` for frontend rendering.

## 2. Module Structure

```
Modules/Menu/
├── Entities/
│   ├── Menu.php
│   └── MenuItem.php
├── Http/Controllers/
│   └── MenuController.php
├── Services/
│   └── MenuService.php
├── Routes/web.php
└── Resources/views/
```

## 3. Menu Model

```php
protected $fillable = [
    'name',       // Menu name (e.g., "Main Menu")
    'location',   // header, footer, sidebar
    'status',     // 1 = active
];

public function items()
{
    return $this->hasMany(MenuItem::class)->whereNull('parent_id')->orderBy('order');
}
```

## 4. MenuItem Model

```php
protected $fillable = [
    'menu_id',     // Parent menu
    'parent_id',   // Parent item (null for top-level)
    'title',       // Display text
    'url',         // Link URL
    'target',      // _self, _blank
    'icon',        // Icon class
    'order',       // Sort position
    'status',      // 1 = active
];
```

**Self-Referential Hierarchy:**
```php
public function children()
{
    return $this->hasMany(MenuItem::class, 'parent_id')->orderBy('order');
}

public function parent()
{
    return $this->belongsTo(MenuItem::class, 'parent_id');
}

// Recursive descendants
public function descendants()
{
    return $this->children()->with('descendants');
}
```

## 5. Admin Menu Management

**Controller:** `Modules/Menu/Http/Controllers/MenuController.php`

### 5.1 Routes

```
GET    /admin/menus                   → index()       Menu listing
POST   /admin/menu                    → store()       Create menu
PUT    /admin/menu/{id}               → update()      Update menu
DELETE /admin/menu/{id}               → destroy()     Delete menu
GET    /admin/menu/{id}/items         → items()       Manage items
POST   /admin/menu/{id}/item          → store_item()  Add item
PUT    /admin/menu-item/{id}          → update_item() Edit item
DELETE /admin/menu-item/{id}          → destroy_item()Delete item
POST   /admin/menu/{id}/order         → update_order()Save drag-drop order
```

### 5.2 Drag-and-Drop Ordering

```php
public function update_order(Request $request, $menuId)
{
    $items = json_decode($request->order, true);
    $this->saveOrder($items);
    cache()->forget('menus');
}

private function saveOrder($items, $parentId = null, $order = 0)
{
    foreach ($items as $item) {
        MenuItem::where('id', $item['id'])->update([
            'parent_id' => $parentId,
            'order' => $order++,
        ]);
        if (isset($item['children'])) {
            $this->saveOrder($item['children'], $item['id']);
        }
    }
}
```

### 5.3 Cache Management

After any menu mutation:
```php
cache()->forget('menus');
```

## 6. MenuService (Frontend)

**File:** `Modules/Menu/Services/MenuService.php`

```php
class MenuService
{
    public static function getMenu($location)
    {
        return cache()->remember("menu_{$location}", 3600, function () use ($location) {
            return Menu::where('location', $location)
                ->where('status', 1)
                ->with('items.descendants')
                ->first();
        });
    }
}
```

## 7. Frontend Rendering

Menus are shared globally via `AppServiceProvider`:

```php
View::composer('*', function ($view) {
    $headerMenu = MenuService::getMenu('header');
    $footerMenu = MenuService::getMenu('footer');
    $view->with(compact('headerMenu', 'footerMenu'));
});
```

**Blade Rendering (recursive):**
```blade
@foreach($headerMenu->items as $item)
    <li>
        <a href="{{ $item->url }}" target="{{ $item->target }}">
            @if($item->icon) <i class="{{ $item->icon }}"></i> @endif
            {{ $item->title }}
        </a>
        @if($item->children->count())
            <ul class="dropdown-menu">
                @foreach($item->children as $child)
                    <li><a href="{{ $child->url }}">{{ $child->title }}</a></li>
                @endforeach
            </ul>
        @endif
    </li>
@endforeach
```
