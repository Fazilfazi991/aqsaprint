const fs = require('fs');
const path = require('path');

const root = process.cwd();
const baseUrl = 'https://aqsaprint.com';
const defaultImage = `${baseUrl}/images/aqsa-print-social-share.jpg`;
const today = '2026-07-12';
const primaryPhoneDisplay = '+966 55 668 3044';
const primaryPhoneHref = '+966556683044';
const secondaryPhoneDisplay = '+966 50 496 0576';
const secondaryPhoneHref = '+966504960576';
const mapShortUrl = 'https://maps.app.goo.gl/suV6JjCMPg9DDnp79?g_st=ic';
const mapEmbedUrl = 'https://www.google.com/maps?q=AQSA%20Print%20%7C%20Printing%20Press%20%26%20Advertisement%20Riyadh%2C%20Al%20Mutanabbi%2C%20Al%20Malaz%2C%20Riyadh%2012831&output=embed';
const workshopAddress = 'AQSA Print, Al Mutanabbi, Al Malaz, Riyadh 12831';

const excludeFromSitemap = new Set(['404.html', 'admin-panel.html', 'login.html', 'thank-you.html']);
const noindexFiles = new Set(['404.html', 'admin-panel.html', 'login.html', 'thank-you.html']);

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function write(file, content) {
  fs.writeFileSync(path.join(root, file), content, 'utf8');
}

function walk(dir = root, prefix = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, rel));
    else if (entry.name.endsWith('.html')) out.push(rel.replace(/\\/g, '/'));
  }
  return out.sort();
}

function routeFor(file) {
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return `/${file.replace(/\/index\.html$/, '')}`;
  return `/${file.replace(/\.html$/, '')}`;
}

