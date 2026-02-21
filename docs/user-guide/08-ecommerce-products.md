# E-commerce & Product Management

## Overview

The E-commerce system allows you to sell physical products, manage inventory, process orders, handle customer reviews, offer coupons, and configure shipping options. This comprehensive guide covers all aspects of running your online store.

---

## Product Management

### Accessing Products

Navigate to **E-commerce → Products** to manage your product catalog.

### What is a Product?

Products are physical or digital items you sell to customers. Each product can have:
- Multiple images
- Price and sale price
- Inventory tracking
- Product variants (sizes, colors, etc.)
- Categories and tags
- Reviews and ratings
- SEO metadata

### Creating a New Product

1. Click "Create"
2. Fill in the product form:

   **Product Information (Main Section):**
   - **Name**: Product name (required, translatable)
   - **Slug**: URL-friendly identifier (auto-generated)
   - **SKU**: Stock Keeping Unit (unique identifier)
   - **Description**: Full product description (Rich Text Editor, translatable)
   - **Short Description**: Brief summary (translatable)

   **Pricing Section:**
   - **Price**: Regular selling price (required)
   - **Compare At Price**: Original price for showing discounts
   - **Cost Per Item**: Your cost (for profit calculations)

   **Inventory Section:**
   - **Track Quantity**: Enable/disable inventory tracking
   - **Quantity**: Current stock level
   - **Continue Selling When Out of Stock**: Allow backorders

   **Organization:**
   - **Categories**: Assign to product categories (multiple)
   - **Tags**: Add product tags (multiple)

   **Media:**
   - **Featured Image**: Main product image
   - **Gallery**: Additional product images

   **Status & Visibility:**
   - **Status**: Draft/Active/Archived
   - **Is Featured**: Show on homepage/featured sections

   **SEO (Collapsible):**
   - **Meta Title**: SEO-optimized title
   - **Meta Description**: Search engine description

3. Click "Save"

### Product Statuses

- **Draft**: Work in progress, not visible to customers
- **Active**: Live and available for purchase
- **Archived**: Hidden from store, kept for records

### Product Features

**Inventory Tracking:**
- Real-time stock updates
- Low stock alerts
- Out of stock handling
- Manual stock adjustments

**Product Variants:**
Create variations like:
- Size: Small, Medium, Large
- Color: Red, Blue, Green
- Material: Cotton, Polyester

Each variant can have:
- Unique SKU
- Individual pricing
- Separate inventory

**Image Management:**
- Upload multiple images
- Set featured image
- Image editor (crop, resize)
- Gallery order control

**Categories & Tags:**
- Organize products
- Multiple categories per product
- Filterable by customers
- Hierarchical category structure

### Managing Products

**Product List:**
- View all products
- Search by name, SKU, description
- Sort by name, price, stock
- Quick view product details

**Filters:**
- **Status**: Draft/Active/Archived
- **Is Featured**: Featured products only
- **Out of Stock**: Show out of stock items
- **Category**: Filter by category
- **Price Range**: Min and max price

**Bulk Actions:**
- Publish multiple drafts
- Feature/unfeature products
- Archive products
- Delete products
- Export to Excel
- Update stock levels

### Product Variants

**Creating Variants:**
1. Open product in edit mode
2. Navigate to "Variants" section
3. Add variant details:
   - Name (e.g., "Small - Red")
   - SKU (unique)
   - Price
   - Compare at price
   - Quantity
   - Is Active

4. Save variant

**Variant Features:**
- Independent pricing
- Separate inventory
- Enable/disable variants
- Track variant sales

### Browser Testing - Products

Test these features in your browser:

- [ ] Create new product with all fields
- [ ] Upload featured image and gallery
- [ ] Add product to multiple categories
- [ ] Add product tags
- [ ] Set pricing (regular and compare at)
- [ ] Enable inventory tracking
- [ ] Set stock quantity
- [ ] Save as draft and preview
- [ ] Publish product
- [ ] Mark product as featured
- [ ] View product on frontend
- [ ] Create product variants
- [ ] Filter products by status
- [ ] Filter by out of stock
- [ ] Search products by name/SKU
- [ ] Edit existing product
- [ ] Archive product
- [ ] Bulk publish products
- [ ] Export products to Excel
- [ ] Test low stock alerts

---

## Product Categories

### Accessing Product Categories

Navigate to **E-commerce → Product Categories** to organize products.

### Creating Product Categories

