const fs = require('fs');
const path = require('path');

const root = process.cwd();
const baseUrl = 'https://aqsaprint.com';
const defaultImage = `${baseUrl}/images/generated/home_hero.png`;
const socialProfiles = [
  'https://youtube.com/@aqsaprint',
  'https://www.instagram.com/aqsa_print',
  'https://www.facebook.com/share/1Dsn3aHPf3/?mibextid=wwXIfr',
  'https://x.com/aqsaprint_ksa'
];

const excludeFromSitemap = new Set(['admin-panel.html', 'login.html', 'thank-you.html', '404.html']);
const noindexPages = new Set(['admin-panel.html', 'login.html', 'thank-you.html', '404.html']);

const metadata = {
  'index.html': {
    title: 'Printing Company in Riyadh, Saudi Arabia | AQSA Print',
    description: 'AQSA Print provides digital printing, offset printing, signage, vehicle branding, exhibition displays, packaging and corporate gifts in Riyadh, Saudi Arabia. Request a quotation today.',
    image: `${baseUrl}/images/generated/home_hero.png`
  },
  'about.html': {
    title: 'About AQSA Print Riyadh | Printing & Signage Team',
    description: 'Learn about AQSA Print, a Riyadh printing and signage company supporting businesses with print production, branding, signage and corporate gift solutions.',
    image: `${baseUrl}/images/generated/about_hero.png`
  },
  'services.html': {
    title: 'Printing & Signage Services in Riyadh | AQSA Print',
    description: 'Explore AQSA Print services in Riyadh, including digital printing, offset printing, signage, vehicle branding, banners, displays, gifts and branding solutions.',
    image: `${baseUrl}/images/generated/services_hero.png`
  },
  'portfolio.html': {
    title: 'Printing and Signage Portfolio Riyadh | AQSA Print',
    description: 'View AQSA Print portfolio examples across signage, vehicle branding, exhibitions, packaging, business printing and office branding projects.',
    image: `${baseUrl}/images/generated/portfolio_hero.png`
  },
  'events.html': {
    title: 'Event Printing and Exhibition Branding | AQSA Print',
    description: 'Explore event printing, exhibition branding, display graphics, backdrops, roll-up banners and branded event materials by AQSA Print in Riyadh.',
    image: `${baseUrl}/images/generated/events_hero.png`
  },
  'contact.html': {
    title: 'Contact AQSA Print Riyadh | Request Printing Quote',
    description: 'Contact AQSA Print in Riyadh for printing, signage, vehicle branding, corporate gifts, exhibition displays and project quotations.',
    image: `${baseUrl}/images/generated/contact_hero.png`
  },
  'quote.html': {
    title: 'Request a Printing Quote in Riyadh | AQSA Print',
    description: 'Send AQSA Print your project details to request a quotation for printing, signage, vehicle branding, exhibition graphics or promotional products.',
    image: `${baseUrl}/images/hero_laptop.png`
  },
  'digital-printing.html': {
    title: 'Digital Printing in Riyadh | AQSA Print',
    description: 'Digital printing in Riyadh for business cards, flyers, brochures, menus, posters, invitations and short-run marketing materials.',
    image: `${baseUrl}/images/digital_printing.png`,
    service: 'Digital Printing'
  },
  'offset-printing.html': {
    title: 'Offset Printing in Riyadh | AQSA Print',
    description: 'Offset printing in Riyadh for catalogues, company profiles, brochures, packaging and medium to large commercial print quantities.',
    image: `${baseUrl}/images/offset_printing.png`,
    service: 'Offset Printing'
  },
  'printing-services.html': {
    title: 'Commercial Printing Services Riyadh | AQSA Print',
    description: 'Commercial printing services in Riyadh including digital printing, offset printing, large format printing, finishing and branded print materials.',
    image: `${baseUrl}/images/digital_printing.png`,
    service: 'Commercial Printing'
  },
  'signages.html': {
    title: 'Signage Company in Riyadh | AQSA Print',
    description: 'Indoor and outdoor signage in Riyadh, including 3D letters, acrylic signs, shop signs, office signs, wayfinding and installation support.',
    image: `${baseUrl}/images/aqsa_signage_3d.png`,
    service: 'Signage'
  },
  '3d-signage.html': {
    title: '3D Signage in Riyadh | AQSA Print',
    description: 'Custom 3D signage in Riyadh for storefronts, reception areas, offices and branded business environments, with fabrication and installation support.',
    image: `${baseUrl}/images/signage_3d.png`,
    service: '3D Signage'
  },
  'acrylic-name-signages.html': {
    title: 'Acrylic Name Signage Riyadh | AQSA Print',
    description: 'Acrylic name boards and office signage in Riyadh for reception walls, shops, clinics, corporate offices and branded interiors.',
    image: `${baseUrl}/images/aqsa_signage_3d.png`,
    service: 'Acrylic Signage'
  },
  'vehicle-branding.html': {
    title: 'Vehicle Branding in Riyadh | AQSA Print',
    description: 'Vehicle branding in Riyadh for full wraps, partial wraps, cut vinyl, fleet graphics, commercial decals and professional installation.',
    image: `${baseUrl}/images/vehicle_branding_van.png`,
    service: 'Vehicle Branding'
  },
  'full-partial-vehicle-branding.html': {
    title: 'Full and Partial Vehicle Wraps | AQSA Print',
    description: 'Full and partial vehicle branding solutions for business cars, vans and fleets in Riyadh, from artwork preparation to installation.',
    image: `${baseUrl}/images/vehicle_branding_van.png`,
    service: 'Full and Partial Vehicle Branding'
  },
  'car-branding.html': {
    title: 'Car Branding in Riyadh | AQSA Print',
    description: 'Car branding in Riyadh with custom decals, partial wraps, brand graphics and installation for business vehicles and promotional campaigns.',
    image: `${baseUrl}/images/product_vehicle.png`,
    service: 'Car Branding'
  },
  'truck-van-branding.html': {
    title: 'Truck and Van Branding Riyadh | AQSA Print',
    description: 'Truck and van branding in Riyadh for delivery vehicles, service fleets and commercial campaigns using durable vinyl graphics.',
    image: `${baseUrl}/images/vehicle_branding_van.png`,
    service: 'Truck and Van Branding'
  },
  'promotional-gifts.html': {
    title: 'Corporate Gifts in Riyadh | AQSA Print',
    description: 'Corporate gifts and promotional products in Riyadh, including branded notebooks, mugs, bottles, bags, apparel, gift sets and event giveaways.',
    image: `${baseUrl}/images/corporate_gifts.png`,
    service: 'Corporate Gifts'
  },
  'rollup-banners.html': {
    title: 'Roll-Up Banner Printing Riyadh | AQSA Print',
    description: 'Roll-up banner printing in Riyadh for exhibitions, showrooms, events and promotions, with display-ready print and stand options.',
    image: `${baseUrl}/images/product_rollup.png`,
    service: 'Roll-Up Banners'
  },
  'rollups-backdrops.html': {
    title: 'Roll-Ups and Backdrops Riyadh | AQSA Print',
    description: 'Roll-up banners, exhibition backdrops and event display printing in Riyadh for corporate events, conferences and retail promotions.',
    image: `${baseUrl}/images/banners_exhibition.png`,
    service: 'Roll-Ups and Backdrops'
  },
  'exhibition-stall-branding.html': {
    title: 'Exhibition Stall Branding Riyadh | AQSA Print',
    description: 'Exhibition stall branding in Riyadh with printed panels, counters, backdrops, directional graphics and event display materials.',
    image: `${baseUrl}/images/portfolio_exhibition.png`,
    service: 'Exhibition Stall Branding'
  },
  'flex-banner-printing.html': {
    title: 'Flex Banner Printing Riyadh | AQSA Print',
    description: 'Flex banner and large format printing in Riyadh for outdoor promotions, events, construction hoardings, retail displays and campaigns.',
    image: `${baseUrl}/images/banners_exhibition.png`,
    service: 'Flex Banner Printing'
  },
  'outdoor-signage.html': {
    title: 'Outdoor Signage in Riyadh | AQSA Print',
    description: 'Outdoor signage in Riyadh for shops, buildings, wayfinding, events and branded exterior displays with durable material options.',
    image: `${baseUrl}/images/generated/service_outdoor.png`,
    service: 'Outdoor Signage'
  },
  'indoor-signage.html': {
    title: 'Indoor Signage in Riyadh | AQSA Print',
    description: 'Indoor signage in Riyadh for reception areas, offices, showrooms, directional systems, acrylic signs and branded interior graphics.',
    image: `${baseUrl}/images/generated/service_indoor.png`,
    service: 'Indoor Signage'
  },
  'indoor-outdoor-branding.html': {
    title: 'Indoor and Outdoor Branding Riyadh | AQSA Print',
    description: 'Indoor and outdoor branding in Riyadh for offices, retail spaces, events, showrooms, walls, windows, signs and promotional displays.',
    image: `${baseUrl}/images/generated/service_outdoor.png`,
    service: 'Indoor and Outdoor Branding'
  },
  'wall-branding.html': {
    title: 'Wall Branding in Riyadh | AQSA Print',
    description: 'Wall branding and office graphics in Riyadh for reception areas, meeting rooms, retail interiors and branded workplace environments.',
    image: `${baseUrl}/images/portfolio/office_wall_branding.png`,
    service: 'Wall Branding'
  },
  'vinyl-branding.html': {
    title: 'Vinyl Branding in Riyadh | AQSA Print',
    description: 'Vinyl branding in Riyadh for windows, walls, vehicles, shops and events using printed graphics, cut vinyl and installation support.',
    image: `${baseUrl}/images/product_vehicle.png`,
    service: 'Vinyl Branding'
  },
  'frosted-sticker.html': {
    title: 'Frosted Sticker Printing Riyadh | AQSA Print',
    description: 'Frosted stickers and privacy films in Riyadh for offices, meeting rooms, glass doors, partitions and branded interior spaces.',
    image: `${baseUrl}/images/generated/work_wayfinding.png`,
    service: 'Frosted Stickers'
  },
  'directional-signage.html': {
    title: 'Directional Signage Riyadh | AQSA Print',
    description: 'Directional signage and wayfinding signs in Riyadh for offices, buildings, events, clinics, showrooms and public-facing spaces.',
    image: `${baseUrl}/images/generated/work_wayfinding.png`,
    service: 'Directional Signage'
  },
  'traffic-safety-signage.html': {
    title: 'Traffic Safety Signage Riyadh | AQSA Print',
    description: 'Traffic safety signage in Riyadh for sites, facilities, parking areas, warehouses and workplace safety communication.',
    image: `${baseUrl}/images/generated/work_wayfinding.png`,
    service: 'Traffic Safety Signage'
  },
  'flags.html': {
    title: 'Custom Flag Printing Riyadh | AQSA Print',
    description: 'Custom flag printing in Riyadh for events, showrooms and promotions, including feather flags, teardrop flags, J-shape flags and table flags.',
    image: `${baseUrl}/images/generated/flags-hero.png`,
    service: 'Custom Flags'
  },
  'canvas-printing.html': {
    title: 'Canvas Printing in Riyadh | AQSA Print',
    description: 'Canvas printing in Riyadh for photo prints, framed decor, wall art, gifts and high-quality display pieces for homes and businesses.',
    image: `${baseUrl}/images/canvas_wallart.png`,
    service: 'Canvas Printing'
  },
  'mementos.html': {
    title: 'Mementos and Awards Riyadh | AQSA Print',
    description: 'Custom mementos, trophies, awards and plaques in Riyadh for corporate recognition, events, ceremonies and branded gifts.',
    image: `${baseUrl}/images/mementos_awards.png`,
    service: 'Mementos and Awards'
  },
  'uv-printing.html': {
    title: 'UV Printing in Riyadh | AQSA Print',
    description: 'UV printing in Riyadh for rigid materials, promotional items, acrylic, signage components and branded product surfaces.',
    image: `${baseUrl}/images/generated/work_print.png`,
    service: 'UV Printing'
  },
  'screen-printing.html': {
    title: 'Screen Printing in Riyadh | AQSA Print',
    description: 'Screen printing in Riyadh for apparel, promotional products, bags, uniforms and branded merchandise in practical production quantities.',
    image: `${baseUrl}/images/T-shirts-vests.PNG`,
    service: 'Screen Printing'
  },
  'dtf-printing.html': {
    title: 'DTF Printing in Riyadh | AQSA Print',
    description: 'DTF printing in Riyadh for apparel decoration, uniforms, promotional clothing, tote bags and custom textile branding.',
    image: `${baseUrl}/images/T-shirts-vests.PNG`,
    service: 'DTF Printing'
  }
};

