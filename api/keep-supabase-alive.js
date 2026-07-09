const SUPABASE_URL = process.env.SUPABASE_URL || "https://enfoikpsxghjbhtnprei.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZm9pa3BzeGdoamJodG5wcmVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTkzMjEsImV4cCI6MjA5NDMzNTMyMX0.DJqi2V9GmjzeAH-sbmrJHzsh4CgEfEW3-jhF6sKILS4";

module.exports = async function handler(req, res) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/portfolio?select=id&limit=1`, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Supabase responded with ${response.status}`);
        }

        res.status(200).json({ ok: true });
    } catch (error) {
        console.warn("Supabase keep-alive failed:", error);
        res.status(200).json({ ok: false });
    }
};
