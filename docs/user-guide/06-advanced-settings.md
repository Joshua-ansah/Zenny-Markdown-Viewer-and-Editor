# Advanced Settings & Configuration

## Overview

This guide covers advanced system configuration including general settings, multi-language support, SEO management, analytics integration, and translations.

---

## General Settings

### Accessing Settings

Navigate to **Settings → Manage Settings** to configure system-wide options.

### Site Configuration

**Basic Settings:**
- **Site Name**: Your website name
- **Site Description**: Brief description
- **Site Logo**: Upload your logo
- **Site Favicon**: Browser tab icon
- **Contact Email**: Main contact email
- **Contact Phone**: Business phone
- **Address**: Physical address

**Regional Settings:**
- **Timezone**: Default timezone
- **Date Format**: How dates display
- **Time Format**: 12-hour or 24-hour
- **Currency**: Default currency (GHS, USD, EUR)
- **Currency Position**: Before or after amount

**Application Settings:**
- **Default Application Status**: New application status
- **Admin Email**: Receive notifications
- **Items Per Page**: Pagination count
- **Enable Registrations**: Allow new users
- **Require Email Verification**: Email confirmation

### Browser Testing - General Settings

- [ ] Update site name and logo
- [ ] Change timezone
- [ ] Modify date/time format
- [ ] Update contact information
- [ ] Change currency settings
- [ ] Save settings
- [ ] Verify changes on frontend
- [ ] Test with different currencies
- [ ] Check logo displays correctly
- [ ] Verify favicon in browser tab

---

## Multi-Language Management

### Accessing Languages

Navigate to **Settings → Languages** to manage supported languages.

### Adding a New Language

1. Click "Create"
2. Fill in:
   - **Name**: Language name (e.g., "French")
   - **Code**: ISO code (e.g., "fr")
   - **Native Name**: Local name (e.g., "Français")
   - **Direction**: LTR or RTL
   - **Is Default**: Default language
   - **Is Active**: Enable language

3. Click "Save"

### Supported Languages

Common language codes:
- **en** - English
- **fr** - French (Français)
- **es** - Spanish (Español)
- **de** - German (Deutsch)
- **ar** - Arabic (العربية) - RTL
- **zh** - Chinese (中文)
- **ja** - Japanese (日本語)

### Language Features

**Content Translation:**
- Posts and pages
- Categories and tags
- FAQs and testimonials
- Email templates
- Menu items

**Interface Translation:**
- Button labels
- Form labels
- Error messages
- Navigation items
- System messages

### Language Switcher

Users can switch between languages:
- Dropdown in header
- Flag icons
- URL parameter (?lang=fr)
- Subdomain (fr.yoursite.com)
- Cookie-based preference

### Browser Testing - Languages

- [ ] Add French language
- [ ] Set as active
- [ ] Create content in multiple languages
- [ ] Switch between languages on frontend
- [ ] Verify translations display
- [ ] Test RTL language (Arabic)
- [ ] Check language switcher
- [ ] Test fallback to default language
- [ ] Verify email templates in different languages

---

## Translation Management

### Accessing Translations

Navigate to **Settings → Translations** to manage text translations.

### Translation Structure

**Translation Keys:**
- Organized by context (e.g., "auth.login")
- Groups: auth, navigation, forms, messages
- Supports placeholders: ":name is :age years old"

### Managing Translations

**Add Translation:**
1. Click "Create"
2. Fill in:
   - **Group**: Category (auth, nav, etc.)
   - **Key**: Translation key
   - **Language**: Target language
   - **Value**: Translated text

3. Click "Save"

**Example Translations:**
```
Group: auth
Key: login
en: "Log in"
fr: "Se connecter"
es: "Iniciar sesión"

Group: navigation
Key: home
en: "Home"
fr: "Accueil"
es: "Inicio"
```

### Translation Placeholders

Use placeholders for dynamic content:
```
Original: "Welcome back, :name!"
French: "Bon retour, :name !"
Spanish: "¡Bienvenido de nuevo, :name!"
```

### Export/Import Translations

**Export:**
1. Select language
2. Click "Export"
3. Download JSON/CSV

