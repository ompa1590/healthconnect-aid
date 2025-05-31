const express = require('express');
const { verifyPatientIdentity } = require('../utils/verifyIdentity');
const { getUpcomingAppointment } = require('../utils/getAppointmentDetails');
const { 
  saveCallAnalysis, 
  callAnalysisExists, 
  parseSuccessEvaluation 
} = require('../utils/callAnalysisUtils');

const router = express.Router();

// IMPORTANT: Declare pendingCalls at module level
const pendingCalls = new Map(); // In production, use Redis or database

// Update your /verifyIdentity route to store patient data in Vapi call metadata
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
    
    // Step 1: Verify patient identity
    const identityResult = await verifyPatientIdentity(name, dateOfBirth);
    console.log('[API] Verification result:', identityResult);
    
    if (!identityResult.verified) {
      const failureResult = {
        results: [{
          toolCallId: toolCallId,
          result: JSON.stringify({
            verified: false,
            error: identityResult.error || 'Identity verification failed'
          })
        }]
      };
      console.log('[API] Returning verification failure:', failureResult);
      return res.status(200).json(failureResult);
    }
    
    // Step 2: If identity verified, fetch appointment details
    console.log('[API] Identity verified, fetching appointment details for patientId:', identityResult.patientId);
    
    let appointmentDetails = {};
    try {
      const appointmentResult = await getUpcomingAppointment(identityResult.patientId);
      console.log('[API] Appointment result:', appointmentResult);
      
      appointmentDetails = {
        appointmentDate: appointmentResult.appointmentDate || null,
        appointmentTime: appointmentResult.appointmentTime || null,
        doctorName: appointmentResult.doctorName || null,
        serviceType: appointmentResult.serviceType || null,
        reason: appointmentResult.reason || null,
        appointmentStatus: appointmentResult.status || (appointmentResult.error ? 'error' : 'found'),
        appointmentMessage: appointmentResult.error || appointmentResult.message || null
      };
    } catch (appointmentError) {
      console.error('[API] Error fetching appointment details:', appointmentError);
      appointmentDetails = {
        appointmentDate: null,
        appointmentTime: null,
        doctorName: null,
        serviceType: null,
        reason: null,
        appointmentStatus: 'error',
        appointmentMessage: 'Failed to retrieve appointment details'
      };
    }
    
    // Step 3: Update Vapi call with patient metadata (if this is a Vapi call)
    if (req.body.message && req.body.message.call) {
      try {
        await updateVapiCallMetadata(req.body.message.call.id, {
          patientId: identityResult.patientId,
          patientName: identityResult.patientName,
          appointmentId: appointmentDetails.appointmentId || null,
          verifiedAt: new Date().toISOString()
        });
        console.log('[API] Updated Vapi call metadata with patient info');
      } catch (metadataError) {
        console.error('[API] Failed to update Vapi call metadata:', metadataError);
        // Don't fail the request if metadata update fails
      }
    }
    
    // Step 4: Return combined result
    const combinedResult = {
      verified: true,
      patientId: identityResult.patientId,
      patientName: identityResult.patientName,
      ...appointmentDetails
    };
    
    const successResult = {
      results: [{
        toolCallId: toolCallId,
        result: JSON.stringify(combinedResult)
      }]
    };
    
    console.log('[API] Returning combined success result:', successResult);
    return res.status(200).json(successResult);
    
  } catch (error) {
    console.error('[API] /verifyIdentity error:', error.message);
    console.error('[API] Full error:', error);
    
    const errorResult = {
      results: [{
        toolCallId: req.body.message?.toolCallList?.[0]?.id || 'unknown',
        result: JSON.stringify({
          verified: false,
          error: 'Internal server error during identity verification and appointment lookup'
        })
      }]
    };
    return res.status(200).json(errorResult);
  }
});

