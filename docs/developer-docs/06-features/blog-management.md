# Quland CMS — Blog Management

## 1. Overview

The Blog module (`Modules/Blog`) provides a full blogging system with categories, comments with moderation, multi-language support, and image handling with WebP conversion.

## 2. Module Structure

```
Modules/Blog/
├── Entities/
│   ├── Blog.php
│   ├── BlogCategory.php
│   └── BlogComment.php
├── Http/Controllers/
│   ├── BlogController.php          (Admin CRUD)
│   ├── BlogCategoryController.php  (Admin categories)
│   └── BlogCommentController.php   (Admin comment moderation)
├── Routes/web.php
└── Resources/views/
```

## 3. Blog Model

**File:** `Modules/Blog/Entities/Blog.php`

```php
protected $fillable = [
    'title', 'slug', 'description', 'image',
    'category_id', 'admin_id', 'status',
    'seo_title', 'seo_description',
    'views', 'tags',
];

protected $casts = [
    'tags' => 'array',
];
```

**Translation Pattern:**
```php
public function getTitleAttribute($value)
{
    return getTranslatedValue($this, 'title');
}
```

**Relationships:**
```php
public function category() { return $this->belongsTo(BlogCategory::class, 'category_id'); }
public function comments() { return $this->hasMany(BlogComment::class); }
public function admin() { return $this->belongsTo(Admin::class); }
```

## 4. Admin CRUD

**Controller:** `Modules/Blog/Http/Controllers/BlogController.php`

**Routes:**
```
GET    /admin/blogs            → index()    Paginated listing
GET    /admin/blog/create      → create()   Create form
POST   /admin/blog             → store()    Store blog
GET    /admin/blog/{id}/edit   → edit()     Edit form
PUT    /admin/blog/{id}        → update()   Update blog
DELETE /admin/blog/{id}        → destroy()  Delete blog
GET    /admin/blog-status/{id} → status()   Toggle active
```

**Blog Creation with Image Handling:**
```php
public function store(Request $request)
{
    $request->validate([
        'title' => 'required|max:255',
        'slug' => 'required|unique:blogs|max:255',
        'description' => 'required',
        'category_id' => 'required|exists:blog_categories,id',
        'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        'tags' => 'nullable|array',
    ]);

    $blog = new Blog();
    $blog->fill($request->except('image', 'tags'));
    $blog->admin_id = Auth::guard('admin')->id();
    $blog->tags = $request->tags;

    // Image handling — WebP conversion
    if ($request->hasFile('image')) {
        $fileName = uniqid() . '.webp';
        $image = Image::make($request->file('image'));
        $image->encode('webp', 80)->save(public_path('uploads/blogs/' . $fileName));
        $blog->image = $fileName;
    }

    // Multi-language translations
    $translations = [];
    foreach (Language::all() as $lang) {
        $translations[$lang->code] = [
            'title' => $request->input("title_{$lang->code}"),
            'description' => $request->input("description_{$lang->code}"),
        ];
    }
    $blog->translations = json_encode($translations);
    $blog->save();
}
```

## 5. Blog Categories

**Controller:** `Modules/Blog/Http/Controllers/BlogCategoryController.php`

**Routes:**
```
GET    /admin/blog-categories → index()
POST   /admin/blog-category   → store()
PUT    /admin/blog-category/{id} → update()
DELETE /admin/blog-category/{id} → destroy()
```

**Model:**
```php
protected $fillable = ['name', 'slug', 'status'];
public function blogs() { return $this->hasMany(Blog::class, 'category_id'); }
```

## 6. Comment System

**Controller:** `Modules/Blog/Http/Controllers/BlogCommentController.php`

### 6.1 Frontend Comment Submission

**Route:** `POST /blog-comment` (HomeController or dedicated route)

```php
// Validation includes reCAPTCHA
$request->validate([
    'name' => 'required|max:100',
    'email' => 'required|email|max:100',
    'comment' => 'required|max:1000',
    'g-recaptcha-response' => [new Captcha()],
]);

BlogComment::create([
    'blog_id' => $request->blog_id,
    'name' => $request->name,
    'email' => $request->email,
    'comment' => $request->comment,
    'status' => 0,  // Pending moderation
]);
```

### 6.2 Admin Moderation

**Routes:**
```
GET    /admin/blog-comments         → index()   All comments
GET    /admin/blog-comment-status/{id} → status()  Approve/reject
DELETE /admin/blog-comment/{id}     → destroy()  Delete
```

**Status Values:**
- `0` = Pending (not shown on frontend)
- `1` = Approved (visible on frontend)

## 7. Frontend Blog Display

**Controller:** `app/Http/Controllers/HomeController.php`

### 7.1 Blog Listing Page

**Routes:**
```
GET /blogs                       → blogs()
GET /blogs?search=keyword        → Search by title
GET /blogs?category=slug         → Filter by category
GET /blogs?tag=tagname           → Filter by tag
```

```php
public function blogs(Request $request)
{
    $blogs = Blog::where('status', 1)
        ->when($request->search, fn($q) => $q->where('title', 'LIKE', "%{$request->search}%"))
        ->when($request->category, function ($q) use ($request) {
            $category = BlogCategory::where('slug', $request->category)->first();
            $q->where('category_id', $category->id);
        })
        ->when($request->tag, fn($q) => $q->whereJsonContains('tags', $request->tag))
        ->latest()
        ->paginate(9);

    $categories = BlogCategory::where('status', 1)->withCount('blogs')->get();
    $recent_blogs = Blog::where('status', 1)->latest()->take(5)->get();

    return view("{$theme}.blogs", compact('blogs', 'categories', 'recent_blogs'));
}
```

### 7.2 Blog Detail Page

**Route:** `GET /blog/{slug}` → `blog_detail()`

```php
public function blog_detail($slug)
{
    $blog = Blog::where('slug', $slug)->where('status', 1)->firstOrFail();
    $blog->increment('views');
    $comments = BlogComment::where('blog_id', $blog->id)->where('status', 1)->get();
    $related = Blog::where('category_id', $blog->category_id)
        ->where('id', '!=', $blog->id)
        ->take(3)->get();
    $categories = BlogCategory::where('status', 1)->withCount('blogs')->get();
    $recent_blogs = Blog::where('status', 1)->latest()->take(5)->get();

    return view("{$theme}.blog_detail", compact('blog', 'comments', 'related', ...));
}
```

## 8. File Storage

| Content | Path | Format |
|---------|------|--------|
| Blog images | `public/uploads/blogs/` | WebP (80% quality) |

## 9. SEO Features

Each blog has:
- `seo_title` — Custom meta title (falls back to blog title)
- `seo_description` — Custom meta description
- `slug` — URL-friendly identifier
- `tags` — JSON array for tag filtering and display
