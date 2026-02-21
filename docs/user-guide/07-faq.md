# Frequently Asked Questions (FAQ)

## General Questions

### What is LetsTravel Ghana?

LetsTravel Ghana is a comprehensive travel services management platform that helps process visa applications, passport services, travel insurance, vaccinations, and other travel-related services. It includes a powerful admin panel built with Filament for managing all aspects of the business.

### Who can use this system?

The system is designed for:
- **Super Admins**: Full system access
- **Admins**: Manage applications and content
- **Content Managers**: Create and publish content
- **Customer Service Reps**: Process applications
- **Customers**: Submit applications (frontend)

### How do I access the admin panel?

Navigate to `https://your-domain.com/admin` and log in with your credentials. Contact your system administrator if you don't have login details.

### What browsers are supported?

The system works best on modern browsers:
- Google Chrome (recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari
- Opera

### Is the system mobile-friendly?

Yes! The admin panel is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

---

## User Management

### How do I create a new user account?

1. Navigate to **User Management → Users**
2. Click "Create"
3. Fill in user details
4. Assign roles and permissions
5. Click "Save"

### What are the different user roles?

- **Super Admin**: Full access to everything
- **Admin**: Most features except critical settings
- **Content Manager**: Content creation and management
- **Customer Service**: Application processing
- **Customer**: Frontend access only

### How do I reset a user's password?

1. Go to **User Management → Users**
2. Find and click on the user
3. Click "Reset Password"
4. Send reset link or set new password
5. Notify the user

### Can users have multiple roles?

Yes, users can be assigned multiple roles. Their permissions will be the combination of all assigned roles.

### How do I deactivate a user account?

1. Open the user's profile
2. Toggle "Is Active" to off
3. Save changes
The user will no longer be able to log in.

---

## Service Applications

### What types of applications can I process?

The system handles six types of applications:
1. Visa Applications
2. Passport Applications
3. Travel Insurance
4. Vaccinations
5. Birth Certificates
6. Police Reports

### How do I create a new application?

1. Navigate to the specific application type
2. Click "Create"
3. Fill in customer and service details
4. Upload required documents
5. Set status and amount
6. Click "Save"

### How do I update an application status?

1. Open the application
2. Change the "Status" field
3. Add processing notes
4. Save changes
An email notification will be sent to the customer automatically.

### Can I upload multiple documents?

Yes, each application supports multiple file uploads. Supported formats include:
- PDF documents
- JPG/PNG images
- Maximum file size: 2MB per file

### How do I process payments for applications?

1. Open the application
2. Click "Record Payment"
3. Enter payment details
4. Select payment method
5. Save payment record
6. Update application status

### What if a customer wants to cancel?

1. Open the application
2. Change status to "Cancelled"
3. Add cancellation reason
4. Process refund if applicable
5. Send cancellation confirmation

---

## Content Management

### How do I create a blog post?

1. Navigate to **CMS → Posts**
2. Click "Create"
3. Enter title and content
4. Add featured image
5. Select categories and tags
6. Choose "Draft" or "Published"
7. Click "Save"

### What's the difference between Posts and Pages?

- **Posts**: Time-sensitive content like blog articles and news (shown in chronological order)
- **Pages**: Static content like About Us, Contact, Services (not dated)

### How do I create a menu?

1. Go to **CMS → Menus**
2. Click "Create"
3. Enter menu name
4. Add menu items with links
5. Create parent-child relationships for dropdowns
6. Set sort order
7. Save menu

### Can I schedule posts for future publishing?

Yes! When creating or editing a post:
1. Set status to "Scheduled"
2. Choose "Scheduled At" date/time
3. Save
The post will automatically publish at the scheduled time.

### How do I add an FAQ?

1. Navigate to **CMS → FAQs**
2. Click "Create"
3. Enter question and answer
4. Assign to category
5. Set as active
6. Save

### How do I manage testimonials?

1. Go to **CMS → Testimonials**
2. Click "Create"
3. Enter client information
4. Add testimonial content
5. Upload client photo (optional)
6. Set rating (1-5 stars)
7. Mark as featured if desired
8. Save

---

## Deals & Promotions

### How do I create a deal?

1. Navigate to **Deals & Payments → Deals**
2. Click "Create"
3. Enter deal title and description
4. Set regular and sale prices
5. Choose start and end dates
6. Upload deal images
7. Add what's included
8. Save deal

### How do I feature a deal on the homepage?

When editing a deal:
1. Toggle "Is Featured" to on
2. Save
Featured deals will appear prominently on the homepage.

### Can I limit the number of bookings?

Yes! Set "Maximum Applications" when creating the deal. The deal will automatically show as "Sold Out" when the limit is reached.

### How do I process a deal booking?

1. Go to **Deals & Payments → Deal Applications**
2. Click on the application
3. Verify payment
4. Update status to "Confirmed"
5. Send confirmation email
6. Process the booking

### How do I issue a refund?

1. Navigate to **Deals & Payments → Refund Requests**
2. Find the refund request
3. Review the reason
4. Click "Approve" or "Reject"
5. If approved, process the refund
6. Update payment and application records

---

## Communication & Email

### How do I create an email template?

1. Go to **Communication → Email Templates**
2. Click "Create"
3. Enter template name and subject
4. Write email content
5. Use variables like `{customer_name}`
6. Set from email and reply-to
7. Save template

### How do I send a bulk email campaign?

1. Navigate to **Communication → Bulk Email Campaigns**
2. Click "Create"
3. Enter campaign details
4. Choose recipients
5. Write or select template
6. Send immediately or schedule
7. Track campaign performance

### What variables can I use in emails?

Common variables include:
- `{customer_name}` - Customer's name
- `{customer_email}` - Email address
- `{application_number}` - Reference number
- `{site_name}` - Your site name
- `{current_date}` - Today's date

### How do I track if someone opened my email?

When creating a campaign:
1. Enable "Track Opens"
2. Enable "Track Clicks"
3. Save and send
View open and click rates in the campaign details.

### How do I create a contact form?

1. Go to **Communication → Forms**
2. Click "Create"
3. Enter form name
4. Add form fields (name, email, message)
5. Set validation rules
6. Configure notification email
7. Save form
8. Embed on your site

### Where do form submissions go?

All submissions are stored in **Communication → Form Submissions**. You'll also receive email notifications if configured.

---

## Settings & Configuration

### How do I change the site name and logo?

1. Navigate to **Settings → Manage Settings**
2. Find "Site Configuration"
3. Update site name
4. Upload new logo
5. Save settings
6. Clear cache if needed

### How do I add a new language?

1. Go to **Settings → Languages**
2. Click "Create"
3. Enter language name and code (e.g., "French" - "fr")
4. Mark as active
5. Save
6. Add translations for that language

### How do I setup Google Analytics?

1. Navigate to **Settings → Manage Settings**
2. Find "Analytics" section
3. Enter your Google Analytics Tracking ID (G-XXXXXXXXXX)
4. Enable tracking
5. Save settings

### How do I enable live chat?

1. Create a Tawk.to account
2. Get your Property ID
3. Go to **Settings → Manage Settings**
4. Find "Tawk.to" section
5. Enter Property ID
6. Enable chat widget
7. Save

### How do I configure email sending?

1. Navigate to **Settings → Mail Configuration**
2. Choose email driver (SMTP, Mailgun, etc.)
3. Enter SMTP details:
   - Host, Port, Username, Password
4. Test email sending
5. Save settings

---

## Payments & Financial

### What payment methods are supported?

The system supports:
- Credit/Debit Cards (Visa, Mastercard, Amex)
- Mobile Money (MTN, Vodafone, AirtelTigo)
- Hubtel, Paystack, Stripe
- PayPal
- Bank Transfer
- Cash
- Flutterwave

### How do I record a manual payment?

1. Go to **Deals & Payments → Payments**
2. Click "Create"
3. Select customer
4. Enter amount and currency
5. Choose payment method
6. Add transaction ID
7. Save payment

### How do I generate an invoice?

1. Navigate to **Deals & Payments → Invoices**
2. Click "Create"
3. Select customer
4. Add line items
5. System calculates totals
6. Save and send to customer

### Can I export financial reports?

Yes! Most payment, deal, and invoice pages have an "Export" button that downloads data in Excel or CSV format.

### How do I handle currency conversion?

Set your default currency in **Settings → General Settings**. For multiple currencies:
- Record payments in customer's currency
- System tracks exchange rates
- Reports can show in preferred currency

---

## Technical Issues

### The page won't load - what should I do?

1. Refresh the page (F5 or Ctrl+R)
2. Clear your browser cache
3. Try in incognito/private mode
4. Try a different browser
5. Contact system administrator

### I can't upload files - what's wrong?

**Possible Solutions:**
- Check file size (must be under 2MB)
- Verify file type (PDF, JPG, PNG only)
- Check internet connection
- Try a different browser
- Contact support

### Changes aren't showing on the website

This is usually a caching issue:
1. Go to **Settings → Cache**
2. Click "Clear All Cache"
3. Refresh the website
4. Changes should now appear

### I forgot my password

1. Go to admin login page
2. Click "Forgot Password?"
3. Enter your email
4. Check email for reset link
5. Create new password

### Email notifications aren't sending

**Check These:**
1. Verify SMTP settings correct
2. Check queue is running
3. Look in email logs for errors
4. Test with different email address
5. Contact system administrator

### Search isn't working

1. Make sure you're searching in the right section
2. Try different keywords
3. Clear filters
4. Clear cache
5. Refresh page

---

## Best Practices

### How often should I backup data?

**Recommended Schedule:**
- Daily: Automatic database backup
- Weekly: Full system backup
- Before updates: Complete backup
- Store backups offsite

### How can I improve system performance?

1. Enable caching in settings
2. Optimize images before upload
3. Clear old logs regularly
4. Use CDN for assets
5. Monitor database size
6. Regular maintenance

### How do I keep customer data secure?

1. Use strong passwords
2. Enable two-factor authentication
3. Limit user permissions
4. Regular security updates
5. Monitor activity logs
6. Follow GDPR guidelines

### What should I do before making changes?

1. Test in a staging environment
2. Backup your data
3. Note your current settings
4. Make changes during off-peak hours
5. Verify changes work correctly

### How do I train new staff?

1. Create user accounts with limited permissions
2. Start with this user guide
3. Shadow experienced users
4. Practice in test environment
5. Gradually increase permissions
6. Regular training sessions

---

## Getting More Help

### Where can I find video tutorials?

Check with your system administrator for available video tutorials and training materials.

### How do I report a bug?

1. Note what you were doing
2. Take screenshots of the error
3. Check browser console for errors (F12)
4. Contact system administrator with details

### How do I request a new feature?

Submit feature requests to your system administrator with:
- Clear description
- Use case explanation
- Why it would be helpful
- Examples if possible

### Who do I contact for support?

Contact your system administrator or the designated IT support team for technical assistance.

### Is there a mobile app?

While there's no dedicated mobile app, the admin panel is fully responsive and works great in mobile browsers. Add to home screen for app-like experience.

---

## Quick Reference

### Common Keyboard Shortcuts

- `Ctrl/Cmd + K`: Global search
- `Ctrl/Cmd + S`: Save current form
- `Esc`: Close modals
- `Tab`: Navigate form fields
- `Enter`: Submit forms

### Status Color Codes

- **Green**: Active, Published, Completed
- **Yellow**: Pending, Processing, In Progress
- **Red**: Rejected, Failed, Error
- **Blue**: Info, Draft, Scheduled
- **Gray**: Inactive, Archived, Cancelled

### File Upload Limits

- Maximum file size: 2MB per file
- Supported formats: PDF, JPG, PNG, GIF
- Multiple files: Yes (per application)
- Total storage: Check with administrator

### Email Best Practices

- Subject line: Under 50 characters
- Preview text: First 100 characters matter
- Mobile-friendly: 60%+ open on mobile
- Include unsubscribe: Required by law
- Test before sending: Always!

### Performance Tips

- Use filters to narrow large lists
- Export data for offline analysis
- Clear cache after major changes
- Optimize images before upload
- Close unused browser tabs

---

## Additional Resources

### Related Guides

- [Getting Started](01-getting-started.md) - System introduction
- [Service Applications](02-service-applications.md) - Process applications
- [Deals & Promotions](03-deals-promotions.md) - Manage deals
- [CMS & Content](04-cms-content.md) - Content creation
- [Communication & Forms](05-communication-forms.md) - Email & forms
- [Advanced Settings](06-advanced-settings.md) - Configuration

### External Resources

- Filament Documentation: https://filamentphp.com
- Laravel Documentation: https://laravel.com/docs
- Tailwind CSS: https://tailwindcss.com
- PHP Documentation: https://php.net

---

**Last Updated**: February 2026

**Version**: 1.0 (Laravel 11 + Filament 3)

For additional assistance, please contact your system administrator.
