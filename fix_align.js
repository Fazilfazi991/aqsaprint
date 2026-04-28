const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    const regex = /\.cta-note\s*\{[^}]+\}\s*\.cta-note\s+i\s*\{[^}]+\}/g;
    if (regex.test(content)) {
        content = content.replace(regex, '.cta-note{display:flex;align-items:center;justify-content:center;gap:8px;color:rgba(255,255,255,.6);font-size:15px;margin-top:12px}\n        .cta-note i{color:var(--teal-primary);margin-top:2px}');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Fixed alignment in ' + file);
    }
});