// Helper function to update Vapi call metadata
async function updateVapiCallMetadata(callId, metadata) {
  try {
    const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        metadata: metadata
      })
    });
    
    if (!response.ok) {
      throw new Error(`Vapi API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('[Vapi] Call metadata updated successfully:', { callId, metadata });
    return result;
  } catch (error) {
    console.error('[Vapi] Failed to update call metadata:', error);
    throw error;
  }
}

// Keep the separate getAppointmentDetails endpoint for backward compatibility or direct usage
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

// Enhanced end-of-call-report with proper queued call handling
router.post('/end-of-call-report', async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log('[Vapi] End-of-call report received:', JSON.stringify(req.body, null, 2));
    
    const { message } = req.body;
    const { call } = message;
    
    if (!call) {
      return res.status(400).json({ error: 'No call object found' });
    }
    
    const callInfo = {
      callId: call.id,
      status: call.status,
      endedReason: call.endedReason,
      duration: call.duration,
      cost: call.cost,
      startedAt: call.startedAt,
      endedAt: call.endedAt
    };
    
    console.log('[Vapi] Call info extracted:', callInfo);
    
    // Handle queued/ringing/in-progress calls - schedule them for later processing
    if (['queued', 'ringing', 'in-progress'].includes(call.status)) {
      console.log(`[Vapi] Call ${call.id} still in progress (${call.status}) - scheduling for completion check`);
      
      // Store call info for later processing
      if (!pendingCalls.has(call.id)) {
        pendingCalls.set(call.id, {
          callInfo,
          receivedAt: new Date(),
          retryCount: 0,
          initialStatus: call.status
        });
        
        // Schedule a check for when the call completes
        scheduleCallCompletionCheck(call.id);
      }
      
      return res.status(200).json({ 
        message: 'Webhook received - call in progress, scheduled for completion check',
        callId: call.id,
        status: call.status,
        scheduled: true,
        timestamp: new Date().toISOString()
      });
    }
    
    // Call has ended - check if we have analysis
    if (call.status === 'ended' || call.status === 'completed') {
      if (!call.analysis || Object.keys(call.analysis).length === 0) {
        console.log(`[Vapi] Call ${call.id} ended but no analysis yet - scheduling retry`);
        
        // Store call info for retry
        if (!pendingCalls.has(call.id)) {
          pendingCalls.set(call.id, {
            callInfo,
            receivedAt: new Date(),
            retryCount: 0,
            initialStatus: call.status
          });
        }
        
        // Schedule retry for analysis
        scheduleAnalysisRetry(call.id);
        
        return res.status(200).json({
          message: 'Call ended - analysis pending, retry scheduled',
          callId: call.id,
          status: call.status,
          retryScheduled: true,
          timestamp: new Date().toISOString()
        });
      }
      
      // We have analysis - process it
      console.log(`[Vapi] Call ${call.id} completed with analysis`);
      const result = await processCompletedCall(call);
      
      // Remove from pending if it was there
      pendingCalls.delete(call.id);
      
      return res.status(200).json(result);
    }
    
    // Handle other statuses (failed, etc.)
    console.log(`[Vapi] Call ${call.id} ended with status: ${call.status}`);
    
    // Remove from pending calls since it's definitively ended
    pendingCalls.delete(call.id);
    
    return res.status(200).json({
      message: `Call ended with status: ${call.status}`,
      callInfo,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[Vapi] Error processing webhook:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// New function to check for call completion (for queued/ringing/in-progress calls)
function scheduleCallCompletionCheck(callId, delayMs = 60000) { // Start with 1 minute delay
  console.log(`[Vapi] Scheduling completion check for call ${callId} in ${delayMs}ms`);
  
  setTimeout(async () => {
    const pendingCall = pendingCalls.get(callId);
    if (!pendingCall) {
      console.log(`[Vapi] Call ${callId} no longer pending - skipping completion check`);
      return;
    }
    
    pendingCall.retryCount++;
    console.log(`[Vapi] Completion check attempt ${pendingCall.retryCount} for call ${callId}`);
    
    try {
      // Fetch the call details from Vapi API
      const currentCall = await fetchCallFromVapi(callId);
      
      if (!currentCall) {
        console.error(`[Vapi] Could not fetch call ${callId} from API`);
        if (pendingCall.retryCount < 3) {
          scheduleCallCompletionCheck(callId, Math.min(delayMs * 1.5, 300000));
        } else {
          console.error(`[Vapi] Call ${callId} completion check failed after ${pendingCall.retryCount} attempts`);
          pendingCalls.delete(callId);
          await handleFailedCall(callId, 'Completion check max retries exceeded');
        }
        return;
      }
      
      // Check if call is still in progress
      if (['queued', 'ringing', 'in-progress'].includes(currentCall.status)) {
        console.log(`[Vapi] Call ${callId} still in progress (${currentCall.status})`);
        if (pendingCall.retryCount < 3) {
          scheduleCallCompletionCheck(callId, Math.min(delayMs * 1.2, 180000)); // Cap at 3 minutes
        } else {
          console.error(`[Vapi] Call ${callId} still in progress after ${pendingCall.retryCount} checks - giving up`);
          pendingCalls.delete(callId);
          await handleFailedCall(callId, 'Call completion max retries exceeded');
        }
        return;
      }
      
      // Call has completed - now process it
      if (currentCall.status === 'ended' || currentCall.status === 'completed') {
        if (currentCall.analysis && Object.keys(currentCall.analysis).length > 0) {
          console.log(`[Vapi] Call ${callId} completed with analysis - processing`);
          await processCompletedCall(currentCall);
          pendingCalls.delete(callId);
        } else {
          console.log(`[Vapi] Call ${callId} completed but no analysis - switching to analysis retry`);
          // Switch to analysis retry mechanism
          scheduleAnalysisRetry(callId);
        }
      } else {
        // Call failed or other final status
        console.log(`[Vapi] Call ${callId} ended with final status: ${currentCall.status}`);
        pendingCalls.delete(callId);
        await handleFailedCall(callId, `Call ended with status: ${currentCall.status}`);
      }
      
    } catch (error) {
      console.error(`[Vapi] Completion check failed for call ${callId}:`, error);
      if (pendingCall.retryCount < 3) {
        scheduleCallCompletionCheck(callId, delayMs * 2);
      } else {
        pendingCalls.delete(callId);
        await handleFailedCall(callId, `Completion check error: ${error.message}`);
      }
    }
  }, delayMs);
}

// Retry mechanism for analysis
function scheduleAnalysisRetry(callId, delayMs = 30000) {
  console.log(`[Vapi] Scheduling analysis retry for call ${callId} in ${delayMs}ms`);
  
  setTimeout(async () => {
    const pendingCall = pendingCalls.get(callId);
    if (!pendingCall) {
      console.log(`[Vapi] Call ${callId} no longer pending - skipping analysis retry`);
      return;
    }
    
    pendingCall.retryCount++;
    console.log(`[Vapi] Analysis retry attempt ${pendingCall.retryCount} for call ${callId}`);
    
    try {
      // Fetch the call details from Vapi API
      const completedCall = await fetchCallFromVapi(callId);
      
      if (completedCall && completedCall.analysis && Object.keys(completedCall.analysis).length > 0) {
        console.log(`[Vapi] Retrieved completed call ${callId} with analysis`);
        await processCompletedCall(completedCall);
        pendingCalls.delete(callId);
      } else if (pendingCall.retryCount < 3) {
        // Retry again with exponential backoff
        const nextDelay = delayMs * Math.pow(2, pendingCall.retryCount - 1);
        console.log(`[Vapi] Call ${callId} analysis still incomplete, scheduling retry ${pendingCall.retryCount + 1}`);
        scheduleAnalysisRetry(callId, Math.min(nextDelay, 300000)); // Max 5 minutes
      } else {
        console.error(`[Vapi] Call ${callId} analysis failed after ${pendingCall.retryCount} retries`);
        pendingCalls.delete(callId);
        await handleFailedCall(callId, 'Analysis max retries exceeded');
      }
    } catch (error) {
      console.error(`[Vapi] Analysis retry failed for call ${callId}:`, error);
      if (pendingCall.retryCount < 3) {
        scheduleAnalysisRetry(callId, delayMs * 2);
      } else {
        pendingCalls.delete(callId);
        await handleFailedCall(callId, `Analysis retry error: ${error.message}`);
      }
    }
  }, delayMs);
}

// Function to fetch call data from Vapi API
async function fetchCallFromVapi(callId) {
  try {
    const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Vapi API error: ${response.status} ${response.statusText}`);
    }
    
    const callData = await response.json();
    console.log(`[Vapi] Fetched call ${callId} from API:`, {
      status: callData.status,
      hasAnalysis: !!callData.analysis,
      endedAt: callData.endedAt
    });
    
    // Log detailed analysis content for debugging
    if (callData.analysis) {
      console.log(`[Vapi] Analysis details for call ${callId}:`, {
        summary: callData.analysis.summary || 'NO SUMMARY',
        successEvaluation: callData.analysis.successEvaluation,
        structuredData: callData.analysis.structuredData ? 'PRESENT' : 'MISSING',
        analysisKeys: Object.keys(callData.analysis),
        fullAnalysis: JSON.stringify(callData.analysis, null, 2)
      });
    } else {
      console.log(`[Vapi] No analysis object found for call ${callId}`);
    }
    
    return callData;
  } catch (error) {
    console.error(`[Vapi] Failed to fetch call ${callId}:`, error);
    throw error;
  }
}