1. Click "Create"
2. Fill in:

   **Category Information:**
   - **Name**: Category name (required, translatable)
   - **Slug**: URL-friendly (auto-generated)
   - **Description**: Category description (translatable)

   **Hierarchy:**
   - **Parent Category**: Create sub-categories
   - **Sort Order**: Control display order

   **Media:**
   - **Category Image**: Upload category image

   **Settings:**
   - **Is Active**: Enable/disable category

3. Click "Save"

### Category Hierarchy

Create multi-level categories:

```
Travel Gear (Parent)
├── Luggage (Child)
│   ├── Carry-On
│   └── Checked Bags
├── Accessories (Child)
│   ├── Travel Pillows
│   └── Packing Cubes
└── Electronics (Child)
    ├── Adapters
    └── Chargers
```

### Using Categories

**Product Organization:**
- Assign products to categories
- Multiple categories per product
- Browse products by category
- Filter product listings

**Category Pages:**
- Dedicated category pages
- Show all products in category
- Include sub-category products
- SEO optimized URLs

### Browser Testing - Product Categories

- [ ] Create top-level category
- [ ] Create sub-category with parent
- [ ] Upload category image
- [ ] Set sort order
- [ ] Assign products to category
- [ ] View category on frontend
- [ ] Edit category details
- [ ] Disable category
- [ ] Delete unused category
- [ ] Test hierarchical structure

---

## Order Management

### Accessing Orders

Navigate to **E-commerce → Orders** to manage customer orders.

### What is an Order?

An order represents a customer's purchase, containing:
- Customer information
- Ordered products
- Pricing details
- Payment information
- Shipping address
- Order status

### Order Fields

**Order Information:**
- **Order Number**: Auto-generated (ORD-XXXXX)
- **Customer**: Linked to user account
- **Order Date**: When order was placed
- **Status**: Order processing status
- **Payment Status**: Payment state

**Order Items:**
- Product details
- Quantity
- Price at time of purchase
- Product variants (if applicable)

**Pricing:**
- **Subtotal**: Products total
- **Tax**: Tax amount
- **Shipping Cost**: Delivery fee
- **Discount**: Coupon discount
- **Total**: Final amount

**Addresses:**
- **Billing Address**: Payment address
- **Shipping Address**: Delivery address

**Notes:**
- **Customer Notes**: Customer's message
- **Admin Notes**: Internal notes

### Order Statuses

**Pending:**
- Just placed
- Payment pending
- Awaiting processing

**Processing:**
- Payment confirmed
- Being prepared
- Items being packed

**Completed:**
- Order fulfilled
- Shipped to customer
- Transaction finished

**Cancelled:**
- Customer cancelled
- Out of stock
- Payment failed

**Refunded:**
- Payment returned
- Full or partial refund
- Items returned

### Managing Orders

**View Order Details:**
1. Click on order number
2. Review order information
3. Check order items
4. Verify addresses
5. View payment details

**Update Order Status:**
1. Open order
2. Change "Status" field
3. Add admin notes
4. Save changes
5. Customer receives email notification

**Process Order:**

**Step 1: Verify Order**
- Check all items in stock
- Verify customer details
- Confirm payment received
- Review shipping address

**Step 2: Prepare Items**
- Pick products from inventory
- Check product quality
- Pack securely
- Print packing slip

**Step 3: Ship Order**
- Choose shipping method
- Generate shipping label
- Add tracking number
- Mark as "Processing"

**Step 4: Complete**
- Confirm delivery
- Update status to "Completed"
- Send completion email
- Request review

### Order Filters

Filter orders by:
- **Status**: Pending/Processing/Completed
- **Payment Status**: Paid/Unpaid/Refunded
- **Date Range**: Order date period
- **Customer**: Search by name
- **Order Number**: Find specific order

### Order Actions

**Print Invoice:**
- Generate PDF invoice
- Professional format
- All order details
- Payment information

**Send Email:**
- Order confirmation
- Shipping notification
- Completion email
- Custom messages

**Refund Order:**
- Full refund
- Partial refund
- Refund specific items
- Update inventory

**Cancel Order:**
- Cancel before shipping
- Refund payment
- Restore inventory
- Notify customer

### Browser Testing - Orders

- [ ] View all orders
- [ ] Filter by status
- [ ] Filter by payment status
- [ ] Search by order number
- [ ] View order details
- [ ] Update order status
- [ ] Add admin notes
- [ ] Print invoice
- [ ] Send order email
- [ ] Process refund
- [ ] Cancel order
- [ ] Export orders to Excel
- [ ] View order timeline
- [ ] Check inventory updates

---

## Review & Rating System

### Accessing Reviews

Navigate to **E-commerce → Reviews** to manage customer feedback.

### What is a Review?

