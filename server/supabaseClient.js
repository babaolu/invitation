import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Server uses the SERVICE ROLE key — this bypasses RLS so it can
// read/write guests regardless of policy. NEVER expose this key
// to the frontend/browser. The React app uses the anon key instead.
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
