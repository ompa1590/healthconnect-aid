
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { 
  Clipboard, 
  Calendar, 
  Video, 
  ClipboardCheck, 
  PackageCheck,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorksPage = () => {
  const steps = [
    {
      id: 1,
      title: "Choose Your Service",
      description: "Browse our list of available treatments or use the AI Symptom Checker to find the right consultation for your needs.",
      icon: Clipboard,
      color: "primary",
      animation: "fade-right",
      details: [
        "Explore specialized services for your specific health concerns",
        "Use our AI Symptom Checker for personalized recommendations",
        "Read doctor profiles and reviews to find the perfect match",
        "Compare service options and pricing"
      ]
    },
    {
      id: 2,
      title: "Book an Appointment",
      description: "Select a healthcare provider, choose a time that works for you, and confirm your booking in minutes.",
      icon: Calendar,
      color: "secondary",
      animation: "fade-left",
      details: [
        "See real-time availability for healthcare providers",
        "Schedule same-day appointments when needed",
        "Receive instant confirmation via email and text",
        "Add appointment to your digital calendar with one click"
      ]
    },
    {
      id: 3,
      title: "Secure Virtual Consultation",
      description: "Meet your doctor via our encrypted, HIPAA-compliant video platform or chat directly with your provider.",
      icon: Video,
      color: "primary",
      animation: "fade-right",
      details: [
        "Connect via high-quality video on any device",
        "End-to-end encrypted for complete privacy",
        "Access virtual waiting room 5 minutes before appointment",
        "Text-based chat option for those who prefer it"
      ]
    },
    {
      id: 4,
      title: "Get Your Treatment Plan",
      description: "Receive a personalized diagnosis, prescription, referral, or follow-up recommendations from your provider.",
      icon: ClipboardCheck,
      color: "secondary",
      animation: "fade-left",
      details: [
        "Digital treatment plans sent directly to your patient portal",
        "Electronic prescriptions sent to your preferred pharmacy",
        "Detailed aftercare instructions",
        "Lab work referrals when necessary"
      ]
    },
    {
      id: 5,
      title: "Medication & Follow-Ups",
      description: "Use our online pharmacy for home-delivered medications or schedule a follow-up appointment if needed.",
      icon: PackageCheck,
      color: "primary",
      animation: "fade-right",
      details: [
        "Medication delivered to your door within 24-48 hours",
        "Automatic refill reminders",
        "Easy scheduling of follow-up appointments",
        "Ongoing chat support with your care team"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">How CloudCare Works</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Our simple, secure process connects you with quality healthcare in minutes.
              Follow these steps to get the care you need, when you need it.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary -ml-0.5 hidden lg:block"></div>

            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`relative mb-20 lg:mb-32 ${index % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`lg:flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Step number bubble */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${index % 2 === 0 ? 'from-primary to-primary/80' : 'from-secondary to-secondary/80'} shadow-lg`}>
                      {step.id}
                    </div>
                  </div>

                  <GlassCard 
                    className={`w-full lg:w-1/2 p-8 hover:shadow-lg transition-all duration-300 ${index % 2 === 0 ? '' : ''}`}
                  >
                    <div className="flex items-center mb-6">
                      <div className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-${step.color} to-${step.color}/80 mr-4`}>
                        {step.id}
                      </div>
                      <h3 className="text-2xl font-semibold">{step.title}</h3>
                    </div>
                    
                    <div className={`rounded-full bg-${step.color}/10 w-14 h-14 flex items-center justify-center mb-6`}>
                      <step.icon className={`h-6 w-6 text-${step.color}`} />
                    </div>
                    
                    <p className="text-muted-foreground mb-6">{step.description}</p>
                    
                    <ul className="space-y-3 mb-6">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center">
                          <span className={`h-2 w-2 rounded-full bg-${step.color} mr-2`}></span>
                          <span className="text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {step.id === 1 && (
                      <Button 
                        className={`bg-${step.color} hover:bg-${step.color}/90 rounded-full text-white`}
                        asChild
                      >
                        <Link to="/services">
                          Browse Services <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </GlassCard>
                  
                  {/* Decorative elements */}
                  <div className={`hidden lg:block w-1/2 ${index % 2 === 0 ? 'pl-16' : 'pr-16'}`}>
                    <div className={`${index % 2 === 0 ? 'float-animation-slow' : 'float-animation'} relative`}>
                      <div className={`absolute top-1/2 transform -translate-y-1/2 ${index % 2 === 0 ? 'left-8' : 'right-8'} w-16 h-16 rounded-lg bg-${step.color}/30 rotate-12`}></div>
                      <div className={`absolute bottom-1/4 ${index % 2 === 0 ? 'left-20' : 'right-20'} w-12 h-12 rounded-full bg-${index % 2 === 0 ? 'secondary' : 'primary'}/20 floating`} style={{ animationDelay: "0.5s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Final CTA */}
            <div className="text-center mt-12">
              <h3 className="text-2xl font-semibold mb-4">Ready to get started?</h3>
              <p className="text-muted-foreground mb-8">Experience healthcare that revolves around your schedule, not the other way around.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-primary hover:bg-primary/90 rounded-full" size="lg" asChild>
                  <Link to="/services">Browse Services</Link>
                </Button>
                <Button variant="outline" className="rounded-full border-primary/30" size="lg" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
