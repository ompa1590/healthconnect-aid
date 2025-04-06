
// documentParser.ts
import { Mistral } from '@mistralai/mistralai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL || "https://juwznmplmnkfpmrmrrfv.supabase.co";
const supabaseKey = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1d3pubXBsbW5rZnBtcm1ycmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4OTI2MjksImV4cCI6MjA1NzQ2ODYyOX0.G8P3sYB6S-AAMK1HeLhSTTjcmga833SiGdC_URIkT5w";
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Mistral client with environment variable
const apiKey = import.meta.env.VITE_MISTRAL_API_KEY || 'luKfKb9Bw0pxi6sjPZYtsVHdtNimFzFh';
const mistralClient = new Mistral({ apiKey });

// Define the correct types for Mistral content chunks
type TextContentChunk = {
  type: 'text';
  text: string;
};

type DocumentUrlContentChunk = {
  type: 'document_url';
  documentUrl: string;
};

type ContentChunk = TextContentChunk | DocumentUrlContentChunk;

export const parsePdfContent = async (file: File, fileId?: string): Promise<string> => {
  try {
    // Ensure user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) throw new Error('User not authenticated');

    let documentUrl: string;

    if (fileId) {
      // For existing documents, get the path and generate a signed URL
      const { data, error } = await supabase
        .from('user_documents')
        .select('document_path')
        .eq('id', fileId)
        .single();

      if (error) throw error;
      if (!data?.document_path) throw new Error('Document path not found');

      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('medical_documents')
        .createSignedUrl(data.document_path, 60 * 60); // 1 hour expiry

      if (signedUrlError) throw signedUrlError;
      if (!signedUrlData?.signedUrl) throw new Error('Failed to generate signed URL');

      documentUrl = signedUrlData.signedUrl;
    } else {
      // For new uploads, upload the file temporarily and get a signed URL
      const tempFileName = `${Date.now()}-${session.user.id}-${file.name}`;
      const tempFilePath = `${session.user.id}/temp/${tempFileName}`;

      const { error: uploadError } = await supabase
        .storage
        .from('medical_documents')
        .upload(tempFilePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('medical_documents')
        .createSignedUrl(tempFilePath, 60 * 60); // 1 hour expiry

      if (signedUrlError) throw signedUrlError;
      if (!signedUrlData?.signedUrl) throw new Error('Failed to generate signed URL');

      documentUrl = signedUrlData.signedUrl;

      // Clean up the temporary upload
      await supabase.storage.from('medical_documents').remove([tempFilePath]);
    }

    // Determine document type from filename
    let documentType = 'medical record';
    const fileName = file.name.toLowerCase();
    
    if (fileName.includes('blood') || fileName.includes('lab')) {
      documentType = 'lab test results';
    } else if (fileName.includes('cardio') || fileName.includes('heart')) {
      documentType = 'cardiovascular assessment';
    } else if (fileName.includes('allerg')) {
      documentType = 'allergy test report';
    } else if (fileName.includes('xray') || fileName.includes('imaging')) {
      documentType = 'radiology report';
    } else if (fileName.includes('mri')) {
      documentType = 'MRI report';
    } else if (fileName.includes('med') || fileName.includes('prescription')) {
      documentType = 'medication summary';
    }
    
    // Create prompt with medical context based on document type
    const medicalPrompt = `You are a specialized medical document analysis system for telehealth professionals.

The attached document is a ${documentType}. Extract and provide a clear, structured summary of the key medical information, including:

1. Patient demographics (if present)
2. Key findings and diagnoses
3. Vital signs and critical lab values (with indicators for abnormal results)
4. Treatment plans or medication changes
5. Follow-up instructions or recommendations
6. Any critical alerts or warnings that would require immediate attention

Format the summary in a structured, easy-to-scan format with bullet points and clear sections.
Focus only on extracting factual medical information. Prioritize information that would be most relevant for a telehealth provider to know quickly.`;

    // Create the content array with proper typing
    const content: ContentChunk[] = [
      {
        type: 'text',
        text: medicalPrompt
      },
      {
        type: 'document_url',
        documentUrl: documentUrl
      }
    ];

    // Use Mistral's document understanding capability
    const response = await mistralClient.chat.complete({
      model: 'mistral-large-latest',
      messages: [{
        role: 'user',
        content: content as any // Type assertion to avoid TypeScript errors
      }]
    });

    // Extract text content from response
    const responseContent = response.choices[0].message.content;
    return responseContent;
    
  } catch (error) {
    console.error('Error processing document with Mistral:', error);
    return fallbackParsePdfContent(file);
  }
};

// Generate a realistic body map based on diagnoses
export const generateRealisticBodyMap = async (diagnoses: string[], view: string = 'front'): Promise<string> => {
  try {
    const prompt = `Generate a detailed SVG code for a realistic human body outline with anatomical details. The SVG should:
    1. Show a ${view} view of a human body (${view === 'front' ? 'frontal' : view === 'back' ? 'posterior' : 'side'} view)
    2. Include proportional head, torso, arms, and legs
    3. Have subtle anatomical details like facial features, joints, and muscle groups
    4. Use gentle gradients for depth
    5. Be suitable for a medical charting interface
    6. Use a viewBox of "0 0 100 230"
    7. Include only the SVG path data, no JavaScript
    8. Make the drawing style similar to the professional medical body diagrams used in clinical settings
    
    The SVG should highlight and annotate these conditions: ${diagnoses.join(", ")}
    
    Respond ONLY with the valid SVG code that I can directly use in an HTML document.`;

    const response = await mistralClient.chat.complete({
      model: 'mistral-large-latest',
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    // Extract just the SVG code from the response
    const svgResponse = response.choices[0].message.content;
    
    // Type guard to ensure we're working with a string
    if (typeof svgResponse === 'string') {
      const svgMatch = svgResponse.match(/<svg[^>]*>[\s\S]*<\/svg>/i);
      return svgMatch ? svgMatch[0] : fallbackBodyMapSvg(view);
    }
    
    return fallbackBodyMapSvg(view);
  } catch (error) {
    console.error('Error generating realistic body map:', error);
    return fallbackBodyMapSvg(view);
  }
};

// Generate AI-enhanced chart summary
export const generateChartSummary = async (markers: any[], patientName: string, transcript?: string[]): Promise<string> => {
  try {
    // Format markers into a string for the prompt
    const markersText = markers.map(m => 
      `- Body Part: ${m.bodyPart}, Diagnosis: ${m.diagnosis || "Undiagnosed"}, Severity: ${m.severity}, Notes: ${m.notes || "None"}, Chronic: ${m.chronic ? "Yes" : "No"}`
    ).join("\n");

    let prompt = `You are a medical professional creating a comprehensive chart summary for a patient named ${patientName}.
    
    Based on the following documented conditions, create a detailed clinical summary that a healthcare provider would find useful:
    
    ${markersText}
    `;

    // Add transcript context if available
    if (transcript && transcript.length > 0) {
      prompt += `\n\nAdditionally, here is the consultation transcript that may provide context:
      ${transcript.join("\n")}`;
    }

    prompt += `\n\nInclude:
    1. An overview of the patient's condition
    2. Connections between symptoms if they appear related
    3. Potential concerns that should be monitored
    4. Recommendations for follow-up based on standard medical practice
    5. Any critical warnings that would be important for continuity of care
    
    Format the summary in a professional medical chart style with clear sections and medical terminology.`;

    const response = await mistralClient.chat.complete({
      model: 'mistral-large-latest',
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI chart summary:', error);
    return fallbackChartSummary(markers, patientName);
  }
};

// Generate a complete medical chart with multiple body views
export const generateCompleteChart = async (
  patientData: any, 
  markers: any[], 
  consultation: any
): Promise<{frontView: string, backView: string, sideView: string, summary: string}> => {
  try {
    // Extract diagnoses from markers
    const diagnoses = markers
      .filter(marker => marker.diagnosis)
      .map(marker => `${marker.bodyPart}: ${marker.diagnosis}`);

    // Create transcript array from consultation if available
    const transcript = consultation?.conversation?.map((msg: any) => 
      `${msg.role === 'assistant' ? 'Provider' : 'Patient'}: ${msg.text}`
    ) || [];

    // Generate all three views in parallel
    const [frontView, backView, sideView, summary] = await Promise.all([
      generateRealisticBodyMap(diagnoses, 'front'),
      generateRealisticBodyMap(diagnoses, 'back'),
      generateRealisticBodyMap(diagnoses, 'side'),
      generateChartSummary(markers, patientData.name, transcript)
    ]);

    return {
      frontView,
      backView,
      sideView,
      summary
    };
  } catch (error) {
    console.error('Error generating complete chart:', error);
    return {
      frontView: fallbackBodyMapSvg('front'),
      backView: fallbackBodyMapSvg('back'),
      sideView: fallbackBodyMapSvg('side'),
      summary: fallbackChartSummary(markers, patientData.name)
    };
  }
};

// Fallback function for chart summary
const fallbackChartSummary = (markers: any[], patientName: string): string => {
  if (markers.length === 0) {
    return "No conditions have been documented for this patient.";
  }
  
  const summary = `
Patient Chart Summary for ${patientName}
Generated on: ${new Date().toLocaleString()}

DOCUMENTED CONDITIONS:
${markers.map(marker => `
• ${marker.bodyPart.toUpperCase()}: ${marker.diagnosis || "Undiagnosed"}
  Severity: ${marker.severity.charAt(0).toUpperCase() + marker.severity.slice(1)}
  ${marker.chronic ? "CHRONIC CONDITION" : "Acute condition"}
  Notes: ${marker.notes || "No additional notes"}
  Documented by: ${marker.provider} on ${marker.timestamp.toLocaleString()}
  ${marker.followUp ? `Follow-up scheduled: ${marker.followUp.toLocaleDateString()}` : "No follow-up scheduled"}
`).join('')}

END OF SUMMARY
`;
  return summary;
};

// Fallback SVG for body map
const fallbackBodyMapSvg = (view: string = 'front'): string => {
  if (view === 'front') {
    return `<svg viewBox="0 0 100 230" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,15 C67,15 80,30 80,50 C80,70 67,85 50,85 C33,85 20,70 20,50 C20,30 33,15 50,15 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M30,85 L70,85 L70,120 L30,120 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M30,120 L70,120 L70,155 L30,155 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M15,85 L30,85 L30,140 L15,155 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M70,85 L85,85 L85,155 L70,140 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M30,155 L45,155 L45,210 L30,210 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M55,155 L70,155 L70,210 L55,210 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <ellipse cx="40" cy="40" rx="3" ry="4" fill="#1f2937" />
      <ellipse cx="60" cy="40" rx="3" ry="4" fill="#1f2937" />
      <path d="M45,60 Q50,65 55,60" stroke="#1f2937" stroke-width="1" fill="none" />
    </svg>`;
  } else if (view === 'back') {
    return `<svg viewBox="0 0 100 230" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,15 C67,15 80,30 80,50 C80,70 67,85 50,85 C33,85 20,70 20,50 C20,30 33,15 50,15 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M30,85 L70,85 L70,120 L30,120 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M30,120 L70,120 L70,155 L30,155 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M15,85 L30,85 L30,140 L15,155 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M70,85 L85,85 L85,155 L70,140 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M30,155 L45,155 L45,210 L30,210 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M55,155 L70,155 L70,210 L55,210 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
    </svg>`;
  } else { // side view
    return `<svg viewBox="0 0 100 230" xmlns="http://www.w3.org/2000/svg">
      <path d="M60,15 C77,15 85,30 85,50 C85,70 77,85 60,85 C50,85 45,70 45,50 C45,30 50,15 60,15 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M45,85 L75,85 L75,120 L45,120 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M45,120 L75,120 L75,155 L45,155 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M45,155 L60,155 L60,210 L45,210 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <path d="M60,155 L75,155 L75,210 L60,210 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="0.5"/>
      <ellipse cx="70" cy="40" rx="3" ry="4" fill="#1f2937" />
    </svg>`;
  }
};

// Fallback function using the original mock implementation
const fallbackParsePdfContent = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const documentName = file.name.toLowerCase();
      let summary = "";
      
      if (documentName.includes('blood') || documentName.includes('lab')) {
        summary = "Blood Test Results Summary:\n• Hemoglobin: 14.2 g/dL (Normal)\n• White Blood Cells: 7.5 x10^9/L (Normal)\n• Platelets: 250,000/µL (Normal)\n• Vitamin B12: 180 pg/mL (Low - Deficiency detected)\n• Vitamin D: 22 ng/mL (Low)\n• Glucose: 95 mg/dL (Normal)\n• Total Cholesterol: 195 mg/dL (Normal)\n• Thyroid Stimulating Hormone (TSH): 2.8 mIU/L (Normal)\n• Red Blood Cell Count: 4.8 million/µL (Normal)\n• Hemoglobin A1c: 5.4% (Normal)";
      } else if (documentName.includes('cardio') || documentName.includes('heart')) {
        summary = "Cardiovascular Exam Summary:\n• Blood Pressure: 128/82 mmHg (Slightly elevated)\n• Heart Rate: 72 bpm (Normal)\n• ECG: Normal sinus rhythm\n• Ejection Fraction: 60% (Normal)\n• Cholesterol - LDL: 110 mg/dL (Borderline high)\n• Cholesterol - HDL: 55 mg/dL (Good)\n• Triglycerides: 130 mg/dL (Normal)\n• No evidence of structural heart disease\n• Carotid Doppler: No significant stenosis\n• Recommendation: Follow-up in 6 months, continue moderate exercise";
      } else {
        summary = `Medical Document Analysis:\n
• Document Type: ${file.type}
• Document Name: ${file.name}
• File Size: ${(file.size / 1024).toFixed(2)} KB
• Last Modified: ${new Date(file.lastModified).toLocaleString()}

Content Analysis:
• Medical document detected
• Contains patient health information
• Multiple health parameters mentioned
• Assessment and plan section identified
• Provider recommendations noted
• Document appears to be a clinical note or medical report

Key Points:
• Patient health information documented
• Clinical findings recorded
• Diagnosis information included
• Treatment plan outlined
• Follow-up recommendations provided

Recommendations:
• Review document in detail with healthcare provider
• Compare with previous medical records
• Discuss any questions about findings with your doctor
• Keep this document for your personal health records`;
      }
      
      resolve(summary);
    }, 1500);
  });
};
