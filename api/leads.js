const { sendLeadEmail } = require("../src/server/email/sendLeadEmail");

const MAX_FIELD_LENGTH = 2000;
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

function sanitize(value, maxLength = MAX_FIELD_LENGTH) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function sanitizeLead(input) {
    const lead = input || {};
    return {
        source: sanitize(lead.source, 80) || "website",
        formType: sanitize(lead.formType, 120),
        name: sanitize(lead.name, 120),
        phone: sanitize(lead.phone, 80),
        email: sanitize(lead.email, 160),
        company: sanitize(lead.company, 160),
        serviceNeeded: sanitize(lead.serviceNeeded || lead.service_needed || lead.service || lead.service_type, 160),
        quantity: sanitize(lead.quantity, 160),
        size: sanitize(lead.size, 160),
        location: sanitize(lead.location, 200),
        deadline: sanitize(lead.deadline || lead.timeline, 160),
        artworkAvailable: sanitize(lead.artworkAvailable || lead.artwork_available, 160),
        message: sanitize(lead.message || lead.project_details),
        sourcePage: sanitize(lead.sourcePage || lead.source_page, 300),
        submittedAt: new Date().toISOString()
    };
}

function toSupabaseLead(lead) {
    return {
        source: lead.source,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        company: lead.company,
        service_needed: lead.serviceNeeded,
        quantity: lead.quantity,
        size: lead.size,
        location: lead.location,
        deadline: lead.deadline,
        artwork_available: lead.artworkAvailable,
        message: lead.message,
        source_page: lead.sourcePage
    };
}

function validateLead(lead) {
    if (!lead.message && !lead.serviceNeeded) {
        return "Please share a message or service needed.";
    }
    if (lead.source === "chatbot" && (!lead.name || !lead.phone || !lead.serviceNeeded)) {
        return "Minimum chatbot lead details are required.";
    }
    return "";
}

async function saveLeadToSupabase(lead) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.info("AQSA lead captured. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to save it.", lead);
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
        body: JSON.stringify(toSupabaseLead(lead))
    });

    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`Supabase lead insert failed: ${response.status} ${detail}`);
    }

    return { saved: true };
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
        return res.status(429).json({ success: false, message: "Please try again shortly." });
    }

    try {
        const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
        if (sanitize(body.website_url, 300)) {
            return res.status(200).json({ success: true });
        }

        const lead = sanitizeLead(body);
        const validationError = validateLead(lead);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        let supabaseSaved = false;
        let emailSent = false;

        try {
            const result = await saveLeadToSupabase(lead);
            supabaseSaved = result.saved;
        } catch (error) {
            console.warn("AQSA lead Supabase save failed:", error);
        }

        try {
            await sendLeadEmail(lead);
            emailSent = true;
        } catch (error) {
            console.warn("AQSA lead email failed:", error);
        }

        if (!supabaseSaved && !emailSent) {
            return res.status(200).json({
                success: false,
                message: "Sorry, something went wrong. Please try again or contact us directly at info@aqsaprint.com."
            });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.warn("AQSA leads endpoint failed:", error);
        return res.status(200).json({
            success: false,
            message: "Sorry, something went wrong. Please try again or contact us directly at info@aqsaprint.com."
        });
    }
};
