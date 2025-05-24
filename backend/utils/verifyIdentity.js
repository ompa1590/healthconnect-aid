
const { supabase } = require('../services/supabase');
const Joi = require('joi');

// Input validation schema
const verifyIdentitySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  dateOfBirth: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
});

const verifyPatientIdentity = async (name, dateOfBirth) => {
  try {
    console.log(`[Identity Verification] Attempting to verify patient with name length: ${name.length}`);
    
    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedDOB = dateOfBirth.trim();
    
    // Validate inputs
    const { error } = verifyIdentitySchema.validate({ 
      name: sanitizedName, 
      dateOfBirth: sanitizedDOB 
    });
    
    if (error) {
      console.log('[Identity Verification] Validation failed:', error.details[0].message);
      return { verified: false, error: 'Invalid input format' };
    }
    
    // Query profiles table for exact name and date of birth match
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, email')
      .eq('name', sanitizedName)
      .eq('date_of_birth', sanitizedDOB)
      .single();
    
    if (profileError) {
      if (profileError.code === 'PGRST116') {
        console.log('[Identity Verification] No matching profile found');
        return { verified: false };
      }
      console.error('[Identity Verification] Database error:', profileError.message);
      throw new Error('Database query failed');
    }
    
    if (!profileData) {
      console.log('[Identity Verification] No matching profile found');
      return { verified: false };
    }
    
    // Check if the patient has any appointments
    const { data: appointmentData, error: appointmentError } = await supabase
      .from('appointments')
      .select('id')
      .eq('patient_id', profileData.id)
      .limit(1);
    
    if (appointmentError) {
      console.error('[Identity Verification] Appointment query error:', appointmentError.message);
      throw new Error('Failed to verify appointment history');
    }
    
    if (!appointmentData || appointmentData.length === 0) {
      console.log('[Identity Verification] Patient found but no appointments');
      return { verified: false, error: 'No appointment history found' };
    }
    
    console.log(`[Identity Verification] Successfully verified patient ID: ${profileData.id}`);
    
    return {
      verified: true,
      patientId: profileData.id,
      patientName: profileData.name
    };
    
  } catch (error) {
    console.error('[Identity Verification] Unexpected error:', error.message);
    throw error;
  }
};

module.exports = { verifyPatientIdentity };
