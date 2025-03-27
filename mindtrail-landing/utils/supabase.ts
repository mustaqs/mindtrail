import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// Note: In a production environment, these should be environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Regular client for client-side operations (with limited permissions)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (with full permissions)
// Only create this client when running on the server
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

// Only initialize the admin client on the server side
if (typeof window === 'undefined') {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
  if (supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  } else {
    console.error('SUPABASE_SERVICE_KEY is not defined. Admin operations will not work.');
  }
} else {
  // On the client side, supabaseAdmin will be null
  supabaseAdmin = null;
}

export { supabaseAdmin };
