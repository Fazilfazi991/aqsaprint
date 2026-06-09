/* ============================================
   AQSA PRINT - CORE JAVASCRIPT
   ============================================ */

/* Compute actual navbar height and apply to hero sections */
function applyNavbarOffset() {
    const topBar = document.querySelector('.top-bar');
    const header = document.querySelector('.header');
    if (!header) return;

    const topBarH = topBar ? topBar.getBoundingClientRect().height : 0;
    const headerH = header.getBoundingClientRect().height;
    const totalH = Math.ceil(topBarH + headerH);

    document.documentElement.style.setProperty('--navbar-height', totalH + 'px');

    // Apply to .hero-content (index page)
    document.querySelectorAll('.hero-content').forEach(el => {
        el.style.paddingTop = (totalH + 40) + 'px';
    });
    // Apply to .about-hero-content and similar inner-page heroes
    document.querySelectorAll('.about-hero-content, .page-hero-content').forEach(el => {
        const section = el.closest('section, .about-hero, .page-hero');
        if (section) section.style.paddingTop = totalH + 'px';
        el.style.paddingTop = '40px';
    });
    // Apply to .page-hero sections directly
    document.querySelectorAll('.page-hero').forEach(el => {
        el.style.paddingTop = (totalH + 20) + 'px';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            // Animate hamburger
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (mobileMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(5px, -5px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Lazy Loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    if (image.dataset.src) {
                        image.src = image.dataset.src;
                        image.classList.remove('lazy');
                        observer.unobserve(image);
                    }
                }
            });
        });

        document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
    }

    // Animated Counters
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.dataset.target);
                    const suffix = target.dataset.suffix || '';
                    const duration = 2000; // ms
                    const startTime = performance.now();
                    
                    function updateCounter(currentTime) {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        
                        // Easing function (easeOutQuad)
                        const easeProgress = progress * (2 - progress);
                        
                        const currentValue = Math.floor(easeProgress * finalValue);
                        target.innerText = currentValue + suffix;
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            target.innerText = finalValue + suffix;
                        }
                    }
                    
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }

    // Chatbot Toggle
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChat = document.getElementById('closeChat');
    const sendMessage = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    const chatbotMessages = document.getElementById('chatbotMessages');

    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });

        if (closeChat) {
            closeChat.addEventListener('click', () => {
                chatbotWindow.classList.remove('active');
            });
        }

        const handleSend = () => {
            const text = chatInput.value.trim();
            if (text) {
                // Add user message
                const userMsg = document.createElement('div');
                userMsg.className = 'message user';
                userMsg.textContent = text;
                chatbotMessages.appendChild(userMsg);
                chatInput.value = '';
                
                // Scroll to bottom
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

                // Simulate bot response (Gemini integration later)
                setTimeout(() => {
                    const botMsg = document.createElement('div');
                    botMsg.className = 'message bot';
                    botMsg.textContent = "Thanks for your message! Our team will get back to you shortly, or you can use WhatsApp for an immediate response.";
                    chatbotMessages.appendChild(botMsg);
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }, 1000);
            }
        };

        if (sendMessage && chatInput) {
            sendMessage.addEventListener('click', handleSend);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSend();
            });
        }
    }
});

// Run navbar offset on load (after fonts/images render) and resize
window.addEventListener('load', applyNavbarOffset);
window.addEventListener('resize', applyNavbarOffset);
// Also run immediately on DOMContentLoaded
document.addEventListener('DOMContentLoaded', applyNavbarOffset);
