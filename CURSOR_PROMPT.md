# AQSA PRINT - CURSOR AI DEVELOPMENT PROMPT

## PROJECT OVERVIEW

**Client**: AQSA Print (www.aqsaprint.com)
**Domain**: UAE-based printing company
**Old Site**: www.nooraprints.com (redesign from scratch)
**Reference Sites**:
- Pages/Services: goldenadds.com
- Design/Layout: vistaprint.ae

---

## DESIGN SYSTEM

### Brand Identity (DO NOT CHANGE)
- **Logo**: Bilingual AQSA/أقصى with pink-to-teal gradient
- **Icon**: Geometric mountain "A" shape with circular elements and bottom bar
- **Base Color**: White background (as specified by client)
- **Primary Gradient**: #E8A5B8 (pink) → #2DB8A8 (teal)
- **Typography**:
  - English: Inter (bold, modern, sans-serif)
  - Arabic: Noto Sans Arabic

### Color Palette
```css
/* Brand Colors - Pink to Teal Gradient */
--pink-primary: #E8A5B8;
--pink-light: #F5D0DB;
--teal-primary: #2DB8A8;
--teal-dark: #1A9A8A;
--teal-light: #7FD4C8;

/* Neutrals */
--white: #FFFFFF;
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;

/* Gradients */
--gradient-primary: linear-gradient(135deg, var(--pink-primary) 0%, var(--teal-primary) 100%);
--gradient-light: linear-gradient(135deg, var(--pink-light) 0%, var(--teal-light) 100%);
```

---

## REFERENCE ANALYSIS

### FROM GOLDENADDS.COM (Page Structure & Content)
**SITE ARCHITECTURE:**
- Homepage → Services dropdown → Portfolio → About → Contact
- Service categories: Outdoor/Indoor Branding, Vehicle Branding, Signages, Design & Development, Other Services

**KEY SERVICES TO INCLUDE:**
1. **Outdoor & Indoor Branding**
   - Wall Branding
   - Frosted Sticker
   - Vinyl Branding
   - Flex & Banner Printing
   - Stall Branding
   - Directional Signage

2. **Vehicle Branding**
   - Car Branding
   - Truck/Van Branding
   - Slogan Stickers
   - Partial & Full Vehicle Branding
   - RTA Approvals

3. **Signages**
   - Indoor Signage
   - Outdoor Signage
   - 3D Signage
   - Directional Signage
   - Acrylic Name Signages
   - Traffic & Safety Signage

4. **Exhibition & Display**
   - Rollup Banners
   - Pop-up Stands
   - Backdrops
   - Tension Fabric Displays
   - Exhibition Stall Branding

5. **Promotional Products**
   - Bags
   - Gadgets
   - Drinkware
   - Stationery
   - Apparel
   - Gift Sets
   - Lanyards

6. **Printing Services**
   - Screen Printing
   - DTF Printing
   - Digital Printing
   - UV Printing
   - Offset Printing

7. **Design Services**
   - Graphic Design
   - Brand Identity
   - Web Design (optional)

**TRUST SIGNALS TO INCORPORATE:**
- "Since 2020" or founding year
- "Trusted by top businesses across UAE"
- Client logos/badges
- Local UAE focus ("Dubai", "UAE", "across the UAE")
- WhatsApp integration prominent

---

### FROM VISTAPRINT.AE (Design & UX Patterns)

**LAYOUT PRINCIPLES:**
1. **Clean White Background** - Products and content on clean white
2. **Card-Based Layouts** - Services displayed as interactive cards
3. **Product-First Visual Hierarchy**: Image → Title → Price → CTA
4. **Sticky Header** with search + quote CTA always visible
5. **Mega-menu navigation** for easy product/service discovery

**KEY DESIGN PATTERNS:**
- Heavy use of white space
- Bold product photography / mockups
- Prominent "Get a Quote" CTAs
- Real-time pricing where applicable
- Trust badges (ratings, guarantees, delivery timelines)
- Minimal text, maximum visuals
- Hover effects on cards and buttons
- Floating WhatsApp/Contact buttons

**E-COMMERCE ELEMENTS:**
- Product catalog with categories
- Price display (AED currency for UAE)
- "Add to Cart" / "Customize" buttons
- Sample pack option
- Product badges ("Popular", "Best Seller", etc.)

---

## COMPLETE SITE STRUCTURE

