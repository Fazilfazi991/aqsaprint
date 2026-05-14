const SUPABASE_URL = "https://enfoikpsxghjbhtnprei.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZm9pa3BzeGdoamJodG5wcmVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTkzMjEsImV4cCI6MjA5NDMzNTMyMX0.DJqi2V9GmjzeAH-sbmrJHzsh4CgEfEW3-jhF6sKILS4";

// This will be initialized in the browser
let supabase;

function initSupabase() {
    if (typeof supabasejs !== 'undefined') {
        supabase = supabasejs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.error("Supabase library not loaded. Make sure to include the CDN script.");
    }
}
