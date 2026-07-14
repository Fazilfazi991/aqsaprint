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

const AQSA_CHATBOT_STORAGE_KEY = 'aqsa_chatbot_submission_state';
const AQSA_FORM_SUBMIT_URL = 'https://formsubmit.co/ajax/info@aqsaprint.com';
const AQSA_QUOTE_MAX_FILE_SIZE = 5 * 1024 * 1024;
const AQSA_ALLOWED_FILE_EXTENSIONS = new Set(['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'ai', 'eps']);
const AQSA_ALLOWED_FILE_TYPES = new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/postscript',
    'application/illustrator',
    'application/octet-stream'
]);

function isAqsaDevelopmentHost() {
    return ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
}

function safeJsonParse(value, fallback) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        if (isAqsaDevelopmentHost()) {
            console.warn('AQSA chatbot storage contained invalid JSON.');
        }
        return fallback;
    }
}

function getStoredChatbotSubmissionState() {
    const fallback = {
        messages: [],
        capturedContactDetails: {},
        detectedRequirements: {},
        lastMessageAt: ''
    };

    if (window.AQSA_CHATBOT_SUBMISSION_STATE) {
        return {
            ...fallback,
            ...window.AQSA_CHATBOT_SUBMISSION_STATE,
            messages: Array.isArray(window.AQSA_CHATBOT_SUBMISSION_STATE.messages) ? window.AQSA_CHATBOT_SUBMISSION_STATE.messages : []
        };
    }

    try {
        return {
            ...fallback,
            ...safeJsonParse(sessionStorage.getItem(AQSA_CHATBOT_STORAGE_KEY), fallback)
        };
    } catch (error) {
        return fallback;
    }
}

function persistChatbotSubmissionState(state) {
    const safeState = {
        messages: Array.isArray(state.messages) ? state.messages.slice(-40) : [],
        capturedContactDetails: state.capturedContactDetails || {},
        detectedRequirements: state.detectedRequirements || {},
        lastMessageAt: state.lastMessageAt || ''
    };
    window.AQSA_CHATBOT_SUBMISSION_STATE = safeState;
    try {
        sessionStorage.setItem(AQSA_CHATBOT_STORAGE_KEY, JSON.stringify(safeState));
    } catch (error) {
        if (isAqsaDevelopmentHost()) {
            console.warn('AQSA chatbot state could not be stored.');
        }
    }
}

function extractRequirementHints(text) {
    const value = String(text || '');
    return {
        quantity: (value.match(/\b\d+\s*(?:pcs|pieces|units|cards|stickers|banners|boxes|vehicles|cars|vans|trucks)?\b/i) || [''])[0],
        dimensions: (value.match(/\b\d+(?:\.\d+)?\s*(?:x|by)\s*\d+(?:\.\d+)?\s*(?:cm|mm|m|meter|meters|ft|feet|inch|inches)?\b/i) || [''])[0],
        timeline: (value.match(/\b(?:today|tomorrow|urgent|asap|this week|next week|within\s+\d+\s+(?:day|days|week|weeks))\b/i) || [''])[0],
        budget: (value.match(/\b(?:sar|rs|aed|budget)\s*[\d,]+|[\d,]+\s*(?:sar|rs|aed)\b/i) || [''])[0],
        material: (value.match(/\b(?:matte|gloss|vinyl|acrylic|metal|paper|canvas|fabric|foam|aluminium|stainless|lamination)\b/i) || [''])[0]
    };
}

function compactObject(object) {
    return Object.fromEntries(Object.entries(object || {}).filter(([, value]) => {
        if (value == null) return false;
        if (typeof value === 'string') return value.trim() !== '';
        if (typeof value === 'object') return Object.keys(value).length > 0;
        return true;
    }));
}