async function processCompletedCall(call) {
  console.log(`[Vapi] Processing completed call ${call.id}`);
  
  // Log the full call analysis for debugging
  console.log(`[Vapi] Full call analysis for ${call.id}:`, JSON.stringify(call.analysis, null, 2));
  
  const analysisResult = {
    hasAnalysis: !!call.analysis,
    summary: call.analysis?.summary || null,
    structuredData: null,
    successEvaluation: null,
    errors: []
  };
  
  // Log what we extracted
  console.log(`[Vapi] Extracted analysis data for ${call.id}:`, {
    hasSummary: !!call.analysis?.summary,
    summaryValue: call.analysis?.summary,
    hasSuccessEval: call.analysis?.successEvaluation !== undefined,
    successEvalValue: call.analysis?.successEvaluation,
    hasStructuredData: !!call.analysis?.structuredData
  });
  
  // Process structured data
  if (call.analysis?.structuredData) {
    try {
      analysisResult.structuredData = typeof call.analysis.structuredData === 'string' 
        ? JSON.parse(call.analysis.structuredData)
        : call.analysis.structuredData;
    } catch (error) {
      analysisResult.errors.push(`Failed to parse structured data: ${error.message}`);
    }
  }
  
  // Process success evaluation
  if (call.analysis?.successEvaluation !== undefined) {
    analysisResult.successEvaluation = {
      isSuccessful: call.analysis.successEvaluation === true,
      value: call.analysis.successEvaluation
    };
  }
  
  // Check if we should save to database
  const shouldSaveToDatabase = analysisResult.hasAnalysis && 
                               !!analysisResult.summary && 
                               analysisResult.successEvaluation !== null;
  
  let databaseResult = null;
  let callWasSuccessful = false;
  let failureReason = null;
  
  if (shouldSaveToDatabase) {
    console.log(`[Database] Call ${call.id} meets criteria for database storage`);
    
    // Check if analysis already exists to avoid duplicates
    const alreadyExists = await callAnalysisExists(call.id);
    
    if (alreadyExists) {
      console.log(`[Database] Call analysis for ${call.id} already exists, skipping save`);
      databaseResult = { 
        success: true, 
        message: 'Already exists',
        callSuccessful: true 
      };
    } else {
      // Save to database
      databaseResult = await saveCallAnalysis(call, analysisResult);
      console.log(`[Database] Save result for call ${call.id}:`, {
        success: databaseResult.success,
        callSuccessful: databaseResult.callSuccessful,
        error: databaseResult.error
      });
    }
    
    callWasSuccessful = databaseResult.callSuccessful;
    failureReason = databaseResult.reason;
    
  } else {
    console.log(`[Database] Call ${call.id} does not meet criteria for database storage:`, {
      hasAnalysis: analysisResult.hasAnalysis,
      hasSummary: !!analysisResult.summary,
      hasSuccessEval: analysisResult.successEvaluation !== null
    });
    
    failureReason = 'Incomplete analysis data - missing required fields';
  }
  
  // Execute business logic based on success/failure
  const businessResult = await executeBusinessLogic(call, analysisResult, callWasSuccessful, failureReason);
  
  console.log(`[Vapi] Call ${call.id} processing complete:`, {
    successful: callWasSuccessful,
    savedToDatabase: shouldSaveToDatabase && databaseResult?.success,
    businessLogicExecuted: businessResult.executed
  });
  
  return {
    message: 'Call processed successfully',
    callId: call.id,
    analysis: analysisResult,
    database: databaseResult,
    businessLogic: businessResult,
    callSuccessful: callWasSuccessful,
    failureReason: failureReason,
    timestamp: new Date().toISOString()
  };
}

