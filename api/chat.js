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

function sanitizeLead(input, sourcePage) {
    const lead = input || {};
    return {
        name: sanitize(lead.name, 120),
        phone: sanitize(lead.phone, 80),
        email: sanitize(lead.email, 160),
        company: sanitize(lead.company, 160),
        service_needed: sanitize(lead.serviceNeeded || lead.service_needed, 160),
        quantity: sanitize(lead.quantity, 160),
        size: sanitize(lead.size, 160),
        location: sanitize(lead.location, 200),
        deadline: sanitize(lead.deadline, 160),
        artwork_available: sanitize(lead.artworkAvailable || lead.artwork_available, 160),
        message: sanitize(lead.message),
        source_page: sanitize(sourcePage || lead.sourcePage || lead.source_page, 300)
    };
}

function hasMinimumLeadData(lead) {
    return Boolean(lead.name && lead.phone && lead.service_needed);
}

async function saveLeadIfPossible(lead) {
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

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
        return res.status(429).json({ ok: false, error: "Too many requests" });
    }

    try {
        const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
        const lead = sanitizeLead(body.lead, body.sourcePage);

        if (!hasMinimumLeadData(lead)) {
            return res.status(400).json({ ok: false, error: "Minimum lead details are required" });
        }

        try {
            const result = await saveLeadIfPossible(lead);
            return res.status(200).json({ ok: true, leadSaved: result.saved, reason: result.reason || null });
        } catch (error) {
            console.warn("AQSA chat lead save failed:", error);
            return res.status(200).json({ ok: true, leadSaved: false, reason: "save_failed" });
        }
    } catch (error) {
        console.warn("AQSA chat lead endpoint failed:", error);
        return res.status(200).json({ ok: false, leadSaved: false, reason: "app_error" });
    }
};