function buildChatbotSummary({ state, formValues }) {
    // For a true AI-generated summary later, call a secure backend/serverless endpoint here;
    // do not expose AI provider keys in browser JavaScript.
    const captured = compactObject({
        ...(state.capturedContactDetails || {}),
        name: formValues.name || state.capturedContactDetails?.name,
        phone: formValues.phone || state.capturedContactDetails?.phone,
        email: formValues.email || state.capturedContactDetails?.email,
        company: formValues.company || state.capturedContactDetails?.company
    });
    const requirements = compactObject({
        ...(state.detectedRequirements || {}),
        service: formValues.serviceNeeded || state.detectedRequirements?.service,
        quantity: formValues.quantity || state.detectedRequirements?.quantity,
        dimensions: formValues.dimensions || state.detectedRequirements?.dimensions,
        timeline: formValues.timeline || state.detectedRequirements?.timeline,
        budget: formValues.budget || state.detectedRequirements?.budget,
        projectDescription: formValues.projectDescription || state.detectedRequirements?.projectDescription,
        uploadedFile: formValues.uploadedFile || state.detectedRequirements?.uploadedFile
    });

    const transcriptMessages = Array.isArray(state.messages) ? state.messages : [];
    const customerMessages = transcriptMessages.filter((message) => message.role === 'user').map((message) => message.text).filter(Boolean);

    if (!customerMessages.length && !Object.keys(captured).length && !Object.keys(requirements).length) {
        return 'No chatbot conversation was recorded.';
    }

    const lines = ['Customer Requirement Summary'];
    if (captured.name) lines.push(`Name: ${captured.name}`);
    if (captured.phone) lines.push(`Phone: ${captured.phone}`);
    if (captured.email) lines.push(`Email: ${captured.email}`);
    if (captured.company) lines.push(`Company: ${captured.company}`);
    if (requirements.service) lines.push(`Service: ${requirements.service}`);
    if (requirements.quantity) lines.push(`Quantity: ${requirements.quantity}`);
    if (requirements.dimensions) lines.push(`Dimensions: ${requirements.dimensions}`);
    if (requirements.material) lines.push(`Material/Finish: ${requirements.material}`);
    if (requirements.timeline) lines.push(`Timeline: ${requirements.timeline}`);
    if (requirements.budget) lines.push(`Budget: ${requirements.budget}`);
    if (requirements.deliveryLocation) lines.push(`Delivery Location: ${requirements.deliveryLocation}`);
    if (requirements.uploadedFile) lines.push(`Uploaded/Reference File: ${requirements.uploadedFile}`);
    if (requirements.projectDescription) lines.push(`Project Description: ${requirements.projectDescription}`);
    if (customerMessages.length) {
        lines.push(`Conversation Summary: ${customerMessages.slice(-4).join(' | ')}`);
    } else {
        lines.push('Conversation Summary: No chatbot conversation was recorded.');
    }
    return lines.join('\n');
}

function getChatbotSubmissionData(formValues = {}) {
    const state = getStoredChatbotSubmissionState();
    const storedMessages = Array.isArray(state.messages) ? state.messages : [];
    const hasCustomerMessage = storedMessages.some((message) => message.role === 'user');
    const messages = hasCustomerMessage ? storedMessages : [];
    const transcript = messages.length
        ? messages.map((message) => `[${message.at || ''}] ${message.role}: ${message.text}`).join('\n')
        : 'No transcript available.';
    const summary = buildChatbotSummary({ state, formValues });

    return {
        summary,
        transcript,
        messageCount: messages.length,
        lastMessageAt: state.lastMessageAt || '',
        capturedContactDetails: compactObject(state.capturedContactDetails || {}),
        detectedRequirements: compactObject(state.detectedRequirements || {})
    };
}

