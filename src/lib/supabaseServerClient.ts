import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are set for the server client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// IMPORTANT: Use the service key here, NOT the anon key
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseServiceKey) {
  // This error should ideally be caught during build or server startup
  throw new Error("Missing environment variable: SUPABASE_SERVICE_KEY");
}

// Create and export the Supabase server client
// This client uses the service_role key and should ONLY be used in server-side code
// (Server Components, API routes, getServerSideProps) as it bypasses RLS.
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);

// Re-export types if needed, or import them directly where used
export type { Student, Event, EventParticipant } from './supabaseClient';
