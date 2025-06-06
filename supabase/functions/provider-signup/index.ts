
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
    // Starting the function handler
    console.log("Provider signup edge function started")
    
    let reqBody;
    try {
      reqBody = await req.json()
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return createResponse({ 
        success: false, 
        error: "Invalid JSON in request body" 
      }, 400)
    }
    
    const { providerData, userId } = reqBody
    
    if (!userId) {
      console.error("Missing userId in request")
      return createResponse({ 
        success: false, 
        error: "Missing required parameter: userId" 
      }, 400)
    }
    
    if (!providerData) {
      console.error("Missing providerData in request")
      return createResponse({ 
        success: false, 
        error: "Missing required parameter: providerData" 
      }, 400)
    }
    
    console.log('Creating provider profile for user:', userId)
    console.log('Provider data summary:', {
      provider_type: providerData.providerType,
      email: providerData.email,
      name: `${providerData.firstName} ${providerData.lastName}`,
      data_size: JSON.stringify(providerData).length,
    })

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
    
    try {
      // Create the provider profile
      const { data, error } = await adminAuthClient
        .from('provider_profiles')
        .insert(profileData)
        
      if (error) {
        console.error('Error creating provider profile:', error)
        return createResponse({ success: false, error: error.message }, 400)
      }
      
      console.log('Provider profile created successfully')
      
      // Also add a record to the profiles table for general user data
      const { error: profilesError } = await adminAuthClient
        .from('profiles')
        .upsert({
          id: userId,
          name: `${providerData.firstName} ${providerData.lastName}`,
          email: providerData.email,
          role: 'provider'
        })
        
      if (profilesError) {
        console.error('Warning: Error creating general profile record:', profilesError)
        // Continue anyway since the provider profile was created
      }
      
      return createResponse({ 
        success: true, 
        message: "Provider profile created successfully" 
      })
    } catch (dbError) {
      console.error('Database error in provider profile creation:', dbError)
      return createResponse({ 
        success: false, 
        error: dbError instanceof Error ? dbError.message : String(dbError) 
      }, 500)
    }
  } catch (error) {
    console.error('Unexpected exception in provider profile creation:', error)
    return createResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    }, 500)
  }
}

async function handleFileUpload(req: Request) {
  try {
    console.log("Provider file upload edge function started")
    
    let reqBody;
    try {
      reqBody = await req.json()
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return createResponse({ 
        success: false, 
        error: "Invalid JSON in request body" 
      }, 400)
    }
    
    const { userId, fileType, fileData, fileName } = reqBody
    
    if (!userId) {
      return createResponse({ 
        success: false, 
        error: "Missing required parameter: userId" 
      }, 400)
    }
    
    if (!fileType || !fileData) {
      return createResponse({ 
        success: false, 
        error: "Missing required parameters: fileType or fileData" 
      }, 400)
    }
    
    console.log(`Processing ${fileType} upload for user: ${userId}`)
    
    // Here we would handle file upload to storage bucket
    // This function is just acknowledging receipt, actual file upload is done client-side
    // But we can save metadata about the file or update user profile with file references
    
    // Update provider profile with reference to uploaded file
    if (fileType === 'profile_picture' && fileName) {
      try {
        const { error } = await adminAuthClient
          .from('provider_profiles')
          .update({ 
            profile_image_path: fileName 
          })
          .eq('id', userId)
          
        if (error) {
          console.error('Error updating profile with file reference:', error)
        }
      } catch (err) {
        console.error('Exception updating profile with file reference:', err)
      }
    }
    
    return createResponse({
      success: true, 
      message: `${fileType} received successfully`,
      userId: userId
    })
  } catch (error) {
    console.error('Error in file upload:', error)
    return createResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    }, 500)
  }
}

// Request handler
serve(async (req) => {
  // Display information about the request for debugging
  console.log(`Provider signup function received ${req.method} request to ${req.url}`)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    if (path === 'create-profile') {
      return await handleCreateProviderProfile(req)
    } else if (path === 'upload-file') {
      return await handleFileUpload(req)
    } else if (path === 'health-check') {
      return createResponse({ status: 'ok', message: 'Provider signup function is healthy' })
    }
    
    return createResponse({ error: 'Invalid endpoint' }, 404)
  } catch (error) {
    console.error('Error handling request:', error)
    return createResponse({ 
      error: error instanceof Error ? error.message : String(error) 
    }, 500)
  }
})
