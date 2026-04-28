const fs = require('fs');
const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    const stickyBarRegex = /<div class="sticky-bar">[\s\S]*?<\/div>/g;
    if (stickyBarRegex.test(content)) {
        content = content.replace(stickyBarRegex, '');
        changed = true;
    }

    const stickyCtaRegex = /<div class="sticky-cta"[\s\S]*?<\/div>/g;
    if (stickyCtaRegex.test(content)) {
        content = content.replace(stickyCtaRegex, '');
        changed = true;
    }
    
    // Some floating buttons might still be there if they were missed
    const floatingRegex = /<div class="floating-buttons">[\s\S]*?<\/div>/g;
    if (floatingRegex.test(content)) {
        content = content.replace(floatingRegex, '');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Cleaned ' + file);
    }
});
