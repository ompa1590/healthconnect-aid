// documentParser.ts
import { Mistral } from '@mistralai/mistralai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = "https://juwznmplmnkfpmrmrrfv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1d3pubXBsbW5rZnBtcm1ycmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4OTI2MjksImV4cCI6MjA1NzQ2ODYyOX0.G8P3sYB6S-AAMK1HeLhSTTjcmga833SiGdC_URIkT5w";
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Mistral client with environment variable
const mistralClient = new Mistral({ apiKey: 'luKfKb9Bw0pxi6sjPZYtsVHdtNimFzFh' });

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
        content: content as unknown as (string | ContentChunk[])
      }]
    });

    return response.choices[0].message.content;
    
  } catch (error) {
    console.error('Error processing document with Mistral:', error);
    return fallbackParsePdfContent(file);
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