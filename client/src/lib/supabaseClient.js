import { createClient } from '@supabase/supabase-js';

// The frontend uses the ANON key only — this is safe to expose in the
// browser. Row Level Security policies (see supabase/schema.sql) control
// exactly what this key is allowed to read/write.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
