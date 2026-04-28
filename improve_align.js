const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. Remove style="margin-right:8px" from icons inside buttons
    // Pattern: <i class="[^"]+" style="margin-right:8px"></i>
    const iconStyleRegex = /<i class="([^"]+)" style="margin-right:8px"><\/i>/g;
    if (iconStyleRegex.test(content)) {
        content = content.replace(iconStyleRegex, '<i class="$1"></i>');
        changed = true;
    }

    // 2. Fix cta-note CSS (remove margin-top:2px from i, improve centering)
    const ctaRegex = /\.cta-note\s*\{[^}]+\}\s*\.cta-note\s+i\s*\{[^}]+\}/g;
    if (ctaRegex.test(content)) {
        content = content.replace(ctaRegex, '.cta-note{display:flex;align-items:center;justify-content:center;gap:10px;color:rgba(255,255,255,.6);font-size:15px;margin-top:16px}\n        .cta-note i{color:var(--teal-primary);font-size:16px}');
        changed = true;
    }
    
    // 3. Ensure buttons have min-width for better alignment
    if (content.includes('.cta-buttons{')) {
        content = content.replace('.cta-buttons{', '.cta-buttons{display:flex;flex-wrap:wrap;justify-content:center;gap:16px;margin-bottom:24px}\n        .cta-buttons .btn{min-width:220px}');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Improved alignment in ' + file);
    }
});
