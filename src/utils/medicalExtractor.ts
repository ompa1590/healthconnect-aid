
// Medical condition extraction utility with enhanced detection

const commonConditions = [
  "diabetes", "hypertension", "asthma", "arthritis", "cancer", 
  "heart disease", "depression", "anxiety", "copd", "obesity", 
  "thyroid", "migraine", "epilepsy", "hiv", "hepatitis", 
  "kidney disease", "stroke", "alzheimer", "parkinson", "dementia",
  "high blood pressure", "high cholesterol", "chronic pain", "fibromyalgia",
  "multiple sclerosis", "osteoporosis", "gout", "irritable bowel", "anemia", 
  "adhd", "ocd", "bipolar", "schizophrenia", "ptsd", "glaucoma", "cataracts"
];

const commonAllergies = [
  "peanut", "penicillin", "lactose", "gluten", "shellfish", 
  "tree nuts", "eggs", "soy", "fish", "wheat", "milk", "dairy",
  "dust", "pollen", "mold", "latex", "insect stings", "sulfa", 
  "ibuprofen", "aspirin", "codeine", "morphine", "animal dander", 
  "grass", "sesame", "sulfites", "nsaids", "contrast dye"
];

const commonMedications = [
  "aspirin", "insulin", "ibuprofen", "metformin", "atorvastatin", 
  "lisinopril", "amlodipine", "metoprolol", "levothyroxine", "omeprazole", 
  "albuterol", "gabapentin", "hydrochlorothiazide", "losartan", "simvastatin", 
  "furosemide", "prednisone", "sertraline", "amoxicillin", "acetaminophen", 
  "fluoxetine", "warfarin", "citalopram", "pantoprazole", "tramadol",
  "methotrexate", "cipro", "zoloft", "lipitor", "prozac", "tylenol",
  "adderall", "ritalin", "xanax", "valium", "morphine", "oxycontin"
];

const commonTreatments = [
  "surgery", "therapy", "transplant", "radiation", "chemotherapy", 
  "physical therapy", "dialysis", "appendectomy", "gallbladder removal", 
  "hernia repair", "hip replacement", "knee replacement", "cataract removal", 
  "angioplasty", "bypass surgery", "cardiac ablation", "colonoscopy", 
  "lumpectomy", "mastectomy", "pacemaker", "spinal fusion", "tonsillectomy", 
  "vasectomy", "gastric bypass", "skin graft", "stent placement", "joint replacement",
  "orthopedic surgery", "laser eye surgery", "cesarean section", "implants"
];

// Words that might help detect conditions/treatments when used with other terms
const medicalIndicators = [
  "diagnosed with", "suffering from", "treated for", "living with", 
  "managing", "taking medication for", "struggling with", "had",
  "underwent", "received", "got", "have", "experienced", "went through",
  "dealing with", "coping with", "being treated for", "in remission from",
  "survived", "recovered from", "battling", "fighting"
];

// Enhanced extraction function
export const extractMedicalInfo = (text: string): {
  conditions: string[];
  allergies: string[];
  medications: string[];
  pastTreatments: string[];
} => {
  text = text.toLowerCase();
  
  // Process and tokenize the text
  const sentences = text.split(/[.!?]+/);
  
  const foundConditions: string[] = [];
  const foundAllergies: string[] = [];
  const foundMedications: string[] = [];
  const foundTreatments: string[] = [];
  
  // Extract common medical terms from each sentence
  sentences.forEach(sentence => {
    // Check for medical indicators in the sentence
    const hasIndicator = medicalIndicators.some(indicator => 
      sentence.includes(indicator)
    );
    
    // Enhanced condition detection
    commonConditions.forEach(condition => {
      if (sentence.includes(condition) || 
         (hasIndicator && sentence.includes(condition.split(' ')[0]))) {
        foundConditions.push(condition);
      }
    });
    
    // Enhanced allergy detection with contextual clues
    if (sentence.includes("allerg") || 
        sentence.includes("sensitive") || 
        sentence.includes("react") || 
        sentence.includes("intolerance")) {
      commonAllergies.forEach(allergy => {
        if (sentence.includes(allergy)) {
          foundAllergies.push(allergy);
        }
      });
    } else {
      // Still check for direct mentions
      commonAllergies.forEach(allergy => {
        if (sentence.includes(`allergic to ${allergy}`) || 
            sentence.includes(`${allergy} allergy`)) {
          foundAllergies.push(allergy);
        }
      });
    }
    
    // Enhanced medication detection
    if (sentence.includes("take") || 
        sentence.includes("taking") || 
        sentence.includes("medication") || 
        sentence.includes("medicine") || 
        sentence.includes("prescribed") || 
        sentence.includes("dose") || 
        sentence.includes("drug") || 
        sentence.includes("pill")) {
      commonMedications.forEach(medication => {
        if (sentence.includes(medication)) {
          foundMedications.push(medication);
        }
      });
    } else {
      // Still check for direct mentions
      commonMedications.forEach(medication => {
        if (sentence.includes(medication)) {
          foundMedications.push(medication);
        }
      });
    }
    
    // Enhanced treatment detection
    if (sentence.includes("had") || 
        sentence.includes("underwent") || 
        sentence.includes("procedure") || 
        sentence.includes("operation") || 
        sentence.includes("removed") || 
        sentence.includes("surgery") || 
        sentence.includes("treatment")) {
      commonTreatments.forEach(treatment => {
        if (sentence.includes(treatment)) {
          foundTreatments.push(treatment);
        }
      });
    } else {
      // Still check for direct mentions
      commonTreatments.forEach(treatment => {
        if (sentence.includes(treatment)) {
          foundTreatments.push(treatment);
        }
      });
    }
  });
  
  // Remove duplicates
  return {
    conditions: [...new Set(foundConditions)],
    allergies: [...new Set(foundAllergies)],
    medications: [...new Set(foundMedications)],
    pastTreatments: [...new Set(foundTreatments)]
  };
};
