const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client with service role key for backend operations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.error('SUPABASE_URL is not set in environment variables');
  throw new Error('SUPABASE_URL is required');
}

if (!supabaseServiceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

console.log('Supabase URL detected:', supabaseUrl);
console.log('Supabase service role key length:', supabaseServiceRoleKey.length);

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = { supabase };
