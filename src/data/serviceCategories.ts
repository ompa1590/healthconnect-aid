
import { 
  Activity, 
  Stethoscope, 
  Heart, 
  Hospital, 
  UserCheck, 
  Pill,
  Brain,
  Feather,
  HeartPulse,
  FlaskConical,
  Scissors,
  Weight,
  Smile,
  ThermometerSnowflake
} from "lucide-react";

// Most popular treatments for homepage
export const popularTreatments = [
  {
    id: "weight-loss",
    title: "Weight Loss",
    tagline: "Lose weight with science",
    icon: Weight,
    color: "primary",
    description: "Science-backed weight loss plans, including nutrition, exercise, and medication options.",
    path: "/services/weight-loss"
  },
  {
    id: "erectile-dysfunction",
    title: "Erectile Dysfunction",
    tagline: "Get confidence back in bed",
    icon: HeartPulse,
    color: "secondary",
    description: "Discreet, effective treatments for erectile dysfunction with virtual consultations and medication options.",
    path: "/services/erectile-dysfunction"
  },
  {
    id: "menopause",
    title: "Menopause",
    tagline: "Take control of menopause",
    icon: ThermometerSnowflake,
    color: "primary",
    description: "Comprehensive menopause management with hormone therapy options and symptom relief strategies.",
    path: "/services/menopause"
  }
];

// Health categories for main services page
export const healthCategories = [
  {
    id: "menopause",
    title: "Menopause",
    icon: ThermometerSnowflake,
    color: "primary",
    description: "Relief from hot flashes, mood changes, and other menopause symptoms through personalized treatment plans.",
    treatments: ["Hormone Replacement Therapy", "Symptom Management", "Lifestyle Guidance"]
  },
  {
    id: "sexual-health",
    title: "Sexual Health",
    icon: HeartPulse,
    color: "secondary",
    description: "Confidential treatments for erectile dysfunction, premature ejaculation, and other sexual health concerns.",
    treatments: ["Erectile Dysfunction", "Premature Ejaculation", "Birth Control", "PrEP", "Genital Herpes"]
  },
  {
    id: "mental-health",
    title: "Mental Health",
    icon: Brain,
    color: "primary",
    description: "Support for anxiety, depression, and stress management with therapy, counseling, and medication options.",
    treatments: ["Anxiety", "Depression", "Stress Management", "Sleep Issues"]
  },
  {
    id: "weight-loss",
    title: "Weight Loss",
    icon: Weight,
    color: "secondary",
    description: "Clinically-proven weight loss programs with dietary guidance, exercise plans, and prescription options.",
    treatments: ["Medical Weight Loss", "Nutritional Counseling", "Metabolic Health"]
  },
  {
    id: "skin-hair",
    title: "Skin & Hair",
    icon: Scissors,
    color: "primary",
    description: "Treatments for acne, hair loss, rosacea, and other skin and hair conditions with proven results.",
    treatments: ["Acne", "Hair Loss", "Rosacea", "Cold Sores"]
  },
  {
    id: "medications",
    title: "Medications",
    icon: Pill,
    color: "secondary",
    description: "Prescription medications for chronic conditions, allergies, migraines, and more with convenient delivery.",
    treatments: ["Allergies", "Diabetes", "Migraines", "Smoking Cessation"]
  }
];

