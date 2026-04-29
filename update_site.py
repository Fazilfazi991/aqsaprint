import os
import re

html_dir = "."
logo_img_tag = '<img src="images/logo.png" alt="AQSA Print Logo" class="logo-img">'
footer_logo_tag = '<img src="images/logo.png" alt="AQSA Print Logo" class="footer-logo-img">'

chatbot_html = """
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
"""

def update_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace header logo
    # The header logo is usually inside <a href="index.html" class="logo"> ... </a>
    new_content = re.sub(r'<a href="index\.html" class="logo">.*?</a>', 
                     f'<a href="index.html" class="logo">{logo_img_tag}</a>', 
                     content, flags=re.DOTALL)
    
    if new_content == content:
        # Try without the .html link for subpages that might link differently
        new_content = re.sub(r'<a href=".*?" class="logo">.*?</a>', 
                         f'<a href="index.html" class="logo">{logo_img_tag}</a>', 
                         content, flags=re.DOTALL)

    # Replace footer logo
    new_content = re.sub(r'<div class="footer-logo">.*?</div>', 
                     f'<div class="footer-logo">{footer_logo_tag}</div>', 
                     new_content, flags=re.DOTALL)
    
    # Inject chatbot
    if 'id="chatbotToggle"' not in new_content:
        new_content = new_content.replace('</body>', chatbot_html + '\n</body>')
    
    if new_content != content:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

count = 0
for filename in os.listdir(html_dir):
    if filename.endswith(".html"):
        if update_file(filename):
            count += 1

print(f"Updated {count} HTML files with new logo and chatbot UI.")