const simplePublic = {
  'backdrops.html': ['Backdrop Printing Riyadh | AQSA Print', 'Backdrop printing in Riyadh for events, exhibitions, stages, media walls, photo areas and branded promotional spaces.'],
  'brand-identity.html': ['Brand Identity Design Riyadh | AQSA Print', 'Brand identity support in Riyadh for logos, print materials, business stationery, signage and consistent visual branding.'],
  'design-development.html': ['Design and Development Services | AQSA Print', 'Graphic design and production-ready artwork services for printing, signage, branding, exhibitions and promotional materials in Riyadh.'],
  'gift-sets.html': ['Corporate Gift Sets Riyadh | AQSA Print', 'Branded corporate gift sets in Riyadh for client gifts, employee recognition, events and promotional campaigns.'],
  'graphic-design.html': ['Graphic Design for Print Riyadh | AQSA Print', 'Graphic design services in Riyadh for business cards, brochures, signage, banners, packaging and promotional campaigns.'],
  'lanyards.html': ['Custom Lanyards Riyadh | AQSA Print', 'Custom lanyards in Riyadh for events, staff IDs, conferences, exhibitions and branded workplace use.'],
  'pop-up-stands.html': ['Pop-Up Stand Printing Riyadh | AQSA Print', 'Pop-up stand printing and display graphics in Riyadh for exhibitions, retail promotions, conferences and events.'],
  'promotional-apparel.html': ['Promotional Apparel Riyadh | AQSA Print', 'Promotional apparel branding in Riyadh for uniforms, T-shirts, vests, event clothing and corporate merchandise.'],
  'promotional-bags.html': ['Promotional Bags Riyadh | AQSA Print', 'Custom promotional bag printing in Riyadh for events, retail campaigns, corporate gifts and branded giveaways.'],
  'promotional-drinkware.html': ['Promotional Drinkware Riyadh | AQSA Print', 'Custom mugs, bottles and branded drinkware in Riyadh for corporate gifts, events and promotional campaigns.'],
  'promotional-gadgets.html': ['Promotional Gadgets Riyadh | AQSA Print', 'Promotional gadget branding in Riyadh for USB items, tech gifts, event giveaways and corporate merchandise.'],
  'promotional-stationery.html': ['Promotional Stationery Riyadh | AQSA Print', 'Promotional stationery printing in Riyadh for notebooks, pens, folders, office gifts and branded business materials.'],
  'rta-approvals.html': ['RTA Approval Support for Branding | AQSA Print', 'Artwork and branding support for vehicle and signage approval workflows where applicable to business branding projects.'],
  'slogan-stickers.html': ['Sticker and Label Printing Riyadh | AQSA Print', 'Sticker and label printing in Riyadh for packaging, promotions, product labels, decals and custom business use.'],
  'stall-branding.html': ['Stall Branding Riyadh | AQSA Print', 'Stall branding in Riyadh for exhibitions, kiosks, pop-up retail, conferences and branded event spaces.'],
  'tension-fabric-displays.html': ['Tension Fabric Displays Riyadh | AQSA Print', 'Tension fabric displays in Riyadh for exhibitions, backdrops, retail graphics and portable event branding.'],
  'web-design.html': ['Web Design Services Riyadh | AQSA Print', 'Web design support in Riyadh for businesses that need digital presence alongside print, branding and signage materials.']
};

