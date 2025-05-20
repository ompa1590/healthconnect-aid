
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Create a Supabase client with the service role key for admin operations
const adminAuthClient = createClient(supabaseUrl, serviceRoleKey)

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper for creating consistent response objects
const createResponse = (body: any, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function handleCreateProviderProfile(req: Request) {
  try {
    const { providerData, userId } = await req.json()
    console.log('Creating provider profile for user:', userId)

    // Map provider data to the database schema
    const profileData = {
      id: userId,
      first_name: providerData.firstName,
      last_name: providerData.lastName,
      email: providerData.email,
      phone_number: providerData.phoneNumber,
      provider_type: providerData.providerType,
      registration_number: providerData.registrationNumber,
      specializations: providerData.specializations,
      biography: providerData.biography,
      availability: providerData.availability,
      date_of_birth: providerData.dateOfBirth?.split('T')[0],
      registration_expiry: providerData.registrationExpiry?.split('T')[0],
      address_line1: providerData.address,
      city: providerData.city,
      state: providerData.province,
      zip_code: providerData.postalCode
    }
    
    console.log('Provider profile data structure:', Object.keys(profileData))
    
    // Create the provider profile
    const { data, error } = await adminAuthClient
      .from('provider_profiles')
      .insert(profileData)
      
    if (error) {
      console.error('Error creating provider profile:', error)
      return createResponse({ success: false, error: error.message }, 400)
    }
    
    return createResponse({ 
      success: true, 
      message: "Provider profile created successfully" 
    })
  } catch (error) {
    console.error('Exception in provider profile creation:', error)
    return createResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    }, 500)
  }
}

// Request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    if (path === 'create-profile') {
      return await handleCreateProviderProfile(req)
    }
    
    return createResponse({ error: 'Invalid endpoint' }, 404)
  } catch (error) {
    console.error('Error handling request:', error)
    return createResponse({ 
      error: error instanceof Error ? error.message : String(error) 
    }, 500)
  }
})
