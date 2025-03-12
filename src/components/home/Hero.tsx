
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const benefits = [
    "24/7 access to healthcare professionals",
    "Secure, HIPAA-compliant consultations",
    "Chronic care management programs",
    "On-demand specialist services",
  ];

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="max-w-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-primary mb-6">
              <span className="pulse-dot mr-2"></span>
              <span>Healthcare reimagined for the digital age</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance">
              <span className="block">Virtual Healthcare</span>
              <span className="block text-primary">Always Accessible</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Comprehensive, HIPAA-compliant telehealth services designed to provide 24/7 unlimited 
              virtual healthcare access focusing on chronic disease management, general consultations, 
              specialist care, and wellness services.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5 mr-2" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="rounded-full text-base font-medium px-8 bg-primary hover:bg-primary/90"
                asChild
              >
                <Link to="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full text-base font-medium px-8 border-primary/20 hover:bg-primary/5 hover:border-primary/30"
                asChild
              >
                <Link to="#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <GlassCard className="relative z-10 overflow-hidden p-8">
              <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-r from-primary/20 to-secondary/20 mb-6">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-2xl font-medium text-primary/50">Video Consultation Demo</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Dr. Sarah Johnson</h3>
                    <p className="text-sm text-muted-foreground">General Practitioner</p>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full bg-secondary hover:bg-secondary/90"
                  >
                    Connect Now
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground">Wait Time</div>
                    <div className="text-sm font-medium">~5 min</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground">Available</div>
                    <div className="text-sm font-medium">24/7</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground">Rating</div>
                    <div className="text-sm font-medium">4.9/5</div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Decorative Element */}
            <div className="absolute -bottom-8 -right-8 w-56 h-56 bg-secondary/20 rounded-full filter blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