for (const [file, [title, description]] of Object.entries(simplePublic)) {
  metadata[file] = { title, description, image: defaultImage, service: title.split(' Riyadh')[0].replace(' | AQSA Print', '') };
}

function toRoute(file) {
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return `/${file.replace(/\/index\.html$/, '')}`;
  return `/${file.replace(/\.html$/, '')}`;
}

function canonicalFor(file) {
  return `${baseUrl}${toRoute(file)}`;
}

function escapeAttr(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function textFromSlug(file) {
  const base = file.replace(/\.html$/, '').split('/').filter(Boolean).pop() || 'home';
  return base.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function seoBlock(file, data) {
  const canonical = canonicalFor(file);
  const robots = noindexPages.has(file) ? 'noindex, follow' : 'index, follow, max-image-preview:large';
  const type = file.startsWith('blog/') && file !== 'blog/index.html' ? 'article' : 'website';
  const image = data.image || defaultImage;
  const lines = [
    `    <title>${escapeAttr(data.title)}</title>`,
    `    <meta name="description" content="${escapeAttr(data.description)}">`,
    `    <link rel="canonical" href="${canonical}">`,
    `    <meta name="robots" content="${robots}">`,
    `    <meta property="og:type" content="${type}">`,
    `    <meta property="og:title" content="${escapeAttr(data.title)}">`,
    `    <meta property="og:description" content="${escapeAttr(data.description)}">`,
    `    <meta property="og:url" content="${canonical}">`,
    `    <meta property="og:image" content="${image}">`,
    `    <meta property="og:site_name" content="AQSA Print">`,
    `    <meta name="twitter:card" content="summary_large_image">`,
    `    <meta name="twitter:title" content="${escapeAttr(data.title)}">`,
    `    <meta name="twitter:description" content="${escapeAttr(data.description)}">`,
    `    <meta name="twitter:image" content="${image}">`
  ];
  return lines.join('\n');
}

function jsonLdBlock(file, data) {
  const route = canonicalFor(file);
  const graph = [];
  if (file === 'index.html') {
    graph.push({
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'AQSA Print',
      url: `${baseUrl}/`,
      logo: `${baseUrl}/images/logo.png`,
      email: 'info@aqsaprint.com',
      telephone: '+966556683044',
      sameAs: socialProfiles
    });
    graph.push({
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      name: 'AQSA Print',
      url: `${baseUrl}/`,
      publisher: { '@id': `${baseUrl}/#organization` }
    });
    graph.push({
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#localbusiness`,
      name: 'AQSA Print',
      url: `${baseUrl}/`,
      image: data.image || defaultImage,
      telephone: '+966556683044',
      email: 'info@aqsaprint.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Riyadh',
        addressCountry: 'SA'
      }
    });
  }
  if (data.service) {
    graph.push({
      '@type': 'Service',
      '@id': `${route}#service`,
      name: data.service,
      description: data.description,
      provider: { '@id': `${baseUrl}/#organization` },
      areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
      url: route
    });
  }
  if (file !== 'index.html' && !noindexPages.has(file)) {
    const name = file === 'blog/index.html' ? 'Blog' : data.service || data.title.replace(/\s*\|\s*AQSA Print.*/, '');
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${route}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
        { '@type': 'ListItem', position: 2, name, item: route }
      ]
    });
  }
  if (!graph.length) return '';
  return `\n    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

function replaceSeo(content, file, data) {
  const googleMetaMatch = content.match(/    <meta name="google-site-verification"[^>]*>\r?\n?/);
  const googleMeta = googleMetaMatch ? googleMetaMatch[0].trimEnd() + '\n' : '';
  let head = content.match(/<head>([\s\S]*?)<\/head>/);
  if (!head) return content;
  let headContent = head[1];
  const firstLinks = [];
  for (const pattern of [
    /    <meta charset="UTF-8">\r?\n?/,
    /    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r?\n?/
  ]) {
    const match = headContent.match(pattern);
    if (match) firstLinks.push(match[0].trimEnd());
  }
  headContent = headContent
    .replace(/    <title>[\s\S]*?<\/title>\r?\n?/g, '')
    .replace(/    <meta name="description"[^>]*>\r?\n?/g, '')
    .replace(/    <link rel="canonical"[^>]*>\r?\n?/g, '')
    .replace(/    <meta name="robots"[^>]*>\r?\n?/g, '')
    .replace(/    <meta property="og:[^"]+"[^>]*>\r?\n?/g, '')
    .replace(/    <meta name="twitter:[^"]+"[^>]*>\r?\n?/g, '')
    .replace(/    <meta name="google-site-verification"[^>]*>\r?\n?/g, '')
    .replace(/    <script type="application\/ld\+json">[\s\S]*?<\/script>\r?\n?/g, '');
  for (const item of firstLinks) {
    headContent = headContent.replace(item, '');
  }
  const rebuilt = [
    '<head>',
    firstLinks.join('\n'),
    googleMeta.trimEnd(),
    seoBlock(file, data),
    jsonLdBlock(file, data),
    headContent.trimEnd(),
    '</head>'
  ].filter(Boolean).join('\n');
  return content.replace(/<head>[\s\S]*?<\/head>/, rebuilt);
}

function normalizeInternalLinks(content) {
  const replacements = {
    'href="index.html"': 'href="/"',
    'href="about.html"': 'href="/about"',
    'href="services.html"': 'href="/services"',
    'href="portfolio.html"': 'href="/portfolio"',
    'href="events.html"': 'href="/events"',
    'href="contact.html"': 'href="/contact"',
    'href="quote.html"': 'href="/quote"',
    'href="promotional-gifts.html"': 'href="/promotional-gifts"',
    'href="digital-printing.html"': 'href="/digital-printing"',
    'href="offset-printing.html"': 'href="/offset-printing"',
    'href="rollup-banners.html"': 'href="/rollup-banners"',
    'href="flags.html"': 'href="/flags"',
    'href="mementos.html"': 'href="/mementos"',
    'href="canvas-printing.html"': 'href="/canvas-printing"',
    'href="signages.html"': 'href="/signages"',
    'href="vehicle-branding.html"': 'href="/vehicle-branding"',
    'href="uv-printing.html"': 'href="/uv-printing"',
    'href="flex-banner-printing.html"': 'href="/flex-banner-printing"',
    'href="screen-printing.html"': 'href="/screen-printing"',
    'href="dtf-printing.html"': 'href="/dtf-printing"'
  };
  let next = content;
  for (const [from, to] of Object.entries(replacements)) {
    next = next.split(from).join(to);
  }
  return next;
}

function addBlogNav(content) {
  content = content.replace(/<a href="\/portfolio" class="nav-link">Portfolio<\/a>\s*(<a href="\/events")/g, '<a href="/portfolio" class="nav-link">Portfolio</a>\n                    <a href="/blog" class="nav-link">Blog</a>\n                    $1');
  content = content.replace(/<a href="\/portfolio" class="mobile-menu-link">Portfolio<\/a>\s*(<a href="\/events")/g, '<a href="/portfolio" class="mobile-menu-link">Portfolio</a>\n            <a href="/blog" class="mobile-menu-link">Blog</a>\n            $1');
  content = content.replace(/<li><a href="\/portfolio">Portfolio<\/a><\/li>\s*(<li><a href="\/contact">Contact<\/a><\/li>)/g, '<li><a href="/portfolio">Portfolio</a></li>\n                        <li><a href="/blog">Blog</a></li>\n                        $1');
  return content;
}

function addBreadcrumb(content, file, data) {
  if (file === 'index.html' || noindexPages.has(file) || file.startsWith('blog/')) return content;
  if (content.includes('class="breadcrumbs"')) return content;
  const label = data.service || data.title.replace(/\s*\|\s*AQSA Print.*/, '');
  const parent = data.service ? '<a href="/services">Services</a><span>/</span>' : '';
  const crumb = `\n    <nav class="breadcrumbs" aria-label="Breadcrumb"><div class="container"><a href="/">Home</a><span>/</span>${parent}<span aria-current="page">${escapeAttr(label)}</span></div></nav>\n`;
  return content.replace(/(<\/header>\s*)/, `$1${crumb}`);
}

function ensureSingleH1(content, file) {
  const matches = content.match(/<h1\b/gi) || [];
  if (file === 'index.html' && matches.length > 1) {
    let count = 0;
    return content.replace(/<h1\b([\s\S]*?)<\/h1>/gi, (match) => {
      count += 1;
      if (count === 1) return match;
      return match.replace(/<h1\b/i, '<h2').replace(/<\/h1>/i, '</h2>');
    });
  }
  return content;
}

function updateHtmlFile(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) return;
  const data = metadata[file] || {
    title: `${textFromSlug(file)} | AQSA Print`,
    description: `Learn about ${textFromSlug(file).toLowerCase()} services and solutions from AQSA Print in Riyadh, Saudi Arabia.`,
    image: defaultImage
  };
  let content = fs.readFileSync(full, 'utf8');
  content = replaceSeo(content, file, data);
  content = normalizeInternalLinks(content);
  content = addBlogNav(content);
  content = addBreadcrumb(content, file, data);
  content = ensureSingleH1(content, file);
  fs.writeFileSync(full, content, 'utf8');
}

const rootHtmlFiles = fs.readdirSync(root).filter((name) => name.endsWith('.html'));
for (const file of rootHtmlFiles) updateHtmlFile(file);

const blogArticles = [
  {
    slug: 'digital-printing-vs-offset-printing',
    title: 'Digital Printing vs Offset Printing: Which Is Better for Your Project?',
    meta: 'Compare digital printing and offset printing for business cards, brochures, catalogues, packaging and marketing materials in Riyadh.',
    image: '/images/generated/work_print.png',
    date: '2026-07-12',
    sections: [
      ['The Practical Difference', 'Digital printing is usually the flexible choice for short runs, urgent jobs and personalised print pieces. Offset printing is better suited to medium and larger quantities where colour consistency, paper choice and unit cost matter more over a longer run. Both methods can produce professional results; the better choice depends on quantity, deadline, finishing and how the printed item will be used.'],
      ['When Digital Printing Fits', 'Choose digital printing for business cards, flyers, invitations, menus, small brochures, internal documents, variable names or numbers, and jobs where you need a proof that closely represents the final output. It avoids plate setup, so it is practical when you need smaller quantities or when artwork may still change.'],
      ['When Offset Printing Fits', 'Offset printing is often more suitable for catalogues, company profiles, packaging, folders, books and larger marketing campaigns. Once the setup is complete, it can be more efficient for higher quantities and gives strong control over colour and finishing options.'],
      ['Files, Paper and Finishing', 'For either method, send high-resolution print-ready PDF files with bleed, crop marks and embedded fonts where possible. Paper weight, lamination, folding, binding, die cutting and foil effects can influence both method and production timeline.'],
      ['How AQSA Print Helps You Decide', 'AQSA Print reviews the artwork, quantity, paper stock, finish and deadline before recommending a production method. That keeps the conversation practical instead of pushing one process for every project.']
    ],
    links: [['digital printing services in Riyadh', '/digital-printing'], ['offset printing for catalogues', '/offset-printing']]
  },
  {
    slug: 'vehicle-branding-cost-riyadh',
    title: 'How Much Does Vehicle Branding Cost in Riyadh?',
    meta: 'Learn what affects vehicle branding cost in Riyadh, including wrap coverage, vehicle size, vinyl type, artwork preparation and installation.',
    image: '/images/vehicle_branding_van.png',
    date: '2026-07-12',
    sections: [
      ['Why Prices Vary', 'Vehicle branding cost depends on the size of the vehicle, the amount of coverage, the vinyl material, artwork preparation, surface condition and installation complexity. A small door logo is very different from a full commercial van wrap, so a quote needs actual vehicle and artwork details.'],
      ['Coverage Options', 'Common options include cut vinyl lettering, partial wraps, full wraps, window graphics and fleet graphics. Partial branding can be effective when the design focuses on contact details, logo visibility and key service messages. Full wraps create stronger visual impact but require more material and installation time.'],
      ['Artwork and Measurement', 'Good vehicle branding starts with accurate measurements and artwork approval. The design must fit curves, handles, trims and panel gaps. If a fleet is involved, each vehicle type may need a separate layout.'],
      ['Installation Factors', 'Clean vehicle surfaces, controlled installation conditions and proper preparation help vinyl adhere correctly. Older paintwork, dents or existing graphics may need extra assessment before installation.'],
      ['Requesting a Useful Quote', 'Send vehicle photos, model details, required coverage, logo files and preferred timeline. AQSA Print can then recommend a practical vehicle branding route instead of guessing from a single number.']
    ],
    links: [['vehicle branding solutions', '/vehicle-branding'], ['full and partial vehicle wraps', '/full-partial-vehicle-branding']]
  },
  {
    slug: 'best-signage-materials-saudi-arabia',
    title: 'Best Signage Materials for Businesses in Saudi Arabia',
    meta: 'A practical guide to signage materials for Saudi businesses, including acrylic, aluminium, stainless steel, vinyl and illuminated signs.',
    image: '/images/aqsa_signage_3d.png',
    date: '2026-07-12',
    sections: [
      ['Material Choice Matters', 'Saudi weather, sunlight, dust and installation location all affect signage material choices. A reception sign inside an office does not need the same durability as an outdoor shop sign exposed to heat and direct sun.'],
      ['Acrylic Signage', 'Acrylic is popular for clean indoor branding, reception signs, name boards and illuminated letters. It offers a polished look and can be cut, layered or combined with lighting for a premium finish.'],
      ['Aluminium and Stainless Steel', 'Aluminium is lightweight and useful for panels, directional signage and outdoor boards. Stainless steel is often selected for premium dimensional lettering or signs that need a refined corporate appearance.'],
      ['Vinyl and Printed Graphics', 'Vinyl works well for windows, walls, temporary campaigns and vehicle graphics. Printed vinyl can carry full-colour designs, while cut vinyl is useful for text, logos and simple shapes.'],
      ['Illuminated Signs', 'LED illumination can improve visibility for storefronts and night-time branding. The sign structure, power access and installation area should be reviewed before production.']
    ],
    links: [['outdoor signage services', '/outdoor-signage'], ['acrylic name signage', '/acrylic-name-signages'], ['3D signage in Riyadh', '/3d-signage']]
  },
  {
    slug: 'business-card-printing-riyadh-guide',
    title: 'A Complete Guide to Business Card Printing in Riyadh',
    meta: 'Plan business card printing in Riyadh with guidance on paper stock, finish, artwork setup, quantities, laminations and premium options.',
    image: '/images/product_cards.png',
    date: '2026-07-12',
    sections: [
      ['Start With the Purpose', 'A business card may be a simple contact card, a premium sales tool or part of a complete brand identity. The right paper and finish should match how your team will use it and the impression you want to create.'],
      ['Paper and Thickness', 'Business cards are commonly printed on thicker stocks that feel firm in hand. Matte, gloss and textured papers each create a different impression. If the card includes solid dark colours, paper and lamination choice become especially important.'],
      ['Finishing Options', 'Lamination improves durability and changes the feel of the card. Rounded corners, spot UV, foil, embossing and special cuts can add impact, but they should support the design rather than distract from contact details.'],
      ['Artwork Setup', 'Use high-resolution print-ready files with bleed and safe margins. Keep small text readable, avoid placing details too close to the edge and make sure phone numbers, email addresses and QR codes are checked before approval.'],
      ['Printing With AQSA Print', 'AQSA Print can support business card design, print setup, paper selection and finishing so your cards work as part of a broader brand system.']
    ],
    links: [['digital printing services in Riyadh', '/digital-printing'], ['brand identity design', '/brand-identity']]
  },
  {
    slug: 'exhibition-corporate-event-printing-checklist',
    title: 'Printing Checklist for Exhibitions and Corporate Events',
    meta: 'Use this exhibition printing checklist for roll-up banners, backdrops, flags, brochures, badges, giveaways and event branding in Riyadh.',
    image: '/images/banners_exhibition.png',
    date: '2026-07-12',
    sections: [
      ['Plan the Visitor Journey', 'Event printing should guide people from the entrance to your stand, explain your offer quickly and give visitors something useful to take away. Start by listing every touchpoint: banners, backdrops, brochures, badges, table displays and giveaways.'],
      ['Confirm Sizes Early', 'Roll-up banners, backdrops, stall panels and flags all require correct dimensions. Ask the venue or exhibition organiser for stand specifications before finalising artwork.'],
      ['Prepare Print-Ready Artwork', 'Use high-resolution files, correct bleed, embedded fonts and approved brand colours. Large format graphics should be checked at the correct scale so logos and text remain sharp.'],
      ['Match Materials to Use', 'Indoor displays, outdoor flags, reusable stands and one-time event materials may need different substrates. Consider transport, installation and storage when choosing materials.'],
      ['Build in Review Time', 'Leave time for proofing, production, finishing and delivery. Last-minute changes are common in events, so identify which items must be final first and which can be printed closer to the event.']
    ],
    links: [['roll-up banner printing', '/rollup-banners'], ['exhibition stall branding', '/exhibition-stall-branding'], ['custom flag printing', '/flags']]
  }
];

function pageShell({ title, description, canonicalPath, body, image = defaultImage, article = false, extraSchema = [] }) {
  const file = canonicalPath === '/blog' ? 'blog/index.html' : canonicalPath === '/404' ? '404.html' : `blog/${canonicalPath.split('/').pop()}/index.html`;
  const data = { title, description, image: image.startsWith('http') ? image : `${baseUrl}${image}` };
  const schema = [
    {
      '@type': 'BreadcrumbList',
      '@id': `${baseUrl}${canonicalPath}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
        ...(canonicalPath === '/blog' ? [] : [{ '@type': 'ListItem', position: 3, name: title.replace(/\s*\|\s*AQSA Print.*/, ''), item: `${baseUrl}${canonicalPath}` }])
      ]
    },
    ...extraSchema
  ];
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
${seoBlock(file, data)}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="/style.css">
    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': schema })}</script>
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-inner">
                <a href="/" class="logo"><img decoding="async" src="/images/logo.png" alt="AQSA Print Logo" class="logo-img"></a>
                <nav class="nav-desktop">
                    <a href="/" class="nav-link">Home</a>
                    <a href="/services" class="nav-link">Services</a>
                    <a href="/promotional-gifts" class="nav-link">Products</a>
                    <a href="/portfolio" class="nav-link">Portfolio</a>
                    <a href="/blog" class="nav-link active">Blog</a>
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
    </header>
