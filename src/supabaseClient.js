import { createClient } from "@supabase/supabase-js";

// ==========================================
// SUPABASE CONFIGURATION SIGNALS
// Replace these placeholders with your actual project keys
// ==========================================

// Paste your Supabase URL / API endpoint here
// Note: We automatically clean this URL to ensure both Auth and Rest APIs work perfectly.
const RAW_SUPABASE_URL = "https://pgeizyxtikgjidbejxoy.supabase.co/rest/v1/";

// Paste your Supabase Anon / Public Key here
const SUPABASE_PUBLIC_KEY = "sb_publishable_6liJJONpf_MFa1aSEcvJHw_NSQgDq7s";

// Clean the URL: strip '/rest/v1/' or any trailing slash for proper Auth module endpoint tracking
const SUPABASE_URL = RAW_SUPABASE_URL.split('/rest/')[0].replace(/\/+$/, "");

// Dedicated export of the initialized Supabase client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