function canonicalFor(file) {
  return `${baseUrl}${routeFor(file) === '/' ? '/' : routeFor(file)}`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function stripTags(value) {
  return String(value || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function attr(content, regex) {
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

function h1s(content) {
  return [...content.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
}

function structuredTypes(content) {
  const types = new Set();
  for (const match of content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1]);
      const nodes = data['@graph'] || [data];
      for (const node of nodes) {
        const type = node['@type'];
        if (Array.isArray(type)) type.forEach((item) => types.add(item));
        else if (type) types.add(type);
      }
    } catch {
      types.add('Invalid JSON-LD');
    }
  }
  return [...types].join(', ');
}

function discoverFiles() {
  return walk().filter((file) => file.endsWith('.html'));
}

const metadata = {
  'index.html': {
    title: 'Best Printing Press in Riyadh, Saudi Arabia | Aqsa Print',
    description: 'Aqsa Print delivers premium printing, advertising, branding and signage solutions in Riyadh, Saudi Arabia. Request a tailored quote for your project.',
    ogDescription: 'Aqsa Print delivers premium printing, advertising, branding and signage solutions in Riyadh, Saudi Arabia.',
    twitterDescription: 'Aqsa Print delivers premium printing, advertising, branding and signage solutions in Riyadh, Saudi Arabia.',
    h1: 'Transform Your Brand with Premium Printing & Advertising Solutions',
    image: defaultImage,
    kind: 'home'
  },
  'services.html': {
    title: 'Printing & Branding Services in Riyadh | AQSA Print',
    description: 'Explore digital printing, offset printing, signage, vehicle branding, displays, promotional products and custom print services from AQSA Print in Riyadh.',
    h1: 'Printing and Branding Services in Riyadh',
    image: `${baseUrl}/images/generated/services_hero.png`,
    kind: 'service'
  },
  'digital-printing.html': {
    title: 'Digital Printing Services in Riyadh | AQSA Print',
    description: 'Professional digital printing in Riyadh for business cards, brochures, flyers, invitations, menus and short-run print projects. Request a quotation.',
    h1: 'Digital Printing Services in Riyadh',
    image: `${baseUrl}/images/digital_printing.png`,
    serviceName: 'Digital Printing Services'
  },
  'offset-printing.html': {
    title: 'Offset Printing Services in Riyadh | AQSA Print',
    description: 'Offset printing in Riyadh for catalogues, brochures, books, packaging and high-volume commercial printing with consistent colour and finishing options.',
    h1: 'Offset Printing Services in Riyadh',
    image: `${baseUrl}/images/offset_printing.png`,
    serviceName: 'Offset Printing Services'
  },
  '3d-signage.html': {
    title: '3D Signage Company in Riyadh | AQSA Print',
    description: 'Custom 3D signage in Riyadh, including acrylic, metal and illuminated letters for shops, offices, receptions and commercial buildings.',
    h1: 'Custom 3D Signage in Riyadh',
    image: `${baseUrl}/images/signage_3d.png`,
    serviceName: 'Custom 3D Signage'
  },
  'acrylic-name-signages.html': {
    title: 'Acrylic Name Signage in Riyadh | AQSA Print',
    description: 'Custom acrylic name signs for offices, receptions, doors, desks and business interiors in Riyadh. Available in multiple colours, sizes and finishes.',
    h1: 'Custom Acrylic Name Signage',
    image: `${baseUrl}/images/aqsa_signage_3d.png`,
    serviceName: 'Acrylic Name Signage'
  },
  'directional-signage.html': {
    title: 'Directional Signage in Riyadh | AQSA Print',
    description: 'Custom directional and wayfinding signage in Riyadh for offices, hospitals, schools, exhibitions, buildings and commercial properties.',
    h1: 'Directional and Wayfinding Signage',
    image: `${baseUrl}/images/generated/work_wayfinding.png`,
    serviceName: 'Directional and Wayfinding Signage'
  },
  'car-branding.html': {
    title: 'Car Branding & Vehicle Wraps in Riyadh | AQSA Print',
    description: 'Car branding in Riyadh with full wraps, partial wraps, vinyl graphics, commercial vehicle lettering and fleet-branding solutions.',
    h1: 'Car Branding and Vehicle Wraps in Riyadh',
    image: `${baseUrl}/images/product_vehicle.png`,
    serviceName: 'Car Branding and Vehicle Wraps'
  },
  'backdrops.html': {
    title: 'Event Backdrop Printing in Riyadh | AQSA Print',
    description: 'Custom event backdrop printing in Riyadh for exhibitions, conferences, launches, weddings, photography and corporate events.',
    h1: 'Custom Event Backdrop Printing',
    image: `${baseUrl}/images/banners_exhibition.png`,
    serviceName: 'Event Backdrop Printing'
  },
  'brand-identity.html': {
    title: 'Brand Identity Design in Riyadh | AQSA Print',
    description: 'Professional brand identity design in Riyadh, including logo development, colour systems, typography and branded business materials.',
    h1: 'Brand Identity Design Services',
    image: defaultImage,
    serviceName: 'Brand Identity Design'
  },
  'design-development.html': {
    title: 'Graphic Design Services in Riyadh | AQSA Print',
    description: 'Graphic design services in Riyadh for print artwork, signage, marketing materials, packaging, displays and corporate branding.',
    h1: 'Graphic Design and Artwork Development',
    image: defaultImage,
    serviceName: 'Graphic Design Services'
  },
  'canvas-printing.html': {
    title: 'Canvas Printing in Riyadh | Custom Photo Canvas | AQSA Print',
    description: 'Custom canvas printing in Riyadh for photographs, artwork, office decor and personalised wall displays in a range of sizes.',
    h1: 'Custom Canvas Printing in Riyadh',
    image: `${baseUrl}/images/canvas_wallart.png`,
    serviceName: 'Canvas Printing'
  },
  'dtf-printing.html': {
    title: 'DTF Printing Services in Riyadh | AQSA Print',
    description: 'Custom DTF printing in Riyadh for clothing, uniforms, promotional apparel and textile designs with detailed transfers.',
    h1: 'DTF Printing Services in Riyadh',
    image: `${baseUrl}/images/T-shirts-vests.PNG`,
    serviceName: 'DTF Printing Services'
  },
  'events.html': {
    title: 'Event Branding & Exhibition Printing Riyadh | AQSA Print',
    description: 'Event branding and exhibition printing in Riyadh, including backdrops, banners, booth graphics, signage, displays and promotional materials.',
    h1: 'Event Branding and Exhibition Printing',
    image: `${baseUrl}/images/generated/events_hero.png`,
    serviceName: 'Event Branding and Exhibition Printing'
  },
  'promotional-gifts.html': {
    title: 'Custom Printed Products in Riyadh | AQSA Print',
    description: 'Explore custom printed products, promotional items, corporate gifts, displays, signage and branded business materials available from AQSA Print.',
    h1: 'Custom Printed and Branded Products',
    image: `${baseUrl}/images/corporate_gifts.png`,
    serviceName: 'Custom Printed Products'
  },
  'portfolio.html': {
    title: 'Printing, Signage & Branding Portfolio | AQSA Print',
    description: 'View AQSA Print projects featuring signage, vehicle branding, digital printing, displays and custom branding work completed in Riyadh.',
    h1: 'Printing and Branding Portfolio',
    image: `${baseUrl}/images/generated/portfolio_hero.png`,
    kind: 'page'
  },
  'about.html': {
    title: 'About AQSA Print | Printing Company in Riyadh',
    description: 'Learn about AQSA Print, our printing, signage and branding services, production approach and commitment to supporting businesses in Riyadh.',
    h1: 'About AQSA Print',
    image: `${baseUrl}/images/generated/about_hero.png`,
    kind: 'page'
  },
  'contact.html': {
    title: 'Contact AQSA Print | Printing Services in Riyadh',
    description: 'Contact AQSA Print for digital printing, signage, vehicle branding, displays and promotional-product quotations in Riyadh.',
    h1: 'Contact AQSA Print',
    image: `${baseUrl}/images/generated/contact_hero.png`,
    kind: 'contact'
  },
  'blog/index.html': {
    title: 'Printing, Signage & Branding Guides | AQSA Print',
    description: 'Read practical guides about printing, signage, vehicle branding, exhibitions and corporate gifts for businesses in Riyadh and Saudi Arabia.',
    h1: 'Printing, Signage and Branding Resources',
    image: defaultImage,
    kind: 'blog'
  },
  'printing-services.html': {
    title: 'Commercial Printing Services in Riyadh | AQSA Print',
    description: 'Commercial printing services in Riyadh for digital, offset and large-format projects, including branded business materials and finishing.',
    h1: 'Commercial Printing Services in Riyadh',
    image: `${baseUrl}/images/digital_printing.png`,
    serviceName: 'Commercial Printing Services'
  },
  'signages.html': {
    title: 'Signage Company in Riyadh | Indoor & Outdoor Signs',
    description: 'Indoor and outdoor signage in Riyadh, including 3D letters, acrylic signs, shop signs, office signs, wayfinding and installation support.',
    h1: 'Signage Company in Riyadh',
    image: `${baseUrl}/images/aqsa_signage_3d.png`,
    serviceName: 'Signage Services'
  },
  'vehicle-branding.html': {
    title: 'Vehicle Branding in Riyadh | Fleet Graphics | AQSA Print',
    description: 'Vehicle branding in Riyadh for full wraps, partial wraps, cut vinyl, fleet graphics, commercial decals and professional installation.',
    h1: 'Vehicle Branding in Riyadh',
    image: `${baseUrl}/images/vehicle_branding_van.png`,
    serviceName: 'Vehicle Branding'
  },
  'quote.html': {
    title: 'Request a Printing Quote in Riyadh | AQSA Print',
    description: 'Send AQSA Print your project details to request a quotation for printing, signage, vehicle branding, exhibition graphics or promotional products.',
    h1: 'Request a Printing Quote',
    image: defaultImage,
    kind: 'page'
  }
};

const fallbackTitles = {
  'exhibition-stall-branding.html': ['Exhibition Stall Branding in Riyadh | AQSA Print', 'Exhibition stall branding in Riyadh with printed panels, counters, backdrops, directional graphics and event display materials.'],
  'flex-banner-printing.html': ['Flex Banner Printing in Riyadh | AQSA Print', 'Flex banner and large-format printing in Riyadh for outdoor promotions, events, construction hoardings, retail displays and campaigns.'],
  'flags.html': ['Custom Flag Printing in Riyadh | AQSA Print', 'Custom flag printing in Riyadh for events, showrooms and promotions, including feather flags, teardrop flags, rectangular flags and table flags.'],
  'frosted-sticker.html': ['Frosted Sticker Printing in Riyadh | AQSA Print', 'Frosted stickers and privacy films in Riyadh for offices, meeting rooms, glass doors, partitions and branded interior spaces.'],
  'full-partial-vehicle-branding.html': ['Full and Partial Vehicle Wraps in Riyadh | AQSA Print', 'Full and partial vehicle branding for business cars, vans and fleets in Riyadh, from artwork preparation to installation.'],
  'gift-sets.html': ['Corporate Gift Sets in Riyadh | AQSA Print', 'Branded corporate gift sets in Riyadh for client gifts, employee recognition, events and promotional campaigns.'],
  'graphic-design.html': ['Graphic Design for Print in Riyadh | AQSA Print', 'Graphic design services in Riyadh for business cards, brochures, signage, banners, packaging and promotional campaigns.'],
  'indoor-outdoor-branding.html': ['Indoor & Outdoor Branding in Riyadh | AQSA Print', 'Indoor and outdoor branding in Riyadh for offices, retail spaces, events, showrooms, walls, windows, signs and promotional displays.'],
  'indoor-signage.html': ['Indoor Signage in Riyadh | AQSA Print', 'Indoor signage in Riyadh for reception areas, offices, showrooms, directional systems, acrylic signs and branded interior graphics.'],
  'lanyards.html': ['Custom Lanyards in Riyadh | AQSA Print', 'Custom lanyards in Riyadh for events, staff IDs, conferences, exhibitions and branded workplace use.'],
  'mementos.html': ['Mementos and Awards in Riyadh | AQSA Print', 'Custom mementos, trophies, awards and plaques in Riyadh for corporate recognition, events, ceremonies and branded gifts.'],
  'outdoor-signage.html': ['Outdoor Signage in Riyadh | AQSA Print', 'Outdoor signage in Riyadh for shops, buildings, wayfinding, events and branded exterior displays with durable material options.'],
  'pop-up-stands.html': ['Pop-Up Stand Printing in Riyadh | AQSA Print', 'Pop-up stand printing and display graphics in Riyadh for exhibitions, retail promotions, conferences and events.'],
  'promotional-apparel.html': ['Promotional Apparel in Riyadh | AQSA Print', 'Promotional apparel branding in Riyadh for uniforms, T-shirts, vests, event clothing and corporate merchandise.'],
  'promotional-bags.html': ['Promotional Bags in Riyadh | AQSA Print', 'Custom promotional bag printing in Riyadh for events, retail campaigns, corporate gifts and branded giveaways.'],
  'promotional-drinkware.html': ['Promotional Drinkware in Riyadh | AQSA Print', 'Custom mugs, bottles and branded drinkware in Riyadh for corporate gifts, events and promotional campaigns.'],
  'promotional-gadgets.html': ['Promotional Gadgets in Riyadh | AQSA Print', 'Promotional gadget branding in Riyadh for USB items, tech gifts, event giveaways and corporate merchandise.'],
  'promotional-stationery.html': ['Promotional Stationery in Riyadh | AQSA Print', 'Promotional stationery printing in Riyadh for notebooks, pens, folders, office gifts and branded business materials.'],
  'rollup-banners.html': ['Roll-Up Banner Printing in Riyadh | AQSA Print', 'Roll-up banner printing in Riyadh for exhibitions, showrooms, events and promotions, with display-ready print and stand options.'],
  'rollups-backdrops.html': ['Roll-Ups and Backdrops in Riyadh | AQSA Print', 'Roll-up banners, exhibition backdrops and event display printing in Riyadh for corporate events, conferences and retail promotions.'],
  'rta-approvals.html': ['RTA Approval Support for Branding | AQSA Print', 'Artwork and branding support for vehicle and signage approval workflows where applicable to business branding projects.'],
  'screen-printing.html': ['Screen Printing in Riyadh | AQSA Print', 'Screen printing in Riyadh for apparel, promotional products, bags, uniforms and branded merchandise in practical production quantities.'],
  'slogan-stickers.html': ['Sticker and Label Printing in Riyadh | AQSA Print', 'Sticker and label printing in Riyadh for packaging, promotions, product labels, decals and custom business use.'],
  'stall-branding.html': ['Stall Branding in Riyadh | AQSA Print', 'Stall branding in Riyadh for exhibitions, kiosks, pop-up retail, conferences and branded event spaces.'],
  'tension-fabric-displays.html': ['Tension Fabric Displays in Riyadh | AQSA Print', 'Tension fabric displays in Riyadh for exhibitions, backdrops, retail graphics and portable event branding.'],
  'traffic-safety-signage.html': ['Traffic Safety Signage in Riyadh | AQSA Print', 'Traffic safety signage in Riyadh for sites, facilities, parking areas, warehouses and workplace safety communication.'],
  'truck-van-branding.html': ['Truck and Van Branding in Riyadh | AQSA Print', 'Truck and van branding in Riyadh for delivery vehicles, service fleets and commercial campaigns using durable vinyl graphics.'],
  'uv-printing.html': ['UV Printing in Riyadh | AQSA Print', 'UV printing in Riyadh for rigid materials, promotional items, acrylic, signage components and branded product surfaces.'],
  'vinyl-branding.html': ['Vinyl Branding in Riyadh | AQSA Print', 'Vinyl branding in Riyadh for windows, walls, vehicles, shops and events using printed graphics, cut vinyl and installation support.'],
  'wall-branding.html': ['Wall Branding in Riyadh | AQSA Print', 'Wall branding and office graphics in Riyadh for reception areas, meeting rooms, retail interiors and branded workplace environments.'],
  'web-design.html': ['Web Design Services in Riyadh | AQSA Print', 'Web design support in Riyadh for businesses that need digital presence alongside print, branding and signage materials.']
};

for (const [file, [title, description]] of Object.entries(fallbackTitles)) {
  metadata[file] = { title, description, image: defaultImage, serviceName: title.replace(/\s*\|.*/, '') };
}

const blogData = require('../data/blogArticles.cjs');
for (const article of blogData) {
  const file = `blog/${article.slug}/index.html`;
  metadata[file] = {
    title: article.seoTitle || `${article.title} | AQSA Print`,
    description: article.metaDescription || article.excerpt,
    h1: article.title,
    image: `${baseUrl}${article.featuredImage || article.image || '/images/aqsa-print-social-share.jpg'}`,
    kind: 'article',
    publishedTime: article.publishedDate || today,
    modifiedTime: article.modifiedDate || article.publishedDate || today
  };
}

function fallbackMeta(file, content) {
  const route = routeFor(file);
  const h1 = h1s(content)[0] || route.split('/').pop().replace(/-/g, ' ');
  const titleText = h1 ? `${h1} | AQSA Print` : 'AQSA Print';
  return {
    title: titleText,
    description: `Learn about ${h1.toLowerCase()} from AQSA Print in Riyadh, including printing, branding, signage and custom production support.`,
    h1,
    image: defaultImage,
    kind: 'page'
  };
}

function seoBlock(file, meta) {
  const canonical = canonicalFor(file);
  const robots = noindexFiles.has(file) ? 'noindex, follow' : 'index, follow, max-image-preview:large';
  const type = meta.kind === 'article' ? 'article' : 'website';
  const ogDescription = meta.ogDescription || meta.description;
  const twitterDescription = meta.twitterDescription || meta.description;
  const image = meta.image || defaultImage;
  const lines = [
    `    <title>${escapeHtml(meta.title)}</title>`,
    `    <meta name="description" content="${escapeAttr(meta.description)}">`,
    `    <link rel="canonical" href="${canonical}">`,
    `    <meta name="robots" content="${robots}">`,
    `    <meta property="og:type" content="${type}">`,
    `    <meta property="og:site_name" content="AQSA Print">`,
    `    <meta property="og:title" content="${escapeAttr(meta.openGraphTitle || meta.title)}">`,
    `    <meta property="og:description" content="${escapeAttr(ogDescription)}">`,
    `    <meta property="og:url" content="${canonical}">`,
    `    <meta property="og:image" content="${escapeAttr(image)}">`,
    `    <meta property="og:locale" content="en_SA">`
  ];
  if (meta.kind === 'article') {
    lines.push(`    <meta property="article:published_time" content="${meta.publishedTime}">`);
    lines.push(`    <meta property="article:modified_time" content="${meta.modifiedTime}">`);
  }
  lines.push(
    `    <meta name="twitter:card" content="summary_large_image">`,
    `    <meta name="twitter:title" content="${escapeAttr(meta.twitterTitle || meta.title)}">`,
    `    <meta name="twitter:description" content="${escapeAttr(twitterDescription)}">`,
    `    <meta name="twitter:image" content="${escapeAttr(meta.twitterImage || image)}">`
  );
  return lines.join('\n');
}

function graphFor(file, meta, content) {
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
      telephone: [primaryPhoneHref, secondaryPhoneHref],
      sameAs: [
        'https://youtube.com/@aqsaprint',
        'https://www.instagram.com/aqsa_print',
        'https://www.facebook.com/share/1Dsn3aHPf3/?mibextid=wwXIfr',
        'https://x.com/aqsaprint_ksa'
      ]
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
      image: meta.image || defaultImage,
      telephone: [primaryPhoneHref, secondaryPhoneHref],
      email: 'info@aqsaprint.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Al Mutanabbi, Al Malaz',
        addressLocality: 'Riyadh',
        postalCode: '12831',
        addressCountry: 'SA'
      },
      areaServed: {
        '@type': 'City',
        name: 'Riyadh',
        containedInPlace: { '@type': 'Country', name: 'Saudi Arabia' }
      }
    });
  }
  if (meta.serviceName && !noindexFiles.has(file)) {
    graph.push({
      '@type': 'Service',
      '@id': `${route}#service`,
      name: meta.serviceName,
      description: meta.description,
      provider: { '@id': `${baseUrl}/#organization` },
      areaServed: { '@type': 'City', name: 'Riyadh' },
      url: route
    });
  }
  if (meta.kind === 'article') {
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${route}#article`,
      headline: meta.h1,
      description: meta.description,
      image: meta.image || defaultImage,
      datePublished: meta.publishedTime,
      dateModified: meta.modifiedTime,
      author: { '@type': 'Organization', name: 'AQSA Print' },
      publisher: { '@id': `${baseUrl}/#organization` },
      mainEntityOfPage: route
    });
  }
  if (content.includes('<details') && !noindexFiles.has(file)) {
    const questions = [...content.matchAll(/<details[^>]*class="[^"]*faq-item[^"]*"[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*<div[^>]*class="[^"]*faq-item-content[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)]
      .slice(0, 12)
      .map((m) => ({
        '@type': 'Question',
        name: stripTags(m[1]),
        acceptedAnswer: { '@type': 'Answer', text: stripTags(m[2]) }
      }));
    if (questions.length) graph.push({ '@type': 'FAQPage', '@id': `${route}#faq`, mainEntity: questions });
  }
  if (file !== 'index.html' && !noindexFiles.has(file)) {
    const crumbs = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` }
    ];
    if (file.startsWith('blog/') && file !== 'blog/index.html') {
      crumbs.push({ '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` });
      crumbs.push({ '@type': 'ListItem', position: 3, name: meta.h1 || meta.title.replace(/\s*\|.*/, ''), item: route });
    } else {
      crumbs.push({ '@type': 'ListItem', position: 2, name: meta.h1 || meta.title.replace(/\s*\|.*/, ''), item: route });
    }
    graph.push({ '@type': 'BreadcrumbList', '@id': `${route}#breadcrumb`, itemListElement: crumbs });
  }
  return graph.length ? `\n    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>` : '';
}

