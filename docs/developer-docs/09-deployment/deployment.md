# Quland CMS — Deployment Guide

## 1. Server Requirements

### 1.1 Minimum Requirements

| Component | Version |
|-----------|---------|
| PHP | 8.1+ |
| MySQL | 5.7+ / MariaDB 10.3+ |
| Apache 2.4+ or Nginx | Any recent stable |
| Composer | 2.x |
| Node.js | 16.x+ (for asset building) |
| npm | 8.x+ |

### 1.2 Required PHP Extensions

```
php-bcmath
php-ctype
php-curl
php-dom
php-fileinfo
php-gd (or php-imagick)
php-json
php-mbstring
php-mysql (pdo_mysql)
php-openssl
php-tokenizer
php-xml
php-zip
```

## 2. Installation Steps

### 2.1 Clone & Dependencies

```bash
# 1. Copy files to server
cp -r main_files/main_files/* /var/www/quland/

# 2. Install PHP dependencies
cd /var/www/quland
composer install --optimize-autoloader --no-dev

# 3. Install Node dependencies and build assets
npm install
npm run build
```

### 2.2 Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 2.3 `.env` Configuration

```env
APP_NAME=Quland
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://yourdomain.com
APP_MODE=LIVE

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=quland_db
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

SESSION_DRIVER=file
SESSION_LIFETIME=120

CACHE_DRIVER=file
QUEUE_CONNECTION=sync

# Mail configured via Admin Panel (stored in database)
# Payment gateways configured via Admin Panel
# OAuth configured via Admin Panel
# OpenAI configured via Admin Panel
```

### 2.4 Database Setup

**Option A: Import SQL file**
```bash
mysql -u root -p quland_db < sql/database.sql
```

**Option B: Run migrations**
```bash
php artisan migrate
php artisan db:seed
php artisan module:migrate
php artisan module:seed
```

### 2.5 Directory Permissions

```bash
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
chmod -R 775 public/uploads/
```

### 2.6 Storage Link

```bash
php artisan storage:link
```

### 2.7 Cache Optimization (Production)

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

## 3. Web Server Configuration

### 3.1 Apache `.htaccess`

The `public/.htaccess` is included by default. Ensure `mod_rewrite` is enabled:

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

**Apache VirtualHost:**
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/quland/public

    <Directory /var/www/quland/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/quland-error.log
    CustomLog ${APACHE_LOG_DIR}/quland-access.log combined
</VirtualHost>
```

### 3.2 Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/quland/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## 4. Post-Installation

### 4.1 Create Admin Account

1. Navigate to `https://yourdomain.com/admin/login`
2. If no admin exists, you'll see a registration form
3. Create the first super admin account

### 4.2 Configure Settings

Via Admin Panel:
1. **General Settings** — Site name, logo, contact info
2. **Email Settings** — SMTP credentials
3. **Payment Gateways** — Enable and configure needed gateways
4. **Theme Selection** — Choose active theme (1–7)
5. **Social Login** — Google/Facebook OAuth (optional)
6. **reCAPTCHA** — Google reCAPTCHA keys (optional)
7. **Analytics** — Google Analytics, Facebook Pixel (optional)

### 4.3 Import Content

- Use the Section Builder to populate CMS content
- Create blog categories and posts
- Add products and categories
- Configure menus

## 5. Key Environment Variables

| Variable | Description | Values |
|----------|-------------|--------|
| `APP_ENV` | Environment | `production`, `local` |
| `APP_DEBUG` | Debug mode | `false` in production |
| `APP_URL` | Full site URL | `https://yourdomain.com` |
| `APP_MODE` | Demo mode | `LIVE`, `DEMO` |
| `DB_*` | Database credentials | Connection details |
| `SESSION_DRIVER` | Session storage | `file`, `database`, `redis` |
| `CACHE_DRIVER` | Cache storage | `file`, `redis`, `memcached` |
| `QUEUE_CONNECTION` | Queue driver | `sync`, `database`, `redis` |

> **Important:** Most service credentials (SMTP, OAuth, payment gateways, OpenAI) are stored in the **database**, NOT in `.env`. Configure them through the admin panel after installation.

## 6. File Upload Directories

Ensure these directories exist and are writable:

```
public/uploads/
├── user/               (User profile images)
├── products/            (Product images)
│   └── gallery/         (Product gallery images)
├── blogs/               (Blog images)
├── teams/               (Team member images)
├── testimonials/        (Testimonial images)
├── partners/            (Partner logos)
├── projects/            (Project images)
├── frontend_images/     (CMS section images)
├── settings/            (Logo, favicon, breadcrumb)
├── seo/                 (OG images)
├── support_tickets/     (Ticket attachments)
└── brands/              (Brand logos)
```

## 7. Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| 500 Error | Check `storage/logs/laravel.log`, ensure permissions |
| Blank page | Set `APP_DEBUG=true` temporarily to see errors |
| Images not loading | Run `php artisan storage:link`, check upload permissions |
| Email not sending | Configure SMTP in Admin → Email Settings |
| Login redirect loop | Clear sessions: `php artisan session:clear` |
| Cache issues | `php artisan cache:clear && php artisan config:clear` |
| Module errors | `php artisan module:enable ModuleName` |

### Log Files

```
storage/logs/laravel.log         — Application logs
storage/debugbar/                — Debugbar data (dev only)
```

## 8. Security Checklist

- [ ] `APP_DEBUG=false` in production
- [ ] `APP_MODE=LIVE` (not DEMO)
- [ ] Strong database password
- [ ] HTTPS configured (SSL certificate)
- [ ] File permissions: 755 for directories, 644 for files
- [ ] `public/` set as document root (not project root)
- [ ] Debugbar disabled in production (remove `barryvdh/laravel-debugbar`)
- [ ] Keep `APP_KEY` secret and backed up
- [ ] Regular database backups
- [ ] Remove `sql/database.sql` from production server

## 9. Updating

```bash
# Pull latest files
# Run any new migrations
php artisan migrate

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Rebuild assets
npm run build

# Re-optimize
php artisan optimize
```

## 10. Module Management

### Enable/Disable Modules

```bash
php artisan module:enable Blog
php artisan module:disable Blog
```

### Module Status

**File:** `modules_statuses.json`

```json
{
    "Blog": true,
    "Brand": true,
    "Category": true,
    // ... all modules
}
```

### Registered but Missing Modules

These modules are registered in `modules_statuses.json` but have no directory:

| Module | Status |
|--------|--------|
| `JobPost` | Missing |
| `PaymentWithdraw` | Missing |
| `Wallet` | Missing |
| `LiveChat` | Missing |
| `Refund` | Missing |
| `KYC` | Missing |

These may be planned features or were removed. They do not affect functionality.
