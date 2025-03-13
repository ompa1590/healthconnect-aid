import { 
  Activity, 
  Stethoscope, 
  Heart, 
  Hospital, 
  UserCheck, 
  Pill 
} from "lucide-react";

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
