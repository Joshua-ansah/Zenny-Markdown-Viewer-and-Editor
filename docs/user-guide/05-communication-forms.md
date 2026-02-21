# Communication & Forms Management

## Overview

The Communication & Forms system helps you manage customer communications, email campaigns, contact forms, and customer submissions. This guide covers email templates, bulk campaigns, forms, and email tracking.

---

## Email Templates

### Accessing Email Templates

Navigate to **Communication → Email Templates** to manage reusable email designs.

### What Are Email Templates?

Email templates are pre-designed, reusable email layouts for:
- Application status updates
- Payment confirmations
- Welcome emails
- Password resets
- Promotional emails
- Notifications

### Creating an Email Template

1. Click "Create"
2. Fill in the form:

   **Template Information:**
   - **Name**: Template identifier (e.g., "Visa Approval Notification")
   - **Subject**: Email subject line
   - **Slug**: Unique identifier for code reference

   **Email Content:**
   - **Body**: Email content (Rich Text Editor or HTML)
   - **Variables**: Use placeholders like `{customer_name}`, `{application_number}`

   **Settings:**
   - **Category**: Template category
   - **Is Active**: Enable/disable template
   - **From Name**: Sender name
   - **From Email**: Sender email address
   - **Reply-To Email**: Response email

   **Design:**
   - **Header**: Custom header content
   - **Footer**: Custom footer content
   - **CSS**: Optional custom styling

3. Click "Save"

### Email Template Variables

Use these placeholders in your templates:

**Customer Variables:**
- `{customer_name}`: Customer's full name
- `{customer_email}`: Customer's email
- `{customer_phone}`: Customer's phone

**Application Variables:**
- `{application_number}`: Reference number
- `{application_type}`: Service type
- `{application_status}`: Current status
- `{application_date}`: Submission date

**System Variables:**
- `{site_name}`: Your site name
- `{site_url}`: Your website URL
- `{current_date}`: Today's date
- `{current_year}`: Current year

**Example Template:**
```
Dear {customer_name},

Your {application_type} application #{application_number}
has been {application_status}.

Please log in to your account to view details:
{site_url}/my-applications

Best regards,
{site_name} Team
```

### Template Categories

Organize templates by purpose:
- **Transactional**: Order confirmations, receipts
- **Notifications**: Status updates, alerts
- **Marketing**: Promotions, newsletters
- **System**: Password resets, verifications

### Browser Testing - Email Templates

Test these features:

- [ ] Create new email template
- [ ] Use variable placeholders
- [ ] Preview template with sample data
- [ ] Test with different customer data
- [ ] Send test email to your address
- [ ] Edit existing template
- [ ] Duplicate template
- [ ] Activate/deactivate template
- [ ] Filter by category
- [ ] Search templates
- [ ] Export templates

---

## Bulk Email Campaigns

### Accessing Bulk Campaigns

Navigate to **Communication → Bulk Email Campaigns** to send mass emails.

### Creating a Campaign

1. Click "Create"
2. Fill in the form:

   **Campaign Details:**
   - **Title**: Internal campaign name
   - **Subject**: Email subject line
   - **From Name**: Sender name
   - **From Email**: Sender address
   - **Reply-To Email**: Response email

   **Content:**
   - **Body**: Campaign content (Rich Text Editor or HTML)
   - **Template**: Use existing template (optional)

   **Recipients:**
   - **Recipient Type**:
     - All Customers
     - Specific Groups
     - Filtered List
     - Subscribers Only
   - **Filter Criteria**: Apply filters if needed

   **Schedule:**
   - **Status**: Draft/Scheduled/Sent
   - **Send At**: Immediate or schedule for later
   - **Time Zone**: Consider recipient time zones

   **Settings:**
   - **Track Opens**: Enable open tracking
   - **Track Clicks**: Enable click tracking
   - **Unsubscribe Link**: Include unsubscribe option

3. Click "Save" or "Send"

### Campaign Statuses

