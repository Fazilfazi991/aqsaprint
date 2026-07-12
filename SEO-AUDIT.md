# SEO Audit

Date: 2026-07-12

## Stack

- Framework: static HTML/CSS/JavaScript site deployed on Vercel.
- Routing: root-level HTML files with Vercel `cleanUrls: true`; API routes are serverless Node functions under `/api`.
- Rendering: static HTML pages, with some client-side JavaScript for forms, chat, sliders and portfolio loading.
- Metadata before this pass: mostly per-page title and description only; canonical, Open Graph, Twitter and robots metadata were incomplete.
- Production domain: `https://aqsaprint.com/` redirects to `https://www.aqsaprint.com/`; canonical domain is `https://www.aqsaprint.com`.

## Issues Found and Fixes

| Severity | Issue | Affected URLs | Fix |
| --- | --- | --- | --- |
| High | Sitemap used non-www URLs and included changefreq/priority values without a reliable source. | `/sitemap.xml` | Regenerated sitemap with canonical `https://www.aqsaprint.com` extensionless URLs only. |
| High | No robots.txt existed. | `/robots.txt` | Added crawl-friendly robots.txt with sitemap reference and private/admin exclusions. |
| High | Public pages lacked self-referencing canonical tags. | Public HTML routes | Added absolute canonical URLs matching the sitemap. |
| Medium | Open Graph and Twitter metadata was missing. | Public HTML routes | Added social metadata using page-specific titles/descriptions/images where available. |
| Medium | Homepage had multiple H1 elements because the Arabic slide used a second H1. | `/` | Converted the secondary slide heading to H2 to preserve visible content while keeping one primary H1. |
| Medium | Blog architecture did not exist. | `/blog` | Added crawlable blog listing and six useful articles. |
| Medium | Blog was missing from primary navigation. | Global nav | Added crawlable Blog links to desktop/mobile navigation and footer links. |
| Medium | Breadcrumbs were missing on service and content pages. | Service/product pages, blog articles | Added visible breadcrumbs and matching BreadcrumbList JSON-LD. |
| Low | Internal links used legacy `.html` URLs while clean URLs are enabled. | Many internal links | Normalized key internal links to extensionless paths while preserving existing files. |

## Notes

- No genuine standalone Arabic page set exists. The homepage contains an Arabic slide, but there are no reciprocal Arabic URLs, so hreflang was not added.
- No fake reviews, ratings, exact prices, coordinates or full street address were added.
- Query-string URLs are not intentionally linked. Canonicals omit query strings.
- Important navigation uses standard `<a href>` links.

## Public Routes Discovered

- /
- /3d-signage
- /about
- /acrylic-name-signages
- /backdrops
- /brand-identity
- /canvas-printing
- /car-branding
- /contact
- /design-development
- /digital-printing
- /directional-signage
- /dtf-printing
- /events
- /exhibition-stall-branding
- /flags
- /flex-banner-printing
- /frosted-sticker
- /full-partial-vehicle-branding
- /gift-sets
- /graphic-design
- /indoor-outdoor-branding
- /indoor-signage
- /lanyards
- /mementos
- /offset-printing
- /outdoor-signage
- /pop-up-stands
- /portfolio
- /printing-services
- /promotional-apparel
- /promotional-bags
- /promotional-drinkware
- /promotional-gadgets
- /promotional-gifts
- /promotional-stationery
- /quote
- /rollup-banners
- /rollups-backdrops
- /rta-approvals
- /screen-printing
- /services
- /signages
- /slogan-stickers
- /stall-branding
- /tension-fabric-displays
- /traffic-safety-signage
- /truck-van-branding
- /uv-printing
- /vehicle-branding
- /vinyl-branding
- /wall-branding
- /web-design
- /blog
- /blog/digital-printing-vs-offset-printing
- /blog/vehicle-branding-cost-riyadh
- /blog/best-signage-materials-saudi-arabia
- /blog/business-card-printing-riyadh-guide
- /blog/exhibition-printing-checklist
- /blog/corporate-gift-ideas-saudi-arabia
