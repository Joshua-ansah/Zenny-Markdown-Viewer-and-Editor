# Deals & Promotions Management

## Overview

The Deals & Promotions system allows you to create special offers, manage promotional campaigns, and track deal applications. This guide covers creating deals, processing deal applications, and managing payments.

---

## Deals Management

### Accessing Deals

Navigate to **Deals & Payments → Deals** to manage promotional offers.

### What Are Deals?

Deals are special promotional offers for your services:
- **Package deals**: Combine multiple services
- **Seasonal offers**: Holiday promotions
- **Early bird discounts**: Book in advance
- **Group deals**: Travel groups
- **Flash sales**: Limited-time offers

### Creating a New Deal

1. Click "Create"
2. Fill in the form:

   **Deal Details:**
   - **Title**: Deal name (e.g., "Summer Visa Package")
   - **Slug**: URL-friendly identifier
   - **Description**: Detailed information (Rich Text Editor)
   - **Short Description**: Brief summary

   **Pricing:**
   - **Regular Price**: Original price
   - **Sale Price**: Discounted price
   - **Discount Percentage**: Auto-calculated
   - **Currency**: GHS, USD, EUR, etc.

   **Deal Terms:**
   - **Start Date**: When deal begins
   - **End Date**: When deal expires
   - **Maximum Applications**: Limit bookings
   - **Minimum Group Size**: For group deals
   - **Maximum Group Size**: Group limit

   **Inclusions:**
   - **What's Included**: List of services
   - **What's Not Included**: Exclusions
   - **Terms & Conditions**: Deal terms

   **Settings:**
   - **Status**: Draft/Active/Expired
   - **Is Featured**: Highlight on homepage
   - **Is Popular**: Mark as popular choice
   - **Category**: Deal category

   **Media:**
   - **Featured Image**: Main deal image
   - **Gallery Images**: Additional photos
   - **Video URL**: YouTube/Vimeo link (optional)

3. Click "Save"

### Deal Categories

Organize deals by category:
- **Visa Packages**: Visa + related services
- **Travel Insurance**: Insurance deals
- **Passport Services**: Passport packages
- **Group Travel**: Group discounts
- **Seasonal Offers**: Holiday specials
- **Student Discounts**: Student deals

### Deal Statuses

- **Draft**: Not visible to public
- **Active**: Currently available
- **Scheduled**: Will activate at start date
- **Expired**: Past end date
- **Sold Out**: Reached maximum applications

### Deal Features

**Countdown Timer:**
- Shows time remaining
- Creates urgency
- Auto-updates

**Limited Availability:**
- Show spots remaining
- "Only 5 left!" alerts
- Hide when sold out

**Social Proof:**
- Show application count
- Display recent bookings
- Customer ratings

**Urgency Indicators:**
- "Ends in 3 days"
- "Flash sale"
- "Limited time only"

### Browser Testing - Deals

Test these features in your browser:

- [ ] Create new deal with all fields
- [ ] Upload featured image and gallery
- [ ] Set start and end dates
- [ ] Configure pricing
- [ ] Add what's included/excluded
- [ ] Save as draft and preview
- [ ] Publish deal
- [ ] Mark deal as featured
- [ ] View deal on frontend
- [ ] Test countdown timer
- [ ] Check responsive design on mobile
- [ ] Filter deals by category
- [ ] Search deals
- [ ] Export deals to Excel
- [ ] Duplicate existing deal
- [ ] Edit active deal
- [ ] Archive expired deal

---

## Deal Applications

### Accessing Deal Applications

Navigate to **Deals & Payments → Deal Applications** to manage bookings.

### What Is a Deal Application?

When a customer books a deal, a deal application is created containing:
- Customer information
- Selected deal
- Number of travelers
- Travel dates
- Special requests
- Payment information

### Deal Application Fields

**Customer Information:**
- Full name
- Email address
- Phone number
- Country/region

**Travel Details:**
- Number of adults
- Number of children
- Preferred travel date
- Flexible dates (yes/no)
- Special requirements

**Payment:**
- Payment method
- Payment status
- Amount paid
- Balance due

**Status:**
- Pending
- Confirmed
- Cancelled
- Completed

