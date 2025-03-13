
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Bot, MessageCircle, Video, Activity, Stethoscope, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-secondary/5 to-transparent"></div>
      </div>

      {/* 3D decorative shapes */}
      <div className="absolute top-20 left-1/4 w-24 h-24 bg-primary/10 rounded-full floating-slow"></div>
      <div className="absolute top-40 right-1/3 w-16 h-16 bg-secondary/10 rounded-lg transform rotate-45 floating" style={{ animationDelay: "1s" }}></div>
      <div className="absolute bottom-1/3 left-1/4 w-20 h-20 border-2 border-primary/10 rounded-full floating-fast" style={{ animationDelay: "0.5s" }}></div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* CTA Content */}
          <div className="max-w-xl animate-fade-in">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-muted text-primary mb-4">Start Your Health Journey</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Experience Healthcare <span className="gradient-text">Without Boundaries</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of patients who have transformed their healthcare experience. Our platform provides 24/7 access to quality care from the comfort of your home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="rounded-full text-base font-medium px-8 bg-primary hover:bg-primary/90 transform transition-transform duration-300 hover:scale-105"
                asChild
              >
                <Link to="/signup">Get Started Now</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full text-base font-medium px-8 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transform transition-transform duration-300 hover:scale-105"
                asChild
              >
                <Link to="#">View Pricing</Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-xs font-medium transform transition-transform duration-300 hover:scale-110 hover:z-10"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">4,000+</span> patients trust our telehealth services
              </p>
            </div>
          </div>

          {/* CTA Visuals with 3D-like cards */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <GlassCard className="sm:translate-y-8 transform transition-all duration-500 hover:translate-y-6 hover:shadow-xl">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-sm"></div>
                <Video className="h-8 w-8 text-primary mb-4 transform transition-transform duration-300 hover:scale-110" />
                <h3 className="text-xl font-semibold mb-2">Video Consultations</h3>
                <p className="text-muted-foreground">
                  Secure, HD video calls with healthcare professionals from anywhere.
                </p>
                
                {/* 3D-like animated illustration */}
                <div className="h-12 mt-4 relative">
                  <div className="absolute left-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center floating-fast">
                    <Stethoscope className="h-4 w-4 text-primary/60" />
                  </div>
                  <div className="absolute left-1/3 top-2 w-10 h-5 bg-secondary/20 rounded-lg floating" style={{ animationDelay: "0.7s" }}>
                    <div className="w-full h-1 bg-secondary/30 rounded-full mt-2"></div>
                  </div>
                  <div className="absolute right-4 w-6 h-6 bg-primary/10 rounded-lg transform rotate-45 floating-slow" style={{ animationDelay: "1.2s" }}></div>
                </div>
              </GlassCard>

              <GlassCard className="transform transition-all duration-500 hover:translate-y-[-8px] hover:shadow-xl">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-sm"></div>
                <Bot className="h-8 w-8 text-secondary mb-4 transform transition-transform duration-300 hover:scale-110" />
                <h3 className="text-xl font-semibold mb-2">AI Symptom Analysis</h3>
                <p className="text-muted-foreground">
                  Advanced AI helps understand your symptoms before your consultation.
                </p>
                
                {/* 3D-like animated illustration */}
                <div className="h-12 mt-4 relative">
                  <div className="absolute left-2 top-2 w-6 h-6 bg-secondary/20 rounded-lg transform rotate-12 floating-fast" style={{ animationDelay: "0.3s" }}></div>
                  <div className="absolute left-1/2 w-8 h-8 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-full floating" style={{ animationDelay: "0.9s" }}></div>
                  <div className="absolute right-2 w-4 h-4 bg-secondary/10 rounded-full floating-slow" style={{ animationDelay: "1.5s" }}></div>
                </div>
              </GlassCard>

              <GlassCard className="sm:col-span-2 transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl">
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-tl from-primary/10 to-secondary/10 rounded-full blur-sm"></div>
                <MessageCircle className="h-8 w-8 text-primary mb-4 transform transition-transform duration-300 hover:scale-110" />
                <h3 className="text-xl font-semibold mb-2">Secure Messaging</h3>
                <p className="text-muted-foreground">
                  HIPAA-compliant messaging with your healthcare team for continuous support.
                </p>
                
                {/* 3D-like animated illustration with message bubbles */}
                <div className="h-16 mt-4 relative">
                  <div className="absolute left-0 w-8 h-6 bg-muted rounded-lg transform -rotate-6 floating-fast">
                    <div className="w-full h-1 bg-primary/20 rounded-full mt-2"></div>
                    <div className="w-3/4 h-1 bg-primary/20 rounded-full mt-1 ml-1"></div>
                  </div>
                  <div className="absolute left-1/4 top-6 w-10 h-8 bg-primary/10 rounded-lg transform rotate-3 floating" style={{ animationDelay: "0.5s" }}>
                    <div className="w-full h-1 bg-primary/20 rounded-full mt-2"></div>
                    <div className="w-2/3 h-1 bg-primary/20 rounded-full mt-1 ml-1"></div>
                    <div className="w-1/2 h-1 bg-primary/20 rounded-full mt-1 ml-1"></div>
                  </div>
                  <div className="absolute right-1/4 top-2 w-12 h-7 bg-secondary/10 rounded-lg transform -rotate-3 floating-slow" style={{ animationDelay: "1s" }}>
                    <div className="w-full h-1 bg-secondary/20 rounded-full mt-2"></div>
                    <div className="w-3/4 h-1 bg-secondary/20 rounded-full mt-1 ml-2"></div>
                  </div>
                  <div className="absolute right-0 top-8 w-9 h-6 bg-muted rounded-lg transform rotate-6 floating" style={{ animationDelay: "1.5s" }}>
                    <div className="w-full h-1 bg-primary/20 rounded-full mt-2"></div>
                    <div className="w-1/2 h-1 bg-primary/20 rounded-full mt-1 ml-1"></div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full filter blur-2xl -z-10 blob-animation-slow"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/10 rounded-full filter blur-2xl -z-10 blob-animation"></div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-10 right-10 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center floating">
        <Activity className="h-5 w-5 text-primary/50" />
      </div>
      <div className="absolute top-1/3 left-10 w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center floating-slow">
        <Calendar className="h-6 w-6 text-secondary/50" />
      </div>
    </section>
  );
};

export default CTASection;
