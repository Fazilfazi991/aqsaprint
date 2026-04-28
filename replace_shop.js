const fs = require('fs');
const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Replace shop.html links with promotional-gifts.html
    const shopRegex = /href="shop\.html"/g;
    if (shopRegex.test(content)) {
        content = content.replace(shopRegex, 'href="promotional-gifts.html"');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Replaced shop.html links in ' + file);
    }
});
