# CMS & Content Management

## Overview

The Content Management System (CMS) allows you to create, manage, and publish various types of content on your LetsTravel Ghana website. This includes blog posts, pages, FAQs, testimonials, team profiles, and partner information.

---

## Posts & Blog Management

### Accessing Posts

Navigate to **CMS → Posts** to manage blog articles and news.

### Creating a New Post

1. Click "Create" button
2. Fill in the form:

   **Content Section:**
   - **Title**: Post headline (required)
   - **Slug**: URL-friendly version (auto-generated)
   - **Excerpt**: Brief summary for previews
   - **Body**: Full post content (Rich Text Editor)

   **SEO Section:**
   - **Meta Title**: SEO title (optional, defaults to title)
   - **Meta Description**: Search engine description
   - **Featured Image**: Upload main image

   **Status Sidebar:**
   - **Status**: Draft/Published/Scheduled
   - **Is Featured**: Highlight on homepage
   - **Published At**: Publication date/time
   - **Scheduled At**: Schedule for future publishing
   - **Author**: Select post author

   **Associations:**
   - **Categories**: Assign to categories (multiple)
   - **Tags**: Add relevant tags (multiple)

3. Click "Save" (Draft) or "Publish"

### Post Statuses

- **Draft**: Work in progress, not visible to public
- **Published**: Live on website
- **Scheduled**: Will publish automatically at set time

### Rich Text Editor Features

- **Text Formatting**: Bold, italic, underline
- **Headings**: H1, H2, H3, H4
- **Lists**: Bulleted and numbered
- **Links**: Internal and external
- **Images**: Inline images
- **Quotes**: Blockquotes
- **Code**: Code blocks
- **Tables**: Basic tables
- **Embeds**: YouTube, Twitter, etc.

### Managing Existing Posts

1. **View All Posts**: See list with filters
2. **Search**: Find posts by title or content
3. **Filter**:
   - By status (draft, published)
   - By category
   - By author
   - By featured status
   - By date range

4. **Bulk Actions**:
   - Publish multiple drafts
   - Feature/unfeature posts
   - Delete selected posts
   - Export to Excel

### Browser Testing - Posts

Test the following in your browser:

- [ ] Create new blog post with rich content
- [ ] Upload featured image
- [ ] Add multiple categories and tags
- [ ] Save as draft and preview
- [ ] Schedule post for future date
- [ ] Publish post immediately
- [ ] Feature post on homepage
- [ ] Edit existing post
- [ ] Filter posts by category
- [ ] Search posts by keyword
- [ ] Export posts to Excel
- [ ] Delete draft post
- [ ] View post revisions (if enabled)

---

## Pages Management

### Accessing Pages

Navigate to **CMS → Pages** to manage static pages.

### When to Use Pages vs Posts

- **Pages**: Static content (About Us, Contact, Services, Terms)
- **Posts**: Dynamic content (Blog, News, Updates)

### Creating a New Page

1. Click "Create"
2. Fill in the form:

   **Content Section:**
   - **Title**: Page title (required)
   - **Slug**: URL path (e.g., about-us)
   - **Content**: Page body (Rich Text Editor)
   - **Template**: Page layout (if multiple templates available)

   **SEO Section:**
   - **Meta Title**: SEO-optimized title
   - **Meta Description**: Page description for search engines
   - **Featured Image**: Social media share image

   **Settings Sidebar:**
   - **Status**: Draft/Published
   - **Parent Page**: Create page hierarchy
   - **Is Featured**: Show in special sections
   - **Sort Order**: Control page order
   - **Published At**: Publication date

3. Click "Save"

### Page Hierarchy

Create parent-child relationships:
- Parent: "Services"
  - Child: "Visa Services"
  - Child: "Passport Services"
  - Child: "Travel Insurance"

This creates URLs like:
- `/services`
- `/services/visa-services`
- `/services/passport-services`

### Browser Testing - Pages

- [ ] Create "About Us" page
- [ ] Create "Contact" page
- [ ] Create page with parent (hierarchy)
- [ ] Add rich content (images, videos)
- [ ] Set SEO meta tags
- [ ] Preview page before publishing
- [ ] Publish page
- [ ] Edit page content
- [ ] Reorder pages with sort order
- [ ] Delete draft page