```
HOME
├── Header (sticky)
│   ├── Logo (AQSA + أقصى)
│   ├── Navigation
│   │   ├── Services (mega-menu dropdown)
│   │   ├── Products
│   │   ├── Portfolio
│   │   ├── About
│   │   └── Contact
│   └── CTA: Get Quote + WhatsApp
│
├── Hero Section
│   ├── Headline with gradient text
│   ├── Subheadline
│   ├── Primary CTA: Get Free Quote
│   ├── Secondary CTA: Browse Products
│   ├── Trust Stats (500+ Clients, 10K+ Projects, 24h Delivery)
│   └── Visual: Large product/mockup image with floating cards
│
├── Services Section
│   ├── Section Header
│   └── 6 Service Cards in Grid
│       ├── Business Printing
│       ├── Signage & Banners
│       ├── Vehicle Branding
│       ├── Promotional Products
│       ├── Packaging Solutions
│       └── Design Services
│
├── Products Section
│   ├── Category Tabs (All, Business, Marketing, Signage, Gifts)
│   ├── Product Grid (4 products visible)
│   └── View All Products CTA
│
├── Portfolio Section
│   ├── Section Header
│   ├── 4 Featured Projects
│   └── View All Projects CTA
│
├── Why Choose Us Section
│   ├── 4 Benefit Cards
│   └── Icons + descriptions
│
├── Testimonials Section
│   └── 3 Customer Reviews
│
├── CTA Banner
│   ├── Headline
│   ├── Subheadline
│   └── WhatsApp + Email CTAs
│
├── Footer
│   ├── Brand Column (logo, description, social)
│   ├── Services links
│   ├── Quick Links
│   └── Contact Info
│
└── Floating Buttons (WhatsApp + Call)
```

---

## PAGES TO BUILD

### 1. HOMEPAGE (index.html)
- Already created as base template
- Must include all sections above

### 2. SERVICES PAGE (services.html)
- Hero banner with services overview
- Detailed service cards for each category
- Sub-services grid
- CTA section

### 3. PRODUCTS PAGE (products.html)
- Category filters (sidebar)
- Product grid with pagination
- Quick view modal
- Sort options (price, popularity)

### 4. PORTFOLIO PAGE (portfolio.html)
- Filterable gallery (by industry, service type)
- Masonry/grid layout
- Project detail modals
- Before/after capability

### 5. ABOUT PAGE (about.html)
- Company story
- Mission & Values
- Team section (optional)
- Equipment/technology showcase
- Client logos

### 6. CONTACT PAGE (contact.html)
- Contact form (Name, Email, Phone, Service, Message)
- Map embed
- Office address & directions
- Social links

### 7. GET A QUOTE PAGE (quote.html)
- Multi-step form wizard
- Service selection
- Specifications input
- File upload capability
- WhatsApp integration

---

## DETAILED SPECIFICATIONS

### HEADER
```
- Height: 80px (sticky)
- Background: white with 95% opacity + blur
- Border-bottom: 1px solid gray-100
- Logo: Left aligned, 48x48px icon + text
- Nav: Center-aligned, dropdown menus
- CTA: Right aligned, "Get Quote" button
```

### HERO SECTION
```
- Min-height: 600px
- Background: White with subtle gradient shape on right
- Badge: Pill shape with gradient background
- Title: H1, 56px, gradient text on "Brand Identity"
- Subtitle: 18px, gray-500
- CTAs: Primary (gradient) + Secondary (outline)
- Trust stats: 3 columns, numbers in gradient color
```

### SERVICE CARDS
```
- Size: Equal height cards in 3-column grid
- Icon: 64x64px, gradient background, centered
- Title: 20px, bold, gray-800
- Description: 15px, gray-500, 3 lines max
- Link: Arrow icon, teal color
- Hover: Lift + shadow + border highlight
```

### PRODUCT CARDS
```
- Image: 4:3 aspect ratio, hover zoom effect
- Badge: "Popular" / "Best Seller" pill on top-left
- Category: Small caps, teal color
- Title: 18px, semibold
- Price: Current (bold) + Old (strikethrough)
- Buttons: "Customize" (gradient) + "Sample" (outline)
```

### FOOTER
```
- Background: gray-900
- 4-column layout
- Brand column: Logo + description + social icons
- Links columns: 3 (Services, Quick Links, Contact)
- Bottom bar: Copyright + Legal links
```

### FLOATING BUTTONS
```
- Position: Fixed, bottom-right
- WhatsApp: Green (#25D366), rounded
- Phone: Gradient, rounded
- Size: 56x56px
- Hover: Scale up animation
```

---

## INTERACTIONS & ANIMATIONS

### NAVIGATION
- Dropdown menus: Fade in + slide down
- Mobile menu: Slide in from top
- Smooth scroll for anchor links

### CARDS
- Hover: translateY(-4px) + shadow increase
- Active state: Border highlight

### BUTTONS
- Hover: translateY(-2px) + shadow increase
- Click: Scale down briefly

### IMAGES
- Hover: Subtle zoom (scale 1.05)
- Lazy loading with fade-in

### SCROLL EFFECTS
- Header: Add shadow when scrolled
- Sections: Staggered fade-in on scroll (optional)

---

## MOBILE RESPONSIVENESS

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Adaptations
- Hamburger menu for navigation
- Single-column layouts
- Stacked buttons
- Simplified floating buttons
- Touch-friendly tap targets (min 44px)

---

## CONTENT MOCKUP DATA

### COMPANY INFO
```
Name: AQSA Print
Tagline: "أقصى" (Aqsa - meaning supreme/farthest)
Founded: 2020
Location: Dubai, UAE
Email: info@aqsaprint.com
Phone: +971 50 XXX XXXX
WhatsApp: +971 50 XXX XXXX
```