// All treatments comprehensive list
export const allTreatments = [
  {
    id: "acne",
    title: "Acne",
    category: "skin-hair",
    description: "Effective treatments for mild to severe acne with prescription options and skincare recommendations.",
    treatments: ["Topical Treatments", "Oral Medications", "Lifestyle Management"],
    path: "/services/acne"
  },
  {
    id: "allergies",
    title: "Allergies",
    category: "medications",
    description: "Relief from seasonal and chronic allergies with prescription and over-the-counter options.",
    treatments: ["Antihistamines", "Nasal Sprays", "Allergy Testing"],
    path: "/services/allergies"
  },
  {
    id: "anxiety",
    title: "Anxiety",
    category: "mental-health",
    description: "Comprehensive treatment plans for anxiety disorders including therapy and medication when appropriate.",
    treatments: ["Therapy", "Medication", "Stress Management Techniques"],
    path: "/services/anxiety"
  },
  {
    id: "birth-control",
    title: "Birth Control",
    category: "sexual-health",
    description: "Various contraception options tailored to your lifestyle, health needs, and preferences.",
    treatments: ["Oral Contraceptives", "Long-acting Methods", "Emergency Contraception"],
    path: "/services/birth-control"
  },
  {
    id: "cold-sores",
    title: "Cold Sores",
    category: "skin-hair",
    description: "Treatments to reduce the frequency, duration, and severity of cold sore outbreaks.",
    treatments: ["Antiviral Medications", "Preventive Strategies", "Symptom Relief"],
    path: "/services/cold-sores"
  },
  {
    id: "depression",
    title: "Depression",
    category: "mental-health",
    description: "Personalized approaches to depression treatment with therapy, medication, and lifestyle recommendations.",
    treatments: ["Therapy", "Antidepressants", "Holistic Approaches"],
    path: "/services/depression"
  },
  {
    id: "diabetes",
    title: "Diabetes",
    category: "medications",
    description: "Management of Type 1 and Type 2 diabetes with medication, monitoring, and lifestyle guidance.",
    treatments: ["Medication Management", "Blood Sugar Monitoring", "Nutrition Planning"],
    path: "/services/diabetes"
  },
  {
    id: "erectile-dysfunction",
    title: "Erectile Dysfunction",
    category: "sexual-health",
    description: "Discreet, effective treatments for erectile dysfunction with virtual consultations and medication options.",
    treatments: ["Prescription Medications", "Lifestyle Modifications", "Underlying Cause Assessment"],
    path: "/services/erectile-dysfunction"
  },
  {
    id: "genital-herpes",
    title: "Genital Herpes",
    category: "sexual-health",
    description: "Confidential treatment and management strategies for genital herpes infections.",
    treatments: ["Antiviral Medications", "Outbreak Management", "Prevention Strategies"],
    path: "/services/genital-herpes"
  },
  {
    id: "hair-loss",
    title: "Hair Loss",
    category: "skin-hair",
    description: "Evidence-based approaches to hair loss prevention and treatment for both men and women.",
    treatments: ["Prescription Medications", "Topical Solutions", "Nutritional Support"],
    path: "/services/hair-loss"
  },
  {
    id: "menopause",
    title: "Menopause",
    category: "menopause",
    description: "Comprehensive menopause management with hormone therapy options and symptom relief strategies.",
    treatments: ["Hormone Replacement Therapy", "Symptom Management", "Non-hormonal Options"],
    path: "/services/menopause"
  },
  {
    id: "migraines",
    title: "Migraines",
    category: "medications",
    description: "Relief and prevention strategies for migraine headaches with prescription and lifestyle approaches.",
    treatments: ["Preventive Medications", "Acute Treatment", "Trigger Management"],
    path: "/services/migraines"
  },
  {
    id: "prep",
    title: "PrEP",
    category: "sexual-health",
    description: "Pre-exposure prophylaxis (PrEP) for HIV prevention with virtual consultations and ongoing support.",
    treatments: ["PrEP Medication", "Regular Testing", "Prevention Counseling"],
    path: "/services/prep"
  },
  {
    id: "premature-ejaculation",
    title: "Premature Ejaculation",
    category: "sexual-health",
    description: "Effective treatments for premature ejaculation with medications and behavioral techniques.",
    treatments: ["Medication Options", "Behavioral Techniques", "Psychological Support"],
    path: "/services/premature-ejaculation"
  },
  {
    id: "rosacea",
    title: "Rosacea",
    category: "skin-hair",
    description: "Management strategies for rosacea symptoms including redness, bumps, and skin irritation.",
    treatments: ["Topical Treatments", "Oral Medications", "Trigger Avoidance"],
    path: "/services/rosacea"
  },
  {
    id: "smoking-cessation",
    title: "Smoking Cessation",
    category: "medications",
    description: "Support for quitting smoking with medication, nicotine replacement, and behavioral strategies.",
    treatments: ["Prescription Medications", "Nicotine Replacement", "Behavioral Support"],
    path: "/services/smoking-cessation"
  },
  {
    id: "weight-loss",
    title: "Weight Loss",
    category: "weight-loss",
    description: "Science-backed weight loss plans, including nutrition, exercise, and medication options.",
    treatments: ["Prescription Weight Loss", "Dietary Guidance", "Exercise Planning"],
    path: "/services/weight-loss"
  }
];