### Creating a Deal Application (Manual)

1. Click "Create"
2. Select customer (or create new)
3. Choose deal
4. Enter travel details:
   - Number of travelers
   - Travel dates
   - Special requests

5. Calculate total:
   - Deal price × travelers
   - Apply discounts
   - Add taxes/fees

6. Record payment:
   - Payment method
   - Payment status
   - Transaction reference

7. Set status and save

### Processing Deal Applications

**1. New Application Received:**
- Review customer information
- Verify deal availability
- Check travel dates
- Confirm pricing

**2. Payment Verification:**
- Confirm payment received
- Verify amount correct
- Process payment gateway
- Issue receipt/invoice

**3. Confirmation:**
- Update status to "Confirmed"
- Send confirmation email
- Provide booking reference
- Send deal details

**4. Pre-Travel:**
- Send reminders
- Provide checklist
- Share contact information
- Confirm arrangements

**5. Completion:**
- Mark as "Completed"
- Request feedback
- Send thank you email
- Offer future deals

### Application Statuses

**Pending:**
- Newly submitted
- Awaiting review
- Payment not confirmed

**Confirmed:**
- Payment received
- Deal confirmed
- Customer notified

**Processing:**
- Arranging services
- Coordinating details
- Pending documents

**Completed:**
- Service delivered
- Travel completed
- Ready for feedback

**Cancelled:**
- Customer cancelled
- Refund processed (if applicable)
- Deal reopened

**Expired:**
- Not confirmed in time
- Payment timeout
- Deal no longer available

### Deal Application Filters

Filter applications by:
- **Status**: Pending/Confirmed/Completed
- **Deal**: Specific deal
- **Date Range**: Application date
- **Customer**: Search by name/email
- **Payment Status**: Paid/Unpaid/Partial

### Bulk Operations

Select multiple applications to:
- Update status
- Send confirmation emails
- Export to Excel
- Generate invoices
- Mark as completed

### Browser Testing - Deal Applications

- [ ] Create manual deal application
- [ ] View application list
- [ ] Filter by status
- [ ] Filter by deal
- [ ] View application details
- [ ] Update application status
- [ ] Process payment
- [ ] Generate invoice
- [ ] Send confirmation email
- [ ] Add internal notes
- [ ] Calculate total with multiple travelers
- [ ] Cancel application
- [ ] Issue refund
- [ ] Export applications
- [ ] Print application details

---

## Payment Processing

### Accessing Payments

Navigate to **Deals & Payments → Payments** to track all transactions.

### Payment Information

Each payment record shows:
- **Customer**: Who paid
- **Amount**: Payment amount
- **Currency**: Payment currency
- **Method**: Payment method
- **Status**: Payment status
- **Transaction ID**: Reference number
- **Date**: Payment date
- **Related To**: Application/deal

### Payment Methods

**Supported Methods:**
- **Credit/Debit Card**: Visa, Mastercard, Amex
- **Mobile Money**: MTN, Vodafone, AirtelTigo
- **Hubtel**: Mobile money aggregator
- **Paystack**: Online payment gateway
- **Stripe**: International cards
- **PayPal**: Global payment
- **Bank Transfer**: Direct transfer
- **Cash**: In-person payment
- **Flutterwave**: African payments

### Payment Statuses

**Pending:**
- Payment initiated
- Not confirmed
- Awaiting verification

**Processing:**
- Payment gateway processing
- Bank verification
- Mobile money approval

**Completed:**
- Payment successful
- Funds received
- Customer charged

**Failed:**
- Payment declined
- Insufficient funds
- Technical error
- Card rejected

**Refunded:**
- Full refund processed
- Partial refund
- Reversal completed

**Cancelled:**
- Customer cancelled
- Timeout
- Manual cancellation

### Recording a Payment

1. Click "Create"
2. Fill in details:
   - **Customer**: Select customer
   - **Amount**: Payment amount
   - **Currency**: Select currency
   - **Payment Method**: Choose method
   - **Transaction ID**: Reference number
   - **Status**: Payment status
   - **Notes**: Additional information

3. Link to application (optional)
4. Click "Save"

### Processing Refunds