- **Draft**: Being created, not sent
- **Scheduled**: Set to send at specific time
- **Sending**: Currently being sent
- **Sent**: Completed
- **Failed**: Encountered errors
- **Cancelled**: Stopped before completion

### Recipient Selection

**All Customers:**
- Sends to all registered users
- Be careful with large lists

**Specific Groups:**
- Customers with pending applications
- Recent purchasers
- Active users
- Specific service users

**Filtered List:**
- Custom filters:
  - Registration date
  - Last activity
  - Application types
  - Location
  - Purchase history

**Subscribers Only:**
- Newsletter subscribers
- Opt-in marketing list

### Campaign Analytics

Track campaign performance:
- **Sent**: Total emails sent
- **Delivered**: Successfully delivered
- **Opened**: Email opens (%)
- **Clicked**: Link clicks (%)
- **Bounced**: Failed deliveries
- **Unsubscribed**: Opt-out count
- **Spam Reports**: Marked as spam

### Best Practices for Campaigns

1. **Segment Your Audience**
   - Send relevant content
   - Use targeted messaging
   - Respect preferences

2. **Optimize Subject Lines**
   - Keep under 50 characters
   - Create curiosity
   - Be clear and specific
   - Avoid spam triggers

3. **Design for Mobile**
   - Responsive layout
   - Clear call-to-action
   - Easy-to-read fonts
   - Optimize images

4. **Test Before Sending**
   - Send test emails
   - Check all links
   - Verify images load
   - Test on different devices

5. **Timing Matters**
   - Consider time zones
   - Avoid weekends (unless relevant)
   - Test different send times
   - Don't over-send

6. **Compliance**
   - Include unsubscribe link
   - Honor opt-outs immediately
   - Follow GDPR/CAN-SPAM
   - Don't purchase email lists

### Browser Testing - Campaigns

- [ ] Create new campaign
- [ ] Select recipient group
- [ ] Write compelling subject line
- [ ] Design email body
- [ ] Add images and links
- [ ] Send test email
- [ ] Schedule campaign
- [ ] View campaign in list
- [ ] Check campaign statistics
- [ ] View opened emails
- [ ] Track link clicks
- [ ] Resend to non-openers
- [ ] Export campaign results
- [ ] Cancel scheduled campaign

---

## Email Logs

### Accessing Email Logs

Navigate to **Communication → Email Logs** to track all sent emails.

### Email Log Information

Each log entry shows:
- **Recipient**: Email address
- **Subject**: Email subject line
- **Status**: Sent/Failed/Pending
- **Sent At**: Date and time
- **Opened At**: When email was opened
- **Failed Reason**: Error message if failed
- **Template Used**: Which template
- **Campaign**: Associated campaign (if any)

### Email Statuses

- **Pending**: Queued, not sent yet
- **Sent**: Successfully sent
- **Delivered**: Confirmed delivery
- **Opened**: Recipient opened email
- **Clicked**: Recipient clicked link
- **Bounced**: Delivery failed
- **Failed**: Send attempt failed
- **Spam**: Marked as spam

### Using Email Logs

**Find Specific Emails:**
1. Search by recipient email
2. Filter by date range
3. Filter by status
4. Filter by template

**Troubleshoot Issues:**
1. Check failed emails
2. Review error messages
3. Identify bounce patterns
4. Fix invalid addresses

**Verify Delivery:**
1. Confirm important emails sent
2. Check customer claims
3. Track order confirmations
4. Monitor system emails

### Browser Testing - Email Logs

- [ ] View all email logs
- [ ] Search by recipient
- [ ] Filter by status (failed, sent)
- [ ] Filter by date range
- [ ] View email details
- [ ] Check failure reasons
- [ ] Track email opens
- [ ] Resend failed emails
- [ ] Export email logs
- [ ] Delete old logs

---

## Forms Management

### Accessing Forms

Navigate to **Communication → Forms** to manage custom forms.

### What Are Forms?

