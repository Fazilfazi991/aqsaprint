const fs = require('fs');
const path = require('path');
const articles = require('../data/blogArticles.cjs');

const root = path.resolve(__dirname, '..');
const baseUrl = 'https://aqsaprint.com';
const author = 'AQSA Print';
const logoUrl = `${baseUrl}/images/logo.png`;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function wordCount(article) {
  const text = [
    article.title,
    article.excerpt,
    ...article.sections.flatMap((section) => [section.heading, ...section.body]),
    ...article.faq.flat()
  ].join(' ');
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function readingTime(article) {
  return `${Math.max(4, Math.ceil(wordCount(article) / 180))} min read`;
}

function articleBySlug(slug) {
  return articles.find((article) => article.slug === slug);
}

function relatedArticles(article) {
  return article.relatedArticles.map(articleBySlug).filter(Boolean);
}

function seoHead({ title, description, canonicalUrl, image, type = 'website', article }) {
  const extra = article ? `
    <meta property="article:published_time" content="${article.publishedDate}">
    <meta property="article:modified_time" content="${article.modifiedDate}">
    <meta property="article:section" content="${escapeHtml(article.category)}">` : '';
  return `<title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta property="og:type" content="${type}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="${image}">
    <meta property="og:site_name" content="AQSA Print">${extra}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${image}">`;
}

function header(active = 'blog') {
  return `<header class="header">
        <div class="container">
            <div class="header-inner">
                <a href="/" class="logo"><img decoding="async" src="/images/logo.png" alt="AQSA Print Logo" class="logo-img"></a>
                <nav class="nav-desktop">
                    <a href="/" class="nav-link">Home</a>
                    <a href="/services" class="nav-link">Services</a>
                    <a href="/promotional-gifts" class="nav-link">Products</a>
                    <a href="/portfolio" class="nav-link">Portfolio</a>
                    <a href="/blog" class="nav-link ${active === 'blog' ? 'active' : ''}">Blog</a>
                    <a href="/events" class="nav-link">Events</a>
                    <a href="/about" class="nav-link">About</a>
                    <a href="/contact" class="nav-link">Contact</a>
                </nav>
                <div class="header-actions">
                    <a href="/quote" class="btn btn-primary btn-quote"><i class="fas fa-calendar-check"></i> Get Quote</a>
                    <button class="mobile-menu-btn" aria-label="Toggle menu"><span></span><span></span><span></span></button>
                </div>
            </div>
        </div>
        <div class="mobile-menu">
            <a href="/" class="mobile-menu-link">Home</a>
            <a href="/services" class="mobile-menu-link">Services</a>
            <a href="/promotional-gifts" class="mobile-menu-link">Products</a>
            <a href="/portfolio" class="mobile-menu-link">Portfolio</a>
            <a href="/blog" class="mobile-menu-link">Blog</a>
            <a href="/events" class="mobile-menu-link">Events</a>
            <a href="/about" class="mobile-menu-link">About</a>
            <a href="/contact" class="mobile-menu-link">Contact</a>
            <div class="mobile-menu-cta"><a href="/quote" class="btn btn-primary" style="width:100%">Get Free Quote</a></div>
        </div>
    </header>`;
}

function footer() {
  return `<footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="footer-logo"><img decoding="async" src="/images/logo.png" alt="AQSA Print Logo" class="footer-logo-img"></div>
                    <p class="footer-description">Your trusted partner for printing and branding needs in Riyadh, KSA.</p>
                </div>
                <div><h4 class="footer-title">Services</h4><ul class="footer-links"><li><a href="/digital-printing">Digital Printing</a></li><li><a href="/offset-printing">Offset Printing</a></li><li><a href="/signages">Signage</a></li><li><a href="/vehicle-branding">Vehicle Branding</a></li><li><a href="/promotional-gifts">Corporate Gifts</a></li></ul></div>
                <div><h4 class="footer-title">Company</h4><ul class="footer-links"><li><a href="/about">About Us</a></li><li><a href="/portfolio">Portfolio</a></li><li><a href="/blog">Blog</a></li><li><a href="/contact">Contact</a></li><li><a href="/quote">Get Quote</a></li></ul></div>
                <div><h4 class="footer-title">Contact</h4><ul class="footer-contact"><li><i class="fas fa-phone"></i><span>+966 55 668 3044</span></li><li><i class="fas fa-envelope"></i><span>info@aqsaprint.com</span></li><li><i class="fas fa-map-marker-alt"></i><span>Riyadh, Saudi Arabia</span></li></ul></div>
            </div>
            <div class="footer-bottom"><p class="footer-copyright">© 2025 AQSA Print. All rights reserved.</p></div>
        </div>
    </footer>`;
}

function shell({ head, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    ${header()}
    ${body}
    ${footer()}
    <script src="/main.js"></script>
</body>
</html>`;
}

function schemasForArticle(article) {
  const canonicalUrl = `${baseUrl}/blog/${article.slug}`;
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: article.title, item: canonicalUrl }
    ]
  };
  const blogPosting = {
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
    headline: article.title,
    description: article.metaDescription,
    image: [`${baseUrl}${article.featuredImage}`],
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate,
    author: { '@type': 'Organization', name: author },
    publisher: {
      '@type': 'Organization',
      name: 'AQSA Print',
      logo: { '@type': 'ImageObject', url: logoUrl }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    articleSection: article.category,
    keywords: article.keywords.join(', ')
  };
  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${canonicalUrl}#faq`,
    mainEntity: article.faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  };
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [breadcrumb, blogPosting, faqPage] })}</script>`;
}

function blogCard(article, featured = false) {
  return `<article class="${featured ? 'blog-featured-card' : 'blog-card'}">
                        <img src="${article.featuredImage}" alt="${escapeHtml(article.imageAlt)}" width="1200" height="630" loading="${featured ? 'eager' : 'lazy'}">
                        <div class="${featured ? 'blog-featured-body' : 'blog-card-body'}">
                            <p class="blog-category">${escapeHtml(article.category)}</p>
                            <p class="blog-meta">${article.publishedDate} · ${readingTime(article)}</p>
                            <h2><a href="/blog/${article.slug}">${escapeHtml(article.title)}</a></h2>
                            <p>${escapeHtml(article.excerpt)}</p>
                            <a class="btn btn-primary" href="/blog/${article.slug}">Read Article <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>`;
}

function generateListing() {
  const featured = articles[0];
  const rest = articles.slice(1);
  const categories = [...new Set(articles.map((article) => article.category))];
  const body = `<main>
        <section class="blog-hero">
            <div class="container">
                <span class="section-badge">AQSA Print Blog</span>
                <h1>Printing, Branding and Signage Resources</h1>
                <p>Explore practical printing, signage, branding and promotional product guides from AQSA Print. Learn how to select the right materials, printing methods and branding solutions for your business in Riyadh and Saudi Arabia.</p>
            </div>
        </section>
        <section class="blog-listing">
            <div class="container">
                <div class="blog-categories" aria-label="Blog categories">${categories.map((category) => `<span>${escapeHtml(category)}</span>`).join('')}</div>
                <div class="blog-featured">
                    <div class="section-header"><span class="section-badge">Featured Article</span><h2 class="section-title">${escapeHtml(featured.title)}</h2></div>
                    ${blogCard(featured, true)}
                </div>
                <div class="section-header"><span class="section-badge">Latest Guides</span><h2 class="section-title">More Practical Resources</h2></div>
                <div class="blog-grid">${rest.map((article) => blogCard(article)).join('\n')}
                </div>
                <nav class="blog-pagination" aria-label="Blog pagination"><span aria-current="page">1</span><span>More articles will appear here as they are published.</span></nav>
                <section class="blog-service-cta">
                    <h2>Need help choosing a print or branding option?</h2>
                    <p>AQSA Print can review your project details and recommend practical materials, production methods and finishing options.</p>
                    <a href="/quote" class="btn btn-primary">Request a quotation</a>
                </section>
            </div>
        </section>
    </main>`;
  const head = `${seoHead({
    title: 'Printing, Branding and Signage Blog | AQSA Print',
    description: 'Read practical AQSA Print guides about digital printing, offset printing, signage, vehicle branding, exhibitions and corporate gifts in Riyadh.',
    canonicalUrl: `${baseUrl}/blog`,
    image: `${baseUrl}${featured.featuredImage}`
  })}
    <script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          '@id': `${baseUrl}/blog#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` }
          ]
        },
        {
          '@type': 'Blog',
          '@id': `${baseUrl}/blog#blog`,
          name: 'AQSA Print Blog',
          url: `${baseUrl}/blog`,
          publisher: { '@type': 'Organization', name: 'AQSA Print', logo: { '@type': 'ImageObject', url: logoUrl } }
        }
      ]
    })}</script>`;
  fs.mkdirSync(path.join(root, 'blog'), { recursive: true });
  fs.writeFileSync(path.join(root, 'blog', 'index.html'), shell({ head, body }), 'utf8');
}

function generateArticle(article, index) {
  const canonicalUrl = `${baseUrl}/blog/${article.slug}`;
  const toc = article.sections.map((section) => `<li><a href="#${slugify(section.heading)}">${escapeHtml(section.heading)}</a></li>`).join('');
  const serviceLinks = article.serviceLinks.map(([label, href]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join('');
  const related = relatedArticles(article).map((item) => blogCard(item)).join('\n');
  const prev = articles[index - 1];
  const next = articles[index + 1];
  const sections = article.sections.map((section, sectionIndex) => {
    const paragraphs = section.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n');
    const highlight = sectionIndex === 5 ? `<div class="blog-highlight"><strong>Quick planning note:</strong> Share quantity, size, deadline and intended use when asking for a quote. Those details help the production team recommend the right material and process.</div>` : '';
    return `<section id="${slugify(section.heading)}">
                            <h2>${escapeHtml(section.heading)}</h2>
                            ${paragraphs}
                            ${highlight}</section>`;
  }).join('\n');
  const faqHtml = article.faq.map(([question, answer]) => `<div class="faq-item"><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></div>`).join('\n');
  const navHtml = `<nav class="article-neighbors" aria-label="Article navigation">
                        ${prev ? `<a href="/blog/${prev.slug}"><span>Previous</span>${escapeHtml(prev.title)}</a>` : '<span></span>'}
                        ${next ? `<a href="/blog/${next.slug}"><span>Next</span>${escapeHtml(next.title)}</a>` : '<span></span>'}
                    </nav>`;
  const body = `<main>
        <nav class="breadcrumbs" aria-label="Breadcrumb"><div class="container"><a href="/">Home</a><span>/</span><a href="/blog">Blog</a><span>/</span><span aria-current="page">${escapeHtml(article.title)}</span></div></nav>
        <article class="blog-article">
            <header class="blog-article-hero">
                <div class="container">
                    <p class="blog-category">${escapeHtml(article.category)}</p>
                    <p class="blog-meta">Published ${article.publishedDate} · Updated ${article.modifiedDate} · ${readingTime(article)} · ${author}</p>
                    <h1>${escapeHtml(article.title)}</h1>
                    <p>${escapeHtml(article.excerpt)}</p>
                    <img src="${article.featuredImage}" alt="${escapeHtml(article.imageAlt)}" width="1200" height="630" loading="eager">
                </div>
            </header>
            <div class="container blog-article-layout">
                <aside class="toc"><h2>Contents</h2><ol>${toc}</ol></aside>
                <div class="article-content">
                    ${sections}
                    <section><h2>Helpful AQSA Print Links</h2><ul>${serviceLinks}</ul></section>
                    <section><h2>Frequently Asked Questions</h2><div class="faq-grid">${faqHtml}</div></section>
                    <section><h2>Related Articles</h2><div class="blog-grid related-articles">${related}</div></section>
                    <section class="blog-cta"><h2>Request a quotation</h2><p>Share your project details with AQSA Print so the team can recommend suitable materials, production methods and timelines for your business in Riyadh or Saudi Arabia.</p><a href="/quote" class="btn btn-primary">Request a quotation</a></section>
                    <div class="social-share" aria-label="Share this article"><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}" rel="noopener noreferrer" target="_blank">Facebook</a><a href="https://x.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(article.title)}" rel="noopener noreferrer" target="_blank">X</a><a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(canonicalUrl)}" rel="noopener noreferrer" target="_blank">LinkedIn</a></div>
                    ${navHtml}
                </div>
            </div>
        </article>
    </main>`;
  const head = `${seoHead({
    title: article.seoTitle,
    description: article.metaDescription,
    canonicalUrl,
    image: `${baseUrl}${article.featuredImage}`,
    type: 'article',
    article
  })}
    ${schemasForArticle(article)}`;
  const dir = path.join(root, 'blog', article.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), shell({ head, body }), 'utf8');
}

function updateSitemap() {
  const sitemapPath = path.join(root, 'sitemap.xml');
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const existing = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => match[1])
    .filter((url) => !url.includes('/blog/exhibition-corporate-event-printing-checklist'))
    .filter((url, index, arr) => arr.indexOf(url) === index);
  const required = [`${baseUrl}/blog`, ...articles.map((article) => `${baseUrl}/blog/${article.slug}`)];
  for (const url of required) {
    if (!existing.includes(url)) existing.push(url);
  }
  const urls = existing.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n');
  fs.writeFileSync(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, 'utf8');
}

function updateServicePageLinks() {
  const links = [
    ['digital-printing.html', '<li><a href="/blog/digital-printing-vs-offset-printing">Digital printing vs offset printing guide</a></li>'],
    ['offset-printing.html', '<li><a href="/blog/digital-printing-vs-offset-printing">Compare offset and digital printing methods</a></li>'],
    ['vehicle-branding.html', '<li><a href="/blog/vehicle-branding-cost-riyadh">Vehicle branding cost factors in Riyadh</a></li>'],
    ['signages.html', '<li><a href="/blog/best-signage-materials-saudi-arabia">Guide to signage materials for Saudi Arabia</a></li>'],
    ['promotional-gifts.html', '<li><a href="/blog/corporate-gift-ideas-saudi-arabia">Corporate gift ideas for Saudi businesses</a></li>'],
    ['rollup-banners.html', '<li><a href="/blog/exhibition-printing-checklist">Exhibition printing checklist</a></li>'],
    ['exhibition-stall-branding.html', '<li><a href="/blog/exhibition-printing-checklist">Exhibition printing and branding checklist</a></li>']
  ];
  for (const [file, link] of links) {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) continue;
    let html = fs.readFileSync(filePath, 'utf8');
    if (html.includes(link)) continue;
    const block = `<section class="related-blog-links"><div class="container"><h2>Related Blog Guide</h2><ul>${link}</ul></div></section>`;
    html = html.replace(/\s*<footer class="footer">/, `\n    ${block}\n\n    <footer class="footer">`);
    fs.writeFileSync(filePath, html, 'utf8');
  }
}

function updateVercelRedirect() {
  const vercelPath = path.join(root, 'vercel.json');
  const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  const redirect = {
    source: '/blog/exhibition-corporate-event-printing-checklist',
    destination: '/blog/exhibition-printing-checklist',
    permanent: true
  };
  config.redirects = config.redirects || [];
  if (!config.redirects.some((item) => item.source === redirect.source)) {
    config.redirects.unshift(redirect);
  }
  fs.writeFileSync(vercelPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
}

generateListing();
articles.forEach(generateArticle);
updateSitemap();
updateServicePageLinks();
updateVercelRedirect();

console.log(`Generated blog listing and ${articles.length} articles.`);
