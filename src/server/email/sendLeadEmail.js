const nodemailer = require("nodemailer");

const FIELD_LABELS = [
    ["source", "Source"],
    ["serviceNeeded", "Service Needed"],
    ["name", "Name"],
    ["phone", "Phone / WhatsApp"],
    ["email", "Email"],
    ["company", "Company"],
    ["quantity", "Quantity"],
    ["size", "Size"],
    ["location", "Location"],
    ["deadline", "Deadline"],
    ["artworkAvailable", "Artwork Available"],
    ["sourcePage", "Source Page"],
    ["submittedAt", "Submitted At"]
];

function valueOrFallback(value) {
    const text = String(value || "").trim();
    return text || "Not provided";
}

function escapeHtml(value) {
    return valueOrFallback(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function formatSource(source) {
    const labels = {
        chatbot: "Chatbot",
        contact_form: "Contact Form",
        quote_form: "Quote Form",
        service_form: "Service Form"
    };
    return labels[source] || source || "Website Enquiry";
}

function buildLeadRows(leadData) {
    return FIELD_LABELS.map(([key, label]) => {
        const value = key === "source" ? formatSource(leadData.source) : leadData[key];
        return `
            <tr>
                <td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:700;color:#374151;width:180px;">${label}</td>
                <td style="padding:10px 12px;border:1px solid #e5e7eb;color:#111827;">${escapeHtml(value)}</td>
            </tr>
        `;
    }).join("");
}

function buildPlainText(leadData) {
    const lines = ["New AQSA Website Lead", ""];
    FIELD_LABELS.forEach(([key, label]) => {
        const value = key === "source" ? formatSource(leadData.source) : leadData[key];
        lines.push(`${label}: ${valueOrFallback(value)}`);
    });
    lines.push("", "Message:", valueOrFallback(leadData.message));
    lines.push("", "This lead was submitted from AQSA Print website.");
    return lines.join("\n");
}

function buildHtml(leadData) {
    return `
        <div style="font-family:Arial,sans-serif;background:#f3f4f6;padding:24px;">
            <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                <div style="background:linear-gradient(135deg,#E8A5B8,#2DB8A8);padding:22px 24px;color:#ffffff;">
                    <h1 style="margin:0;font-size:22px;">AQSA Print</h1>
                    <p style="margin:6px 0 0;font-size:15px;">New AQSA Website Lead</p>
                </div>
                <div style="padding:24px;">
                    <table style="width:100%;border-collapse:collapse;font-size:14px;">
                        ${buildLeadRows(leadData)}
                    </table>
                    <div style="margin-top:20px;">
                        <h2 style="font-size:16px;margin:0 0 8px;color:#111827;">Message</h2>
                        <div style="white-space:pre-wrap;border:1px solid #e5e7eb;background:#f9fafb;border-radius:8px;padding:14px;color:#374151;">${escapeHtml(leadData.message)}</div>
                    </div>
                </div>
                <div style="padding:14px 24px;background:#f9fafb;color:#6b7280;font-size:12px;">
                    This lead was submitted from AQSA Print website.
                </div>
            </div>
        </div>
    `;
}

function createTransport() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        throw new Error("SMTP credentials are not configured");
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: String(process.env.SMTP_SECURE || "true").toLowerCase() === "true",
        auth: { user, pass }
    });
}

async function sendLeadEmail(leadData) {
    const to = process.env.LEADS_TO_EMAIL || "info@aqsaprint.com";
    const from = process.env.LEADS_FROM_EMAIL || process.env.SMTP_USER || "info@aqsaprint.com";
    const serviceLabel = leadData.serviceNeeded || leadData.formType || formatSource(leadData.source) || "Website Enquiry";
    const replyTo = leadData.email || undefined;
    const transporter = createTransport();

    await transporter.sendMail({
        to,
        from,
        replyTo,
        subject: `New AQSA Lead - ${serviceLabel}`,
        text: buildPlainText(leadData),
        html: buildHtml(leadData)
    });
}

module.exports = { sendLeadEmail };