function replaceHeadSeo(content, file, meta) {
  const match = content.match(/<head>([\s\S]*?)<\/head>/i);
  if (!match) return content;
  let head = match[1];
  const keep = [
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
  ];
  for (const item of head.matchAll(/\s*<meta name="google-site-verification"[^>]*>\r?\n?/gi)) keep.push(item[0].trim());
  head = head
    .replace(/\s*<meta charset="[^"]+"[^>]*>/gi, '')
    .replace(/\s*<meta name="viewport"[^>]*>/gi, '')
    .replace(/\s*<title>[\s\S]*?<\/title>/gi, '')
    .replace(/\s*<meta\s+name="description"[^>]*>/gi, '')
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/\s*<meta\s+name="robots"[^>]*>/gi, '')
    .replace(/\s*<meta\s+(property|name)="(?:og:|twitter:|article:)[^"]+"[^>]*>/gi, '')
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '')
    .replace(/\s*<meta name="google-site-verification"[^>]*>/gi, '');
  const rebuilt = `\n${keep.map((line) => `    ${line.trim()}`).join('\n')}${keep.length ? '\n' : ''}${seoBlock(file, meta)}${graphFor(file, meta, content)}\n${head.trimStart()}`;
  return content.replace(match[0], `<head>${rebuilt}</head>`);
}