window.getChatbotSubmissionData = getChatbotSubmissionData;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-current-year]').forEach((element) => {
        element.textContent = new Date().getFullYear();
    });

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
    let submissionState = getStoredChatbotSubmissionState();

    function updateStoredChatbotState(extra = {}) {
        const lead = chatState && chatState.collectedLeadData ? chatState.collectedLeadData : {};
        const selectedService = chatState && chatState.selectedService ? chatState.selectedService : '';
        const latestUserText = (submissionState.messages || []).filter((message) => message.role === 'user').map((message) => message.text).join('\n');
        submissionState = {
            ...submissionState,
            ...extra,
            capturedContactDetails: compactObject({
                ...(submissionState.capturedContactDetails || {}),
                name: lead.name,
                phone: lead.phone,
                email: lead.email,
                company: lead.company
            }),
            detectedRequirements: compactObject({
                ...(submissionState.detectedRequirements || {}),
                service: lead.serviceNeeded || selectedService,
                quantity: lead.quantity,
                dimensions: lead.size,
                timeline: lead.deadline,
                projectDescription: lead.message,
                ...extractRequirementHints(latestUserText)
            })
        };
        persistChatbotSubmissionState(submissionState);
    }

    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function addMessage(role, text, className) {
        const message = document.createElement('div');
        message.className = `message ${className || role}`;
        message.textContent = text;
        chatbotMessages.appendChild(message);
        const storedRole = role === 'assistant' ? 'assistant' : role;
        const at = new Date().toISOString();
        submissionState.messages = [
            ...(Array.isArray(submissionState.messages) ? submissionState.messages : []),
            { role: storedRole, text: String(text || '').slice(0, 1200), at }
        ].slice(-40);
        submissionState.lastMessageAt = at;
        updateStoredChatbotState();
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
            updateStoredChatbotState();
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
        let isSubmitting = false;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (isSubmitting) return;

            if (form.dataset.leadSource === 'quote_form') {
                await handleQuoteFormSubmit({ form, status, submitButton, setSubmitting: (value) => { isSubmitting = value; } });
                return;
            }

            const formData = new FormData(form);

            if (formData.get('website_url') || formData.get('_honey')) {
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

function setLeadStatus(status, message, className) {
    if (!status) return;
    status.textContent = message;
    status.className = `lead-form-status${className ? ` ${className}` : ''}`;
}

function getFieldValue(form, name) {
    const field = form.elements[name];
    return field && typeof field.value === 'string' ? field.value.trim() : '';
}

function updateHiddenField(form, name, value) {
    let field = form.querySelector(`input[type="hidden"][name="${name}"]`);
    if (!field) {
        field = document.createElement('input');
        field.type = 'hidden';
        field.name = name;
        form.appendChild(field);
    }
    field.value = value == null ? '' : String(value);
}

function validateQuoteForm(form) {
    const requiredFields = [
        ['name', 'Please enter your full name.'],
        ['email', 'Please enter your email address.'],
        ['phone', 'Please enter your phone number.']
    ];

    for (const [name, message] of requiredFields) {
        const field = form.elements[name];
        if (!field || !String(field.value || '').trim()) {
            if (field && typeof field.focus === 'function') field.focus();
            return message;
        }
    }

    const email = form.elements.email;
    if (email && !email.checkValidity()) {
        email.focus();
        return 'Please enter a valid email address.';
    }

    const fileInput = form.elements.attachment;
    const file = fileInput && fileInput.files && fileInput.files[0];
    if (file) {
        const extension = (file.name.split('.').pop() || '').toLowerCase();
        if (!AQSA_ALLOWED_FILE_EXTENSIONS.has(extension) || (file.type && !AQSA_ALLOWED_FILE_TYPES.has(file.type))) {
            fileInput.value = '';
            fileInput.focus();
            return 'Please upload a PDF, JPG, JPEG, PNG, DOC, DOCX, AI, or EPS file.';
        }
        if (file.size > AQSA_QUOTE_MAX_FILE_SIZE) {
            fileInput.value = '';
            fileInput.focus();
            return 'Your file is too large to upload through this form. Please send it directly to info@aqsaprint.com or contact us through WhatsApp.';
        }
    }

    return '';
}

function quoteFormValues(form) {
    const file = form.elements.attachment && form.elements.attachment.files ? form.elements.attachment.files[0] : null;
    return {
        name: getFieldValue(form, 'name'),
        email: getFieldValue(form, 'email'),
        phone: getFieldValue(form, 'phone'),
        company: getFieldValue(form, 'company'),
        serviceNeeded: getFieldValue(form, 'serviceNeeded'),
        projectDescription: getFieldValue(form, 'project_details'),
        quantity: getFieldValue(form, 'quantity_dimensions'),
        dimensions: getFieldValue(form, 'quantity_dimensions'),
        timeline: getFieldValue(form, 'timeline'),
        budget: getFieldValue(form, 'budget_range'),
        uploadedFile: file ? `${file.name} (${Math.round(file.size / 1024)} KB)` : ''
    };
}

function buildQuoteFormData(form) {
    const values = quoteFormValues(form);
    const chatData = getChatbotSubmissionData(values);
    const submittedAt = new Date().toISOString();
    const sourcePage = window.location.href;

    updateHiddenField(form, 'chatbot_summary', chatData.summary || 'No chatbot conversation was recorded.');
    updateHiddenField(form, 'chatbot_transcript', chatData.transcript || 'No transcript available.');
    updateHiddenField(form, 'chatbot_message_count', chatData.messageCount || 0);
    updateHiddenField(form, 'chatbot_last_message_at', chatData.lastMessageAt || '');
    updateHiddenField(form, 'chatbot_captured_details', JSON.stringify(chatData.capturedContactDetails || {}));
    updateHiddenField(form, 'chatbot_detected_requirements', JSON.stringify(chatData.detectedRequirements || {}));
    updateHiddenField(form, 'source_page', sourcePage);
    updateHiddenField(form, 'submitted_at', submittedAt);

    const formData = new FormData(form);
    formData.set('_subject', 'New Quote Request - Aqsa Print');
    formData.set('_template', 'table');
    formData.set('_captcha', 'false');
    formData.set('source_page', sourcePage);
    formData.set('submitted_at', submittedAt);
    formData.set('chatbot_summary', chatData.summary || 'No chatbot conversation was recorded.');
    formData.set('chatbot_transcript', chatData.transcript || 'No transcript available.');
    formData.set('chatbot_message_count', String(chatData.messageCount || 0));
    formData.set('chatbot_last_message_at', chatData.lastMessageAt || '');
    formData.set('chatbot_captured_details', JSON.stringify(chatData.capturedContactDetails || {}));
    formData.set('chatbot_detected_requirements', JSON.stringify(chatData.detectedRequirements || {}));
    return formData;
}

async function submitFormSubmitRequest(formData, timeoutMs = 20000) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
        // FormSubmit may send an activation email to info@aqsaprint.com on the first submission.
        // The inbox owner must approve it before normal submissions are delivered.
        return await fetch(AQSA_FORM_SUBMIT_URL, {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json'
            },
            signal: controller.signal
        });
    } finally {
        window.clearTimeout(timeout);
    }
}