---

## Categories Management

### Accessing Categories

Navigate to **CMS → Categories** to organize content.

### Creating Categories

1. Click "Create"
2. Fill in:
   - **Name**: Category name (e.g., "Travel Tips")
   - **Slug**: URL-friendly (e.g., "travel-tips")
   - **Description**: Brief description
   - **Parent Category**: Create hierarchical structure
   - **Sort Order**: Control display order

3. Click "Save"

### Category Hierarchy

Example structure:
- Travel Guides (Parent)
  - Africa (Child)
  - Europe (Child)
  - Asia (Child)
- Visa Information (Parent)
  - Tourist Visas (Child)
  - Business Visas (Child)

### Using Categories

- Assign categories to posts
- Filter posts by category
- Display category-specific content
- Create category pages

### Browser Testing - Categories

- [ ] Create top-level category
- [ ] Create sub-category with parent
- [ ] Edit category details
- [ ] Assign category to post
- [ ] Filter posts by category
- [ ] View category hierarchy
- [ ] Delete unused category

---

## Tags Management

### Accessing Tags

Navigate to **CMS → Tags** to create content tags.

### Creating Tags

1. Click "Create"
2. Fill in:
   - **Name**: Tag name (e.g., "Budget Travel")
   - **Slug**: URL-friendly
   - **Description**: Optional description

3. Click "Save"

### Tags vs Categories

- **Categories**: Broad grouping (e.g., "Travel Guides")
- **Tags**: Specific topics (e.g., "budget", "luxury", "family-friendly")

### Using Tags

- Add multiple tags to posts
- Create tag clouds
- Filter content by tags
- Generate tag-based recommendations

### Browser Testing - Tags

- [ ] Create multiple tags
- [ ] Assign tags to posts
- [ ] Search content by tag
- [ ] View all posts with specific tag
- [ ] Bulk edit tags
- [ ] Delete unused tags

---

## Menu Management

### Accessing Menus

Navigate to **CMS → Menus** to manage site navigation.

### Menu Locations

Common menu locations:
- **Header Menu**: Main site navigation
- **Footer Menu**: Footer links
- **Mobile Menu**: Responsive menu
- **Sidebar Menu**: Contextual navigation

### Creating a Menu

1. Click "Create"
2. Fill in:
   - **Name**: Menu identifier (e.g., "Main Navigation")
   - **Location**: Where menu appears
   - **Items**: Menu structure

3. **Add Menu Items**:
   - **Label**: Display text
   - **Link Type**: Internal page, external URL, custom
   - **URL/Page**: Link destination
   - **Parent Item**: Create submenus
   - **Sort Order**: Control item order
   - **Icon**: Optional menu icon
   - **Is Active**: Show/hide item

4. Click "Save"

### Menu Item Types

- **Page Link**: Link to internal page
- **Post Link**: Link to blog post
- **Category Link**: Link to category archive
- **Custom URL**: External or custom link
- **Dropdown**: Parent item with children

### Creating Dropdown Menus

1. Create parent menu item (e.g., "Services")
2. Create child items:
   - Set parent to "Services"
   - Adjust sort order
3. Save menu

Result:
```
Services ▼
  ├─ Visa Applications
  ├─ Passport Services
  └─ Travel Insurance
```

### Browser Testing - Menus

- [ ] Create header menu
- [ ] Add pages to menu
- [ ] Create dropdown menu with children
- [ ] Reorder menu items
- [ ] Add external links
- [ ] Toggle menu item visibility
- [ ] Preview menu on frontend
- [ ] Edit menu structure
- [ ] Delete menu item

---

## FAQ Management

### Accessing FAQs

Navigate to **CMS → FAQs** to manage frequently asked questions.

### Creating an FAQ

1. Click "Create"
2. Fill in the form:

   **FAQ Details:**
   - **Question**: Customer's question (required)
   - **Answer**: Detailed answer (Rich Text Editor)

   **Settings:**
   - **Category**: Assign to FAQ category (Visa, Passport, etc.)
   - **Sort Order**: Control display order
   - **Is Active**: Show/hide FAQ
   - **View Count**: Auto-tracked (read-only)

