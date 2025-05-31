const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // or SERVICE_ROLE_KEY for server-side operations
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;