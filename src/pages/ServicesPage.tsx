
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  FirstAid, 
  Heart, 
  Brain, 
  Stethoscope, 
  UserCheck, 
  Baby, 
  PanelRight, 
  Pill, 
  ShoppingBag, 
  ArrowRight, 
  Workflow 
} from "lucide-react";

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("general");

  const serviceCategories = [
    {
      id: "general",
      title: "General & Urgent Care",
      icon: FirstAid,
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

  const renderServiceCard = (service: any, index: number) => (
    <GlassCard 
      key={index} 
      className="p-6 transition-all duration-300 hover:scale-102 hover:shadow-lg"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`rounded-full ${service.iconColor}/10 w-14 h-14 flex items-center justify-center mb-5`}>
        {selectedCategory === "general" && <FirstAid className={service.iconColor} size={24} />}
        {selectedCategory === "chronic" && <Heart className={service.iconColor} size={24} />}
        {selectedCategory === "specialist" && <UserCheck className={service.iconColor} size={24} />}
        {selectedCategory === "wellness" && <Activity className={service.iconColor} size={24} />}
        {selectedCategory === "pharmacy" && <Pill className={service.iconColor} size={24} />}
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
      <p className="text-muted-foreground mb-4">{service.description}</p>
      
      <div className="mb-5">
        <h4 className="font-medium mb-2">Benefits:</h4>
        <ul className="grid grid-cols-1 gap-2">
          {service.benefits.map((benefit: string, i: number) => (
            <li key={i} className="flex items-center text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <span className="font-semibold text-primary">{service.price}</span>
        <Button className="rounded-full">
          Book Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </GlassCard>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Our Healthcare Services</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Comprehensive telehealth services designed to provide care when and where you need it.
              Browse our services below and find the right care for your needs.
            </p>
          </div>

          <Tabs 
            defaultValue="general" 
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <div className="relative mb-10">
              <TabsList className="flex flex-wrap justify-center gap-2">
                {serviceCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="px-4 py-3 data-[state=active]:bg-primary/10 rounded-full flex items-center gap-2"
                  >
                    <category.icon className={`h-5 w-5 text-${category.color}`} />
                    {category.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {serviceCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="animate-fade-in mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.services.map((service, idx) => renderServiceCard(service, idx))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