1. Open payment record
2. Click "Process Refund"
3. Choose refund type:
   - Full refund
   - Partial refund
4. Enter refund amount
5. Add refund reason
6. Select refund method
7. Process refund
8. Update payment status
9. Send refund confirmation

### Payment Reports

Generate reports for:
- Daily/weekly/monthly revenue
- Payment method breakdown
- Successful vs failed payments
- Refund statistics
- Outstanding payments
- Revenue by deal
- Customer payment history

### Browser Testing - Payments

- [ ] View all payments
- [ ] Filter by status
- [ ] Filter by method
- [ ] Filter by date range
- [ ] Search by transaction ID
- [ ] View payment details
- [ ] Record manual payment
- [ ] Process refund
- [ ] Generate invoice
- [ ] Send payment receipt
- [ ] Export payments to Excel
- [ ] View payment statistics
- [ ] Link payment to application
- [ ] Update payment status

---

## Invoices Management

### Accessing Invoices

Navigate to **Deals & Payments → Invoices** to manage billing documents.

### What Is an Invoice?

An invoice is a formal payment request sent to customers containing:
- Customer details
- Service/deal description
- Itemized charges
- Tax calculations
- Payment terms
- Due date
- Payment methods

### Creating an Invoice

1. Click "Create"
2. Fill in information:

   **Customer Details:**
   - Select customer
   - Billing address
   - Tax ID (if applicable)

   **Invoice Details:**
   - Invoice number (auto-generated)
   - Invoice date
   - Due date
   - Currency

   **Line Items:**
   - Description
   - Quantity
   - Unit price
   - Tax rate
   - Total

   **Totals:**
   - Subtotal
   - Tax amount
   - Discount (if any)
   - Total amount

   **Payment Terms:**
   - Payment instructions
   - Bank details
   - Payment methods
   - Notes

3. Click "Save"

### Invoice Statuses

- **Draft**: Being created
- **Sent**: Sent to customer
- **Paid**: Payment received
- **Overdue**: Past due date
- **Cancelled**: Voided invoice
- **Refunded**: Payment refunded

### Invoice Features

**Automatic Generation:**
- Create from deal application
- Include all charges
- Calculate taxes
- Apply currencies

**Email Sending:**
- Send to customer
- PDF attachment
- Payment link
- Reminder emails

**Payment Tracking:**
- Link to payments
- Show payment status
- Track outstanding balance
- Payment history

**PDF Export:**
- Professional template
- Company logo
- Customizable layout
- Print-friendly

### Invoice Templates

Customize invoice appearance:
- Company information
- Logo and branding
- Color scheme
- Layout style
- Footer information
- Terms and conditions

### Browser Testing - Invoices

- [ ] Create new invoice
- [ ] Add multiple line items
- [ ] Calculate taxes
- [ ] Apply discount
- [ ] Save as draft
- [ ] Preview invoice
- [ ] Send invoice via email
- [ ] Download PDF
- [ ] Print invoice
- [ ] Record payment
- [ ] Mark as paid
- [ ] Send payment reminder
- [ ] View invoice history
- [ ] Filter by status
- [ ] Export invoices
- [ ] Cancel invoice

---

## Refund Requests

### Accessing Refund Requests

Navigate to **Deals & Payments → Refund Requests** to manage refund applications.

### Refund Request Information

Each request contains:
- **Customer**: Who requested
- **Application**: Related booking
- **Amount**: Refund amount
- **Reason**: Why refunding
- **Status**: Request status
- **Requested Date**: When requested
- **Payment Method**: Original method

### Refund Reasons

Common reasons:
- Booking cancelled by customer
- Service not delivered
- Overcharged
- Duplicate payment
- Quality issues
- Force majeure (COVID, disasters)
- Customer dissatisfaction

### Processing Refund Requests

**1. Review Request:**
- Check refund eligibility
- Verify refund policy
- Review payment record
- Check cancellation terms

**2. Approve or Reject:**
- **Approve**: Full or partial
- **Reject**: With reason
- **Request More Info**: Ask customer

**3. Process Refund:**
- Choose refund method
- Calculate refund amount
- Deduct fees (if applicable)
- Process transaction