**Import:**
1. Prepare translation file
2. Click "Import"
3. Upload file
4. Review and confirm

### Browser Testing - Translations

- [ ] Create translation key
- [ ] Add translations for multiple languages
- [ ] Test placeholders
- [ ] Switch language and verify
- [ ] Export translations
- [ ] Import translations
- [ ] Test fallback translations
- [ ] Verify special characters
- [ ] Check pluralization

---

## SEO Management

### Accessing SEO Settings

SEO settings are integrated into content management:
- Post/Page edit forms
- Category/Tag edit forms
- General settings

### SEO Fields

**On Every Page/Post:**
- **Meta Title**: SEO-optimized title (50-60 chars)
- **Meta Description**: Search snippet (150-160 chars)
- **Meta Keywords**: Target keywords (optional)
- **Open Graph Image**: Social media share image
- **Canonical URL**: Prevent duplicate content

**Structured Data:**
- Schema.org markup
- Article schema for posts
- Organization schema
- Product schema (for deals)

### SEO Best Practices

**1. Title Optimization:**
- Include main keyword
- Keep under 60 characters
- Make it compelling
- Unique for each page

**2. Meta Descriptions:**
- Summarize content
- Include call-to-action
- Use target keywords
- 150-160 characters

**3. URL Structure:**
- Keep short and descriptive
- Use hyphens not underscores
- Include keywords
- Avoid special characters

**4. Heading Structure:**
- One H1 per page (title)
- Use H2 for main sections
- Use H3 for subsections
- Logical hierarchy

**5. Internal Linking:**
- Link related content
- Use descriptive anchor text
- Maintain shallow depth
- Fix broken links

**6. Image Optimization:**
- Use descriptive filenames
- Add alt text
- Compress images
- Use appropriate formats

### XML Sitemap

**Automatic Generation:**
- Posts and pages
- Categories and tags
- Custom post types

**Access Sitemap:**
```
https://yoursite.com/sitemap.xml
```

**Submit to Search Engines:**
- Google Search Console
- Bing Webmaster Tools

### Robots.txt

**Default Configuration:**
```
User-agent: *
Allow: /

Sitemap: https://yoursite.com/sitemap.xml
```

**Blocking Pages:**
```
Disallow: /admin
Disallow: /api
Disallow: /private
```

### Browser Testing - SEO

- [ ] Add meta title and description to post
- [ ] Verify meta tags in source code
- [ ] Test Open Graph sharing
- [ ] Check URL structure
- [ ] Verify canonical URLs
- [ ] Test structured data with Google tool
- [ ] Access sitemap.xml
- [ ] Check robots.txt
- [ ] Test social media previews
- [ ] Verify alt text on images

---

## Analytics Integration

### Google Analytics

**Setup:**
1. Navigate to **Settings → Manage Settings**
2. Find "Analytics" section
3. Enter Google Analytics Tracking ID (e.g., "G-XXXXXXXXXX")
4. Enable tracking
5. Save settings

**What's Tracked:**
- Page views
- User sessions
- Traffic sources
- User behavior
- Conversion goals
- E-commerce transactions

**Privacy Considerations:**
- Anonymize IP addresses
- Respect Do Not Track
- Cookie consent compliance
- GDPR compliance

### Facebook Pixel

**Setup:**
1. Go to **Settings → Manage Settings**
2. Find "Facebook Pixel" section
3. Enter Pixel ID
4. Enable tracking
5. Save settings

**What's Tracked:**
- Page views
- Custom events (applications, purchases)
- Conversion tracking
- Remarketing audiences

**Events Tracked:**
- View content
- Add to cart (deals)
- Initiate checkout
- Purchase
- Lead (application submission)

### Google Tag Manager

**Setup:**
1. Create GTM account
2. Get container ID (GTM-XXXXXX)
3. Enter in settings
4. Add custom tags in GTM

**Benefits:**
- Manage multiple tracking codes
- No code changes needed
- Version control
- Testing before publishing

### Browser Testing - Analytics

- [ ] Add Google Analytics ID
- [ ] Verify tracking code in source
- [ ] Test page view tracking
- [ ] Verify data in Google Analytics
- [ ] Add Facebook Pixel
- [ ] Test pixel firing
- [ ] Check Facebook Events Manager
- [ ] Test custom events
- [ ] Verify conversion tracking
- [ ] Test with analytics debugger