3. Click "Save"

### FAQ Categories

Organize FAQs by topic:
- Visa Questions
- Passport Services
- Payment & Billing
- Travel Insurance
- General Inquiries

### FAQ Features

- **Search**: Customers can search FAQs
- **Categories**: Filter by topic
- **View Tracking**: See which FAQs are most viewed
- **Rich Answers**: Include images, videos, links

### Best Practices for FAQs

1. **Clear Questions**: Use customer language
2. **Concise Answers**: Be brief but complete
3. **Add Examples**: Show, don't just tell
4. **Link to Resources**: Add relevant links
5. **Update Regularly**: Keep information current

### Browser Testing - FAQs

- [ ] Create FAQ with rich text answer
- [ ] Assign to category
- [ ] Set sort order
- [ ] Mark as active
- [ ] Search FAQs
- [ ] Filter by category
- [ ] View FAQ on frontend
- [ ] Track view count
- [ ] Edit existing FAQ
- [ ] Bulk activate/deactivate FAQs
- [ ] Export FAQs to Excel

---

## Testimonials Management

### Accessing Testimonials

Navigate to **CMS → Testimonials** to manage customer reviews.

### Creating a Testimonial

1. Click "Create"
2. Fill in the form:

   **Client Information:**
   - **Client Name**: Customer's full name (required)
   - **Client Position**: Job title (optional)
   - **Client Company**: Company name (optional)

   **Testimonial Content:**
   - **Content**: Testimonial text (required)

   **Media:**
   - **Avatar**: Upload client photo (optional)

   **Settings:**
   - **Rating**: 1-5 stars (required)
   - **Is Featured**: Show on homepage
   - **Is Active**: Enable/disable
   - **Sort Order**: Display order

3. Click "Save"

### Testimonial Features

- **Star Ratings**: Visual 1-5 star display
- **Client Photos**: Add credibility with avatars
- **Featured Testimonials**: Highlight best reviews
- **Sorting**: Control display order

### Using Testimonials

- Display on homepage
- Show on service pages
- Create testimonials slider
- Build social proof

### Browser Testing - Testimonials

- [ ] Create testimonial with all fields
- [ ] Upload client avatar
- [ ] Set 5-star rating
- [ ] Mark as featured
- [ ] View testimonial on frontend
- [ ] Filter by rating
- [ ] Filter by featured status
- [ ] Sort by date
- [ ] Bulk mark as featured
- [ ] Bulk activate/deactivate
- [ ] Export testimonials
- [ ] Delete testimonial

---

## Team Members Management

### Accessing Team Members

Navigate to **CMS → Team Members** to manage staff profiles.

### Creating a Team Member Profile

1. Click "Create"
2. Fill in the form:

   **Team Member Information:**
   - **Name**: Full name (required)
   - **Position**: Job title (required)
   - **Bio**: Staff biography (Rich Text Editor)

   **Contact & Social:**
   - **Email**: Work email
   - **Phone**: Contact number
   - **LinkedIn URL**: LinkedIn profile
   - **Twitter URL**: Twitter handle
   - **Facebook URL**: Facebook profile

   **Photo:**
   - **Photo**: Upload professional photo

   **Settings:**
   - **Is Active**: Show/hide profile
   - **Sort Order**: Team display order

3. Click "Save"

### Team Member Features

- **Professional Photos**: Display team images
- **Rich Bios**: Tell team member stories
- **Social Links**: Connect to social profiles
- **Contact Info**: Direct communication

### Using Team Member Profiles

- Create "Meet the Team" page
- Display on About page
- Show contact persons for services
- Build trust and transparency

### Browser Testing - Team Members

- [ ] Create team member profile
- [ ] Upload professional photo
- [ ] Add complete bio with formatting
- [ ] Add all social media links
- [ ] Set position and contact info
- [ ] Mark as active
- [ ] View profile on frontend
- [ ] Filter by active status
- [ ] Sort team members
- [ ] Edit existing profile
- [ ] Bulk activate/deactivate
- [ ] Export team members

