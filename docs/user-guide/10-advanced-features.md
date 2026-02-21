# Advanced Features

## Table of Contents
1. [Multi-Currency Management](#multi-currency-management)
2. [Multi-Language Support](#multi-language-support)
3. [Theme Management](#theme-management)
4. [AI-Powered Content Generation](#ai-powered-content-generation)
5. [SEO Management](#seo-management)
6. [Subscription Plans](#subscription-plans)
7. [Activity Log & Audit Trail](#activity-log--audit-trail)
8. [Settings Management](#settings-management)
9. [Media Folder Organization](#media-folder-organization)

---

## Multi-Currency Management

The multi-currency system allows you to accept payments and display prices in multiple currencies, making it easier to serve international customers.

### Accessing Currency Settings

Navigate to **Advanced → Currencies** in the admin panel to manage currencies.

### Managing Currencies

#### Adding a New Currency

1. Click **New Currency** button
2. Fill in the currency details:
   - **Code**: 3-letter ISO currency code (e.g., USD, EUR, GBP)
   - **Name**: Full name of the currency (e.g., US Dollar)
   - **Symbol**: Currency symbol (e.g., $, €, £)
   - **Symbol Position**: Choose whether symbol appears before or after the amount
   - **Decimal Separator**: Character used for decimal point (usually `.`)
   - **Thousands Separator**: Character used for thousands (usually `,`)
   - **Decimal Places**: Number of decimal places (typically 2)
   - **Exchange Rate**: Rate relative to base currency (USD is usually 1.00)
   - **Default Currency**: Toggle if this should be the default currency
   - **Active**: Toggle to enable/disable this currency
3. Click **Create**

#### Example Currency Setup

**USD (US Dollar) - Base Currency**
- Code: `USD`
- Symbol: `$`
- Exchange Rate: `1.00`
- Default: Yes
- Active: Yes

**GHS (Ghanaian Cedi)**
- Code: `GHS`
- Symbol: `₵`
- Exchange Rate: `12.50` (if 1 USD = 12.50 GHS)
- Default: No
- Active: Yes

**EUR (Euro)**
- Code: `EUR`
- Symbol: `€`
- Exchange Rate: `0.85` (if 1 USD = 0.85 EUR)
- Default: No
- Active: Yes

### Setting the Default Currency

**Option 1: When Creating/Editing**
- Toggle the **Default Currency** switch when editing a currency

**Option 2: From Currency List**
- Click the **Set as Default** button on any currency row
- The system automatically removes the default flag from other currencies
- The new default currency is automatically activated

### Updating Exchange Rates

Exchange rates should be updated regularly to reflect current market rates:

1. Navigate to **Advanced → Currencies**
2. Click **Edit** on the currency you want to update
3. Update the **Exchange Rate** field
4. Click **Save**

> **Best Practice**: Update exchange rates daily or weekly depending on your business needs. Consider using an automated exchange rate API for real-time rates.

### Bulk Actions

#### Activate Multiple Currencies
1. Select currencies using checkboxes
2. Click **Activate Selected** from bulk actions
3. Confirm the action

#### Deactivate Multiple Currencies
1. Select currencies using checkboxes
2. Click **Deactivate Selected** from bulk actions
3. Confirm the action

> **Note**: The default currency cannot be deactivated through bulk actions.

### How Currency Conversion Works

The system uses a base currency approach:

1. **Base Currency**: Usually USD with exchange rate of 1.00
2. **Conversion Formula**:
   - To convert FROM base currency: `amount × exchange_rate`
   - To convert TO base currency: `amount ÷ exchange_rate`
   - Between two currencies: Convert to base first, then to target currency

**Example:**
- Convert $100 USD to GHS (rate: 12.50): `100 × 12.50 = ₵1,250.00`
- Convert ₵1,250 GHS to EUR (GHS rate: 12.50, EUR rate: 0.85):
  - First to USD: `1,250 ÷ 12.50 = $100`
  - Then to EUR: `100 × 0.85 = €85.00`

### Price Display

When a user selects a currency:
- All prices are automatically converted
- The selected currency is stored in their session
- Prices display with the correct symbol and formatting

### Best Practices

1. **Keep USD as Base Currency**: This is the most common practice and makes rate management simpler
2. **Update Rates Regularly**: Outdated rates can cause pricing issues
3. **Test Conversions**: Verify that conversions are accurate before going live
4. **Consider Rounding**: Be aware that conversion rounding may cause slight price differences
5. **Limit Active Currencies**: Only activate currencies you actively support to avoid confusion

### Troubleshooting

**Issue**: Currency not showing on frontend
- **Solution**: Ensure the currency is marked as **Active**

**Issue**: Incorrect conversion amounts
- **Solution**: Verify the exchange rate is correct and up-to-date

**Issue**: Can't set currency as default
- **Solution**: Only one currency can be default at a time. The system automatically removes the default flag from others when you set a new one.

---

## Multi-Language Support

The multi-language system allows you to offer your website in multiple languages, improving accessibility for international visitors.

### Accessing Language Settings

Navigate to **Advanced → Languages** in the admin panel to manage languages.

### Managing Languages

#### Adding a New Language

1. Click **New Language** button
2. Fill in the language details:
   - **Code**: 2-letter ISO language code (e.g., en, fr, es)
   - **Name**: English name of the language (e.g., English, French)
   - **Native Name**: Name in the native language (e.g., English, Français)
   - **Flag Icon**: Emoji or icon representing the language (e.g., 🇬🇧, 🇫🇷)
   - **Right-to-Left**: Toggle for RTL languages like Arabic or Hebrew
   - **Active**: Toggle to enable/disable this language
   - **Default Language**: Toggle if this should be the default language
   - **Sort Order**: Display order (lower numbers appear first)
3. Click **Create**

#### Example Language Setup

**English (Default)**
- Code: `en`
- Name: `English`
- Native Name: `English`
- Flag Icon: `🇬🇧`
- RTL: No
- Default: Yes
- Active: Yes
- Sort Order: `0`

**French**
- Code: `fr`
- Name: `French`
- Native Name: `Français`
- Flag Icon: `🇫🇷`
- RTL: No
- Default: No
- Active: Yes
- Sort Order: `1`

**Arabic**
- Code: `ar`
- Name: `Arabic`
- Native Name: `العربية`
- Flag Icon: `🇸🇦`
- RTL: Yes (Important!)
- Default: No
- Active: Yes
- Sort Order: `4`

### Right-to-Left (RTL) Languages

For languages like Arabic, Hebrew, Urdu, and Persian:

1. **Enable RTL Toggle**: When creating/editing the language
2. The system will automatically:
   - Flip the layout direction
   - Adjust text alignment
   - Mirror UI elements

**Supported RTL Languages:**
- Arabic (ar)
- Hebrew (he)
- Persian/Farsi (fa)
- Urdu (ur)

### Managing Translations

The system provides two types of translations:

#### 1. UI String Translations (JSON Files)

For static text like buttons, labels, and system messages:

**Location**: `lang/{locale}.json`

**Example - English (lang/en.json)**:
```json
{
    "Welcome": "Welcome",
    "Login": "Login",
    "Logout": "Logout"
}
```

**Example - French (lang/fr.json)**:
```json
{
    "Welcome": "Bienvenue",
    "Login": "Connexion",
    "Logout": "Déconnexion"
}
```

#### 2. Content Translations (Database)

For dynamic content like posts, pages, products:

1. Create your content in the default language
2. Click the **Translations** tab on the content item
3. Add translations for each language
4. Select the language and enter the translated content

**Available for Translation:**
- Blog posts
- Pages
- Product names and descriptions
- Deal listings
- Categories and tags
- FAQ entries
- And more...

### Translation Workflow

#### For Administrators

1. **Create Content in Default Language**
   - Write the original content in your default language (usually English)

2. **Access Translation Interface**
   - Navigate to the content item (e.g., a blog post)
   - Look for the **Translations** relation manager or translation fields

3. **Add Translations**
   - Select the target language
   - Enter the translated content
   - Save the translation

4. **Review Translations**
   - Navigate to **Advanced → Translations** to see all translations
   - Filter by language or content type
   - Edit or delete translations as needed

#### Translation Status

The **Translations** column in language listing shows:
- How many content items have been translated into each language
- Helps you track translation progress

### Bulk Actions

#### Activate Multiple Languages
1. Select languages using checkboxes
2. Click **Activate Selected** from bulk actions
3. Confirm the action

#### Deactivate Multiple Languages
1. Select languages using checkboxes
2. Click **Deactivate Selected** from bulk actions
3. Confirm the action

> **Note**: The default language cannot be deactivated through bulk actions.

### Language Switching on Frontend

When properly implemented on your frontend:

1. Users see a language selector (usually in header/nav)
2. Clicking a language switches the entire site
3. Selected language is stored in session
4. Content displays in the chosen language (if translation exists)
5. Falls back to default language if translation is missing

### Best Practices

1. **Start with One Language**: Launch with your default language, add others gradually
2. **Complete Core Content First**: Translate essential pages before expanding
3. **Use Professional Translators**: Machine translation can miss context and nuance
4. **Test RTL Layouts**: If supporting RTL languages, test thoroughly for layout issues
5. **Maintain Translation Memory**: Keep a glossary of common terms for consistency
6. **Update Translations Together**: When updating content, update all language versions
7. **Consider SEO**: Each language version should have proper SEO metadata

### Translation Priority

Recommended translation order:

1. **Critical Pages**
   - Homepage
   - About Us
   - Contact
   - Legal pages (Privacy, Terms)

2. **Navigation & UI**
   - Menus
   - Buttons
   - Form labels
   - Error messages

3. **Products/Services**
   - Service descriptions
   - Deals
   - Product catalogs

4. **Marketing Content**
   - Blog posts
   - Testimonials
   - FAQs

### Troubleshooting

**Issue**: Language not showing on frontend
- **Solution**: Ensure the language is marked as **Active**

**Issue**: Content showing in wrong language
- **Solution**: Check if translation exists for that content. System falls back to default language if translation is missing.

**Issue**: RTL layout broken
- **Solution**: Ensure CSS supports RTL. Check that `is_rtl` toggle is enabled for the language.

**Issue**: Flag icons not displaying
- **Solution**: Ensure your system supports emoji rendering, or use icon classes instead

### Working with Translators

If you're hiring translators:

1. **Export Content**: Provide translators with the content to translate
2. **Provide Context**: Include screenshots and descriptions of where text appears
3. **Set Character Limits**: Inform translators of space constraints (e.g., button labels)
4. **Review Before Publishing**: Always review translations before making them live
5. **Test with Native Speakers**: Have native speakers verify translations

### Language Analytics

Monitor language performance:
- Track which languages visitors use most
- Identify missing translations
- Measure engagement per language
- Use data to prioritize translation efforts

---

## Theme Management

The theme management system allows you to control the visual appearance and branding of your website.

### Accessing Theme Settings

Navigate to **Advanced → Themes** in the admin panel to manage themes.

### Managing Themes

#### Creating a New Theme

1. Click **New Theme** button
2. Fill in the theme details:
   - **Name**: Descriptive name for the theme (e.g., "Summer 2026", "Corporate Blue")
   - **Slug**: URL-friendly identifier (auto-generated from name)
   - **Description**: Brief description of the theme's style and purpose
   - **Is Active**: Toggle to activate this theme (only one theme can be active at a time)
   - **Color Scheme**: JSON object defining primary colors
   - **Font Settings**: JSON object defining typography settings
   - **Layout Options**: JSON object for layout configurations
3. Upload a preview image to show how the theme looks
4. Click **Create**

#### Theme Settings Structure

**Color Scheme Example:**
```json
{
  "primary": "#FF5A5A",
  "secondary": "#3B82F6",
  "accent": "#10B981",
  "background": "#FFFFFF",
  "text": "#1F2937",
  "muted": "#6B7280"
}
```

**Font Settings Example:**
```json
{
  "heading": "Inter",
  "body": "Inter",
  "size_base": "16px",
  "scale": "1.25"
}
```

**Layout Options Example:**
```json
{
  "container_width": "1280px",
  "sidebar_position": "right",
  "header_style": "sticky"
}
```

### Activating a Theme

**Method 1: From Theme List**
1. Navigate to **Advanced → Themes**
2. Click the **Activate** action on the theme
3. Confirm the activation
4. The previously active theme is automatically deactivated

**Method 2: When Editing**
1. Edit the theme you want to activate
2. Toggle **Is Active** to ON
3. Click **Save changes**

> **Note**: Only one theme can be active at a time. The system automatically deactivates other themes when you activate a new one.

### Editing Theme Settings

1. Navigate to **Advanced → Themes**
2. Click **Edit** on the theme
3. Modify the settings:
   - Update colors in the Color Scheme JSON
   - Adjust fonts in Font Settings
   - Change layout options
   - Upload a new preview image
4. Click **Save changes**

### Testing Theme Changes

Before activating a theme system-wide:

1. Create a duplicate of your current theme
2. Make experimental changes to the duplicate
3. Preview the changes (if preview functionality is available)
4. Activate when satisfied with the results

### Theme Activity Log

All theme changes are tracked:
- Theme creation
- Theme activation/deactivation
- Settings modifications
- Deletion events

View the activity log by navigating to **Advanced → Activity Log** and filtering by "Theme".

### Best Practices

1. **Keep a Backup Theme**: Always maintain at least one working theme
2. **Test Before Deploying**: Make changes in a staging environment first
3. **Document Custom Settings**: Keep notes about custom color codes and settings
4. **Use Descriptive Names**: Name themes based on season, purpose, or style (e.g., "Holiday Special", "Corporate")
5. **Version Control**: Consider numbering themes (v1, v2) when making major changes

### Troubleshooting

**Issue**: Theme changes not appearing on website
- **Solution**: Clear your browser cache and application cache (`php artisan optimize:clear`)

**Issue**: Invalid JSON in settings
- **Solution**: Validate your JSON using an online JSON validator before saving

**Issue**: Theme preview image not displaying
- **Solution**: Ensure the image is in a supported format (JPG, PNG) and under 2MB

---

## AI-Powered Content Generation

The OpenAI integration provides AI-powered content generation capabilities to help create high-quality content quickly.

### Available Features

#### 1. Content Generation

Use AI to generate content for:
- Blog post drafts
- Product descriptions
- Page content
- Email templates
- Meta descriptions
- Social media posts

#### 2. Content Enhancement

Improve existing content by:
- Rewriting for clarity
- Adjusting tone (professional, casual, friendly)
- Expanding short content
- Summarizing long content
- Fixing grammar and spelling

#### 3. Translation Assistance

Get quick translation suggestions for:
- Content in multiple languages
- Meta tags and descriptions
- Product names and descriptions

#### 4. SEO Optimization

Generate SEO-friendly content:
- Meta titles and descriptions
- Keyword-optimized content
- Schema.org structured data
- Open Graph descriptions

### Using AI Content Generation

> **Note**: AI content generation features are integrated into various resources in the admin panel. Look for "Generate with AI" or similar buttons.

#### Generating Blog Post Content

1. Navigate to **CMS → Posts**
2. Create or edit a post
3. In the content editor, look for the **AI Assist** button
4. Click and choose your desired action:
   - **Generate Draft**: Create a full post from a title
   - **Expand Section**: Elaborate on selected text
   - **Rewrite**: Improve selected content
   - **Summarize**: Create a summary
5. Review the generated content
6. Edit as needed before publishing

#### Generating SEO Meta Tags

1. When editing content (posts, pages, products)
2. Scroll to the SEO section
3. Click **Generate Meta Tags with AI**
4. AI analyzes your content and suggests:
   - Meta title
   - Meta description
   - Keywords
5. Review and adjust as needed
6. Save the content

#### Generating Product Descriptions

1. Navigate to **E-commerce → Products**
2. Create or edit a product
3. Fill in the basic product name
4. Click **Generate Description with AI**
5. Select description style:
   - Short (50-100 words)
   - Medium (100-200 words)
   - Long (200-300 words)
6. Choose tone:
   - Professional
   - Casual
   - Enthusiastic
   - Informative
7. Review and customize the generated description

### AI Generation Settings

Configure AI behavior in **System → Settings → AI Integration**:

- **API Key**: Your OpenAI API key (required)
- **Model**: Choose the AI model (e.g., gpt-4, gpt-3.5-turbo)
- **Temperature**: Control creativity (0.0-1.0, higher = more creative)
- **Max Tokens**: Maximum length of generated content
- **Default Tone**: Default writing tone for generations

### Best Practices

1. **Always Review Output**: AI-generated content should be reviewed and edited before publishing
2. **Provide Context**: Give clear, specific prompts for better results
3. **Combine with Human Creativity**: Use AI as a starting point, not a replacement
4. **Check Facts**: Verify factual information in AI-generated content
5. **Maintain Brand Voice**: Edit AI content to match your brand's tone and style
6. **Monitor API Usage**: AI calls consume API credits; monitor usage to control costs

### Cost Management

AI content generation uses OpenAI's API which has associated costs:

1. **Monitor Usage**: Check **System → Activity Log** for AI generation events
2. **Set Limits**: Configure maximum tokens per request
3. **Use Selectively**: Reserve AI for important content pieces
4. **Choose Appropriate Model**: Simpler models cost less but may produce lower quality

### Troubleshooting

**Issue**: AI generation not working
- **Solution**: Verify your OpenAI API key is correctly configured in **Settings**

**Issue**: Generated content is off-topic
- **Solution**: Provide more specific prompts and context

**Issue**: API errors or timeouts
- **Solution**: Check your OpenAI account has available credits and API access

**Issue**: Generated content too short/long
- **Solution**: Adjust the max tokens setting or specify length in your prompt

### Supported Languages

AI generation supports content in multiple languages including:
- English
- French
- Spanish
- German
- Arabic
- And many more

Specify the desired language in your prompt for best results.

---

## SEO Management

The SEO management system helps optimize your content for search engines, improving visibility and ranking.

### Accessing SEO Features

SEO tools are integrated throughout the admin panel:
- **Individual Content**: SEO tabs on posts, pages, products
- **Seo Management**: **Advanced → SEO** for site-wide settings

### SEO for Content Items

#### Adding SEO Metadata

When creating/editing content (posts, pages, products, deals):

1. Navigate to the **SEO** tab or section
2. Fill in SEO fields:
   - **Meta Title**: 50-60 characters, include primary keyword
   - **Meta Description**: 150-160 characters, compelling summary
   - **Focus Keyword**: Primary target keyword
   - **Canonical URL**: Preferred URL if duplicates exist
   - **Robots Meta**: Index/noindex, follow/nofollow directives

3. Add **Open Graph** metadata (for social sharing):
   - OG Title
   - OG Description
   - OG Image (recommended: 1200x630px)
   - OG Type (article, website, product, etc.)

4. Add **Twitter Card** metadata:
   - Twitter Title
   - Twitter Description
   - Twitter Image
   - Card Type (summary, summary_large_image)

#### Using the SEO Assistant

The SEO assistant analyzes your content:

1. Write or paste your content
2. Click **Analyze SEO** in the SEO section
3. Review the analysis:
   - ✅ **Green**: Good
   - ⚠️ **Yellow**: Needs improvement
   - ❌ **Red**: Issues found

4. Address flagged issues:
   - Title length
   - Description length
   - Keyword density
   - Headings structure
   - Internal/external links
   - Image alt text
   - Content length

#### Schema.org Structured Data

Add rich snippet markup:

1. In the SEO section, find **Schema.org** settings
2. Select schema type:
   - Article
   - Product
   - Organization
   - LocalBusiness
   - Event
   - FAQ
3. Fill in required fields for the chosen schema
4. The system generates JSON-LD markup automatically

**Example Schema Types:**

**Article Schema:**
- Headline
- Author
- Date Published
- Date Modified
- Featured Image

**Product Schema:**
- Name
- Description
- Price
- Currency
- Availability
- Brand
- Ratings

**LocalBusiness Schema:**
- Business Name
- Address
- Phone
- Opening Hours
- Geo Coordinates

### Site-Wide SEO Settings

Navigate to **System → Settings → SEO** for global settings:

#### General SEO

- **Default Meta Title**: Fallback title for pages without one
- **Default Meta Description**: Fallback description
- **Site Name**: Your website name
- **Separator**: Character between title and site name (e.g., "|", "-", "•")

#### Social Media Defaults

- **Default OG Image**: Image used when content doesn't have one
- **Twitter Handle**: Your Twitter username
- **Facebook App ID**: For Facebook Insights

#### Robots & Crawling

- **robots.txt**: Edit your robots.txt file
- **Sitemap URL**: Auto-generated sitemap location
- **Crawl Delay**: Delay for search engine crawlers (if needed)

### Automatic Sitemap Generation

The system automatically generates and updates XML sitemaps:

**Sitemap Location**: `https://yoursite.com/sitemap.xml`

**Included in Sitemap:**
- All published posts
- All published pages
- All published products
- All active deals
- Other public content

**Sitemap Features:**
- Automatic updates when content changes
- Priority settings based on content type
- Last modified dates
- Multi-language support (separate sitemaps per language)

#### Submitting Sitemap to Search Engines

After launch:

1. **Google Search Console**:
   - Go to Sitemaps section
   - Enter your sitemap URL: `https://yoursite.com/sitemap.xml`
   - Click Submit

2. **Bing Webmaster Tools**:
   - Navigate to Sitemaps
   - Submit your sitemap URL

### SEO Best Practices

#### Content Optimization

1. **Title Tags**
   - Include primary keyword
   - Keep under 60 characters
   - Make it compelling (users click titles)
   - Unique for each page

2. **Meta Descriptions**
   - 150-160 characters
   - Include a call-to-action
   - Summarize page content
   - Include target keyword naturally

3. **Headings**
   - One H1 per page (usually the title)
   - Use H2 for main sections
   - Use H3-H6 for subsections
   - Include keywords in headings

4. **Content Quality**
   - Minimum 300 words (longer is often better)
   - Original, valuable content
   - Natural keyword usage (no stuffing)
   - Regular updates

5. **Images**
   - Descriptive file names
   - Alt text for all images
   - Proper size/compression
   - Relevant to content

6. **Links**
   - Internal links to related content
   - Quality external links
   - Descriptive anchor text
   - Fix broken links

#### Technical SEO

1. **URL Structure**
   - Short, descriptive URLs
   - Include keywords
   - Use hyphens (not underscores)
   - Lowercase letters

2. **Page Speed**
   - Optimize images
   - Enable caching
   - Minimize CSS/JS
   - Use CDN

3. **Mobile-Friendly**
   - Responsive design
   - Readable font sizes
   - Touch-friendly buttons
   - No horizontal scrolling

4. **HTTPS**
   - Ensure SSL certificate is installed
   - All pages served over HTTPS
   - Update canonical URLs to HTTPS

### Monitoring SEO Performance

Track your SEO success:

1. **Google Analytics**
   - Monitor organic traffic
   - Track keyword rankings
   - Analyze user behavior
   - Measure bounce rate

2. **Google Search Console**
   - Monitor search appearance
   - Check indexing status
   - Review search queries
   - Fix crawl errors

3. **Rank Tracking**
   - Track keyword positions
   - Monitor competitors
   - Identify opportunities
   - Measure progress

### Common SEO Issues & Solutions

**Issue**: Content not appearing in search results
- **Solutions**:
  - Verify page is published and public
  - Check robots meta isn't set to "noindex"
  - Submit sitemap to search engines
  - Allow time for indexing (can take days/weeks)

**Issue**: Low click-through rate
- **Solutions**:
  - Improve meta titles and descriptions
  - Make them more compelling
  - Include numbers or questions
  - Add call-to-action phrases

**Issue**: High bounce rate
- **Solutions**:
  - Improve page load speed
  - Make content more engaging
  - Enhance mobile experience
  - Add internal links

**Issue**: Duplicate content
- **Solutions**:
  - Set canonical URLs
  - Use 301 redirects for duplicates
  - Ensure unique meta descriptions
  - Consolidate similar pages

### SEO Checklist

Before publishing new content:

- [ ] Meta title optimized (50-60 characters)
- [ ] Meta description written (150-160 characters)
- [ ] Focus keyword selected and used naturally
- [ ] H1 heading includes keyword
- [ ] Images have alt text
- [ ] Internal links added
- [ ] Mobile-friendly layout
- [ ] URL is descriptive and clean
- [ ] Schema.org markup added (if applicable)
- [ ] Open Graph tags configured
- [ ] Twitter Card metadata added
- [ ] Content is original and valuable
- [ ] Proper headings structure (H1-H6)
- [ ] No broken links

---

## Subscription Plans

The subscription management system allows you to offer premium memberships, recurring billing, and tiered service plans.

### Accessing Subscription Management

Navigate to **Advanced → Subscription Plans** to manage your subscription offerings.

### Creating Subscription Plans

#### Adding a New Plan

1. Click **New Subscription Plan**
2. Fill in the plan details:

**Basic Information:**
- **Name**: Plan name (e.g., "Starter", "Professional", "Enterprise")
- **Slug**: URL-friendly identifier (auto-generated)
- **Description**: Detailed description of what the plan includes
- **Price**: Monthly or annual price
- **Currency**: Select currency (default: GHS)
- **Billing Cycle**: Choose from:
  - Daily
  - Weekly
  - Monthly (most common)
  - Quarterly
  - Yearly

**Features & Limits:**
- **Trial Days**: Number of free trial days (e.g., 14, 30)
- **Features**: List of features included (JSON array)
- **Max Users**: Maximum number of users (leave empty for unlimited)
- **Max Projects**: Maximum number of projects (leave empty for unlimited)
- **Max Storage**: Storage limit in bytes (leave empty for unlimited)

**Display Settings:**
- **Is Active**: Enable/disable the plan
- **Is Featured**: Highlight as popular or recommended
- **Sort Order**: Display order (lower numbers appear first)

3. Click **Create**

#### Example Subscription Plans

**Free Plan**
```
Name: Free
Price: 0.00 GHS
Billing Cycle: Monthly
Trial Days: 0
Features:
  - 1 User
  - 5 Projects
  - 1GB Storage
  - Basic Support
Max Users: 1
Max Projects: 5
Max Storage: 1073741824 (1GB in bytes)
Is Featured: false
```

**Professional Plan (Featured)**
```
Name: Professional
Price: 150.00 GHS
Billing Cycle: Monthly
Trial Days: 14
Features:
  - 15 Users
  - 100 Projects
  - 50GB Storage
  - Priority Support
  - Advanced Analytics
  - Custom Branding
  - API Access
Max Users: 15
Max Projects: 100
Max Storage: 53687091200 (50GB in bytes)
Is Featured: true
```

**Enterprise Plan**
```
Name: Enterprise
Price: 500.00 GHS
Billing Cycle: Monthly
Trial Days: 30
Features:
  - Unlimited Users
  - Unlimited Projects
  - 500GB Storage
  - 24/7 Premium Support
  - Advanced Analytics
  - Custom Branding
  - API Access
  - Dedicated Account Manager
  - SLA Guarantee
Max Users: null (unlimited)
Max Projects: null (unlimited)
Max Storage: 536870912000 (500GB in bytes)
Is Featured: false
```

### Managing Features

Features are stored as a JSON array. Each feature is a string describing what's included:

```json
[
  "Unlimited Users",
  "100 Projects",
  "50GB Storage",
  "Priority Support",
  "Advanced Analytics",
  "Custom Branding",
  "API Access",
  "Email Templates"
]
```

### Pricing Strategy

#### Price Display Per Month

The system automatically calculates monthly equivalent pricing:

- **Daily**: `price × 30`
- **Weekly**: `price × 4`
- **Monthly**: `price`
- **Quarterly**: `price ÷ 3`
- **Yearly**: `price ÷ 12`

This helps customers compare plans on a monthly basis.

#### Storage Formatting

Storage limits are stored in bytes but display in human-readable format:

- 1 GB = 1,073,741,824 bytes
- 50 GB = 53,687,091,200 bytes
- 500 GB = 536,870,912,000 bytes
- 1 TB = 1,099,511,627,776 bytes

The system automatically converts to GB/TB for display.

### Managing Active Subscriptions

View and manage customer subscriptions:

1. Navigate to **Advanced → Subscriptions**
2. See all active, cancelled, and expired subscriptions
3. Filter by:
   - Status (active, cancelled, expired, trial)
   - Subscription plan
   - User
   - Date range

#### Subscription Actions

**Cancel Subscription:**
1. Find the subscription
2. Click **Cancel** action
3. Confirm cancellation
4. Subscription remains active until period end
5. Status changes to "cancelled"
6. Customer retains access until end date

**Resume Subscription:**
1. Find a cancelled subscription
2. Click **Resume** action
3. Subscription reactivates
4. Customer is billed on next cycle

**Extend Trial:**
1. Edit the subscription
2. Update **Trial Ends At** date
3. Save changes

**Change Plan:**
1. Edit the subscription
2. Select new **Subscription Plan**
3. Save changes
4. Prorated billing applies (if configured)

### Subscription Lifecycle

A subscription goes through several stages:

1. **Trial** (if applicable)
   - User has full access
   - No charges
   - Converts to active or expires

2. **Active**
   - User has full access
   - Recurring billing
   - Renews automatically

3. **Past Due**
   - Payment failed
   - Limited or no access
   - Retries after configured period

4. **Cancelled**
   - User cancelled
   - Access until period end
   - No renewal

5. **Expired**
   - Subscription ended
   - No access
   - Can resubscribe

### Best Practices

1. **Offer a Free Trial**: Reduces barrier to entry, increases conversions
2. **Create Tiered Plans**: Starter, Professional, Enterprise model works well
3. **Feature One Plan**: Mark your most popular or best-value plan as "Featured"
4. **Clear Feature Lists**: Be specific about what's included in each plan
5. **Annual Billing Discount**: Offer 2 months free for annual subscriptions
6. **Grace Periods**: Give customers time when payments fail
7. **Easy Upgrades**: Make it simple to move between plans
8. **Transparent Pricing**: Show all costs upfront, no hidden fees

### Payment Integration

Subscriptions work with the payment gateway system:

1. **Supported Gateways**:
   - Stripe (recommended for subscriptions)
   - PayPal
   - Paystack
   - Flutterwave

2. **Recurring Billing**:
   - Automatic charges
   - Payment retry on failures
   - Webhook notifications

3. **Invoice Generation**:
   - Automatic invoice creation
   - Email delivery
   - Download PDFs

### Subscription Analytics

Track key metrics:

1. **Monthly Recurring Revenue (MRR)**
   - Total monthly subscription income
   - Growth over time

2. **Churn Rate**
   - Percentage of cancelled subscriptions
   - Identify patterns

3. **Average Revenue Per User (ARPU)**
   - Total revenue ÷ active subscribers

4. **Lifetime Value (LTV)**
   - Average customer subscription duration × monthly value

### Troubleshooting

**Issue**: Subscription not renewing
- **Solutions**:
  - Check payment gateway webhooks are configured
  - Verify customer payment method is valid
  - Review failed payment logs

**Issue**: Trial not converting to paid
- **Solutions**:
  - Ensure payment method is collected during trial
  - Send reminders before trial ends
  - Review trial-to-paid conversion funnel

**Issue**: Customers confused about features
- **Solutions**:
  - Clarify feature descriptions
  - Add tooltips or help text
  - Create a comparison table
  - Offer live chat support

**Issue**: High cancellation rate
- **Solutions**:
  - Survey customers before they cancel
  - Offer plan downgrades instead
  - Improve onboarding experience
  - Add more value or features

---

## Activity Log & Audit Trail

The activity log system tracks all important actions in your system, providing a complete audit trail for security, compliance, and debugging.

### Accessing Activity Logs

Navigate to **Advanced → Activity Log** to view all system activities.

### What Gets Logged

The system automatically logs:

**User Actions:**
- Login/logout events
- Profile updates
- Password changes
- Role assignments

**Content Management:**
- Post/page creation, updates, deletion
- Product management
- Deal management
- Media uploads

**Configuration Changes:**
- Settings modifications
- Currency changes
- Language additions
- Theme activations
- Subscription plan updates

**Financial Activities:**
- Payment processing
- Refund requests
- Order status changes
- Subscription modifications

**System Events:**
- Failed login attempts
- API requests
- Email delivery
- Cron job execution

### Understanding Activity Entries

Each activity log entry contains:

- **Description**: Action performed (created, updated, deleted)
- **Subject**: What was affected (model type and ID)
- **Causer**: Who performed the action (user)
- **Properties**: Detailed changes (old values → new values)
- **Timestamp**: When it occurred
- **IP Address**: Where it came from (if applicable)

### Viewing Activity Details

1. Navigate to **Advanced → Activity Log**
2. Click on any activity entry to see full details
3. View **Properties** to see:
   - **Old Values**: Data before the change
   - **New Values**: Data after the change
   - **Attributes**: Additional context

**Example Property Changes:**
```json
{
  "old": {
    "name": "Summer Deal 2025",
    "price": "500.00",
    "status": "draft"
  },
  "new": {
    "name": "Summer Deal 2026",
    "price": "450.00",
    "status": "published"
  }
}
```

### Filtering Activities

Use filters to find specific activities:

**By Subject Type:**
- Users
- Posts
- Products
- Payments
- Subscriptions
- Themes
- Currencies
- Languages
- Settings

**By Event:**
- Created
- Updated
- Deleted
- Other custom events

**By Causer (User):**
- Filter by specific admin or staff member

**By Date:**
- Today
- Last 7 days
- Last 30 days
- Custom date range

**By Description:**
- Search for specific actions or keywords

### Searching Activities

Use the search bar to find activities containing specific text:
- Model names
- User names
- Action descriptions
- Property values

### Common Use Cases

#### 1. Security Auditing

**Scenario**: Investigate suspicious activity
- Filter by user to see all their actions
- Look for unusual patterns (e.g., bulk deletions, off-hours access)
- Check IP addresses for unauthorized access

#### 2. Compliance Tracking

**Scenario**: Demonstrate who changed what and when
- Export activity logs for specific date ranges
- Show audit trail for financial transactions
- Prove data modification history

#### 3. Debugging

**Scenario**: Track down when something changed
- Search for the affected resource
- Review all modifications
- Identify who made the problematic change

#### 4. Performance Review

**Scenario**: Track staff productivity
- Filter by causer (staff member)
- Review their activities
- Analyze contribution patterns

#### 5. Data Recovery

**Scenario**: Restore accidentally deleted content
- Find deletion event
- View "old" properties to see previous values
- Recreate the deleted content

### Activity Log Settings

Configure logging behavior in **System → Settings → Activity Log**:

- **Log Retention**: How long to keep logs (30, 60, 90 days, forever)
- **Sensitive Fields**: Fields to exclude from logging (e.g., passwords)
- **IP Logging**: Enable/disable IP address logging
- **User Agent Logging**: Log browser/device information

### Best Practices

1. **Regular Reviews**: Check activity logs periodically for anomalies
2. **Archive Old Logs**: Export and archive logs older than 90 days
3. **Monitor Failed Logins**: Set up alerts for repeated failed login attempts
4. **Secure Access**: Restrict activity log access to senior administrators
5. **Use for Training**: Review logs to identify areas where staff need additional training

### Export Activities

Export activity logs for backup or analysis:

1. Apply desired filters
2. Click **Export** button
3. Choose format:
   - Excel (.xlsx)
   - CSV (.csv)
4. Download the file

Exported logs include all visible columns and filtered data.

### Privacy Considerations

Activity logs may contain personal information:

1. **GDPR Compliance**: Include activity logs in data export requests
2. **Right to be Forgotten**: Delete user activities when user accounts are deleted
3. **Access Control**: Only authorized staff should view logs
4. **Data Retention**: Don't keep logs longer than necessary

### Troubleshooting

**Issue**: Activities not being logged
- **Solution**: Ensure activity log package is properly configured. Check that models include the `LogsActivity` trait.

**Issue**: Too many log entries, performance slow
- **Solution**: Configure log retention to automatically delete old entries. Archive logs periodically.

**Issue**: Can't find specific activity
- **Solution**: Use multiple filters simultaneously. Try broader search terms. Check date range includes the event.

**Issue**: Properties showing "null"
- **Solution**: For newly created items, "old" properties are null. For deleted items, "new" properties are null. This is expected behavior.

---

## Settings Management

The settings management system centralizes all application configuration in one convenient location.

### Accessing Settings

Navigate to **System → Settings** in the admin panel (requires admin privileges).

### Settings Categories

Settings are organized into logical groups:

#### 1. General Settings

**Site Information:**
- **Site Name**: Your website name (shown in browser tabs, emails)
- **Site Tagline**: Brief description of your site
- **Site URL**: Your website's primary URL
- **Admin Email**: Primary contact email for admin notifications
- **Default Time Zone**: Timezone for timestamps (e.g., Africa/Accra)
- **Date Format**: How dates are displayed (e.g., Y-m-d, d/m/Y)
- **Time Format**: 12-hour or 24-hour format

**Branding:**
- **Logo**: Main website logo (recommended: PNG, 200x60px)
- **Favicon**: Browser tab icon (recommended: ICO or PNG, 32x32px)
- **Default Share Image**: Image for social sharing (1200x630px)

#### 2. Contact Information

- **Organization Name**: Legal business name
- **Address Line 1 & 2**: Physical address
- **City**: Business city
- **State/Region**: State or region
- **Postal Code**: ZIP or postal code
- **Country**: Country of operation
- **Phone**: Primary contact phone
- **WhatsApp**: WhatsApp business number (include country code)
- **Email**: Public contact email

**Social Media Links:**
- Facebook Page URL
- Twitter/X Handle
- Instagram Handle
- LinkedIn Profile
- YouTube Channel

#### 3. Mail Settings

**SMTP Configuration:**
- **Mail Driver**: smtp, mailgun, ses, postmark
- **SMTP Host**: Mail server address
- **SMTP Port**: Usually 587 (TLS) or 465 (SSL)
- **SMTP Username**: Your email account
- **SMTP Password**: Your email password (encrypted)
- **Encryption**: TLS or SSL
- **From Address**: Email address emails are sent from
- **From Name**: Name shown as sender

**Test Email:**
- Send test email to verify configuration

#### 4. Payment Gateway Settings

Configure multiple payment gateways:

**Hubtel:**
- Merchant ID
- Client ID
- Client Secret
- Webhook URL

**Paystack:**
- Public Key
- Secret Key
- Webhook URL

**Flutterwave:**
- Public Key
- Secret Key
- Webhook URL

**Stripe:**
- Publishable Key
- Secret Key
- Webhook Secret

**Settings:**
- Enable/disable each gateway
- Set default gateway
- Currency per gateway

#### 5. SEO Settings

**Default Meta Tags:**
- Default Meta Title
- Default Meta Description
- Meta Keywords
- Author Tag

**Webmaster Tools:**
- Google Site Verification Code
- Bing Site Verification Code

**Social Media:**
- Default OG Image
- Twitter Handle
- Facebook App ID

#### 6. Analytics & Tracking

**Google Analytics:**
- Measurement ID (G-XXXXXXXXXX)
- Enable/Disable tracking

**Facebook Pixel:**
- Pixel ID
- Enable/Disable tracking

**Google Tag Manager:**
- Container ID (GTM-XXXXXX)

**Other Integrations:**
- Hotjar Site ID
- Microsoft Clarity Project ID

#### 7. Security Settings

**Authentication:**
- Require Email Verification
- Enable Two-Factor Authentication
- Session Lifetime (minutes)
- Password Minimum Length
- Require Special Characters in Passwords

**API Security:**
- Enable API Access
- Rate Limiting (requests per minute)
- Require API Authentication

**CAPTCHA:**
- Enable reCAPTCHA
- reCAPTCHA Site Key
- reCAPTCHA Secret Key
- reCAPTCHA Version (v2 or v3)

#### 8. Advanced Settings

**Maintenance Mode:**
- Enable Maintenance Mode
- Maintenance Message
- Allowed IPs (access during maintenance)

**Cache:**
- Cache Driver (file, redis, memcached)
- Cache Duration (minutes)
- Clear Cache button

**Queue:**
- Queue Driver (sync, database, redis)
- Queue Connection

**Logging:**
- Log Channel (stack, single, daily)
- Log Level (debug, info, warning, error)

**AI Integration:**
- OpenAI API Key
- AI Model (gpt-4, gpt-3.5-turbo)
- Temperature (0.0-1.0)
- Max Tokens per Request

#### 9. Feature Toggles

Enable or disable features:
- E-commerce
- Blog
- Subscriptions
- Multi-Currency
- Multi-Language
- Support Tickets
- Newsletter
- Social Login
- Product Reviews
- Wishlists

#### 10. Localization

**Default Settings:**
- Default Language
- Default Currency
- Available Languages
- Available Currencies

**Format Settings:**
- Number Format (1,000.00 vs 1.000,00)
- First Day of Week (Sunday or Monday)

### Updating Settings

1. Navigate to **System → Settings**
2. Click on the settings category tab
3. Update the desired fields
4. Click **Save Settings** at the bottom
5. Changes take effect immediately (some may require cache clear)

### Settings with Validation

Some settings have validation rules:

- **Email addresses**: Must be valid email format
- **URLs**: Must be valid URLs with http:// or https://
- **API keys**: Validated against service when possible
- **Phone numbers**: Format validation
- **Ports**: Must be valid port numbers (1-65535)

### Sensitive Settings

Certain settings are encrypted in the database:

- API keys and secrets
- Payment gateway credentials
- SMTP passwords
- OAuth client secrets

They're automatically encrypted on save and decrypted when retrieved.

### Testing Configuration

After updating settings, test them:

**Mail Settings:**
1. Update SMTP configuration
2. Click **Send Test Email**
3. Check inbox for test message

**Payment Gateways:**
1. Update gateway credentials
2. Make a test payment
3. Verify webhook delivery

**Analytics:**
1. Update tracking codes
2. Visit website
3. Check real-time reports in analytics platform

### Settings Cache

For performance, settings are cached:

**Clear Cache:**
- Click **Clear Cache** button in Advanced Settings
- Or run: `php artisan optimize:clear`

**When to Clear Cache:**
- After updating settings
- If changes aren't appearing
- After deployment

### Backup Settings

Before making major changes:

1. **Export Settings**: Use export feature if available
2. **Take Note**: Screenshot or copy important values
3. **Test in Staging**: Try changes in test environment first

### Multi-Environment Settings

For different environments (dev, staging, production):

1. Use `.env` file for environment-specific values
2. Keep sensitive data in `.env`, not in database
3. Use different API keys per environment
4. Test payment gateways in sandbox mode before production

### Best Practices

1. **Regular Reviews**: Review settings quarterly
2. **Document Changes**: Keep notes about why settings were changed
3. **Limit Access**: Only senior admins should modify settings
4. **Test Thoroughly**: Always test after making changes
5. **Keep API Keys Secret**: Never share API keys or passwords
6. **Use Environment Variables**: For sensitive data, prefer `.env` over database
7. **Monitor Email Delivery**: Regularly check email sending is working
8. **Update Webhooks**: When URLs change, update all webhook configurations

### Recovery From Misconfiguration

If settings cause issues:

1. **Check Error Logs**: Navigate to **Advanced → Activity Log**
2. **Revert Changes**: Look at what changed and revert
3. **Reset to Defaults**: (if feature available)
4. **Clear Cache**: `php artisan optimize:clear`
5. **Check .env File**: Ensure environment variables are correct

### Settings Audit Trail

All settings changes are logged:
- Who made the change
- What was changed
- Old and new values
- When it occurred

View in **Advanced → Activity Log** filtered by "Setting".

---

## Media Folder Organization

The media folder system helps you organize uploaded files and images hierarchically, making it easy to manage large media libraries.

### Accessing Media Folders

Navigate to **Advanced → Media Folders** to manage your folder structure.

### Understanding Media Folders

Media folders work like folders on your computer:
- Create folders and subfolders
- Move media between folders
- Track folder contents
- Organize by project, category, or type

### Creating Folder Structure

#### Creating a Root Folder

1. Click **New Media Folder**
2. Fill in folder details:
   - **Name**: Descriptive folder name (e.g., "Blog Images", "Product Photos")
   - **Slug**: URL-friendly identifier (auto-generated from name)
   - **Parent Folder**: Leave empty for root-level folder
   - **Description**: Optional notes about folder contents
3. Click **Create**

#### Creating Subfolders

1. Click **New Media Folder**
2. Fill in folder details:
   - **Name**: Subfolder name (e.g., "2026", "Thumbnails")
   - **Slug**: Auto-generated
   - **Parent Folder**: Select the parent folder from dropdown
   - **Description**: Optional notes
3. Click **Create**

**Example Folder Hierarchy:**
```
Documents/
├── Contracts/
├── Invoices/
└── Reports/

Images/
├── Products/
├── Blog/
│   ├── 2025/
│   └── 2026/
├── Banners/
└── Avatars/

Videos/
├── Tutorials/
└── Promotional/

Audio/
```

### Folder Information Display

The media folder list shows:

**Folder Path:**
- Full hierarchical path (e.g., "Images / Blog / 2026")
- Shows folder's location in hierarchy

**File Count:**
- **Direct Files**: Files directly in this folder
- **Total Files**: Files in folder + all subfolders

**Subfolders:**
- Number of immediate child folders

**Depth Level:**
- How many levels deep the folder is
- Root folders are depth 0
- First-level subfolders are depth 1
- And so on...

### Managing Folders

#### Renaming Folders

1. Click **Edit** on the folder
2. Update the **Name** field
3. Slug updates automatically (or customize it)
4. Click **Save changes**

#### Moving Folders

1. Click **Edit** on the folder
2. Change the **Parent Folder** selection
3. Click **Save changes**
4. All subfolders and files move with it

#### Deleting Folders

Deletion rules:

**Folders with Subfolders:**
- Cannot be deleted
- Must delete or move subfolders first
- System prevents deletion to avoid orphans
- Error message explains which subfolders exist

**Folders with Media:**
- Can be deleted, but system warns you
- Warning shows how many files will be affected
- Files aren't deleted, just unlinked from folder
- Files return to "Ungrouped" state

**Empty Folders:**
- Can be deleted immediately
- No warning needed

**Steps to Delete:**
1. Click **Delete** action on folder
2. System checks for subfolders and media
3. Warnings appear if applicable
4. Confirm deletion if you want to proceed

### Assigning Media to Folders

When uploading or editing media:

1. Find the **Folder** field in the media upload/edit form
2. Select the appropriate folder from dropdown
3. Save the media item
4. Media appears in folder's file count

### Viewing Folder Contents

1. Click **View** on any folder
2. See folder details:
   - Name and path
   - Description
   - Parent folder (if any)
   - Creation date
   - Statistics (files, subfolders)
3. View related media files
4. View subfolders

### Folder Filters

Filter folders quickly:

**By Parent Folder:**
- See all subfolders of a specific folder

**Root Folders Only:**
- Show only top-level folders (no parent)

**Has Media:**
- Show folders containing media files

**Has Subfolders:**
- Show folders with child folders

**By Depth Level:**
- Show folders at specific hierarchy level

### Folder Recommendations

#### Folder Naming Best Practices

1. **Descriptive Names**: Use clear, meaningful names
   - Good: "Product Photos 2026"
   - Bad: "Folder1", "Misc"

2. **Consistent Naming**: Follow a naming convention
   - Date-based: "2026-Q1", "2026-Q2"
   - Category-based: "Electronics", "Apparel"
   - Project-based: "Summer-Campaign", "Rebranding"

3. **Avoid Special Characters**: Stick to letters, numbers, spaces, hyphens
   - Good: "Blog-Images-2026"
   - Bad: "Blog*Images@2026"

#### Folder Structure Strategies

**By Content Type:**
```
Images/
Videos/
Documents/
Audio/
```

**By Department:**
```
Marketing/
Sales/
Support/
HR/
```

**By Project:**
```
Summer-Campaign-2026/
├── Images/
├── Videos/
└── Documents/
```

**By Date:**
```
2026/
├── January/
├── February/
└── March/
```

**Hybrid Approach:**
```
Marketing/
├── Blog/
│   ├── 2025/
│   └── 2026/
├── Social-Media/
│   ├── Facebook/
│   └── Instagram/
└── Email-Campaigns/
```

### Folder Statistics & Insights

Each folder shows:

**Direct vs Total Counts:**
- **Direct**: Only files in this folder
- **Total**: Files in this folder + all subfolders

This helps identify:
- Where most files are stored
- Which folders need reorganization
- Storage usage by category

**Example:**
```
Images/ (0 direct, 1,243 total)
├── Products/ (789 direct, 789 total)
├── Blog/ (0 direct, 324 total)
│   ├── 2025/ (162 direct, 162 total)
│   └── 2026/ (162 direct, 162 total)
└── Avatars/ (130 direct, 130 total)
```

### Advanced Features

#### Folder Hierarchy Navigation

**Breadcrumb Path:**
- Shows full path from root to current folder
- Click any parent to navigate up

**Ancestor/Descendant Relationships:**
- System tracks folder relationships
- Prevents circular references (folder can't be its own parent)
- Maintains hierarchy integrity

**Depth Calculations:**
- Automatically calculated based on parent relationships
- Used for filtering and display
- Helps identify deeply nested structures

#### Folder Activity Tracking

All folder operations are logged:
- Folder creation
- Name/parent changes
- Folder deletion
- Media assignments

View folder history in **Advanced → Activity Log**, filtered by "MediaFolder".

### Best Practices

1. **Plan Structure First**: Design folder hierarchy before uploading files
2. **Don't Nest Too Deep**: Keep folders 3-4 levels maximum for usability
3. **Use Consistent Names**: Follow naming conventions across all folders
4. **Regular Cleanup**: Periodically review and reorganize
5. **Document System**: Keep notes about folder purposes
6. **Limit Root Folders**: Too many root folders becomes cluttered
7. **Bulk Organize**: When adding many files, create folders first
8. **Archive Old Content**: Create "Archive" folder for outdated files

### Common Use Cases

**Portfolio/Gallery Organization:**
```
Gallery/
├── Weddings/
├── Portraits/
├── Commercial/
└── Events/
```

**Product Catalog:**
```
Products/
├── Electronics/
│   ├── Phones/
│   └── Tablets/
└── Fashion/
    ├── Mens/
    └── Womens/
```

**Content Calendar:**
```
Content/
├── 2026/
│   ├── Q1/
│   │   ├── January/
│   │   ├── February/
│   │   └── March/
│   └── Q2/
```

### Troubleshooting

**Issue**: Can't delete folder
- **Solution**: Check if folder has subfolders. Delete or move subfolders first, then delete parent.

**Issue**: Folder disappeared from list
- **Solution**: Check if it was moved under another folder. Use filters to find it.

**Issue**: File count doesn't match expectations
- **Solution**: "Total" count includes subfolders. Check "Direct" count for files only in that folder.

**Issue**: Can't find folder in dropdown
- **Solution**: Folder might be nested too deep. Navigate to parent folder and create subfolder from there.

**Issue**: Folder hierarchy looks wrong
- **Solution**: Check parent folder assignments. Use "View" to see full path and verify structure.

### Maintenance Tasks

**Weekly:**
- Review newly uploaded files
- Assign any ungrouped files to folders

**Monthly:**
- Check for orphaned or misplaced files
- Archive old seasonal content
- Delete unnecessary empty folders

**Quarterly:**
- Audit entire folder structure
- Reorganize if needed
- Update folder descriptions

**Annually:**
- Archive previous year's folders
- Create new year-based folders
- Clean up unused media

---

## Need Help?

If you need assistance with any of these features:

- Check the [FAQ section](07-faq.md)
- Review the [Getting Started guide](01-getting-started.md)
- Contact our support team
- Visit our documentation website

---

**Last Updated**: February 2026
**LetsTravel Ghana Admin Panel** - Version 1.0
