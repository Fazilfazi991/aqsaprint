const fs = require('fs');
const files = ['index.html', 'services.html'];

const replacements = [
    { alt: 'Digital Printing', src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80' },
    { alt: 'Offset Printing', src: 'https://images.pexels.com/photos/4207908/pexels-photo-4207908.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { alt: 'Corporate Gifts', src: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80' },
    { alt: 'Roll-up & Banners', src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80' },
    { alt: 'Mementos', src: 'https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=600&q=80' },
    { alt: 'Photos / Canvas', src: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80' },
    { alt: 'Signage', src: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=600&q=80' },
    { alt: 'Vehicle Branding', src: 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=600&q=80' }
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    replacements.forEach(rep => {
        // Regex to find img with specific alt text and replace its src
        const regex1 = new RegExp('<img[^>]*?src=["\']([^"\']+)["\'][^>]*?alt=["\']' + rep.alt + '["\'][^>]*?>', 'g');
        const regex2 = new RegExp('<img[^>]*?alt=["\']' + rep.alt + '["\'][^>]*?src=["\']([^"\']+)["\'][^>]*?>', 'g');
        
        content = content.replace(regex1, (match, p1) => {
            return match.replace(p1, rep.src);
        });
        content = content.replace(regex2, (match, p1) => {
            return match.replace(p1, rep.src);
        });
    });
    fs.writeFileSync(file, content, 'utf8');
});
console.log('Done replacing image URLs.');
