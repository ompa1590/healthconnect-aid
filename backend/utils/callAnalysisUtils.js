const supabase = require('./supabaseClient');

/**
 * Parse success evaluation to determine if call was successful
 * @param {string} successEvalValue - The success evaluation text from Vapi
 * @returns {object} - { isSuccessful: boolean, reason: string }
 */
function parseSuccessEvaluation(successEvalValue) {
  if (!successEvalValue || typeof successEvalValue !== 'string') {
    return {
      isSuccessful: false,
      reason: 'No success evaluation provided'
    };
  }

  const evalText = successEvalValue.toLowerCase();
  
  // Look for success indicators
  const successIndicators = [
    'successful',
    'successfully',
    'completed successfully',
    'gathered the necessary information',
    'all required areas'
  ];
  
  // Look for failure indicators
  const failureIndicators = [
    'unsuccessful',
    'failed',
    'incomplete',
    'missing information',
    'unclear',
    'insufficient'
  ];
  
  const hasSuccessIndicators = successIndicators.some(indicator => 
    evalText.includes(indicator)
  );
  
  const hasFailureIndicators = failureIndicators.some(indicator => 
    evalText.includes(indicator)
  );
  
  // If we have success indicators and no failure indicators, consider it successful
  const isSuccessful = hasSuccessIndicators && !hasFailureIndicators;
  
  return {
    isSuccessful,
    reason: isSuccessful ? 'Call completed successfully' : successEvalValue
  };
}

/**
 * Extract patient ID from call analysis or structured data
 * @param {object} analysisResult - The analysis result object
 * @param {object} call - The call object from Vapi
 * @returns {string|null} - Patient ID if found
 */
function extractPatientId(analysisResult, call) {
  // Try to get patient ID from structured data
  if (analysisResult.structuredData?.patientId) {
    return analysisResult.structuredData.patientId;
  }
  
  // Try to get from call metadata if available
  if (call.metadata?.patientId) {
    return call.metadata.patientId;
  }
  
  // If not available, we'll need to look it up by name/DOB from the summary
  return null;
}

/**
 * Extract appointment ID from call analysis or structured data
 * @param {object} analysisResult - The analysis result object
 * @param {object} call - The call object from Vapi
 * @returns {string|null} - Appointment ID if found
 */
function extractAppointmentId(analysisResult, call) {
  // Try to get appointment ID from structured data
  if (analysisResult.structuredData?.appointmentId) {
    return analysisResult.structuredData.appointmentId;
  }
  
  // Try to get from call metadata if available
  if (call.metadata?.appointmentId) {
    return call.metadata.appointmentId;
  }
  
  return null;
}

/**
 * Save call analysis to Supabase database
 * @param {object} callData - The complete call data from Vapi
 * @param {object} analysisResult - The processed analysis result
 * @returns {object} - Database operation result
 */
async function saveCallAnalysis(callData, analysisResult) {
  try {
    console.log('[Database] Preparing to save call analysis for call:', callData.id);
    
    // Parse success evaluation
    const successEvaluation = parseSuccessEvaluation(analysisResult.successEvaluation?.value);
    
    // Extract patient and appointment IDs
    const patientId = extractPatientId(analysisResult, callData);
    const appointmentId = extractAppointmentId(analysisResult, callData);
    
    if (!patientId) {
      throw new Error('Patient ID is required but not found in call data');
    }
    
    // Prepare data for insertion
    const insertData = {
      call_id: callData.id,
      patient_id: patientId,
      appointment_id: appointmentId,
      call_summary: analysisResult.summary,
      structured_data: analysisResult.structuredData,
      success_evaluation: successEvaluation.isSuccessful,
      success_rubric: analysisResult.successEvaluation?.value || null,
      call_transcript: callData.transcript || null,
      call_duration: callData.duration || null,
      analysis_timestamp: callData.endedAt ? new Date(callData.endedAt) : new Date()
    };
    
    console.log('[Database] Inserting call analysis:', {
      callId: insertData.call_id,
      patientId: insertData.patient_id,
      appointmentId: insertData.appointment_id,
      successEvaluation: insertData.success_evaluation,
      hasSummary: !!insertData.call_summary,
      hasStructuredData: !!insertData.structured_data
    });
    
    // Insert into database
    const { data, error } = await supabase
      .from('call_analysis')
      .insert([insertData])
      .select();
    
    if (error) {
      console.error('[Database] Supabase insert error:', error);
      throw error;
    }
    
    console.log('[Database] Call analysis saved successfully:', data[0].id);
    
    return {
      success: true,
      data: data[0],
      callSuccessful: successEvaluation.isSuccessful,
      reason: successEvaluation.reason
    };
    
  } catch (error) {
    console.error('[Database] Error saving call analysis:', error);
    return {
      success: false,
      error: error.message,
      callSuccessful: false,
      reason: 'Database error occurred'
    };
  }
}

/**
 * Check if call analysis already exists
 * @param {string} callId - The call ID to check
 * @returns {boolean} - True if exists, false otherwise
 */
async function callAnalysisExists(callId) {
  try {
    const { data, error } = await supabase
      .from('call_analysis')
      .select('id')
      .eq('call_id', callId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('[Database] Error checking call analysis existence:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('[Database] Error checking call analysis existence:', error);
    return false;
  }
}

/**
 * Get call analysis by call ID
 * @param {string} callId - The call ID to retrieve
 * @returns {object|null} - Call analysis data or null
 */
async function getCallAnalysis(callId) {
  try {
    const { data, error } = await supabase
      .from('call_analysis')
      .select('*')
      .eq('call_id', callId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('[Database] Error retrieving call analysis:', error);
    return null;
  }
}

module.exports = {
  saveCallAnalysis,
  callAnalysisExists,
  getCallAnalysis,
  parseSuccessEvaluation,
  extractPatientId,
  extractAppointmentId
};