Reviews are customer feedback on products, including:
- Star ratings (1-5 stars)
- Written review
- Review title
- Verification status
- Admin response

### Review Fields

- **Reviewable**: What's being reviewed (Product, Deal, Service)
- **Customer**: Who wrote the review
- **Rating**: 1-5 stars (required)
- **Title**: Review headline
- **Content**: Detailed review
- **Is Verified Purchase**: Bought from you
- **Is Approved**: Admin approved
- **Helpful Count**: How many found it helpful
- **Admin Response**: Your reply to review

### Managing Reviews

**Review List:**
- View all reviews
- See average ratings
- Check approval status
- Sort by rating, date

**Approve/Reject Reviews:**

**Approve:**
1. Read review content
2. Verify appropriate language
3. Check for spam
4. Click "Approve"
5. Review goes live

**Reject:**
1. Identify inappropriate content
2. Review violates guidelines
3. Click "Reject"
4. Review hidden from public

**Respond to Reviews:**
1. Open review
2. Read customer feedback
3. Write admin response
4. Click "Save"
5. Response shows below review

### Review Moderation

**What to Approve:**
- Honest feedback
- Detailed reviews
- Constructive criticism
- Helpful information

**What to Reject:**
- Spam content
- Offensive language
- Fake reviews
- Competitor attacks
- Personal information
- Off-topic content

### Review Filters

Filter reviews by:
- **Rating**: 1/2/3/4/5 stars
- **Is Approved**: Approved/pending
- **Reviewable Type**: Product/Deal/Service
- **Verified Purchase**: Yes/no
- **Date Range**: Review date

### Review Features

**Verified Purchase Badge:**
- Shows customer bought product
- Builds trust
- Higher credibility

**Helpful Count:**
- Customers vote reviews helpful
- Most helpful shown first
- Improves customer experience

**Admin Responses:**
- Show you care
- Address concerns
- Provide solutions
- Build reputation

### Browser Testing - Reviews

- [ ] View all reviews
- [ ] Filter by rating (1-5 stars)
- [ ] Filter by approval status
- [ ] Filter by product
- [ ] Read review details
- [ ] Approve pending review
- [ ] Reject inappropriate review
- [ ] Write admin response
- [ ] Mark as verified purchase
- [ ] View helpful count
- [ ] Test on frontend
- [ ] Export reviews
- [ ] Bulk approve reviews
- [ ] Bulk reject reviews

---

## Coupon & Discount Management

### Accessing Coupons

Navigate to **E-commerce → Coupons** to manage discount codes.

### What is a Coupon?

Coupons are discount codes customers use at checkout to reduce their order total. Types include:
- Percentage discounts (20% off)
- Fixed amount discounts ($10 off)
- Free shipping

### Creating a Coupon

1. Click "Create"
2. Fill in coupon form:

   **Coupon Details:**
   - **Code**: Coupon code (required, unique, e.g., "SUMMER20")
   - **Type**: Percentage/Fixed Amount/Free Shipping
   - **Value**: Discount value (20 for 20%, or $10 amount)
   - **Description**: Internal description

   **Conditions:**
   - **Minimum Purchase Amount**: Min order value required
   - **Maximum Discount Amount**: Max discount (for percentage)

   **Usage Limits:**
   - **Usage Limit**: Total uses allowed
   - **Usage Limit Per User**: Per-customer limit
   - **Usage Count**: Current uses (read-only)

   **Validity:**
   - **Start Date**: When coupon becomes active
   - **End Date**: When coupon expires
   - **Is Active**: Enable/disable coupon

   **Applicability:**
   - **Applicable To**: All products/specific products/categories

3. Click "Save"

### Coupon Types

**Percentage Discount:**
```
Code: SPRING20
Type: Percentage
Value: 20
Result: 20% off entire order
```

**Fixed Amount:**
```
Code: SAVE10
Type: Fixed Amount
Value: 10
Result: $10 off order
```

**Free Shipping:**
```
Code: FREESHIP
Type: Free Shipping
Result: No shipping charge
```

### Coupon Conditions

**Minimum Purchase:**
- Require min order value
- Example: "$50 minimum to use coupon"
- Prevents abuse on small orders

**Maximum Discount:**
- Cap percentage discounts
- Example: "20% off, max $50 discount"
- Protects profit margins

**Usage Limits:**
- Total uses: "100 uses total"
- Per user: "One per customer"
- Prevents overuse

**Date Restrictions:**
- Start date: "Valid from June 1"
- End date: "Expires July 31"
- Limited-time offers

**Product/Category:**
- All products: Applies to everything
- Specific products: Only certain items
- Categories: Product categories only

