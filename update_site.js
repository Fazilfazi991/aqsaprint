const fs = require('fs');
const path = require('path');

const logoImgTag = '<img src="images/logo.png" alt="AQSA Print Logo" class="logo-img">';
const footerLogoTag = '<img src="images/logo.png" alt="AQSA Print Logo" class="footer-logo-img">';

const chatbotHtml = `
    <!-- CHATBOT -->
    <div class="chatbot-toggle" id="chatbotToggle">
        <i class="fas fa-comment-dots"></i>
    </div>
    <div class="chatbot-window" id="chatbotWindow">
        <div class="chatbot-header">
            <h4>AQSA Assistant</h4>
            <button id="closeChat" style="background:none; border:none; color:#fff; cursor:pointer;"><i class="fas fa-times"></i></button>
        </div>
        <div class="chatbot-messages" id="chatbotMessages">
            <div class="message bot">Hello! I'm AQSA's AI assistant. How can I help you today?</div>
        </div>
        <div class="chatbot-input">
            <input type="text" placeholder="Type your message..." id="chatInput">
            <button id="sendMessage"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>
`;

const updateFile = (filename) => {
    let content = fs.readFileSync(filename, 'utf8');
    
    // Replace header logo
    let newContent = content.replace(/<a href="index\.html" class="logo">[\s\S]*?<\/a>/g, 
                     `<a href="index.html" class="logo">${logoImgTag}</a>`);
    
    if (newContent === content) {
        newContent = content.replace(/<a href=".*?" class="logo">[\s\S]*?<\/a>/g, 
                         `<a href="index.html" class="logo">${logoImgTag}</a>`);
    }

    // Replace footer logo
    newContent = newContent.replace(/<div class="footer-logo">[\s\S]*?<\/div>/g, 
                     `<div class="footer-logo">${footerLogoTag}</div>`);
    
    // Inject chatbot
    if (!newContent.includes('id="chatbotToggle"')) {
        newContent = newContent.replace('</body>', chatbotHtml + '\n</body>');
    }
    
    if (newContent !== content) {
        fs.writeFileSync(filename, newContent, 'utf8');
        return true;
    }
    return false;
};

const files = fs.readdirSync('.');
let count = 0;
files.forEach(file => {
    if (file.endsWith('.html')) {
        if (updateFile(file)) {
            count++;
        }
    }
});

console.log(`Updated ${count} HTML files with new logo and chatbot UI.`);