function replaceFirstH1(content, desired) {
  if (!desired) return content;
  return content.replace(/<h1\b([^>]*)>[\s\S]*?<\/h1>/i, `<h1$1>${escapeHtml(desired)}</h1>`);
}

function addLazyLoading(content) {
  return content.replace(/<img\b(?![^>]*\bloading=)(?![^>]*\bfetchpriority="high")([^>]*)>/gi, (m, attrs) => {
    if (/\bclass="[^"]*(?:logo|footer-logo)[^"]*"/i.test(attrs)) return m;
    return `<img loading="lazy"${attrs}>`;
  });
}

function normalizeFooterYear(content) {
  return content.replace(/<p class="footer-copyright">[\s\S]*?AQSA Print\. All rights reserved\.<\/p>/gi, '<p class="footer-copyright">&copy; <span data-current-year>2026</span> AQSA Print. All rights reserved.</p>');
}

function updateHomepageContent(content) {
  content = content.replace(/<span class="hero-badge">[\s\S]*?<\/span>/, '<span class="hero-badge">Printing, Signage &amp; Branding in Riyadh</span>');
  content = content.replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, '<p class="hero-subtitle">Aqsa Print delivers professional printing, advertising, branding and signage services for businesses in Riyadh, Saudi Arabia.</p>');
  return content;
}