### Coupon Features

**Auto-Generate Codes:**
- Click "Generate Code"
- Random unique code created
- Easy bulk creation

**Usage Tracking:**
- Track total uses
- Monitor per-user usage
- View redemption history
- Calculate discount given

**Active/Inactive:**
- Enable/disable any time
- Pause campaigns
- Control availability

**Clone Coupons:**
- Duplicate existing
- Quick creation
- Maintain settings

### Managing Coupons

**Coupon List:**
- View all coupons
- See usage statistics
- Check active status
- Monitor expiration

**Filters:**
- **Type**: Percentage/Fixed/Free Shipping
- **Is Active**: Active/inactive only
- **Expired**: Show expired coupons
- **Date Range**: Creation date

**Bulk Actions:**
- Activate multiple coupons
- Deactivate coupons
- Delete expired coupons
- Export coupon list

### Coupon Best Practices

**1. Clear Codes:**
- Easy to remember
- No confusion (avoid 0 vs O)
- Related to promotion
- Examples: WELCOME10, SUMMER20

**2. Fair Limits:**
- Reasonable usage limits
- Prevent abuse
- Balance customer/business needs

**3. Time-Bound:**
- Set end dates
- Create urgency
- Seasonal campaigns
- Limited offers

**4. Test Coupons:**
- Verify coupon works
- Test all conditions
- Check calculations
- Ensure proper application

**5. Communicate Clearly:**
- State terms clearly
- Explain restrictions
- Show expiration
- Make easy to use

###Browser Testing - Coupons

- [ ] Create percentage coupon
- [ ] Create fixed amount coupon
- [ ] Create free shipping coupon
- [ ] Generate random code
- [ ] Set minimum purchase amount
- [ ] Set maximum discount
- [ ] Set usage limits
- [ ] Set date range
- [ ] Test coupon on frontend
- [ ] Apply coupon at checkout
- [ ] Verify discount calculation
- [ ] Check usage increments
- [ ] Test usage limit enforcement
- [ ] Test expiration
- [ ] Filter by coupon type
- [ ] View usage statistics
- [ ] Deactivate coupon
- [ ] Clone existing coupon
- [ ] Export coupons
- [ ] Delete expired

---

## Shipping Methods

### Accessing Shipping Methods

Navigate to **E-commerce → Shipping Methods** to configure delivery options.

### What are Shipping Methods?

Shipping methods are delivery options offered to customers at checkout:
- Standard shipping
- Express delivery
- Free shipping
- Local pickup

### Creating Shipping Method

1. Click "Create"
2. Fill in shipping form:

   **Method Information:**
   - **Name**: Display name (e.g., "Standard Shipping")
   - **Description**: Additional details
   - **Type**: Flat Rate/Free Shipping/Local Pickup

   **Pricing:**
   - **Cost**: Shipping charge
   - **Tax Class**: Tax category
   - **Min Order Amount**: Free shipping threshold

   **Availability:**
   - **Regions**: Countries/states (JSON)
   - **Estimated Delivery Days**: Delivery time
   - **Is Active**: Enable/disable method

3. Click "Save"

### Shipping Types

**Flat Rate:**
- Fixed shipping cost
- Same price regardless of:
  - Order size
  - Weight
  - Destination (within region)
- Simple for customers

**Free Shipping:**
- No shipping charge
- Conditions:
  - Minimum order amount
  - Specific products
  - Promotional periods

**Local Pickup:**
- Customer collects
- No shipping cost
- Specify pickup location
- Set pickup hours

### Shipping Configuration

**Regional Setup:**
Configure which regions can use method:
```json
{
  "countries": ["Ghana", "Nigeria", "Kenya"],
  "states": ["Greater Accra", "Ashanti"]
}
```

**Delivery Estimates:**
- Standard: 3-5 business days
- Express: 1-2 business days
- Local Pickup: Same day

**Minimum Order Amounts:**
- Free shipping over $50
- Standard shipping under $50
- Encourage larger orders

**Tax Classes:**
- Taxable shipping
- Non-taxable shipping
- Different tax rates

### Managing Shipping Methods

**Shipping List:**
- View all methods
- See active status
- Check costs
- Review delivery times

**Filters:**
- **Type**: Flat Rate/Free/Pickup
- **Is Active**: Active only
- **Region**: By geographical area

**Update Shipping:**
1. Open shipping method
2. Modify cost or terms
3. Update delivery estimates
4. Save changes
5. Applies to new orders

### Shipping Best Practices

**1. Clear Options:**
- Easy to understand
- Obvious differences
- Show delivery times
- Display costs upfront

