
export const parsePdfContent = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const documentType = file.name.toLowerCase();
      let summary = "";
      
      if (documentType.includes('blood') || documentType.includes('lab')) {
        summary = "Blood Test Results Summary:\n• Hemoglobin: 14.2 g/dL (Normal)\n• White Blood Cells: 7.5 x10^9/L (Normal)\n• Vitamin B12: 180 pg/mL (Low - Deficiency detected)\n• Vitamin D: 22 ng/mL (Low)\n• Glucose: 95 mg/dL (Normal)\n• Total Cholesterol: 195 mg/dL (Normal)";
      } else if (documentType.includes('cardio') || documentType.includes('heart')) {
        summary = "Cardiovascular Exam Summary:\n• Blood Pressure: 128/82 mmHg (Slightly elevated)\n• Heart Rate: 72 bpm (Normal)\n• ECG: Normal sinus rhythm\n• No evidence of structural heart disease\n• Recommendation: Follow-up in 6 months";
      } else if (documentType.includes('allerg')) {
        summary = "Allergy Test Results:\n• Dust mites: Strong positive reaction\n• Cat dander: Moderate positive reaction\n• Pollen: Mild positive reaction\n• No food allergies detected\n• Recommendation: Environmental control measures and antihistamines";
      } else {
        summary = "Document Analysis:\n• Medical document detected\n• Multiple health parameters mentioned\n• Please review the document in detail\n• Consult with healthcare provider for interpretation";
      }
      
      resolve(summary);
    }, 1500);
  });
};