// Original service categories for the service page tabs
export const serviceCategories = [
  {
    id: "general",
    title: "General & Urgent Care",
    icon: Hospital,
    color: "primary",
    services: [
      {
        title: "General Consultations",
        description: "Quick medical advice for common conditions like Cold/Flu, UTIs, STIs, Travel Consults, and more.",
        benefits: ["24/7 availability", "No appointment needed", "Prescription services", "Follow-up included"],
        price: "$45 per consultation",
        iconColor: "text-primary",
      },
      {
        title: "Specialist Referrals",
        description: "Get direct referrals to specialists when needed, bypassing long wait times.",
        benefits: ["Fast-tracked appointments", "Digital referral letters", "Specialist matching", "Progress tracking"],
        price: "$35 per referral",
        iconColor: "text-primary",
      },
      {
        title: "Follow-up Appointments",
        description: "Check in with your healthcare provider to monitor your progress and adjust treatment as needed.",
        benefits: ["Treatment monitoring", "Medication adjustments", "Recovery tracking", "Included with initial consult"],
        price: "$25 per follow-up",
        iconColor: "text-primary",
      },
    ]
  },
  {
    id: "chronic",
    title: "Chronic Care Management",
    icon: Heart,
    color: "secondary",
    services: [
      {
        title: "Diabetes Care Management",
        description: "Comprehensive diabetes management with regular monitoring, dietary guidance, and medication management.",
        benefits: ["Blood glucose monitoring", "Dietary counseling", "Medication management", "Complication prevention"],
        price: "$70 per month",
        iconColor: "text-secondary",
      },
      {
        title: "Weight Loss Program",
        description: "Physician-supervised weight management with personalized nutrition plans and progress tracking.",
        benefits: ["Custom meal plans", "Exercise guidance", "Progress tracking", "Behavioral support"],
        price: "$70 per month",
        iconColor: "text-secondary",
      },
      {
        title: "Personalized Health Plans",
        description: "Individualized care plans for managing chronic conditions like hypertension, asthma, and more.",
        benefits: ["Regular check-ins", "Medication adjustments", "Lifestyle modifications", "Emergency support"],
        price: "$70 per month",
        iconColor: "text-secondary",
      },
    ]
  },
  {
    id: "specialist",
    title: "Specialist Care",
    icon: Stethoscope,
    color: "primary",
    services: [
      {
        title: "Dermatology",
        description: "Virtual consultations for skin conditions with board-certified dermatologists.",
        benefits: ["Skin condition diagnosis", "Treatment plans", "Prescription medications", "Follow-up care"],
        price: "$90 per consultation",
        iconColor: "text-primary",
      },
      {
        title: "Endocrinology",
        description: "Expert care for hormonal and metabolic disorders from experienced endocrinologists.",
        benefits: ["Hormone testing guidance", "Medication management", "Nutritional advice", "Ongoing support"],
        price: "$120 per consultation",
        iconColor: "text-primary",
      },
      {
        title: "Respirology",
        description: "Specialized care for respiratory conditions like asthma, COPD, and sleep apnea.",
        benefits: ["Breathing assessments", "Treatment optimization", "Inhaler technique review", "Pulmonary rehabilitation"],
        price: "$110 per consultation",
        iconColor: "text-primary",
      },
      {
        title: "Oncology",
        description: "Supportive care for cancer patients, including symptom management and treatment coordination.",
        benefits: ["Symptom management", "Treatment coordination", "Survivorship planning", "Emotional support"],
        price: "$150 per consultation",
        iconColor: "text-secondary",
      },
      {
        title: "Naturopathic Medicine",
        description: "Holistic health approaches combining conventional and natural therapies.",
        benefits: ["Whole-person assessment", "Natural remedies", "Lifestyle modification", "Preventive care"],
        price: "$85 per consultation",
        iconColor: "text-secondary",
      },
      {
        title: "Sleep Therapy",
        description: "Specialized help for sleep disorders, including insomnia, sleep apnea, and circadian rhythm issues.",
        benefits: ["Sleep assessment", "Behavioral techniques", "Medication review", "Sleep hygiene education"],
        price: "$95 per consultation",
        iconColor: "text-primary",
      },
      {
        title: "Functional Medicine",
        description: "Root-cause focused approach to chronic health issues using comprehensive testing and personalized care.",
        benefits: ["Root cause analysis", "Comprehensive testing", "Personalized protocols", "Long-term planning"],
        price: "$125 per consultation",
        iconColor: "text-primary",
      },
      {
        title: "LGBTQ+ Health & Hormone Therapy",
        description: "Specialized, affirming healthcare services for the LGBTQ+ community.",
        benefits: ["Gender-affirming care", "Hormone therapy", "Preventive screening", "Mental health support"],
        price: "$100 per consultation",
        iconColor: "text-secondary",
      },
      {
        title: "Mental Health",
        description: "Virtual therapy sessions with licensed therapists and psychologists.",
        benefits: ["Cognitive behavioral therapy", "Medication management", "Crisis intervention", "Ongoing support"],
        price: "$85 per session",
        iconColor: "text-secondary",
      },
    ]
  },
  {
    id: "wellness",
    title: "Wellness & Preventative Health",
    icon: Activity,
    color: "secondary",
    services: [
      {
        title: "Fitness Coaching",
        description: "Personalized fitness programs designed by certified trainers to meet your health goals.",
        benefits: ["Custom workout plans", "Form assessment", "Progress tracking", "Motivation support"],
        price: "$60 per session",
        iconColor: "text-secondary",
      },
      {
        title: "Meditation & Wellness Resources",
        description: "Guided meditation sessions and stress management techniques for mental wellbeing.",
        benefits: ["Guided sessions", "Stress reduction", "Sleep improvement", "Mindfulness training"],
        price: "$40 per session",
        iconColor: "text-secondary",
      },
      {
        title: "Pediatric Health",
        description: "Virtual consultations for children's health concerns with pediatric specialists.",
        benefits: ["Child-friendly approach", "Developmental assessment", "Parental guidance", "Preventive care"],
        price: "$75 per consultation",
        iconColor: "text-primary",
      },
    ]
  },
  {
    id: "pharmacy",
    title: "Pharmacy & Prescription Services",
    icon: Pill,
    color: "primary",
    services: [
      {
        title: "Online Pharmacy with Home Delivery",
        description: "Convenient prescription fulfillment with medications delivered right to your door.",
        benefits: ["Prescription delivery", "Medication consultation", "Refill management", "Insurance processing"],
        price: "Varies by medication (delivery included)",
        iconColor: "text-primary",
      },
    ]
  },
];
