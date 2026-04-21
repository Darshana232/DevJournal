import { createClient } from '@supabase/supabase-js';

/**
 * Singleton Supabase client.
 * Reads credentials from Vite env variables (set in .env).
 * Import `supabase` wherever you need DB or Auth access.
 */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