---

## Partners Management

### Accessing Partners

Navigate to **CMS → Partners** to manage business partnerships.

### Creating a Partner Profile

1. Click "Create"
2. Fill in the form:

   **Partner Information:**
   - **Name**: Partner/company name (required)
   - **Website URL**: Partner website
   - **Description**: Partnership details

   **Logo:**
   - **Logo**: Upload partner logo

   **Settings:**
   - **Partnership Level**: Gold/Silver/Bronze
   - **Sort Order**: Display order
   - **Is Active**: Show/hide partner

3. Click "Save"

### Partnership Levels

- **Gold**: Premium partners (highest priority)
- **Silver**: Standard partners
- **Bronze**: Basic partners

Different levels can display with different:
- Logo sizes
- Placement on page
- Badge colors
- Benefits listed

### Using Partner Profiles

- Display logos on homepage
- Create partners page
- Show sponsor sections
- Build business credibility

### Browser Testing - Partners

- [ ] Create gold partner
- [ ] Create silver partner
- [ ] Create bronze partner
- [ ] Upload partner logos
- [ ] Add website URLs
- [ ] Write descriptions
- [ ] Set partnership levels
- [ ] View partners on frontend
- [ ] Filter by partnership level
- [ ] Sort partners by order
- [ ] Bulk activate/deactivate
- [ ] Export partners list

---

## Media Library Management

### Accessing Media Folders

Navigate to **CMS → Media Folders** to organize uploads.

### Creating Media Folders

1. Click "Create"
2. Enter:
   - **Folder Name**: Descriptive name
   - **Parent Folder**: Create hierarchy

3. Click "Save"

### Folder Organization

Example structure:
```
Media Library
├─ Blog Images
│  ├─ 2024
│  └─ 2025
├─ Team Photos
├─ Partner Logos
├─ Service Images
│  ├─ Visas
│  ├─ Passports
│  └─ Insurance
└─ Customer Documents
```

### Media Management Features

- **Upload**: Drag & drop or browse
- **Organize**: Move to folders
- **Preview**: View files
- **Edit**: Crop, resize images
- **Delete**: Remove files
- **Search**: Find media
- **Filter**: By type, date, folder

### Browser Testing - Media

- [ ] Create media folders
- [ ] Upload images
- [ ] Upload documents (PDF)
- [ ] Organize files in folders
- [ ] Preview images
- [ ] Edit/crop images
- [ ] Search media library
- [ ] Filter by file type
- [ ] Delete unused files
- [ ] Move files between folders

---

## Content Workflow Best Practices

### 1. Draft → Review → Publish

- Create content as draft
- Review before publishing
- Schedule for optimal timing
- Monitor performance

### 2. SEO Optimization

- Use descriptive titles
- Write meta descriptions
- Add alt text to images
- Use internal links
- Optimize URLs

### 3. Content Organization

- Use categories consistently
- Tag appropriately
- Maintain folder structure
- Update menus regularly

### 4. Quality Control

- Proofread all content
- Test links work
- Verify images display
- Check mobile rendering
- Review SEO scores

### 5. Regular Maintenance

- Update outdated content
- Remove obsolete pages
- Archive old posts
- Refresh popular content
- Monitor broken links

---

## Troubleshooting

### Issue: Images Not Displaying
**Solution**:
- Check file size (max 2MB)
- Verify file format (JPG, PNG)
- Clear browser cache
- Re-upload image

### Issue: Rich Text Editor Not Loading
**Solution**:
- Disable browser extensions
- Clear cache and cookies
- Try different browser
- Check JavaScript console

### Issue: Menu Not Updating on Frontend
**Solution**:
- Clear cache
- Verify menu location set
- Check menu items are active
- Rebuild menu cache

### Issue: SEO Meta Tags Not Showing
**Solution**:
- Check template supports meta tags
- Verify SEO plugin active
- Clear page cache
- Test with SEO tools

---

## Next Steps

- [Communication & Forms](05-communication-forms.md)
- [Advanced Settings](06-advanced-settings.md)
- [Frequently Asked Questions](07-faq.md)
