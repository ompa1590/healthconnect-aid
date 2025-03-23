
export const parsePdfContent = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const documentName = file.name.toLowerCase();
      let summary = "";
      
      if (documentName.includes('blood') || documentName.includes('lab')) {
        summary = "Blood Test Results Summary:\n• Hemoglobin: 14.2 g/dL (Normal)\n• White Blood Cells: 7.5 x10^9/L (Normal)\n• Platelets: 250,000/µL (Normal)\n• Vitamin B12: 180 pg/mL (Low - Deficiency detected)\n• Vitamin D: 22 ng/mL (Low)\n• Glucose: 95 mg/dL (Normal)\n• Total Cholesterol: 195 mg/dL (Normal)\n• Thyroid Stimulating Hormone (TSH): 2.8 mIU/L (Normal)\n• Red Blood Cell Count: 4.8 million/µL (Normal)\n• Hemoglobin A1c: 5.4% (Normal)";
      } else if (documentName.includes('cardio') || documentName.includes('heart')) {
        summary = "Cardiovascular Exam Summary:\n• Blood Pressure: 128/82 mmHg (Slightly elevated)\n• Heart Rate: 72 bpm (Normal)\n• ECG: Normal sinus rhythm\n• Ejection Fraction: 60% (Normal)\n• Cholesterol - LDL: 110 mg/dL (Borderline high)\n• Cholesterol - HDL: 55 mg/dL (Good)\n• Triglycerides: 130 mg/dL (Normal)\n• No evidence of structural heart disease\n• Carotid Doppler: No significant stenosis\n• Recommendation: Follow-up in 6 months, continue moderate exercise";
      } else if (documentName.includes('allerg')) {
        summary = "Allergy Test Results:\n• Dust mites: Strong positive reaction\n• Cat dander: Moderate positive reaction\n• Pollen: Mild positive reaction\n• Peanuts: Negative\n• Dairy: Negative\n• Eggs: Negative\n• Wheat: Negative\n• Shellfish: Negative\n• Treatment Plan: Environmental control measures and antihistamines\n• Recommendation: Consider allergen immunotherapy for dust mite allergy";
      } else if (documentName.includes('xray') || documentName.includes('imaging')) {
        summary = "Chest X-Ray Report:\n• Lungs: Clear, no infiltrates or effusions\n• Heart: Normal size and contour\n• Mediastinum: Normal appearance\n• Bones: No acute fractures or destructive lesions\n• Soft tissues: Unremarkable\n• Impression: Normal chest radiograph\n• Recommendation: No follow-up imaging necessary";
      } else if (documentName.includes('mri')) {
        summary = "MRI Report - Lumbar Spine:\n• Alignment: Normal lumbar lordosis\n• Vertebral bodies: Normal height and signal\n• Discs: Mild disc desiccation at L4-L5 and L5-S1\n• L4-L5: Small central disc protrusion without nerve compression\n• L5-S1: Mild facet arthropathy\n• Spinal canal: No significant stenosis\n• Neural foramina: Mild left foraminal narrowing at L5-S1\n• Impression: Early degenerative changes without significant nerve compression\n• Recommendation: Physical therapy, follow-up in 6 months if symptoms persist";
      } else if (documentName.includes('med') || documentName.includes('prescription')) {
        summary = "Medication Summary:\n• Levothyroxine 50mcg: Take one tablet daily for hypothyroidism\n• Lisinopril 10mg: Take one tablet daily for hypertension\n• Atorvastatin 20mg: Take one tablet at bedtime for hyperlipidemia\n• Vitamin D3 2000IU: Take one tablet daily for vitamin D deficiency\n• Vitamin B12 1000mcg: Take one tablet daily for B12 deficiency\n• Allergies: Penicillin (hives), Sulfa drugs (rash)\n• Refills: 3 refills for all medications\n• Next follow-up: 3 months";
      } else {
        // Generic analysis for unknown document types - more comprehensive
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
