import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseApiKey = process.env.SUPABASE_API_KEY || process.env.VITE_SUPABASE_API_KEY;

let supabase = null;

if (supabaseUrl && supabaseApiKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseApiKey);
    
    // Test connection to Supabase
    supabase
      .from('puja')
      .select('*')
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.warn('Supabase query notice (puja table):', error.message);
        } else {
          console.log('Successfully connected to Supabase database! Records sample:', data?.length || 0);
        }
      })
      .catch((err) => {
        console.warn('Supabase connection test failed:', err.message || err);
      });
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
} else {
  console.log('Supabase credentials missing or pending in environment.');
}

export default supabase;