${body}
    <footer class="footer">
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
    </footer>
    <script src="/main.js"></script>
</body>
</html>`;
}

function createBlog() {
  const blogDir = path.join(root, 'blog');
  fs.mkdirSync(blogDir, { recursive: true });
  const cards = blogArticles.map((article, index) => `
                    <article class="blog-card">
                        <img src="${article.image}" alt="${escapeAttr(article.title)}" loading="${index === 0 ? 'eager' : 'lazy'}">
                        <div class="blog-card-body">
                            <p class="blog-meta">${article.date} · ${Math.max(4, Math.round(article.sections.map((s) => s[1]).join(' ').split(/\s+/).length / 180))} min read</p>
                            <h2><a href="/blog/${article.slug}">${article.title}</a></h2>
                            <p>${article.meta}</p>
                            <a class="service-link" href="/blog/${article.slug}">Read the article <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>`).join('\n');
  const listingBody = `
    <main>
        <section class="blog-hero">
            <div class="container">
                <span class="section-badge">AQSA Print Blog</span>
                <h1>Printing, Signage and Branding Guides</h1>
                <p>Practical articles for businesses planning print, signage, vehicle branding, exhibitions and corporate gift projects in Riyadh and Saudi Arabia.</p>
            </div>
        </section>
        <section class="blog-listing">
            <div class="container">
                <div class="blog-grid">${cards}
                </div>
            </div>
        </section>
    </main>`;
  fs.writeFileSync(path.join(blogDir, 'index.html'), pageShell({
    title: 'Printing and Signage Blog Riyadh | AQSA Print',
    description: 'Read practical AQSA Print guides about digital printing, offset printing, signage, vehicle branding, exhibitions and corporate event printing.',
    canonicalPath: '/blog',
    body: listingBody
  }));

  for (const article of blogArticles) {
    const dir = path.join(blogDir, article.slug);
    fs.mkdirSync(dir, { recursive: true });
    const words = article.sections.map((section) => section[1]).join(' ').split(/\s+/).length;
    const toc = article.sections.map((section) => `<li><a href="#${section[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}">${section[0]}</a></li>`).join('');
    const bodySections = article.sections.map((section) => {
      const id = section[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `<section id="${id}"><h2>${section[0]}</h2><p>${section[1]}</p></section>`;
    }).join('\n');
    const links = article.links.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('');
    const articleBody = `
    <main>
        <nav class="breadcrumbs" aria-label="Breadcrumb"><div class="container"><a href="/">Home</a><span>/</span><a href="/blog">Blog</a><span>/</span><span aria-current="page">${escapeAttr(article.title)}</span></div></nav>
        <article class="blog-article">
            <header class="blog-article-hero">
                <div class="container">
                    <p class="blog-meta">${article.date} · ${Math.max(4, Math.round(words / 180))} min read · AQSA Print</p>
                    <h1>${article.title}</h1>
                    <p>${article.meta}</p>
                    <img src="${article.image}" alt="${escapeAttr(article.title)}" loading="eager">
                </div>
            </header>
            <div class="container blog-article-layout">
                <aside class="toc"><h2>Contents</h2><ol>${toc}</ol></aside>
                <div class="article-content">
                    ${bodySections}
                    <section><h2>Related AQSA Print Services</h2><ul>${links}</ul></section>
                    <section class="blog-cta"><h2>Planning a print or branding project?</h2><p>Share your project details with AQSA Print so the team can recommend the right print method, material and production route.</p><a href="/quote" class="btn btn-primary">Request a quotation</a></section>
                </div>
            </div>
        </article>
    </main>`;
    const articleSchema = {
      '@type': 'BlogPosting',
      '@id': `${baseUrl}/blog/${article.slug}#article`,
      headline: article.title,
      description: article.meta,
      image: `${baseUrl}${article.image}`,
      datePublished: article.date,
      dateModified: article.date,
      author: { '@type': 'Organization', name: 'AQSA Print' },
      publisher: { '@id': `${baseUrl}/#organization` },
      mainEntityOfPage: `${baseUrl}/blog/${article.slug}`
    };
    fs.writeFileSync(path.join(dir, 'index.html'), pageShell({
      title: `${article.title} | AQSA Print`,
      description: article.meta,
      canonicalPath: `/blog/${article.slug}`,
      body: articleBody,
      image: article.image,
      article: true,
      extraSchema: [articleSchema]
    }));
  }
}