async function handleQuoteFormSubmit({ form, status, submitButton, setSubmitting }) {
    const validationError = validateQuoteForm(form);
    if (validationError) {
        setLeadStatus(status, validationError, 'error');
        return;
    }

    if (form.elements.website_url && form.elements.website_url.value) return;
    if (form.elements._honey && form.elements._honey.value) return;

    const originalButtonHtml = submitButton ? submitButton.innerHTML : '';
    setSubmitting(true);
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending Request...';
    }
    setLeadStatus(status, 'Sending Request...', '');

    try {
        const formData = buildQuoteFormData(form);
        const response = await submitFormSubmitRequest(formData);
        const data = await response.json().catch(() => ({}));
        const succeeded = response.ok && (data.success === true || data.success === 'true' || data.message || Object.keys(data).length === 0);

        if (!succeeded) {
            throw new Error(`FormSubmit rejected quote request with status ${response.status}`);
        }

        form.reset();
        setLeadStatus(status, 'Thank you! Your quotation request has been submitted successfully. Our team will contact you shortly.', 'success');
    } catch (error) {
        if (isAqsaDevelopmentHost()) {
            console.warn('AQSA quote submission failed:', error && error.message ? error.message : error);
        } else {
            console.warn('AQSA quote submission failed.');
        }
        setLeadStatus(status, 'We couldn’t submit your request right now. Please try again or email info@aqsaprint.com.', 'error');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHtml;
        }
        setSubmitting(false);
        return;
    }

    if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHtml;
    }
    setSubmitting(false);
}
