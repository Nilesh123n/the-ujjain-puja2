import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  (import.meta.env.SUPABASE_URL as string) ||
  '';

const supabaseApiKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_API_KEY as string) ||
  (import.meta.env.SUPABASE_API_KEY as string) ||
  '';

export const supabase = (supabaseUrl && supabaseApiKey)
  ? createClient(supabaseUrl, supabaseApiKey)
  : null;
