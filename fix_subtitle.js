const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Pattern for subtitle
    const subRegex = /\.lp-cta\s*>\s*p\s*\{\s*font-size:\s*18px;\s*color:\s*rgba\(255,255,255,\.7\);\s*margin-bottom:\s*3[26]px\s*\}/g;
    if (subRegex.test(content)) {
        content = content.replace(subRegex, '.lp-cta > p{font-size:19px;color:rgba(255,255,255,.95);margin-bottom:40px;font-weight:500}');
        changed = true;
    }

    // Pattern for cta-note
    const ctaRegex = /\.cta-note\s*\{[^}]+\}\s*\.cta-note\s+i\s*\{[^}]+\}/g;
    if (ctaRegex.test(content)) {
        content = content.replace(ctaRegex, '.cta-note{display:flex;align-items:center;justify-content:center;gap:12px;color:rgba(255,255,255,.85);font-size:16px;margin-top:24px}\n        .cta-note i{color:var(--teal-primary);font-size:18px}');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Fixed contrast and alignment in ' + file);
    }
});