Forms allow you to collect information from website visitors:
- Contact forms
- Inquiry forms
- Feedback forms
- Registration forms
- Survey forms

### Creating a Form

1. Click "Create"
2. Fill in the form:

   **Form Details:**
   - **Name**: Form identifier (e.g., "Contact Form")
   - **Slug**: URL slug (e.g., "contact")
   - **Description**: Internal description

   **Form Fields:**
   - **Add Field**: Click to add form fields
   - **Field Types**:
     - Text Input
     - Textarea
     - Email
     - Phone Number
     - Number
     - Date
     - File Upload
     - Checkbox
     - Radio Buttons
     - Select Dropdown
     - Multiple Select

   **Field Configuration:**
   - **Label**: Field label
   - **Name**: Field identifier
   - **Type**: Field type
   - **Required**: Make field mandatory
   - **Placeholder**: Helper text
   - **Validation**: Add rules
   - **Options**: For select/radio fields

   **Settings:**
   - **Success Message**: After submission
   - **Submit Button Text**: Button label
   - **Send Email Notification**: Enable/disable
   - **Notification Email**: Recipient email
   - **Auto-Reply**: Send confirmation to submitter
   - **Redirect URL**: After submission
   - **Is Active**: Enable/disable form

3. Click "Save"

### Form Field Examples

**Contact Form:**
```
- Name (Text, Required)
- Email (Email, Required)
- Phone (Phone)
- Subject (Dropdown, Required)
  Options: General, Support, Sales
- Message (Textarea, Required)
```

**Visa Inquiry Form:**
```
- Full Name (Text, Required)
- Email (Email, Required)
- Phone (Phone, Required)
- Destination Country (Dropdown, Required)
- Travel Date (Date, Required)
- Message (Textarea)
```

**Feedback Form:**
```
- Name (Text, Required)
- Email (Email, Required)
- Service Used (Dropdown, Required)
- Rating (Radio Buttons, Required)
  Options: Excellent, Good, Fair, Poor
- Comments (Textarea)
- Would Recommend? (Checkbox)
```

### Form Validation Rules

- **Required**: Field must be filled
- **Email**: Valid email format
- **Phone**: Valid phone format
- **Min Length**: Minimum characters
- **Max Length**: Maximum characters
- **Number**: Numeric only
- **Date**: Valid date format
- **File Size**: Max upload size
- **File Type**: Allowed file types

### Using Forms

**Embed in Pages:**
```
[form slug="contact"]
```

**Direct Link:**
```
https://yoursite.com/forms/contact
```

**Popup Form:**
- Configure as modal
- Trigger on button click
- Exit-intent popup

### Browser Testing - Forms

- [ ] Create contact form
- [ ] Add multiple field types
- [ ] Set required fields
- [ ] Configure validation rules
- [ ] Test form on frontend
- [ ] Submit valid data
- [ ] Test validation errors
- [ ] Verify email notification
- [ ] Check auto-reply email
- [ ] Test file uploads
- [ ] Test on mobile device
- [ ] Edit form fields
- [ ] Duplicate form
- [ ] Export form configuration

---

## Form Submissions

### Accessing Form Submissions

Navigate to **Communication → Form Submissions** to review submitted data.

### Viewing Submissions

Each submission shows:
- **Form Name**: Which form
- **Submitted By**: Name or email
- **Submitted At**: Date and time
- **Status**: New/Read/Processed/Archived
- **IP Address**: Submitter IP
- **User Agent**: Browser information

### Submission Details

Click on a submission to view:
- All field values
- Attached files
- Submission metadata
- Customer information (if logged in)

### Managing Submissions

**Update Status:**
- Mark as read
- Mark as processed
- Archive old submissions
- Flag for follow-up

**Take Actions:**
- Reply to submitter
- Forward to team member
- Export to Excel
- Print submission
- Delete submission

**Bulk Operations:**
- Mark multiple as read
- Archive selected
- Export selected
- Delete selected

### Submission Filters

