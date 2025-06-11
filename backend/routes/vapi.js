const express = require('express');
const { verifyPatientIdentity } = require('../utils/verifyIdentity');
const { getUpcomingAppointment } = require('../utils/getAppointmentDetails');
const { 
  saveCallAnalysis, 
  callAnalysisExists, 
  getCallAnalysis,
  parseSuccessEvaluation,
  updateAppointmentStatus
} = require('../utils/callAnalysisUtils');

const router = express.Router();

const pendingCalls = new Map();

router.post('/verifyIdentity', async (req, res) => {
  try {
    console.log('[Vapi] Received request:', JSON.stringify(req.body, null, 2));
    
    let name, dateOfBirth, toolCallId;
    
    if (req.body.message && req.body.message.toolCallList) {
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
              verified: false,
              error: 'Invalid arguments format'
            })
          }]
        });
      }
      
      name = parsedArgs.name;
      dateOfBirth = parsedArgs.dateOfBirth;
    } else {
      name = req.body.name;
      dateOfBirth = req.body.dateOfBirth;
      toolCallId = 'direct-call';
    }
    
    console.log('[API] Extracted data:', { name, dateOfBirth, toolCallId });
    
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
      }
    }
    
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

router.post('/getAppointmentDetails', async (req, res) => {
  try {
    console.log('[Vapi] getAppointmentDetails request:', JSON.stringify(req.body, null, 2));
    
    let patientId, toolCallId;
    
    if (req.body.message && req.body.message && req.body.message.toolCallList) {
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
      patientId = req.body.patientId;
      toolCallId = 'direct-call';
    }
    
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
      status: result.status || 'completed',
      message: result.error || result.message,
      reason: result.reason || null
    };
    
    if (req.body.message) {
      return res.status(200).json({
        results: [{
          toolCallId: toolCallId,
          result: JSON.stringify(responseData)
        }]});
      } else {
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
  
  router.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'vapi-triage-backend'
    });
  });
  
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
      
      if (['queued', 'ringing', 'in-progress'].includes(call.status)) {
        console.log(`[Vapi] Call ${call.id} still in progress (${call.status}) - scheduling for completion check`);
        
        if (!pendingCalls.has(call.id)) {
          pendingCalls.set(call.id, {
            callInfo,
            receivedAt: new Date(),
            retryCount: 0,
            initialStatus: call.status
          });
          
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
      
      if (call.status === 'ended' || call.status === 'completed') {
        if (!call.analysis || Object.keys(call.analysis).length === 0) {
          console.log(`[Vapi] Call ${call.id} ended but no analysis yet - scheduling retry`);
          
          if (!pendingCalls.has(call.id)) {
            pendingCalls.set(call.id, {
              callInfo,
              receivedAt: new Date(),
              retryCount: 0,
              initialStatus: call.status
            });
          }
          
          scheduleAnalysisRetry(call.id);
          
          return res.status(200).json({
            message: 'Call ended - analysis pending, retry scheduled',
            callId: call.id,
            status: call.status,
            retryScheduled: true,
            timestamp: new Date().toISOString()
          });
        }
        
        console.log(`[Vapi] Call ${call.id} completed with analysis`);
        const result = await processCompletedCall(call);
        
        pendingCalls.delete(call.id);
        
        return res.status(200).json(result);
      }
      
      console.log(`[Vapi] Call ${call.id} ended with status: ${call.status}`);
      
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
  
  function scheduleCallCompletionCheck(callId, delayMs = 60000) {
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
        
        if (['queued', 'ringing', 'in-progress'].includes(currentCall.status)) {
          console.log(`[Vapi] Call ${callId} still in progress (${currentCall.status})`);
          if (pendingCall.retryCount < 3) {
            scheduleCallCompletionCheck(callId, Math.min(delayMs * 1.2, 180000));
          } else {
            console.error(`[Vapi] Call ${callId} still in progress after ${pendingCall.retryCount} checks - giving up`);
            pendingCalls.delete(callId);
            await handleFailedCall(callId, 'Call completion max retries exceeded');
          }
          return;
        }
        
        if (currentCall.status === 'ended' || currentCall.status === 'completed') {
          if (currentCall.analysis && Object.keys(currentCall.analysis).length > 0) {
            console.log(`[Vapi] Call ${callId} completed with analysis - processing`);
            await processCompletedCall(currentCall);
            pendingCalls.delete(callId);
          } else {
            console.log(`[Vapi] Call ${callId} completed but no analysis - switching to analysis retry`);
            scheduleAnalysisRetry(callId);
          }
        } else {
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
        const completedCall = await fetchCallFromVapi(callId);
        
        if (completedCall && completedCall.analysis && Object.keys(completedCall.analysis).length > 0) {
          console.log(`[Vapi] Retrieved completed call ${callId} with analysis`);
          await processCompletedCall(completedCall);
          pendingCalls.delete(callId);
        } else if (pendingCall.retryCount < 3) {
          const nextDelay = delayMs * Math.pow(2, pendingCall.retryCount - 1);
          console.log(`[Vapi] Call ${callId} analysis still incomplete, scheduling retry ${pendingCall.retryCount + 1}`);
          scheduleAnalysisRetry(callId, Math.min(nextDelay, 300000));
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
    
    console.log(`[Vapi] Full call analysis for ${call.id}:`, JSON.stringify(call.analysis, null, 2));
    
    const analysisResult = {
      hasAnalysis: !!call.analysis,
      summary: call.analysis?.summary || null,
      structuredData: null,
      successEvaluation: null,
      errors: []
    };
    
    console.log(`[Vapi] Extracted analysis data for ${call.id}:`, {
      hasSummary: !!call.analysis?.summary,
      summaryValue: call.analysis?.summary,
      hasSuccessEval: call.analysis?.successEvaluation !== undefined,
      successEvalValue: call.analysis?.successEvaluation,
      hasStructuredData: !!call.analysis?.structuredData
    });
    
    if (call.analysis?.structuredData) {
      try {
        analysisResult.structuredData = typeof call.analysis.structuredData === 'string' 
          ? JSON.parse(call.analysis.structuredData)
          : call.analysis.structuredData;
      } catch (error) {
        analysisResult.errors.push(`Failed to parse structured data: ${error.message}`);
      }
    }
    
    if (call.analysis?.successEvaluation !== undefined) {
      const parsedEvaluation = parseSuccessEvaluation(call.analysis.successEvaluation);
      analysisResult.successEvaluation = {
        isSuccessful: parsedEvaluation.isSuccessful,
        isEmergency: parsedEvaluation.isEmergency,
        status: parsedEvaluation.status,
        value: call.analysis.successEvaluation,
        reason: parsedEvaluation.reason
      };
    }
    
    let databaseResult = null;
    let callStatus = analysisResult.successEvaluation?.status || 'incomplete';
    let failureReason = analysisResult.successEvaluation?.reason || 'No evaluation provided';
    
    console.log(`[Database] Call ${call.id} will be saved to database`);
    
    const alreadyExists = await callAnalysisExists(call.id);
    
    if (alreadyExists) {
      console.log(`[Database] Call analysis for ${call.id} already exists, skipping save`);
      databaseResult = { 
        success: true, 
        message: 'Already exists',
        evaluationStatus: analysisResult.successEvaluation?.status || 'incomplete',
        isSuccessful: analysisResult.successEvaluation?.isSuccessful || false,
        isEmergency: analysisResult.successEvaluation?.isEmergency || false,
        reason: analysisResult.successEvaluation?.reason || 'Analysis already exists'
      };
    } else {
      databaseResult = await saveCallAnalysis(call, analysisResult);
      console.log(`[Database] Save result for call ${call.id}:`, {
        success: databaseResult.success,
        evaluationStatus: databaseResult.evaluationStatus,
        isSuccessful: databaseResult.isSuccessful,
        isEmergency: databaseResult.isEmergency,
        reason: databaseResult.reason,
        error: databaseResult.error
      });
    }
    
    if (!databaseResult.success && analysisResult.successEvaluation) {
      callStatus = analysisResult.successEvaluation.status;
      failureReason = analysisResult.successEvaluation.reason;
    } else {
      callStatus = databaseResult.evaluationStatus || 'incomplete';
      failureReason = databaseResult.reason || 'No evaluation provided';
    }
    
    const businessResult = await executeBusinessLogic(call, analysisResult, databaseResult);
    
    console.log(`[Vapi] Call ${call.id} processing complete:`, {
      evaluationStatus: callStatus,
      savedToDatabase: databaseResult?.success,
      businessLogicExecuted: businessResult.executed
    });
    
    return {
      message: 'Call processed successfully',
      callId: call.id,
      analysis: analysisResult,
      database: databaseResult,
      businessLogic: businessResult,
      evaluationStatus: callStatus,
      failureReason: failureReason,
      timestamp: new Date().toISOString()
    };
  }
  
  async function executeBusinessLogic(call, analysisResult, databaseResult) {
    const result = {
      executed: false,
      actions: [],
      errors: [],
      nextSteps: [],
      frontendAction: null
    };
    
    try {
      const appointmentId = analysisResult.structuredData?.appointmentId || call.metadata?.appointmentId;
      const evaluationStatus = analysisResult.successEvaluation?.status || databaseResult.evaluationStatus || 'incomplete';
      
      if (evaluationStatus === 'successful') {
        console.log(`[Business Logic] Call ${call.id} was successful - processing completion`);
        
        result.actions.push('appointment_prescreening_completed');
        result.nextSteps.push('proceed_to_appointment');
        result.frontendAction = 'show_success_screen';
        
        if (appointmentId) {
          await updateAppointmentStatus(appointmentId, 'confirmed', 'Pre-screening completed successfully');
        }
        
      } else if (evaluationStatus === 'emergency_declared') {
        console.log(`[Business Logic] Call ${call.id} has emergency declared - cancelling appointment`);
        
        result.actions.push('emergency_detected');
        result.nextSteps.push('cancel_appointment');
        result.frontendAction = 'show_emergency_screen';
        
        if (appointmentId) {
          await updateAppointmentStatus(appointmentId, 'cancelled', 'Emergency situation detected during pre-screening');
        }
        
      } else {
        console.log(`[Business Logic] Call ${call.id} was unsuccessful - handling failure`);
        
        result.actions.push('appointment_prescreening_failed');
        result.nextSteps.push('reschedule_prescreening');
        result.frontendAction = 'request_rescreening';
        
        if (appointmentId) {
          await updateAppointmentStatus(appointmentId, 'requires_rescreening', analysisResult.successEvaluation?.reason || databaseResult.reason || 'Pre-screening incomplete');
        }
        
        result.failureDetails = {
          reason: analysisResult.successEvaluation?.reason || databaseResult.reason || 'Pre-screening was incomplete',
          requiresRescreening: true,
          message: `Pre-screening was incomplete. Reason: ${analysisResult.successEvaluation?.reason || databaseResult.reason || 'Unknown'}. Please complete the pre-screening process again.`
        };
      }
      
      result.executed = true;
      
    } catch (error) {
      console.error(`[Business Logic] Error processing call ${call.id}:`, error);
      result.errors.push(error.message);
    }
    
    return result;
  }
  
  router.post('/request-rescreening', async (req, res) => {
    try {
      const { patientId, appointmentId, reason } = req.body;
      
      if (!patientId || !appointmentId) {
        return res.status(400).json({
          error: 'Missing required fields: patientId and appointmentId'
        });
      }
      
      console.log(`[Rescreening] Request received for patient ${patientId}, appointment ${appointmentId}`);
      
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
  
  async function handleFailedCall(callId, reason) {
    console.error(`[Vapi] Permanently failed call ${callId}: ${reason}`);
  }
  
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
  
  router.get('/prescreening-status/:patientId', async (req, res) => {
    try {
      const { patientId } = req.params;
      
      console.log(`[API] Checking prescreening status for patient: ${patientId}`);
      
      // Query the most recent call analysis for this patient
      const { data, error } = await supabase
        .from('call_analysis')
        .select('success_evaluation, success_rubric, is_emergency, analysis_timestamp')
        .eq('patient_id', patientId)
        .order('analysis_timestamp', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('[API] Error fetching prescreening status:', error);
        throw error;
      }
      
      if (!data) {
        return res.status(200).json({
          status: 'loading',
          message: 'Prescreening analysis in progress...',
          patientId
        });
      }
      
      // Map database status to frontend status
      let status = 'loading';
      let message = 'Processing your prescreening...';
      let reason = null;
      
      if (data.is_emergency) {
        status = 'emergency_declared';
        message = 'Your symptoms require immediate medical attention. This platform cannot treat your condition.';
        reason = data.success_rubric;
      } else if (data.success_evaluation === 'successful') {
        status = 'successful';
        message = 'Prescreening completed successfully! You\'re ready for your appointment.';
      } else if (data.success_evaluation === 'failed' || data.success_evaluation === 'incomplete') {
        status = 'failed';
        message = 'Prescreening was incomplete. Please try again.';
        reason = data.success_rubric;
      }
      
      console.log(`[API] Prescreening status for ${patientId}:`, { status, message });
      
      res.status(200).json({
        status,
        message,
        reason,
        patientId,
        timestamp: data.analysis_timestamp
      });
      
    } catch (error) {
      console.error('[API] Error checking prescreening status:', error);
      res.status(500).json({
        error: 'Failed to check prescreening status',
        details: error.message
      });
    }
  });
  
  module.exports = router;