### SERVICES LIST
```
1. Business Printing
   - Business Cards (AED 250-500)
   - Letterheads
   - Envelopes
   - Corporate Stationery

2. Signage & Banners
   - Rollup Banners (AED 320-450)
   - Pop-up Stands
   - Backdrops
   - Indoor Signs
   - Outdoor Signs
   - 3D Signs

3. Vehicle Branding
   - Full Wrap (from AED 2000)
   - Partial Branding
   - Fleet Branding
   - Car Stickers

4. Promotional Products
   - Custom T-Shirts (AED 45-80)
   - Bags
   - Mugs & Drinkware
   - Stationery
   - Gift Sets

5. Packaging Solutions
   - Custom Boxes
   - Labels & Stickers
   - Product Packaging

6. Design Services
   - Brand Identity
   - Graphic Design
   - Layout Design
```

### TESTIMONIALS
```
1. "AQSA Print delivered exceptional quality for our corporate event materials.
   The attention to detail was impressive, and the team went above and beyond to
   meet our tight deadlines."
   - Ahmed Khan, Marketing Manager, TechCorp Dubai

2. "We've been working with AQSA Print for all our vehicle branding needs.
   Professional service, great prices, and the quality of the wraps has been
   consistently excellent."
   - Sarah Mohammed, CEO, DeliveryPro UAE

3. "The business cards and promotional materials we ordered came out beautifully.
   Our clients always comment on the quality. Highly recommended!"
   - Ravi Jain, Director, Retail Solutions
```

---

## TECHNICAL REQUIREMENTS

### Stack
- HTML5 semantic markup
- CSS3 with custom properties (no Tailwind unless requested)
- Vanilla JavaScript (no frameworks unless needed)
- Font Awesome for icons
- Google Fonts (Inter + Noto Sans Arabic)

### Performance
- Optimized images (WebP where supported)
- Lazy loading for images
- Minified CSS/JS in production
- Mobile-first responsive design

### Accessibility
- Proper heading hierarchy
- Alt text for images
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance

### SEO
- Proper meta tags
- Schema markup for local business
- Semantic HTML structure
- Optimized page titles & descriptions

---

## DELIVERABLES CHECKLIST

### Phase 1: Homepage ✅
- [x] HTML structure with all sections
- [ ] Responsive styling
- [ ] Mobile menu functionality
- [ ] Product filtering
- [ ] Smooth scroll
- [ ] Floating buttons

### Phase 2: Sub-pages
- [ ] services.html
- [ ] products.html
- [ ] portfolio.html
- [ ] about.html
- [ ] contact.html
- [ ] quote.html

### Phase 3: Enhancements
- [ ] Animations & micro-interactions
- [ ] Form validation
- [ ] Loading states
- [ ] Error handling
- [ ] SEO optimization

---

## IMPORTANT REMINDERS

1. **DO NOT MODIFY** the brand colors or logo design
2. **ALWAYS USE** the gradient for CTAs and highlights
3. **WHITE BACKGROUND** is the base - no dark sections except footer
4. **DUBAI/UAE FOCUS** - use local context and currency (AED)
5. **WHATSAPP INTEGRATION** - must be prominent throughout
6. **MOBILE-FIRST** - ensure excellent mobile experience
7. **FAST LOADING** - optimize all assets

---

## EXAMPLE CODE SNIPPETS

### Logo SVG (COPY THIS EXACTLY)
```html
<svg viewBox="0 0 48 48" fill="none">
    <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#E8A5B8"/>
            <stop offset="100%" style="stop-color:#2DB8A8"/>
        </linearGradient>
    </defs>
    <circle cx="12" cy="24" r="10" fill="url(#logoGradient)" opacity="0.6"/>
    <path d="M24 6L40 42H32L28 32H20L16 42H8L24 6Z" fill="url(#logoGradient)"/>
    <rect x="4" y="42" width="40" height="4" rx="2" fill="url(#logoGradient)"/>
</svg>
```

### Gradient Button
```css
.btn-primary {
    background: linear-gradient(135deg, #E8A5B8 0%, #2DB8A8 100%);
    color: white;
    box-shadow: 0 4px 14px rgba(45, 184, 168, 0.3);
}
```

### Text Gradient
```css
.text-gradient {
    background: linear-gradient(135deg, #E8A5B8 0%, #2DB8A8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

---

## QUESTIONS TO CLARIFY WITH CLIENT

If any of the following are unclear, ask before proceeding:
1. Specific products to prioritize on homepage
2. Whether to include e-commerce functionality or just quotes
3. Payment integration requirements
4. Blog/resources section needed?
5. Multi-language support (Arabic/English)?
6. Specific case studies to showcase in portfolio
7. Contact form fields preference
8. WhatsApp number to use

---

## SUCCESS CRITERIA

A successful implementation will have:
- ✅ Clean, professional design matching Vistaprint aesthetics
- ✅ Service depth matching Goldenadds content structure
- ✅ Responsive on all devices
- ✅ Fast loading (< 3s)
- ✅ Working navigation and interactions
- ✅ WhatsApp prominently accessible
- ✅ Brand colors applied consistently
- ✅ White background maintained

---

*End of Prompt - Begin Development*