**2. Competitive Pricing:**
- Research competitors
- Balance cost/service
- Consider margins
- Offer value

**3. Free Shipping Strategy:**
- Set smart thresholds
- Encourage bigger orders
- Promotional tool
- Calculate carefully

**4. Accurate Estimates:**
- Realistic delivery times
- Account for processing
- Consider delays
- Under-promise, over-deliver

**5. Multiple Options:**
- Standard option
- Express for urgent
- Free for loyalty
- Pickup for convenience

### Browser Testing - Shipping Methods

- [ ] Create flat rate shipping
- [ ] Create free shipping option
- [ ] Create local pickup
- [ ] Set shipping costs
- [ ] Configure regions
- [ ] Set delivery estimates
- [ ] Set min order for free ship
- [ ] Test on frontend
- [ ] Apply at checkout
- [ ] Verify cost calculation
- [ ] Filter by type
- [ ] Edit shipping method
- [ ] Deactivate method
- [ ] Export shipping methods

---

## E-commerce Best Practices

### Product Management

**1. Quality Product Information:**
- Detailed descriptions
- Multiple high-quality images
- Accurate specifications
- Clear pricing

**2. Inventory Management:**
- Keep stock updated
- Set low stock alerts
- Plan for restocking
- Track popular items

**3. Competitive Pricing:**
- Research market prices
- Consider costs carefully
- Show value clearly
- Use strategic discounts

**4. SEO Optimization:**
- Keyword-rich descriptions
- Optimized meta tags
- Unique product URLs
- Alt text on images

### Order Processing

**1. Fast Processing:**
- Process orders quickly
- Update status promptly
- Communicate with customers
- Meet delivery promises

**2. Clear Communication:**
- Order confirmation emails
- Shipping notifications
- Tracking information
- Delivery updates

**3. Quality Control:**
- Check order accuracy
- Verify product condition
- Secure packaging
- Include packing slip

**4. Customer Service:**
- Respond to inquiries
- Handle issues promptly
- Be professional
- Go extra mile

### Review Management

**1. Encourage Reviews:**
- Request after purchase
- Make it easy
- Follow up
- Incentivize feedback

**2. Respond to All:**
- Thank positive reviews
- Address negative ones
- Show you care
- Offer solutions

**3. Learn from Feedback:**
- Identify patterns
- Improve products
- Enhance service
- Track satisfaction

### Coupon Strategy

**1. Strategic Discounts:**
- New customer acquisition
- Cart abandonment recovery
- Seasonal promotions
- Loyalty rewards

**2. Protect Margins:**
- Set minimum orders
- Cap maximum discounts
- Limit usage
- Track profitability

**3. Create Urgency:**
- Limited time offers
- Countdown timers
- Scarcity messaging
- Exclusive codes

### Shipping Optimization

**1. Multiple Options:**
- Different speeds
- Various price points
- Free shipping tier
- Pickup option

**2. Competitive Rates:**
- Negotiate with carriers
- Bulk shipping discounts
- Pass savings to customers
- Balance cost/service

**3. Clear Expectations:**
- Accurate delivery times
- Transparent costs
- No surprise fees
- Tracking available

---

## Troubleshooting

### Issue: Product Images Not Uploading
**Solution**:
- Check file size (max 2MB)
- Verify image format (JPG, PNG)
- Clear browser cache
- Try different image
- Check server upload limits

### Issue: Inventory Not Updating
**Solution**:
- Verify "Track Quantity" enabled
- Check order completion triggers
- Review inventory logs
- Manual adjustment if needed
- Contact support

### Issue: Orders Stuck in Pending
**Solution**:
- Check payment gateway
- Verify payment received
- Review order details
- Manual status update
- Notify customer

### Issue: Coupon Not Applying
**Solution**:
- Check coupon is active
- Verify not expired
- Check usage limits not reached
- Confirm minimum order met
- Review applicability rules

### Issue: Shipping Cost Incorrect
**Solution**:
- Verify shipping method active
- Check cost configuration
- Review regional settings
- Test checkout process
- Update shipping rules

### Issue: Reviews Not Showing
**Solution**:
- Check review is approved
- Verify product is published
- Clear cache
- Check frontend display settings
- Review permissions

---

## Next Steps

- [Getting Started](01-getting-started.md)
- [Service Applications](02-service-applications.md)
- [Deals & Promotions](03-deals-promotions.md)
- [CMS & Content](04-cms-content.md)
- [Communication & Forms](05-communication-forms.md)
- [Advanced Settings](06-advanced-settings.md)
- [FAQ](07-faq.md)
