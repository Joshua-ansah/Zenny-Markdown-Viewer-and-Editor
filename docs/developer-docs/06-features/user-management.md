# Quland CMS — User Management

## 1. Overview

Admin-side user management provides listing, viewing, banning, and deleting users. Users self-register via the frontend and manage their own profiles through the user dashboard.

## 2. Admin User Controller

**File:** `app/Http/Controllers/Admin/UserController.php`

### 2.1 Routes

```
GET /admin/users                → all_user()    Paginated user listing
GET /admin/user/show/{user_id}  → show_user()   User profile + orders
GET /admin/user/ban/{user_id}   → ban_user()    Toggle ban status
GET /admin/user/delete/{user_id} → delete_user() Delete user
```

### 2.2 User Listing

```php
public function all_user(Request $request)
{
    $users = User::when($request->search, function ($q) use ($request) {
        $q->where('name', 'LIKE', '%' . $request->search . '%')
          ->orWhere('email', 'LIKE', '%' . $request->search . '%');
    })->latest()->paginate(15);

    return view('admin.user.all', compact('users'));
}
```

### 2.3 Ban/Unban Toggle

```php
public function ban_user($user_id)
{
    $user = User::findOrFail($user_id);
    $user->is_banned = $user->is_banned === 'yes' ? 'no' : 'yes';
    $user->save();

    return response()->json([
        'status' => 'success',
        'is_banned' => $user->is_banned,
    ]);
}
```

When `is_banned = 'yes'`, the user cannot log in (checked in `LoginController::store_login()`).

### 2.4 User Deletion

```php
public function delete_user($user_id)
{
    $user = User::findOrFail($user_id);

    // Delete profile image
    $old_image = 'public/uploads/user/' . $user->image;
    if (File::exists($old_image)) {
        File::delete($old_image);
    }

    $user->delete();
    return redirect()->back()->with('success', 'User deleted');
}
```

> **Note:** Admin delete does NOT cascade-delete orders, reviews, wishlists, or carts (unlike user self-deletion which does).

## 3. User Status Fields

| Field | Values | Effect |
|-------|--------|--------|
| `status` | `enable` / `disable` | Disabled users cannot log in |
| `is_banned` | `yes` / `no` | Banned users cannot log in |
| `feez_status` | `0` / `1` | Frozen users cannot log in |
| `email_verified_at` | datetime / null | Unverified users cannot log in |
| `provider` | null / `google` / `facebook` | Social users cannot use password login |
| `online` | `0` / `1` | Set to 1 on login, 0 on logout |

## 4. User Model

**File:** `app/Models/User.php`

```php
use HasApiTokens, HasFactory, Notifiable;

protected $fillable = [
    'name', 'email', 'password', 'phone', 'address',
    'image', 'status', 'is_banned', 'online',
    'provider', 'provider_id',
    'verification_token', 'email_verified_at',
    'forget_password_token', 'feez_status',
];
```

Uses `Laravel\Sanctum\HasApiTokens` trait (though API routes are empty).
