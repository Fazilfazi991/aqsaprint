const fs = require('fs');
const path = require('path');

const targetDir = process.cwd();
const htmlFiles = fs.readdirSync(targetDir).filter(f => f.endsWith('.html'));

const replacement = `<h4 class="footer-title">Services</h4>
                    <ul class="footer-links">
                        <li><a href="digital-printing.html">Digital Printing</a></li>
                        <li><a href="offset-printing.html">Offset Printing</a></li>
                        <li><a href="promotional-gifts.html">Corporate Gifts</a></li>
                        <li><a href="rollup-banners.html">Roll-up & Banners</a></li>
                        <li><a href="mementos.html">Mementos</a></li>
                        <li><a href="canvas-printing.html">Photos / Canvas</a></li>
                        <li><a href="signages.html">Signage</a></li>
                        <li><a href="vehicle-branding.html">Vehicle Branding</a></li>
                    </ul>`;

const regex = /<h4 class="footer-title">\s*Services\s*<\/h4>\s*<ul class="footer-links">[\s\S]*?<\/ul>/g;

let updated = 0;
for (const file of htmlFiles) {
    const filePath = path.join(targetDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.match(regex)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        updated++;
    }
}
console.log(`Updated footer in ${updated} files.`);