**4. Update Records:**
- Update payment status
- Close refund request
- Update application
- Send confirmation

### Refund Statuses

- **Pending**: Awaiting review
- **Approved**: Refund approved
- **Processing**: Being processed
- **Completed**: Refund issued
- **Rejected**: Request denied
- **Cancelled**: Customer cancelled request

### Refund Policies

**Time Limits:**
- Full refund: Cancel 14+ days before
- 50% refund: Cancel 7-13 days before
- No refund: Cancel less than 7 days

**Non-Refundable Items:**
- Processing fees
- Visa fees (paid to embassy)
- Third-party services
- Administrative costs

**Refund Methods:**
- Original payment method
- Bank transfer
- Store credit
- Mobile money

### Browser Testing - Refund Requests

- [ ] View all refund requests
- [ ] Filter by status
- [ ] View request details
- [ ] Approve refund request
- [ ] Reject refund request
- [ ] Process approved refund
- [ ] Calculate refund amount with fees
- [ ] Send refund confirmation
- [ ] Update related records
- [ ] Add notes to request
- [ ] Export refund requests
- [ ] Generate refund report

---

## Reporting & Analytics

### Revenue Reports

**Financial Overview:**
- Total revenue
- Revenue by period
- Revenue by deal
- Revenue by category
- Payment method breakdown

**Metrics:**
- Average order value
- Conversion rate
- Revenue growth
- Profit margins

### Deal Performance

**Deal Analytics:**
- Most popular deals
- Best performing categories
- Views vs bookings
- Conversion rates
- Revenue per deal

**Customer Insights:**
- New vs returning customers
- Customer lifetime value
- Booking frequency
- Customer locations

### Export Reports

**Export Formats:**
- Excel (XLSX)
- CSV
- PDF reports
- JSON data

**Report Types:**
- Financial summary
- Deal performance
- Customer list
- Payment records
- Refund summary

### Browser Testing - Reports

- [ ] View revenue dashboard
- [ ] Filter by date range
- [ ] View deal performance
- [ ] Export revenue report
- [ ] View customer analytics
- [ ] Generate payment summary
- [ ] Export to Excel
- [ ] View charts and graphs
- [ ] Compare period over period
- [ ] View top performing deals

---

## Best Practices

### 1. Deal Creation

**Compelling Offers:**
- Clear value proposition
- Attractive pricing
- High-quality images
- Detailed descriptions
- Social proof (testimonials)

**Pricing Strategy:**
- Competitive analysis
- Clear savings displayed
- No hidden fees
- Multiple payment options

### 2. Customer Communication

**Fast Response:**
- Respond to inquiries quickly
- Provide clear information
- Set expectations
- Follow up regularly

**Professional Service:**
- Polite and helpful
- Detailed explanations
- Proactive updates
- Problem resolution

### 3. Payment Processing

**Security:**
- Secure payment gateways
- PCI compliance
- Encrypted transactions
- Fraud detection

**Transparency:**
- Clear pricing
- Itemized charges
- Receipt immediately
- No surprise fees

### 4. Refund Management

**Fair Policies:**
- Clear refund policy
- Reasonable timeframes
- Fair fee structure
- Exception handling

**Quick Processing:**
- Review requests promptly
- Communicate clearly
- Process efficiently
- Confirm completion

---

## Troubleshooting

### Issue: Deal Not Showing on Frontend
**Solution**:
- Check status is "Active"
- Verify dates are current
- Check not sold out
- Clear cache
- Verify category is active

### Issue: Payment Gateway Failing
**Solution**:
- Check gateway credentials
- Verify API keys
- Test connection
- Check error logs
- Contact gateway support

### Issue: Invoice Not Generating
**Solution**:
- Check customer details complete
- Verify line items added
- Check tax calculations
- Clear cache
- Check file permissions

### Issue: Refund Not Processing
**Solution**:
- Verify refund method available
- Check sufficient balance
- Verify payment gateway supports refunds
- Check transaction ID correct
- Contact payment provider

---

## Next Steps

- [Service Applications Management](02-service-applications.md)
- [CMS & Content Management](04-cms-content.md)
- [Communication & Forms](05-communication-forms.md)
