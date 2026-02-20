import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_anon_key";

// Use service role for backend operations to bypass RLS, or Anon key for frontend requests
// This client should only be used in server-side API routes if using service role key
export const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
);

export const supabaseClient = createClient(
    supabaseUrl,
    supabaseAnonKey
);
