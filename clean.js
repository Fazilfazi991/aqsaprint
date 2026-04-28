const fs = require('fs');
const path = require('path');
const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Remove sticky-cta
    const stickyRegex = /<div class="sticky-cta" id="stickyCta">[\s\S]*?<\/div>/g;
    if (stickyRegex.test(content)) {
        content = content.replace(stickyRegex, '');
        changed = true;
    }

    // Remove floating-buttons
    const floatingRegex = /<div class="floating-buttons">[\s\S]*?<\/div>/g;
    if (floatingRegex.test(content)) {
        content = content.replace(floatingRegex, '');
        changed = true;
    }

    // Remove the sticky-cta script
    const scriptRegex = /\/\/ Sticky CTA bar on scroll[\s\S]*?\}\);/g;
    if (scriptRegex.test(content)) {
        content = content.replace(scriptRegex, '');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Cleaned ' + file);
    }
});
