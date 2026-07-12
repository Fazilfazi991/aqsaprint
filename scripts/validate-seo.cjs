const fs = require('fs');
const path = require('path');

const root = process.cwd();
const baseUrl = 'https://www.aqsaprint.com';
const noindexRoutes = new Set(['/404', '/admin-panel', '/login', '/thank-you']);

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
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

function fileForRoute(route) {
  if (route === '/') return 'index.html';
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  const html = `${clean}.html`;
  const index = `${clean}/index.html`;
  if (fs.existsSync(path.join(root, html))) return html;
  if (fs.existsSync(path.join(root, index))) return index;
  return null;
}

function text(value) {
  return String(value || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function get(content, regex) {
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

function all(content, regex) {
  return [...content.matchAll(regex)].map((m) => m[1]);
}

function structuredTypes(content, errors) {
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
    } catch (error) {
      errors.push(`Invalid JSON-LD: ${error.message}`);
    }
  }
  return [...types];
}

const sitemapUrls = all(read('sitemap.xml'), /<loc>(.*?)<\/loc>/g);
const sitemapRoutes = new Set(sitemapUrls.map((url) => new URL(url).pathname.replace(/\/$/, '') || '/'));
const files = walk();
const titleMap = new Map();
const descriptionMap = new Map();
const rows = [];
const errors = [];
const localLinks = new Set();

for (const file of files) {
  const route = routeFor(file);
  const content = read(file);
  const title = text(get(content, /<title>([\s\S]*?)<\/title>/i));
  const description = get(content, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const canonical = get(content, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const robots = get(content, /<meta\s+name="robots"\s+content="([^"]*)"/i);
  const h1 = all(content, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).map(text);
  const ogImage = get(content, /<meta\s+property="og:image"\s+content="([^"]*)"/i);
  const routeErrors = [];
  const indexable = !noindexRoutes.has(route);
  const types = structuredTypes(content, routeErrors);

  if (!title) routeErrors.push('Missing title');
  if (!description) routeErrors.push('Missing description');
  if (!canonical) routeErrors.push('Missing canonical');
  if (canonical && canonical !== `${baseUrl}${route === '/' ? '/' : route}`) routeErrors.push('Canonical does not match final URL');
  if (indexable && !robots.includes('index, follow')) routeErrors.push('Indexable route missing index/follow');
  if (indexable && h1.length !== 1) routeErrors.push(`Expected one H1, found ${h1.length}`);
  if (indexable && !sitemapRoutes.has(route)) routeErrors.push('Indexable route missing from sitemap');
  if (indexable && ogImage && !ogImage.startsWith('https://')) routeErrors.push('Open Graph image is not absolute');
  if (indexable && !types.length) routeErrors.push('Missing structured data');

  if (indexable) {
    titleMap.set(title, [...(titleMap.get(title) || []), route]);
    descriptionMap.set(description, [...(descriptionMap.get(description) || []), route]);
  }

  for (const href of all(content, /<a\b[^>]*\shref="([^"]+)"/gi)) {
    if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/api/')) {
      localLinks.add(href.split('#')[0].split('?')[0] || '/');
    }
  }

  errors.push(...routeErrors.map((item) => `${route}: ${item}`));
  rows.push({
    route,
    status: indexable ? 200 : 'noindex',
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    canonical,
    robots,
    h1Count: h1.length,
    h1: h1.join(' / '),
    ogImage,
    structuredDataTypes: types.join(', '),
    sitemapStatus: sitemapRoutes.has(route) ? 'In sitemap' : 'Not in sitemap',
    issues: routeErrors.join('; ')
  });
}

for (const [title, routes] of titleMap.entries()) {
  if (title && routes.length > 1) errors.push(`Duplicate title "${title}": ${routes.join(', ')}`);
}
for (const [description, routes] of descriptionMap.entries()) {
  if (description && routes.length > 1) errors.push(`Duplicate description "${description}": ${routes.join(', ')}`);
}
for (const url of sitemapUrls) {
  const pathname = new URL(url).pathname.replace(/\/$/, '') || '/';
  if (!fileForRoute(pathname)) errors.push(`Sitemap URL has no local file: ${url}`);
}
for (const link of localLinks) {
  if (link === '/sitemap.xml' || link === '/robots.txt') continue;
  if (!fileForRoute(link.replace(/\/$/, '') || '/')) errors.push(`Broken local link target: ${link}`);
}

const report = [
  '# SEO Metadata Validation Report',
  '',
  `Date: 2026-07-12`,
  '',
  `Routes checked: ${rows.length}`,
  `Sitemap URLs: ${sitemapUrls.length}`,
  `Errors: ${errors.length}`,
  '',
  '## Issues',
  '',
  ...(errors.length ? errors.map((error) => `- ${error}`) : ['- None']),
  '',
  '## Route Metadata',
  '',
  '| URL | HTTP status | Title | Title length | Description | Description length | Canonical | Robots | H1 count | H1 | Open Graph image | Structured data types | Sitemap status |',
  '| --- | --- | --- | ---: | --- | ---: | --- | --- | ---: | --- | --- | --- | --- |',
  ...rows
    .filter((row) => row.status === 200)
    .sort((a, b) => a.route.localeCompare(b.route))
    .map((row) => `| ${baseUrl}${row.route === '/' ? '/' : row.route} | ${row.status} | ${row.title.replace(/\|/g, '\\|')} | ${row.titleLength} | ${row.description.replace(/\|/g, '\\|')} | ${row.descriptionLength} | ${row.canonical} | ${row.robots} | ${row.h1Count} | ${row.h1.replace(/\|/g, '\\|')} | ${row.ogImage} | ${row.structuredDataTypes} | ${row.sitemapStatus} |`)
].join('\n');

fs.writeFileSync(path.join(root, 'SEO-METADATA-VALIDATION.md'), report, 'utf8');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`SEO validation passed for ${rows.length} routes.`);
