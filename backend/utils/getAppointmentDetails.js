
const { supabase } = require('../services/supabase');
const Joi = require('joi');

// Input validation schema
const appointmentDetailsSchema = Joi.object({
  patientId: Joi.string().uuid().required()
});

const getUpcomingAppointment = async (patientId) => {
  try {
    console.log(`[Appointment Details] Fetching appointment for patient ID: ${patientId}`);
    
    // Validate input
    const { error } = appointmentDetailsSchema.validate({ patientId });
    if (error) {
      console.log('[Appointment Details] Validation failed:', error.details[0].message);
      return { error: 'Invalid patient ID format' };
    }
    
    // Get the most recent upcoming appointment
    const { data: appointmentData, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        appointment_date,
        appointment_time,
        doctor_name,
        service_type,
        service_name,
        status,
        reason
      `)
      .eq('patient_id', patientId)
      .eq('status', 'upcoming')
      .gte('appointment_date', new Date().toISOString().split('T')[0])
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })
      .limit(1);
    
    if (appointmentError) {
      console.error('[Appointment Details] Database error:', appointmentError.message);
      throw new Error('Failed to fetch appointment details');
    }
    
    if (!appointmentData || appointmentData.length === 0) {
      console.log('[Appointment Details] No upcoming appointments found');
      return { 
        error: 'No upcoming appointments found',
        appointmentDate: null,
        appointmentTime: null,
        doctorName: null,
        serviceType: null,
        status: 'no_upcoming_appointments'
      };
    }
    
    const appointment = appointmentData[0];
    console.log(`[Appointment Details] Found appointment on ${appointment.appointment_date}`);
    
    return {
      appointmentDate: appointment.appointment_date,
      appointmentTime: appointment.appointment_time,
      doctorName: appointment.doctor_name || 'TBD',
      serviceType: appointment.service_name || appointment.service_type,
      status: appointment.status,
      reason: appointment.reason
    };
    
  } catch (error) {
    console.error('[Appointment Details] Unexpected error:', error.message);
    throw error;
  }
};

module.exports = { getUpcomingAppointment };
