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
    
    // Check if the patient has any appointments and get the upcoming one
    const { data: appointmentData, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        appointment_time,
        status,
        reason,
        service_type,
        doctor_name
      `)
      .eq('patient_id', profileData.id)
      .gte('appointment_date', new Date().toISOString().split('T')[0]) // Only future/today appointments
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })
      .limit(1);
    
    if (appointmentError) {
      console.error('[Identity Verification] Appointment query error:', appointmentError.message);
      throw new Error('Failed to verify appointment history');
    }
    
    // Check if patient has any appointments at all (including past ones) for verification
    const { data: allAppointments, error: allAppointmentsError } = await supabase
      .from('appointments')
      .select('id')
      .eq('patient_id', profileData.id)
      .limit(1);
    
    if (allAppointmentsError) {
      console.error('[Identity Verification] All appointments query error:', allAppointmentsError.message);
      throw new Error('Failed to verify appointment history');
    }
    
    if (!allAppointments || allAppointments.length === 0) {
      console.log('[Identity Verification] Patient found but no appointments');
      return { verified: false, error: 'No appointment history found' };
    }
    
    console.log(`[Identity Verification] Successfully verified patient ID: ${profileData.id}`);
    
    // Prepare the response with appointment details
    const response = {
      verified: true,
      patientId: profileData.id,
      patientName: profileData.name
    };
    
    // Add appointment details if upcoming appointment exists
    if (appointmentData && appointmentData.length > 0) {
      const appointment = appointmentData[0];
      response.appointmentDate = appointment.appointment_date;
      response.appointmentTime = appointment.appointment_time;
      response.doctorName = appointment.doctor_name;
      response.serviceType = appointment.service_type;
      response.reason = appointment.reason;
      response.appointmentStatus = 'found';
      response.appointmentMessage = 'Upcoming appointment found';
      console.log(`[Identity Verification] Found upcoming appointment: ${appointment.appointment_date} ${appointment.appointment_time}`);
    } else {
      // Patient verified but no upcoming appointments
      response.appointmentDate = null;
      response.appointmentTime = null;
      response.doctorName = null;
      response.serviceType = null;
      response.reason = null;
      response.appointmentStatus = 'none';
      response.appointmentMessage = 'No upcoming appointments found';
      console.log('[Identity Verification] Patient verified but no upcoming appointments');
    }
    
    return response;
    
  } catch (error) {
    console.error('[Identity Verification] Unexpected error:', error.message);
    throw error;
  }
};

// Keep the original function for backward compatibility if needed
const verifyPatientIdentityOnly = async (name, dateOfBirth) => {
  try {
    console.log(`[Identity Verification Only] Attempting to verify patient with name length: ${name.length}`);
    
    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedDOB = dateOfBirth.trim();
    
    // Validate inputs
    const { error } = verifyIdentitySchema.validate({ 
      name: sanitizedName, 
      dateOfBirth: sanitizedDOB 
    });
    
    if (error) {
      console.log('[Identity Verification Only] Validation failed:', error.details[0].message);
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
        console.log('[Identity Verification Only] No matching profile found');
        return { verified: false };
      }
      console.error('[Identity Verification Only] Database error:', profileError.message);
      throw new Error('Database query failed');
    }
    
    if (!profileData) {
      console.log('[Identity Verification Only] No matching profile found');
      return { verified: false };
    }
    
    // Check if the patient has any appointments
    const { data: appointmentData, error: appointmentError } = await supabase
      .from('appointments')
      .select('id')
      .eq('patient_id', profileData.id)
      .limit(1);
    
    if (appointmentError) {
      console.error('[Identity Verification Only] Appointment query error:', appointmentError.message);
      throw new Error('Failed to verify appointment history');
    }
    
    if (!appointmentData || appointmentData.length === 0) {
      console.log('[Identity Verification Only] Patient found but no appointments');
      return { verified: false, error: 'No appointment history found' };
    }
    
    console.log(`[Identity Verification Only] Successfully verified patient ID: ${profileData.id}`);
    
    return {
      verified: true,
      patientId: profileData.id,
      patientName: profileData.name
    };
    
  } catch (error) {
    console.error('[Identity Verification Only] Unexpected error:', error.message);
    throw error;
  }
};

module.exports = { 
  verifyPatientIdentity,
  verifyPatientIdentityOnly 
};