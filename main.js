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

    initAqsaChatbot();
    initAqsaLeadForms();
});

async function loadAqsaChatbotEngine() {
    const scripts = [
        'src/data/aqsaKnowledge.js',
        'src/data/chatFlows.js',
        'src/utils/chatbotEngine.js'
    ];

    for (const src of scripts) {
        if (document.querySelector(`script[src="${src}"]`)) continue;
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Unable to load ${src}`));
            document.head.appendChild(script);
        });
    }
}

async function initAqsaChatbot() {
    try {
        await loadAqsaChatbotEngine();
    } catch (error) {
        console.warn('AQSA chatbot local engine failed to load:', error);
        return;
    }

    let chatbotToggle = document.getElementById('chatbotToggle');
    let chatbotWindow = document.getElementById('chatbotWindow');

    if (!chatbotToggle || !chatbotWindow) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="chatbot-toggle" id="chatbotToggle" aria-label="Open AQSA assistant" role="button" tabindex="0">
                <i class="fas fa-comment-dots" aria-hidden="true"></i>
            </div>
            <div class="chatbot-window" id="chatbotWindow" aria-live="polite">
                <div class="chatbot-header">
                    <div>
                        <span class="chatbot-kicker">AQSA Print</span>
                        <h4>AQSA Assistant</h4>
                    </div>
                    <button id="closeChat" class="chatbot-close" aria-label="Minimize chat"><i class="fas fa-times" aria-hidden="true"></i></button>
                </div>
                <div class="chatbot-messages" id="chatbotMessages"></div>
                <div class="chatbot-input">
                    <input type="text" placeholder="Type your message..." id="chatInput" maxlength="800" autocomplete="off">
                    <button id="sendMessage" aria-label="Send message"><i class="fas fa-paper-plane" aria-hidden="true"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(wrapper);
        chatbotToggle = document.getElementById('chatbotToggle');
        chatbotWindow = document.getElementById('chatbotWindow');
    }

    const closeChat = document.getElementById('closeChat');
    const sendMessage = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const knowledge = window.AQSA_KNOWLEDGE;
    const engine = window.AQSAChatbotEngine;
    let isSending = false;

    if (!chatbotToggle || !chatbotWindow || !chatInput || !sendMessage || !chatbotMessages || !knowledge || !engine) return;
    let chatState = engine.initialState();

    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function addMessage(role, text, className) {
        const message = document.createElement('div');
        message.className = `message ${className || role}`;
        message.textContent = text;
        chatbotMessages.appendChild(message);
        scrollToBottom();
        return message;
    }

    function renderQuickReplies(replyItems) {
        const existingReplies = chatbotMessages.querySelector('.chatbot-quick-replies');
        if (existingReplies) existingReplies.remove();

        const items = replyItems && replyItems.length ? replyItems : knowledge.quickReplies;
        if (!items.length) return;

        const repliesContainer = document.createElement('div');
        repliesContainer.className = 'chatbot-quick-replies';
        items.forEach((reply) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = reply;
            button.addEventListener('click', () => handleSend(reply));
            repliesContainer.appendChild(button);
        });
        chatbotMessages.appendChild(repliesContainer);
        scrollToBottom();
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'message bot chatbot-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        chatbotMessages.appendChild(typing);
        scrollToBottom();
        return typing;
    }

    function setSendingState(nextState) {
        isSending = nextState;
        sendMessage.disabled = nextState;
        chatInput.disabled = nextState;
        chatbotWindow.classList.toggle('is-loading', nextState);
    }

    function waitForTypingDelay() {
        const delay = 400 + Math.floor(Math.random() * 301);
        return new Promise((resolve) => setTimeout(resolve, delay));
    }

    async function saveLead(lead) {
        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...lead,
                    source: 'chatbot',
                    sourcePage: window.location.pathname
                })
            });
            if (!response.ok) throw new Error('Lead save request failed');
            const data = await response.json();
            if (!data.success) {
                console.info('AQSA chat lead captured but email/Supabase delivery was not confirmed.');
            }
        } catch (error) {
            console.warn('AQSA chat lead save failed:', error);
        }
    }

    async function handleSend(value) {
        const text = (value || chatInput.value || '').trim();
        if (!text || isSending) return;

        if (text.length > 800) {
            addMessage('bot', 'Please keep your message under 800 characters so AQSA team can understand it clearly.', 'bot');
            return;
        }

        const existingReplies = chatbotMessages.querySelector('.chatbot-quick-replies');
        if (existingReplies) existingReplies.remove();

        addMessage('user', text, 'user');
        chatInput.value = '';
        setSendingState(true);
        const typing = showTyping();

        try {
            const result = engine.getBotResponse({
                userMessage: text,
                chatState
            });

            chatState = result.state;
            await waitForTypingDelay();
            typing.remove();
            addMessage('assistant', result.message, 'bot');

            if (result.quickReplies && result.quickReplies.length) {
                renderQuickReplies(result.quickReplies);
            }

            if (result.saveLead && result.lead) {
                saveLead(result.lead);
            }
        } catch (error) {
            console.warn('AQSA chatbot error:', error);
            typing.remove();
            addMessage('assistant', knowledge.unknownReply, 'bot');
            renderQuickReplies();
        } finally {
            setSendingState(false);
            chatInput.focus();
        }
    }

    chatbotMessages.innerHTML = '';
    addMessage('assistant', knowledge.greeting, 'bot');
    renderQuickReplies(knowledge.quickReplies);

    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            setTimeout(() => chatInput.focus(), 150);
        }
    });

    chatbotToggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            chatbotToggle.click();
        }
    });

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }

    sendMessage.addEventListener('click', () => handleSend());
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    });
}

// Run navbar offset on load (after fonts/images render) and resize
window.addEventListener('load', applyNavbarOffset);
window.addEventListener('resize', applyNavbarOffset);
// Also run immediately on DOMContentLoaded
document.addEventListener('DOMContentLoaded', applyNavbarOffset);

function initAqsaLeadForms() {
    document.querySelectorAll('form[data-lead-form]').forEach((form) => {
        const status = form.querySelector('[data-lead-status]');
        const submitButton = form.querySelector('[type="submit"]');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);

            if (formData.get('website_url')) {
                form.reset();
                if (status) {
                    status.textContent = 'Thank you. AQSA team will contact you shortly.';
                    status.className = 'lead-form-status success';
                }
                return;
            }

            const payload = {
                source: form.dataset.leadSource || 'service_form',
                formType: form.dataset.leadType || '',
                sourcePage: window.location.pathname,
                name: formData.get('name') || '',
                phone: formData.get('phone') || '',
                email: formData.get('email') || '',
                company: formData.get('company') || '',
                serviceNeeded: formData.get('serviceNeeded') || formData.get('service') || formData.get('service_type') || '',
                quantity: formData.get('quantity') || '',
                size: formData.get('size') || '',
                location: formData.get('location') || '',
                deadline: formData.get('deadline') || formData.get('timeline') || '',
                artworkAvailable: formData.get('artworkAvailable') || '',
                message: formData.get('message') || formData.get('project_details') || ''
            };

            const quantityDimensions = formData.get('quantity_dimensions');
            const budgetRange = formData.get('budget_range');
            const attachment = formData.get('attachment');
            const extraLines = [];
            if (quantityDimensions) extraLines.push(`Quantity/Dimensions: ${quantityDimensions}`);
            if (budgetRange) extraLines.push(`Budget Range: ${budgetRange}`);
            if (attachment && attachment.name) extraLines.push(`Attachment filename: ${attachment.name}`);
            if (extraLines.length) {
                payload.message = [payload.message, ...extraLines].filter(Boolean).join('\n');
            }
            if (!payload.serviceNeeded && payload.source === 'contact_form') {
                payload.serviceNeeded = 'Contact Form';
            }
            if (!payload.quantity && quantityDimensions) {
                payload.quantity = quantityDimensions;
            }

            if (status) {
                status.textContent = 'Sending...';
                status.className = 'lead-form-status';
            }
            if (submitButton) submitButton.disabled = true;

            try {
                const response = await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json().catch(() => ({}));
                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Lead submit failed');
                }
                form.reset();
                if (status) {
                    status.textContent = 'Thank you. AQSA team will contact you shortly.';
                    status.className = 'lead-form-status success';
                }
            } catch (error) {
                console.warn('AQSA lead form failed:', error);
                if (status) {
                    status.textContent = 'Sorry, something went wrong. Please try again or contact us directly at info@aqsaprint.com.';
                    status.className = 'lead-form-status error';
                }
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
    });
}
