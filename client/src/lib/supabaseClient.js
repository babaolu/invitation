import { createClient } from '@supabase/supabase-js';

// The frontend uses the ANON key only — this is safe to expose in the
// browser. Row Level Security policies (see supabase/schema.sql) control
// exactly what this key is allowed to read/write.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// "Invalid path specified in request URL" from Supabase almost always
// means one of these two values is missing, blank, or malformed —
// usually because the .env file wasn't created/filled in, or the dev
// server was started before the .env file was saved (Vite only reads
// .env at startup, so it must be restarted after any change).
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Supabase config error] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing.\n' +
    'Check that client/.env exists (copied from client/.env.example) and is filled in,\n' +
    'then restart the Vite dev server (npm run dev) — env changes require a restart.'
  );
} else if (!/^https?:\/\//.test(supabaseUrl)) {
  console.error(
    `[Supabase config error] VITE_SUPABASE_URL looks malformed: "${supabaseUrl}"\n` +
    'It must be a full URL like https://your-project.supabase.co (no quotes, no trailing slash issues).'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.invalid',
  supabaseAnonKey || 'placeholder-key'
);

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