Filter submissions by:
- **Form**: Specific form
- **Status**: New/Read/Processed
- **Date Range**: Submission date
- **Keyword**: Search field values

### Browser Testing - Submissions

- [ ] View all submissions
- [ ] Filter by form type
- [ ] Filter by date range
- [ ] View submission details
- [ ] Print submission
- [ ] Reply to submitter
- [ ] Mark as processed
- [ ] Archive old submissions
- [ ] Bulk operations
- [ ] Export submissions
- [ ] Delete spam submissions
- [ ] Search submissions

---

## Newsletter Subscriptions

### Accessing Subscriptions

Navigate to **Activity & Reports → Subscriptions** to manage newsletter subscribers.

### Subscription Management

View subscriber information:
- **Email**: Subscriber email
- **Name**: Subscriber name (if provided)
- **Status**: Active/Unsubscribed
- **Subscribed At**: Subscription date
- **Source**: How they subscribed
- **Lists**: Which mailing lists

### Managing Subscribers

**Add Subscribers:**
1. Click "Create"
2. Enter email and name
3. Select mailing lists
4. Click "Save"

**Import Subscribers:**
1. Click "Import"
2. Upload CSV file
3. Map columns
4. Verify and import

**Export Subscribers:**
1. Apply filters if needed
2. Click "Export"
3. Download CSV

**Bulk Actions:**
- Unsubscribe selected
- Delete selected
- Add to mailing list
- Remove from list

### Subscription Sources

Track where subscribers come from:
- Website footer form
- Checkout process
- Landing page
- Manual import
- API integration

### Browser Testing - Subscriptions

- [ ] View all subscribers
- [ ] Add new subscriber
- [ ] Import CSV file
- [ ] Export subscriber list
- [ ] Search by email
- [ ] Filter by status
- [ ] Filter by source
- [ ] Unsubscribe user
- [ ] Resubscribe user
- [ ] Bulk operations
- [ ] Delete subscriber

---

## Communication Best Practices

### 1. Email Deliverability

**Improve Deliverability:**
- Use verified domain
- Warm up IP address
- Maintain clean list
- Avoid spam triggers
- Monitor bounce rates

**Avoid Spam Filters:**
- Don't use all caps
- Avoid excessive punctuation!!!
- Don't use spam words (FREE, BUY NOW)
- Include unsubscribe link
- Use legitimate from address

### 2. Response Management

- Respond within 24 hours
- Use templates for efficiency
- Personalize responses
- Track conversation history
- Follow up appropriately

### 3. Data Privacy

- Store data securely
- Follow GDPR guidelines
- Honor unsubscribe requests
- Delete data upon request
- Encrypt sensitive information

### 4. Email Frequency

- Don't over-send
- Segment by interest
- Respect preferences
- Monitor unsubscribe rates
- Test send frequency

### 5. Mobile Optimization

- Responsive design
- Short subject lines
- Clear CTAs
- Readable fonts
- Fast loading

---

## Troubleshooting

### Issue: Emails Not Sending
**Solution**:
- Check email configuration
- Verify queue is running
- Check email logs
- Test SMTP settings
- Contact hosting provider

### Issue: High Bounce Rate
**Solution**:
- Clean email list
- Verify email addresses
- Check for typos
- Remove invalid emails
- Use double opt-in

### Issue: Low Open Rate
**Solution**:
- Improve subject lines
- Send at better times
- Segment audience
- Clean inactive subscribers
- A/B test different approaches

### Issue: Form Submissions Not Arriving
**Solution**:
- Check form configuration
- Verify notification email
- Check spam folder
- Test form manually
- Review email logs

### Issue: Spam Reports
**Solution**:
- Review content
- Add unsubscribe link
- Clean email list
- Verify permission
- Improve targeting

---

## Next Steps

- [Advanced Settings](06-advanced-settings.md)
- [Frequently Asked Questions](07-faq.md)
- [Getting Started](01-getting-started.md)