createBlog();

function writeRobots() {
  const robots = `User-agent: *
Allow: /

Disallow: /admin-panel
Disallow: /api/
Disallow: /login
Disallow: /thank-you

Sitemap: ${baseUrl}/sitemap.xml
`;
  fs.writeFileSync(path.join(root, 'robots.txt'), robots, 'utf8');
}

function writeSitemap() {
  const rootPublic = fs.readdirSync(root)
    .filter((file) => file.endsWith('.html') && !excludeFromSitemap.has(file))
    .sort();
  const blogRoutes = ['blog/index.html', ...blogArticles.map((article) => `blog/${article.slug}/index.html`)];
  const files = [...rootPublic, ...blogRoutes];
  const urls = files.map((file) => `  <url>\n    <loc>${canonicalFor(file)}</loc>\n  </url>`).join('\n');
  fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, 'utf8');
}

function write404() {
  const body = `
    <main>
        <section class="blog-hero">
            <div class="container">
                <span class="section-badge">Page Not Found</span>
                <h1>We could not find that page</h1>
                <p>The page may have moved or the address may be incorrect. Use the links below to return to the main AQSA Print sections.</p>
                <div class="cta-buttons"><a class="btn btn-primary" href="/">Home</a><a class="btn btn-secondary" href="/services">Services</a><a class="btn btn-secondary" href="/contact">Contact</a></div>
            </div>
        </section>
    </main>`;
  fs.writeFileSync(path.join(root, '404.html'), pageShell({
    title: 'Page Not Found | AQSA Print',
    description: 'The requested AQSA Print page could not be found. Use the navigation to return to services, portfolio, blog or contact pages.',
    canonicalPath: '/404',
    body
  }), 'utf8');
}