// Update your executeBusinessLogic function
async function executeBusinessLogic(call, analysisResult, callWasSuccessful, failureReason) {
  const result = {
    executed: false,
    actions: [],
    errors: [],
    nextSteps: []
  };
  
  try {
    if (callWasSuccessful) {
      console.log(`[Business Logic] Call ${call.id} was successful - processing completion`);
      
      result.actions.push('appointment_prescreening_completed');
      result.nextSteps.push('proceed_to_appointment');
      
      // Your success logic here:
      // - Update appointment status
      // - Send confirmation to patient
      // - Notify healthcare provider
      // - Schedule follow-up if needed
      
      // Example:
      // await updateAppointmentStatus(appointmentId, 'prescreened');
      // await sendPatientConfirmation(patientId, appointmentDetails);
      // await notifyProvider(providerId, prescreeningResults);
      
    } else {
      console.log(`[Business Logic] Call ${call.id} was unsuccessful - handling failure`);
      
      result.actions.push('appointment_prescreening_failed');
      result.nextSteps.push('reschedule_prescreening');
      
      // Add failure reason for user feedback
      result.failureDetails = {
        reason: failureReason,
        requiresRescreening: true,
        message: `Pre-screening was incomplete. Reason: ${failureReason}. Please complete the pre-screening process again.`
      };
      
      // Your failure logic here:
      // - Send re-screening notification to patient
      // - Update appointment status to require re-screening
      // - Log failure for review
      // - Schedule retry attempt
      
      // Example:
      // await sendRescreeningRequest(patientId, failureReason);
      // await updateAppointmentStatus(appointmentId, 'requires_rescreening');
      // await logFailureForReview(call.id, failureReason);
      // await scheduleRescreeningReminder(patientId, appointmentId);
    }
    
    result.executed = true;
    
  } catch (error) {
    console.error(`[Business Logic] Error processing call ${call.id}:`, error);
    result.errors.push(error.message);
  }
  
  return result;
}

