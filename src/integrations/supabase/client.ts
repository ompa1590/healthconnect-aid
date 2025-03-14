
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://juwznmplmnkfpmrmrrfv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1d3pubXBsbW5rZnBtcm1ycmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4OTI2MjksImV4cCI6MjA1NzQ2ODYyOX0.G8P3sYB6S-AAMK1HeLhSTTjcmga833SiGdC_URIkT5w";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true
    }
  }
);