---

## Tawk.to Live Chat

### Setup Live Chat

1. Create Tawk.to account
2. Get Property ID
3. Navigate to **Settings → Manage Settings**
4. Find "Tawk.to" section
5. Enter Property ID
6. Enable chat widget
7. Save settings

### Chat Widget Features

**Visitor Features:**
- Real-time chat
- File sharing
- Chat history
- Offline messages
- Mobile responsive

**Agent Features:**
- Multiple agents
- Chat routing
- Canned responses
- Chat transcripts
- Visitor monitoring

### Chat Customization

**Appearance:**
- Widget position
- Brand colors
- Avatar images
- Welcome message

**Behavior:**
- Show when online/offline
- Auto-trigger after X seconds
- Target specific pages
- Hide on mobile

### Browser Testing - Live Chat

- [ ] Add Tawk.to Property ID
- [ ] Verify widget appears
- [ ] Test chat functionality
- [ ] Send test message
- [ ] Test offline message
- [ ] Check on mobile device
- [ ] Test widget customization
- [ ] Verify on different pages
- [ ] Test file sharing

---

## Cookie Consent

### EU Cookie Law Compliance

**Setup:**
1. Navigate to **Settings → Cookie Consent**
2. Configure options:
   - **Enable Cookie Banner**: Show/hide
   - **Message Text**: Customize message
   - **Accept Button Text**: Customize button
   - **Privacy Policy URL**: Link to policy
   - **Position**: Top/Bottom
   - **Theme**: Light/Dark

### Cookie Categories

**Essential Cookies:**
- Session cookies
- Authentication cookies
- Security cookies
- Cannot be disabled

**Functional Cookies:**
- Language preference
- User preferences
- Remember me

**Analytics Cookies:**
- Google Analytics
- Usage tracking
- Performance monitoring

**Marketing Cookies:**
- Facebook Pixel
- Ad targeting
- Remarketing

### Cookie Consent Modes

**Opt-Out (Default):**
- All cookies set by default
- User can opt out
- Complies with many regions

**Opt-In (Strict):**
- Only essential cookies by default
- User must opt-in
- GDPR compliant
- Better for EU users

### Browser Testing - Cookie Consent

- [ ] Enable cookie banner
- [ ] Customize message
- [ ] Test on frontend
- [ ] Accept cookies
- [ ] Decline cookies
- [ ] Check cookies in browser dev tools
- [ ] Test analytics blocking when declined
- [ ] Verify preferences saved
- [ ] Test on mobile

---

## Email Configuration

### SMTP Settings

**Configure Email:**
1. Navigate to **Settings → Mail Configuration**
2. Select driver: SMTP
3. Enter SMTP details:
   - **Host**: smtp.gmail.com
   - **Port**: 587 (TLS) or 465 (SSL)
   - **Username**: Your email
   - **Password**: App password
   - **Encryption**: TLS/SSL

4. Test connection
5. Save settings

### Mailgun Configuration

**Alternative Email Service:**
1. Create Mailgun account
2. Verify domain
3. Get API credentials
4. Enter in settings
5. Test sending

### Email Queue

**Queue Configuration:**
- **Driver**: Database
- **Connection**: Default
- **Queue**: emails

**Running Queue Worker:**
```bash
php artisan queue:work
```

### Browser Testing - Email

- [ ] Configure SMTP settings
- [ ] Send test email
- [ ] Verify email received
- [ ] Check email formatting
- [ ] Test with attachments
- [ ] Verify email templates work
- [ ] Test bulk campaigns
- [ ] Check email queue
- [ ] Verify error handling

---

## Activity Log

### Accessing Activity Log

Navigate to **Activity & Reports → Activity Log** to view system audit trail.

### What's Logged

**User Actions:**
- Login/logout
- Password changes
- Profile updates
- Permission changes

**Content Changes:**
- Create/edit/delete posts
- Publish pages
- Update settings
- Delete records

**Application Actions:**
- Status changes
- Document uploads
- Payment processing
- Refund requests

### Log Details

