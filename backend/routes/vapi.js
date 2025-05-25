const express = require('express');
const { verifyPatientIdentity } = require('../utils/verifyIdentity');
const { getUpcomingAppointment } = require('../utils/getAppointmentDetails');

const router = express.Router();

router.post('/verifyIdentity', async (req, res) => {
  try {
    console.log('[Vapi] Received request:', JSON.stringify(req.body, null, 2));
    
    // Handle Vapi request format
    let name, dateOfBirth, toolCallId;
    
    // Check if this is a direct call or Vapi format
    if (req.body.message && req.body.message.toolCallList) {
      // Vapi format
      const toolCall = req.body.message.toolCallList[0];
      toolCallId = toolCall.id;
      
      // Parse the arguments JSON string
      let parsedArgs;
      try {
        parsedArgs = typeof toolCall.function.arguments === 'string' 
          ? JSON.parse(toolCall.function.arguments)
          : toolCall.function.arguments;
      } catch (parseError) {
        console.error('[API] Failed to parse tool arguments:', parseError);
        return res.status(200).json({
          results: [{
            toolCallId: toolCall.id,
            result: JSON.stringify({
              verified: false,
              error: 'Invalid arguments format'
            })
          }]
        });
      }
      
      name = parsedArgs.name;
      dateOfBirth = parsedArgs.dateOfBirth;
    } else {
      // Direct format (for testing)
      name = req.body.name;
      dateOfBirth = req.body.dateOfBirth;
      toolCallId = 'direct-call';
    }
    
    console.log('[API] Extracted data:', { name, dateOfBirth, toolCallId });
    
    // Validate required fields
    if (!name || !dateOfBirth) {
      const errorResult = {
        results: [{
          toolCallId: toolCallId || 'unknown',
          result: JSON.stringify({
            verified: false,
            error: 'Missing required fields: name and dateOfBirth'
          })
        }]
      };
      console.log('[API] Missing fields, returning:', errorResult);
      return res.status(200).json(errorResult);
    }
    
    const result = await verifyPatientIdentity(name, dateOfBirth);
    console.log('[API] Verification result:', result);
    
    if (result.verified) {
      const successResult = {
        results: [{
          toolCallId: toolCallId,
          result: JSON.stringify({
            verified: true,
            patientId: result.patientId,
            patientName: result.patientName
          })
        }]
      };
      console.log('[API] Returning success:', successResult);
      return res.status(200).json(successResult);
    } else {
      const failureResult = {
        results: [{
          toolCallId: toolCallId,
          result: JSON.stringify({
            verified: false,
            error: result.error || 'Identity verification failed'
          })
        }]
      };
      console.log('[API] Returning failure:', failureResult);
      return res.status(200).json(failureResult);
    }
    
  } catch (error) {
    console.error('[API] /verifyIdentity error:', error.message);
    console.error('[API] Full error:', error);
    
    const errorResult = {
      results: [{
        toolCallId: req.body.message?.toolCallList?.[0]?.id || 'unknown',
        result: JSON.stringify({
          verified: false,
          error: 'Internal server error during identity verification'
        })
      }]
    };
    return res.status(200).json(errorResult);
  }
});

// POST /vapi/getAppointmentDetails
router.post('/getAppointmentDetails', async (req, res) => {
  try {
    console.log('[Vapi] getAppointmentDetails request:', JSON.stringify(req.body, null, 2));
    
    let patientId, toolCallId;
    
    // Handle Vapi format vs direct format
    if (req.body.message && req.body.message.toolCallList) {
      // Vapi format
      const toolCall = req.body.message.toolCallList[0];
      toolCallId = toolCall.id;
      
      let parsedArgs;
      try {
        parsedArgs = typeof toolCall.function.arguments === 'string' 
          ? JSON.parse(toolCall.function.arguments)
          : toolCall.function.arguments;
      } catch (parseError) {
        console.error('[API] Failed to parse tool arguments:', parseError);
        return res.status(200).json({
          results: [{
            toolCallId: toolCall.id,
            result: JSON.stringify({
              error: 'Invalid arguments format'
            })
          }]
        });
      }
      
      patientId = parsedArgs.patientId;
    } else {
      // Direct format
      patientId = req.body.patientId;
      toolCallId = 'direct-call';
    }
    
    // Validate required fields
    if (!patientId) {
      const errorResult = req.body.message ? {
        results: [{
          toolCallId: toolCallId,
          result: JSON.stringify({
            error: 'Missing required field: patientId'
          })
        }]
      } : {
        error: 'Missing required field: patientId'
      };
      return res.status(400).json(errorResult);
    }
    
    const result = await getUpcomingAppointment(patientId);
    
    const responseData = {
      appointmentDate: result.appointmentDate || null,
      appointmentTime: result.appointmentTime || null,
      doctorName: result.doctorName || null,
      serviceType: result.serviceType || null,
      status: result.status || (result.error ? 'error' : 'success'),
      message: result.error || result.message,
      reason: result.reason || null
    };
    
    if (req.body.message) {
      // Vapi format response
      return res.status(200).json({
        results: [{
          toolCallId: toolCallId,
          result: JSON.stringify(responseData)
        }]
      });
    } else {
      // Direct format response
      return res.status(200).json(responseData);
    }
    
  } catch (error) {
    console.error('[API] /getAppointmentDetails error:', error.message);
    
    const errorResult = req.body.message ? {
      results: [{
        toolCallId: req.body.message?.toolCallList?.[0]?.id || 'unknown',
        result: JSON.stringify({
          error: 'Internal server error while fetching appointment details'
        })
      }]
    } : {
      error: 'Internal server error while fetching appointment details'
    };
    
    return res.status(500).json(errorResult);
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