// Add a new endpoint to handle re-screening requests
router.post('/request-rescreening', async (req, res) => {
  try {
    const { patientId, appointmentId, reason } = req.body;
    
    if (!patientId || !appointmentId) {
      return res.status(400).json({
        error: 'Missing required fields: patientId and appointmentId'
      });
    }
    
    console.log(`[Rescreening] Request received for patient ${patientId}, appointment ${appointmentId}`);
    
    // Your re-screening logic here:
    // - Generate new screening call
    // - Send notification to patient
    // - Update appointment status
    
    // Example implementation:
    // const rescreeningResult = await initiateRescreening(patientId, appointmentId, reason);
    
    res.status(200).json({
      message: 'Re-screening request processed',
      patientId,
      appointmentId,
      reason,
      nextSteps: [
        'Patient will be contacted for re-screening',
        'New pre-screening call will be scheduled',
        'Appointment remains on hold until completion'
      ],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[Rescreening] Error processing request:', error);
    res.status(500).json({
      error: 'Failed to process re-screening request',
      details: error.message
    });
  }
});

// Add endpoint to check call analysis status
router.get('/call-analysis/:callId', async (req, res) => {
  try {
    const { callId } = req.params;
    const analysis = await getCallAnalysis(callId);
    
    if (!analysis) {
      return res.status(404).json({
        error: 'Call analysis not found',
        callId
      });
    }
    
    res.status(200).json({
      callId,
      analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[API] Error retrieving call analysis:', error);
    res.status(500).json({
      error: 'Failed to retrieve call analysis',
      details: error.message
    });
  }
});

// Handle permanently failed calls
async function handleFailedCall(callId, reason) {
  console.error(`[Vapi] Permanently failed call ${callId}: ${reason}`);
  
  // Your failure handling logic here:
  // - Update database status
  // - Send alert to administrators
  // - Maybe schedule manual review
  
  // Example:
  // await updateCallStatus(callId, 'analysis_failed', reason);
  // await sendAdminAlert(`Call ${callId} analysis failed: ${reason}`);
}

// Endpoint to manually trigger call processing (useful for testing)
router.post('/retry-call/:callId', async (req, res) => {
  const { callId } = req.params;
  
  try {
    console.log(`[Vapi] Manual retry requested for call ${callId}`);
    
    const callData = await fetchCallFromVapi(callId);
    
    if (!callData) {
      return res.status(404).json({ error: 'Call not found' });
    }
    
    if (!callData.analysis) {
      return res.status(400).json({ 
        error: 'Call analysis not yet available',
        status: callData.status,
        callId 
      });
    }
    
    const result = await processCompletedCall(callData);
    res.status(200).json(result);
    
  } catch (error) {
    console.error(`[Vapi] Manual retry failed for call ${callId}:`, error);
    res.status(500).json({ 
      error: 'Failed to retry call processing',
      details: error.message 
    });
  }
});

// Endpoint to check pending calls (useful for monitoring)
router.get('/pending-calls', (req, res) => {
  const pending = Array.from(pendingCalls.entries()).map(([callId, data]) => ({
    callId,
    receivedAt: data.receivedAt,
    retryCount: data.retryCount,
    status: data.callInfo.status,
    initialStatus: data.initialStatus
  }));
  
  res.status(200).json({
    pendingCount: pending.length,
    pendingCalls: pending
  });
});

// Your existing business logic function
async function executeBusinessLogic(call, analysisResult) {
  const result = {
    executed: false,
    actions: [],
    errors: []
  };
  
  try {
    if (analysisResult.successEvaluation?.isSuccessful) {
      result.actions.push('appointment_prescreening_completed');
      // Your success logic here
    } else {
      result.actions.push('appointment_prescreening_failed');
      // Your failure logic here
    }
    
    result.executed = true;
  } catch (error) {
    result.errors.push(error.message);
  }
  
  return result;
}

module.exports = router;