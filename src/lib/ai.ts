
// Mock AI functions to fix build errors

export const generateConsultationNotes = async (
  patientName: string,
  patientAge: number,
  reason: string
) => {
  // This would be replaced with an actual AI integration
  return `Notes for ${patientName}, ${patientAge}, regarding: ${reason}`;
};