Each entry shows:
- **Description**: What happened
- **User**: Who did it
- **Subject**: What was affected
- **Properties**: Before/after values
- **Timestamp**: When it occurred
- **IP Address**: User's IP

### Using Activity Logs

**Audit Trail:**
- Track changes
- Identify issues
- Monitor user activity
- Compliance requirements

**Security:**
- Detect suspicious activity
- Track unauthorized access
- Monitor admin actions
- Investigate incidents

### Browser Testing - Activity Log

- [ ] View activity log
- [ ] Filter by user
- [ ] Filter by date range
- [ ] Filter by action type
- [ ] View log details
- [ ] Search logs
- [ ] Export activity log
- [ ] Verify sensitive actions logged

---

## Backup & Maintenance

### Backup Strategy

**What to Backup:**
- Database (MySQL)
- Uploaded files (media)
- Configuration files
- Custom code

**Backup Frequency:**
- Daily: Database
- Weekly: Complete site
- Before updates: Full backup

**Backup Storage:**
- Local server
- Cloud storage (S3, Dropbox)
- Remote server
- External drive

### Maintenance Mode

**Enable Maintenance:**
```bash
php artisan down
```

**Disable Maintenance:**
```bash
php artisan up
```

**Custom Maintenance Page:**
- Display custom message
- Show estimated time
- Whitelist admin IPs

### Cache Management

**Clear Cache:**
1. Navigate to **Settings → Cache**
2. Click "Clear All Cache"
3. Or use command:
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

**When to Clear Cache:**
- After settings changes
- After code updates
- After menu changes
- When seeing old content

---

## Performance Optimization

### Caching

**Enable Caching:**
- Configuration cache
- Route cache
- View cache
- Database query cache

**Cache Locations:**
- File-based (default)
- Redis (recommended for production)
- Memcached

### Image Optimization

**Automatic Optimization:**
- Resize on upload
- Compress images
- Generate thumbnails
- WebP conversion (modern browsers)

**Manual Optimization:**
- Use optimized formats (WebP, AVIF)
- Compress before upload
- Appropriate dimensions
- Lazy loading

### Database Optimization

**Regular Maintenance:**
```bash
php artisan optimize
php artisan route:cache
php artisan config:cache
```

**Index Optimization:**
- Review slow queries
- Add missing indexes
- Remove unused indexes

### CDN Integration

**Content Delivery Network:**
- Faster asset delivery
- Reduced server load
- Global availability
- DDoS protection

**Popular CDNs:**
- Cloudflare
- AWS CloudFront
- KeyCDN
- BunnyCDN

---

## Security Settings

### Two-Factor Authentication

**Enable 2FA:**
1. Navigate to profile
2. Enable 2FA
3. Scan QR code with app
4. Enter verification code
5. Save backup codes

**2FA Apps:**
- Google Authenticator
- Authy
- Microsoft Authenticator

### Password Policy

**Requirements:**
- Minimum 8 characters
- Mix of upper/lower case
- Include numbers
- Include special characters
- No dictionary words

**Password Features:**
- Password expiry (optional)
- Password history
- Strength meter
- Breach detection

### Session Management

**Session Settings:**
- Session timeout: 120 minutes (default)
- Concurrent sessions: Allowed/blocked
- Remember me: 30 days

### IP Whitelist/Blacklist

**Restrict Access:**
- Whitelist admin IPs
- Block suspicious IPs
- Geo-blocking
- Rate limiting

---

## Troubleshooting

### Issue: Settings Not Saving
**Solution**:
- Clear cache
- Check file permissions
- Verify database connection
- Check error logs

### Issue: Translations Not Showing
**Solution**:
- Clear translation cache
- Verify language is active
- Check translation keys
- Republish translations

### Issue: Analytics Not Tracking
**Solution**:
- Verify tracking ID correct
- Check ad blockers disabled
- Clear cache
- Test with Google Tag Assistant

### Issue: Emails Not Sending
**Solution**:
- Check SMTP settings
- Verify queue is running
- Check email logs
- Test with different provider

---

## Next Steps

- [Frequently Asked Questions](07-faq.md)
- [Getting Started](01-getting-started.md)
- [Service Applications](02-service-applications.md)