function updateContactDetails(content, file) {
  content = content.replace(/<a href="tel:\+966556683044" class="top-bar-link">\s*<i class="fas fa-phone"><\/i> \+966 55 668 3044\s*<\/a>/g, `<a href="tel:${primaryPhoneHref}" class="top-bar-link">\n                        <i class="fas fa-phone"></i> ${primaryPhoneDisplay}\n                    </a>\n                    <a href="tel:${secondaryPhoneHref}" class="top-bar-link">\n                        <i class="fas fa-mobile-alt"></i> ${secondaryPhoneDisplay}\n                    </a>`);
  content = content.replace(/<li><i class="fas fa-phone"><\/i><span>\+966 55 668 3044<\/span><\/li>/g, `<li><i class="fas fa-phone"></i><span>${primaryPhoneDisplay}</span></li>\n                        <li><i class="fas fa-mobile-alt"></i><span>${secondaryPhoneDisplay}</span></li>`);
  content = content.replace(/Or call us directly: \+966 55 668 3044/g, `Or call us directly: ${primaryPhoneDisplay} / ${secondaryPhoneDisplay}`);
  content = content.replace(/<p class="cta-note"><i class="fas fa-phone"><\/i> (?:Or call us directly: )?\+966 55 668 3044<\/p>/g, `<p class="cta-note"><i class="fas fa-phone"></i> Or call us directly: ${primaryPhoneDisplay} / ${secondaryPhoneDisplay}</p>`);

  if (file === 'contact.html') {
    content = content.replace(/<a href="tel:\+966556683044" style="text-decoration:none;color:inherit">\s*<div class="contact-card">([\s\S]*?)<\/div>\s*<\/a>/, `<div class="contact-card">$1</div>`);
    content = content.replace(/<div><h4>Call Us<\/h4><p><a href="tel:\+966556683044">\+966 55 668 3044<\/a><\/p><p>Sun–Thu, 8 AM – 6 PM<\/p><\/div>/, `<div><h4>Call Us</h4><p><a href="tel:${primaryPhoneHref}">${primaryPhoneDisplay}</a></p><p><a href="tel:${secondaryPhoneHref}">${secondaryPhoneDisplay}</a></p><p>Sun-Thu, 8 AM - 6 PM</p></div>`);
    content = content.replace(/<div><h4>Visit Our Workshop<\/h4><p>Riyadh, Saudi Arabia<\/p><p>By appointment — call ahead<\/p><\/div>/, `<div><h4>Visit Our Workshop</h4><p>${workshopAddress}</p><p><a href="${mapShortUrl}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a></p></div>`);
    content = content.replace(/<iframe src="[^"]*google\.com\/maps\/embed[^"]*" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"><\/iframe>/, `<iframe src="${mapEmbedUrl}" title="AQSA Print location in Al Malaz, Riyadh" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`);
    content = content.replace(/<a href="tel:\+966556683044" class="btn btn-primary btn-lg"><i class="fas fa-phone"><\/i> Call Us<\/a>/, `<a href="tel:${primaryPhoneHref}" class="btn btn-primary btn-lg"><i class="fas fa-phone"></i> Call Us</a>\n                <a href="tel:${secondaryPhoneHref}" class="btn btn-secondary btn-lg"><i class="fas fa-mobile-alt"></i> Secondary Mobile</a>`);
  }

  return content;
}

function auditRow(file, before, after, meta, inSitemap) {
  const currentTitle = attr(before, /<title>([\s\S]*?)<\/title>/i);
  const currentDescription = attr(before, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const currentCanonical = attr(before, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const beforeH1 = h1s(before);
  const issues = [];
  if (!currentTitle) issues.push('Critical: missing title');
  if (!currentDescription) issues.push('High: missing description');
  if (!currentCanonical) issues.push('High: missing canonical');
  if (beforeH1.length !== 1) issues.push(`High: ${beforeH1.length} H1 elements`);
  if (currentTitle && currentTitle !== meta.title) issues.push('Medium: title not aligned with recommended search intent');
  if (currentDescription && currentDescription !== meta.description) issues.push('Medium: description not aligned with recommended search intent');
  if (!inSitemap && !noindexFiles.has(file)) issues.push('Low: public route not listed in sitemap');
  return `| ${canonicalFor(file)} | ${escapeHtml(stripTags(currentTitle))} | ${escapeHtml(currentDescription)} | ${escapeHtml(beforeH1.join(' / '))} | ${escapeHtml(currentCanonical)} | ${issues.join('<br>') || 'None found'} | ${escapeHtml(meta.title)}; self-referencing canonical; unique description; OG/Twitter/JSON-LD. |`;
}

const allFiles = discoverFiles();
const publicFiles = allFiles.filter((file) => !excludeFromSitemap.has(file));
const sitemapSet = new Set((read('sitemap.xml').match(/<loc>(.*?)<\/loc>/g) || []).map((item) => item.replace(/<\/?loc>/g, '')));
const auditRows = [];

for (const file of allFiles) {
  let content = read(file);
  const before = content;
  const meta = metadata[file] || fallbackMeta(file, content);
  if (file === 'index.html') content = updateHomepageContent(content);
  content = updateContactDetails(content, file);
  content = replaceFirstH1(content, meta.h1);
  content = normalizeFooterYear(content);
  content = addLazyLoading(content);
  content = replaceHeadSeo(content, file, meta);
  write(file, content);
  if (!noindexFiles.has(file)) auditRows.push(auditRow(file, before, content, meta, sitemapSet.has(canonicalFor(file))));
}

const sortedPublic = publicFiles
  .filter((file) => !noindexFiles.has(file))
  .sort((a, b) => routeFor(a).localeCompare(routeFor(b)));
const sitemapUrls = sortedPublic.map((file) => `  <url>\n    <loc>${canonicalFor(file)}</loc>\n  </url>`).join('\n');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`);

write('robots.txt', `User-agent: *\nAllow: /\n\nDisallow: /admin-panel\nDisallow: /api/\nDisallow: /login\nDisallow: /thank-you\n\nSitemap: ${baseUrl}/sitemap.xml\n`);

const claimPatterns = [
  ['500+ Happy Clients', /500\+[^<]*(Happy Clients|عميل سعيد)|Join 500\+/gi],
  ['10,000+ Projects', /10,?000\+|10K\+/gi],
  ['24-48hr Turnaround', /24-48\s*hr|24\s*hours|24-48 hours|24â€“48/gi],
  ['5+ Years Experience', /5\+[^<]*Years Experience|since 2020/gi],
  ['Premium Quality Guaranteed', /Premium Quality Guaranteed|Premium Quality/gi],
  ['100% Satisfaction Promise', /100% Satisfaction Promise|Satisfaction Guarantee/gi]
];
const claimRows = [];
for (const file of allFiles) {
  const content = read(file);
  for (const [claim, regex] of claimPatterns) {
    const matches = content.match(regex);
    if (matches) {
      claimRows.push(`| ${routeFor(file)} | ${escapeHtml(claim)} | ${escapeHtml([...new Set(matches)].join('; '))} | Requires owner confirmation | Keep out of structured data. Consider softening if not documented. |`);
    }
  }
}

write('BUSINESS-CLAIMS-VERIFICATION.md', `# Business Claims Verification\n\nDate: ${today}\n\nNo external business records were provided during this pass, so measurable and guarantee-style claims are not marked as verified. They remain visible content unless the owner chooses to soften them.\n\n| URL | Claim | Found Text | Status | Recommendation |\n| --- | --- | --- | --- | --- |\n${claimRows.join('\n') || '| - | - | - | No measurable claims found | - |'}\n`);

write('SEO-METADATA-AUDIT.md', `# SEO Metadata Audit\n\nDate: ${today}\n\n## Site Architecture\n\n- Framework: Static HTML/CSS/JavaScript website.\n- Hosting/routing: Vercel static deployment with \`cleanUrls: true\`; API endpoints under \`/api/*.js\` use Vercel serverless functions.\n- Rendering method: Metadata is rendered directly in initial static HTML.\n- Metadata implementation: Reusable Node script at \`scripts/seo-metadata-pass.cjs\` updates titles, descriptions, canonicals, robots, Open Graph, Twitter and JSON-LD.\n- Canonical domain: \`${baseUrl}\`.\n- Sitemap: Static \`sitemap.xml\` generated from public HTML routes.\n- Robots: Static \`robots.txt\` allows public crawl and excludes admin/API/login/thank-you.\n- English/Arabic handling: Main document language is English. Homepage includes an Arabic slide, but no complete Arabic URL set exists, so hreflang was not added.\n\n## Audit Table\n\n| URL | Current Title | Current Description | H1 | Canonical | Issues | Recommended Fix |\n| --- | --- | --- | --- | --- | --- | --- |\n${auditRows.join('\n')}\n`);

console.log(`SEO metadata pass completed for ${allFiles.length} HTML files.`);
