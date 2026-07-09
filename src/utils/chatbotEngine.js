(function () {
    const leadDefaults = {
        serviceNeeded: "",
        name: "",
        phone: "",
        email: "",
        company: "",
        quantity: "",
        size: "",
        location: "",
        deadline: "",
        artworkAvailable: "",
        message: ""
    };

    function normalize(text) {
        return String(text || "").toLowerCase().replace(/\s+/g, " ").trim();
    }

    function initialState() {
        return {
            selectedService: "",
            currentQuestionIndex: -1,
            contactStep: "",
            collectedLeadData: { ...leadDefaults },
            leadCompleted: false
        };
    }

    function detectIntent(message) {
        const text = normalize(message);
        if (/\b(price|cost|rate|quotation|quote|estimate|how much)\b/.test(text)) return "price";
        if (/\b(contact|phone|whatsapp|email|location|timing|time|address|number|call)\b/.test(text)) return "contact";
        if (/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(text)) return "greeting";
        return "";
    }

    function detectService(message) {
        const text = normalize(message);
        const flows = window.AQSA_CHAT_FLOWS || {};
        return Object.keys(flows).find((key) => {
            const flow = flows[key];
            return flow.keywords.some((keyword) => text.includes(keyword));
        }) || "";
    }

    function extractPhone(message) {
        const match = String(message || "").match(/(?:\+?\d[\d\s().-]{7,}\d)/);
        return match ? match[0].trim() : "";
    }

    function extractEmail(message) {
        const match = String(message || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
        return match ? match[0].trim() : "";
    }

    function extractName(message) {
        const explicit = String(message || "").match(/\b(?:my name is|name is|i am|i'm)\s+([a-z][a-z\s.'-]{1,50})/i);
        if (explicit) return cleanValue(explicit[1]);

        const text = cleanValue(message);
        if (/^\+?\d/.test(text) || text.includes("@") || text.length > 50) return "";
        return text;
    }

    function extractCompany(message) {
        const explicit = String(message || "").match(/\b(?:company is|company name is|from)\s+([a-z0-9][a-z0-9\s&.'-]{1,60})/i);
        return explicit ? cleanValue(explicit[1]) : "";
    }

    function extractQuantity(message) {
        const match = String(message || "").match(/\b(\d+\s*(?:pcs|pieces|units|cars|vans|trucks|vehicles|banners|cards|boxes|stickers)?)\b/i);
        return match ? cleanValue(match[1]) : "";
    }

    function extractSize(message) {
        const match = String(message || "").match(/\b(\d+(?:\.\d+)?\s*(?:x|by)\s*\d+(?:\.\d+)?\s*(?:cm|mm|m|meter|meters|ft|feet|inch|inches)?)\b/i);
        return match ? cleanValue(match[1]) : "";
    }

    function cleanValue(value) {
        return String(value || "").trim().replace(/[.!,?]+$/, "");
    }

    function mergeExtractedLead(lead, message) {
        const nextLead = { ...lead };
        const phone = extractPhone(message);
        const email = extractEmail(message);
        const company = extractCompany(message);
        const quantity = extractQuantity(message);
        const size = extractSize(message);

        if (phone && !nextLead.phone) nextLead.phone = phone;
        if (email && !nextLead.email) nextLead.email = email;
        if (company && !nextLead.company) nextLead.company = company;
        if (quantity && !nextLead.quantity) nextLead.quantity = quantity;
        if (size && !nextLead.size) nextLead.size = size;
        nextLead.message = [nextLead.message, cleanValue(message)].filter(Boolean).join("\n").slice(-2000);
        return nextLead;
    }

    function saveField(lead, field, message) {
        if (!field) return lead;
        const nextLead = { ...lead };
        const value = cleanValue(message);
        if (!value) return nextLead;

        if (field === "message") {
            nextLead.message = [nextLead.message, value].filter(Boolean).join("\n").slice(-2000);
        } else if (!nextLead[field]) {
            nextLead[field] = value;
        }
        return nextLead;
    }

    function contactReply() {
        const knowledge = window.AQSA_KNOWLEDGE;
        return `You can contact AQSA Print here:\nPhone/WhatsApp: ${knowledge.contact.phone}\nEmail: ${knowledge.contact.email}\nLocation: ${knowledge.contact.location}\nWorking hours: ${knowledge.company.workingHours}.`;
    }

    function leadIsComplete(lead) {
        return Boolean(lead.serviceNeeded && lead.name && lead.phone);
    }

    function leadConfirmation(lead) {
        return `Thank you, ${lead.name}. I've received your requirement for ${lead.serviceNeeded}. AQSA team will contact you shortly on ${lead.phone}.`;
    }

    function nextQuestionForState(state) {
        const flows = window.AQSA_CHAT_FLOWS || {};
        const flow = flows[state.selectedService];
        if (!flow) return "";

        if (state.currentQuestionIndex >= 0 && state.currentQuestionIndex < flow.questions.length) {
            return flow.questions[state.currentQuestionIndex].text;
        }
        if (!state.collectedLeadData.name) return "May I have your name?";
        if (!state.collectedLeadData.phone) return "Please share your phone or WhatsApp number so AQSA team can contact you.";
        if (!state.collectedLeadData.email && !state.collectedLeadData.company) return "Do you have a company name or email to add?";
        return "";
    }

    function advanceQuestionIndex(state) {
        const flow = (window.AQSA_CHAT_FLOWS || {})[state.selectedService];
        if (!flow) return state;

        let index = state.currentQuestionIndex;
        while (index >= 0 && index < flow.questions.length) {
            const field = flow.questions[index].field;
            if (field === "message" || !state.collectedLeadData[field]) break;
            index += 1;
        }
        return { ...state, currentQuestionIndex: index };
    }

    function startServiceFlow(serviceKey, state, message) {
        const flow = window.AQSA_CHAT_FLOWS[serviceKey];
        const lead = mergeExtractedLead({
            ...state.collectedLeadData,
            serviceNeeded: flow.label
        }, message);
        const nextState = {
            ...state,
            selectedService: serviceKey,
            currentQuestionIndex: 0,
            contactStep: "",
            collectedLeadData: lead
        };

        return {
            message: `${flow.answer}\n\n${flow.questions[0].text}`,
            state: nextState,
            quickReplies: [],
            saveLead: false
        };
    }

    function getBotResponse({ userMessage, chatState }) {
        const knowledge = window.AQSA_KNOWLEDGE;
        const flows = window.AQSA_CHAT_FLOWS || {};
        const state = chatState || initialState();
        const intent = detectIntent(userMessage);
        const serviceKey = detectService(userMessage);
        let lead = mergeExtractedLead(state.collectedLeadData, userMessage);

        if (serviceKey && (!state.selectedService || state.leadCompleted)) {
            return startServiceFlow(serviceKey, { ...state, collectedLeadData: lead }, userMessage);
        }

        if (intent === "contact") {
            return { message: contactReply(), state: { ...state, collectedLeadData: lead }, quickReplies: knowledge.quickReplies, saveLead: false };
        }

        if (intent === "price") {
            const followUp = nextQuestionForState({ ...state, collectedLeadData: lead });
            return {
                message: followUp ? `${knowledge.pricingReply}\n\n${followUp}` : knowledge.pricingReply,
                state: { ...state, collectedLeadData: lead },
                quickReplies: [],
                saveLead: false
            };
        }

        if (state.selectedService && !state.leadCompleted) {
            const flow = flows[state.selectedService];
            let nextState = { ...state, collectedLeadData: lead };

            if (state.currentQuestionIndex >= 0 && state.currentQuestionIndex < flow.questions.length) {
                const currentQuestion = flow.questions[state.currentQuestionIndex];
                lead = saveField(lead, currentQuestion.field, userMessage);
                nextState = advanceQuestionIndex({ ...nextState, collectedLeadData: lead, currentQuestionIndex: state.currentQuestionIndex + 1 });
            } else if (!lead.name) {
                lead.name = extractName(userMessage);
                nextState = { ...nextState, collectedLeadData: lead };
            } else if (!lead.phone) {
                const phone = extractPhone(userMessage);
                if (phone) lead.phone = phone;
                nextState = { ...nextState, collectedLeadData: lead };
            } else if (!lead.email || !lead.company) {
                const email = extractEmail(userMessage);
                const company = extractCompany(userMessage);
                if (email) lead.email = email;
                if (company) lead.company = company;
                nextState = { ...nextState, collectedLeadData: lead };
            }

            if (leadIsComplete(lead)) {
                return {
                    message: leadConfirmation(lead),
                    state: { ...nextState, collectedLeadData: lead, leadCompleted: true },
                    quickReplies: knowledge.quickReplies,
                    saveLead: true,
                    lead
                };
            }

            const nextQuestion = nextQuestionForState({ ...nextState, collectedLeadData: lead });
            return {
                message: nextQuestion || "Thanks. Share your phone number and AQSA team will contact you with a quote.",
                state: { ...nextState, collectedLeadData: lead },
                quickReplies: [],
                saveLead: false
            };
        }

        if (intent === "greeting") {
            return { message: knowledge.greeting, state: { ...state, collectedLeadData: lead }, quickReplies: knowledge.quickReplies, saveLead: false };
        }

        return {
            message: knowledge.unknownReply,
            state: { ...state, collectedLeadData: lead },
            quickReplies: knowledge.quickReplies,
            saveLead: false
        };
    }

    window.AQSAChatbotEngine = {
        initialState,
        getBotResponse
    };
}());
