
const express = require('express');
const { verifyPatientIdentity } = require('../utils/verifyIdentity');
const { getUpcomingAppointment } = require('../utils/getAppointmentDetails');

const router = express.Router();

// POST /vapi/verifyIdentity
router.post('/verifyIdentity', async (req, res) => {
  try {
    const { name, dateOfBirth } = req.body;
    
    // Validate required fields
    if (!name || !dateOfBirth) {
      return res.status(400).json({
        verified: false,
        error: 'Missing required fields: name and dateOfBirth'
      });
    }
    
    const result = await verifyPatientIdentity(name, dateOfBirth);
    
    if (result.verified) {
      return res.status(200).json({
        verified: true,
        patientId: result.patientId,
        patientName: result.patientName
      });
    } else {
      return res.status(200).json({
        verified: false,
        error: result.error || 'Identity verification failed'
      });
    }
    
  } catch (error) {
    console.error('[API] /verifyIdentity error:', error.message);
    return res.status(500).json({
      verified: false,
      error: 'Internal server error during identity verification'
    });
  }
});

// POST /vapi/getAppointmentDetails
router.post('/getAppointmentDetails', async (req, res) => {
  try {
    const { patientId } = req.body;
    
    // Validate required fields
    if (!patientId) {
      return res.status(400).json({
        error: 'Missing required field: patientId'
      });
    }
    
    const result = await getUpcomingAppointment(patientId);
    
    if (result.error && result.status === 'no_upcoming_appointments') {
      return res.status(200).json({
        appointmentDate: null,
        appointmentTime: null,
        doctorName: null,
        serviceType: null,
        status: 'no_upcoming_appointments',
        message: 'No upcoming appointments found'
      });
    }
    
    if (result.error) {
      return res.status(200).json({
        error: result.error
      });
    }
    
    return res.status(200).json({
      appointmentDate: result.appointmentDate,
      appointmentTime: result.appointmentTime,
      doctorName: result.doctorName,
      serviceType: result.serviceType,
      status: result.status,
      reason: result.reason
    });
    
  } catch (error) {
    console.error('[API] /getAppointmentDetails error:', error.message);
    return res.status(500).json({
      error: 'Internal server error while fetching appointment details'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'vapi-triage-backend'
  });
});

module.exports = router;
