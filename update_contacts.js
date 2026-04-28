const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Replace the raw phone string in links (wa.me / tel:)
    content = content.replace(/966501234567/g, '966556683044');
    
    // 2. Replace the formatted display string globally
    content = content.replace(/\+966 50 123 4567/g, '+966 55 668 3044');

    // 3. Inject Mob 2 into the footer phone block
    // The previous step changed the span to +966 55 668 3044
    content = content.replace(
        /<i class="fas fa-phone"><\/i>\s*<span>\+966 55 668 3044<\/span>/g,
        '<i class="fas fa-phone"></i>\n                            <span>+966 55 668 3044<br>+966 55 989 6763</span>'
    );

    // 4. Update specific text in contact.html
    if (file === 'contact.html') {
        content = content.replace(
            /Main: \+966 55 668 3044<br>Support: \+966 11 987 6543/g,
            'Main: +966 55 668 3044<br>Mob 2: +966 55 989 6763'
        );
    }

    fs.writeFileSync(file, content, 'utf8');
}

console.log('All contacts updated successfully in ' + files.length + ' files.');