function writeDocs() {
  const publicRoutes = fs.readdirSync(root)
    .filter((file) => file.endsWith('.html') && !excludeFromSitemap.has(file))
    .map(toRoute)
    .sort();
  const blogRoutes = ['/blog', ...blogArticles.map((article) => `/blog/${article.slug}`)];
  fs.writeFileSync(path.join(root, 'SEO-AUDIT.md'), `# SEO Audit

Date: 2026-07-12

## Stack

- Framework: static HTML/CSS/JavaScript site deployed on Vercel.
- Routing: root-level HTML files with Vercel \`cleanUrls: true\`; API routes are serverless Node functions under \`/api\`.
- Rendering: static HTML pages, with some client-side JavaScript for forms, chat, sliders and portfolio loading.
- Metadata before this pass: mostly per-page title and description only; canonical, Open Graph, Twitter and robots metadata were incomplete.
- Production domain: \`https://aqsaprint.com/\` redirects to \`https://aqsaprint.com/\`; canonical domain is \`https://aqsaprint.com\`.

## Issues Found and Fixes

| Severity | Issue | Affected URLs | Fix |
| --- | --- | --- | --- |
| High | Sitemap used non-www URLs and included changefreq/priority values without a reliable source. | \`/sitemap.xml\` | Regenerated sitemap with canonical \`https://aqsaprint.com\` extensionless URLs only. |
| High | No robots.txt existed. | \`/robots.txt\` | Added crawl-friendly robots.txt with sitemap reference and private/admin exclusions. |
| High | Public pages lacked self-referencing canonical tags. | Public HTML routes | Added absolute canonical URLs matching the sitemap. |
| Medium | Open Graph and Twitter metadata was missing. | Public HTML routes | Added social metadata using page-specific titles/descriptions/images where available. |
| Medium | Homepage had multiple H1 elements because the Arabic slide used a second H1. | \`/\` | Converted the secondary slide heading to H2 to preserve visible content while keeping one primary H1. |
| Medium | Blog architecture did not exist. | \`/blog\` | Added crawlable blog listing and five useful articles. |
| Medium | Blog was missing from primary navigation. | Global nav | Added crawlable Blog links to desktop/mobile navigation and footer links. |
| Medium | Breadcrumbs were missing on service and content pages. | Service/product pages, blog articles | Added visible breadcrumbs and matching BreadcrumbList JSON-LD. |
| Low | Internal links used legacy \`.html\` URLs while clean URLs are enabled. | Many internal links | Normalized key internal links to extensionless paths while preserving existing files. |

## Notes

- No genuine standalone Arabic page set exists. The homepage contains an Arabic slide, but there are no reciprocal Arabic URLs, so hreflang was not added.
- No fake reviews, ratings, exact prices, coordinates or full street address were added.
- Query-string URLs are not intentionally linked. Canonicals omit query strings.
- Important navigation uses standard \`<a href>\` links.

## Public Routes Discovered

${[...publicRoutes, ...blogRoutes].map((route) => `- ${route}`).join('\n')}
`, 'utf8');

  fs.writeFileSync(path.join(root, 'GOOGLE-INDEXING-CHECKLIST.md'), `# Google Indexing Checklist

## Search Console Setup

1. Add a Domain property in Google Search Console.
2. Verify the domain using the DNS TXT record from Google.
3. Submit this sitemap: ${baseUrl}/sitemap.xml
4. Inspect the homepage with URL Inspection.
5. Run Test Live URL.
6. Click Request Indexing.
7. Repeat for the priority URLs below.
8. Check the Pages/Indexing report.
9. Review: Crawled - currently not indexed, Discovered - currently not indexed, Duplicate without user-selected canonical, Alternate page with proper canonical, Blocked by robots.txt, Excluded by noindex, Soft 404, Redirect error.
10. Confirm sitemap status shows Success.
11. Check Core Web Vitals.
12. Check the HTTPS report.
13. Check Manual actions.
14. Check Security issues.
15. Re-submit important changed URLs after major content updates.

## Priority URLs to Request Indexing

Priority 1:

- ${baseUrl}/
- ${baseUrl}/services
- ${baseUrl}/contact

Priority 2:

- ${baseUrl}/digital-printing
- ${baseUrl}/offset-printing
- ${baseUrl}/signages
- ${baseUrl}/vehicle-branding
- ${baseUrl}/promotional-gifts

Priority 3:

- ${baseUrl}/portfolio
- ${baseUrl}/blog
- ${baseUrl}/blog/digital-printing-vs-offset-printing
- ${baseUrl}/blog/vehicle-branding-cost-riyadh
- ${baseUrl}/blog/best-signage-materials-saudi-arabia
- ${baseUrl}/blog/business-card-printing-riyadh-guide
- ${baseUrl}/blog/exhibition-corporate-event-printing-checklist
`, 'utf8');
}

writeRobots();
writeSitemap();
write404();
writeDocs();

console.log('SEO upgrade completed.');
