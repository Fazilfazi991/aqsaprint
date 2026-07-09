const { AQSA_SYSTEM_INSTRUCTION } = require("./aqsa-config");

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const FALLBACK_REPLY = "Sorry, I'm having trouble responding right now. You can share your requirement and phone number, and our team will contact you.";
const MAX_MESSAGE_LENGTH = 800;
const MAX_HISTORY_ITEMS = 15;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestLog = new Map();

function getClientIp(req) {
    const forwardedFor = req.headers["x-forwarded-for"];
    if (typeof forwardedFor === "string" && forwardedFor.trim()) {
        return forwardedFor.split(",")[0].trim();
    }
    return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : "unknown";
}

function isRateLimited(ip) {
    const now = Date.now();
    const recent = (requestLog.get(ip) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
    recent.push(now);
    requestLog.set(ip, recent);
    return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

function sanitizeMessage(message) {
    return String(message || "").replace(/\s+/g, " ").trim().slice(0, MAX_MESSAGE_LENGTH);
}

function sanitizeHistory(history) {
    if (!Array.isArray(history)) return [];

    return history
        .slice(-MAX_HISTORY_ITEMS)
        .map((item) => ({
            role: item && item.role === "assistant" ? "model" : "user",
            text: sanitizeMessage(item && item.content)
        }))
        .filter((item) => item.text);
}

function extractLead(history, sourcePage) {
    const combined = history.map((item) => item.text).join("\n");
    const userCombined = history.filter((item) => item.role === "user").map((item) => item.text).join("\n");
    const phoneMatch = combined.match(/(?:\+?\d[\d\s().-]{7,}\d)/);
    const emailMatch = combined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const nameMatch = combined.match(/\b(?:my name is|name is|i am|i'm)\s+([a-z][a-z\s.'-]{1,50})/i);
    const companyMatch = combined.match(/\b(?:company is|from|company name is)\s+([a-z0-9][a-z0-9\s&.'-]{1,60})/i);
    const serviceKeywords = [
        "signage", "sign", "3d letters", "acrylic", "led", "flex",
        "vehicle branding", "fleet", "car sticker", "van branding", "truck branding",
        "printing", "business card", "flyer", "brochure", "poster", "banner",
        "packaging", "label", "custom box", "sticker",
        "exhibition", "event", "branding", "logo"
    ];
    const service = serviceKeywords.find((keyword) => combined.toLowerCase().includes(keyword));

    const lead = {
        name: nameMatch ? nameMatch[1].trim().replace(/[.!,?]+$/, "") : null,
        phone: phoneMatch ? phoneMatch[0].trim() : null,
        email: emailMatch ? emailMatch[0].trim() : null,
        company: companyMatch ? companyMatch[1].trim().replace(/[.!,?]+$/, "") : null,
        service_needed: service || null,
        message: userCombined.slice(-2000),
        source_page: sourcePage || null
    };

    return lead.name && lead.phone && lead.service_needed ? lead : null;
}

async function saveLeadIfPossible(lead) {
    if (!lead) return { saved: false, reason: "not_enough_data" };

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.info("AQSA chat lead captured. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to save it.", lead);
        return { saved: false, reason: "supabase_not_configured" };
    }

    const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/chat_leads`, {
        method: "POST",
        headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
        },
        body: JSON.stringify(lead)
    });

    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`Supabase lead insert failed: ${response.status} ${detail}`);
    }

    return { saved: true };
}

async function callGemini(message, history) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Missing GEMINI_API_KEY");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
        const contents = history.map((item) => ({
            role: item.role,
            parts: [{ text: item.text }]
        }));
        contents.push({ role: "user", parts: [{ text: message }] });

        const response = await fetch(`${GEMINI_API_URL}?key=${encodeURIComponent(apiKey)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: AQSA_SYSTEM_INSTRUCTION }]
                },
                contents,
                generationConfig: {
                    temperature: 0.45,
                    maxOutputTokens: 260
                }
            })
        });

        if (!response.ok) {
            const detail = await response.text().catch(() => "");
            throw new Error(`Gemini API failed: ${response.status} ${detail}`);
        }

        const data = await response.json();
        return data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
            ? data.candidates[0].content.parts.map((part) => part.text || "").join(" ").trim()
            : "";
    } finally {
        clearTimeout(timeout);
    }
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
        return res.status(429).json({ reply: FALLBACK_REPLY, error: "Too many requests" });
    }

    try {
        const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
        const message = sanitizeMessage(body.message);
        const history = sanitizeHistory(body.history);

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const reply = await callGemini(message, history);
        const fullHistory = [...history, { role: "user", text: message }];
        const lead = extractLead(fullHistory, sanitizeMessage(body.sourcePage));
        let leadStatus = { saved: false, reason: "not_enough_data" };

        try {
            leadStatus = await saveLeadIfPossible(lead);
        } catch (leadError) {
            console.warn("AQSA chat lead save failed:", leadError);
            leadStatus = { saved: false, reason: "save_failed" };
        }

        return res.status(200).json({
            reply: reply || FALLBACK_REPLY,
            leadSaved: leadStatus.saved
        });
    } catch (error) {
        console.warn("AQSA chat failed:", error);
        return res.status(200).json({ reply: FALLBACK_REPLY, error: "chat_failed" });
    }
};
