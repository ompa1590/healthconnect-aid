
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Bot, MessageCircle, Video } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-secondary/5 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* CTA Content */}
          <div className="max-w-xl animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Experience Healthcare <span className="text-primary">Without Boundaries</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of patients who have transformed their healthcare experience. Our platform provides 24/7 access to quality care from the comfort of your home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="rounded-full text-base font-medium px-8 bg-primary hover:bg-primary/90"
                asChild
              >
                <Link to="/signup">Get Started Now</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full text-base font-medium px-8 border-primary/20 hover:bg-primary/5 hover:border-primary/30"
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
                    className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium"
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

          {/* CTA Visuals */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <GlassCard className="sm:translate-y-8">
                <Video className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Video Consultations</h3>
                <p className="text-muted-foreground">
                  Secure, HD video calls with healthcare professionals from anywhere.
                </p>
              </GlassCard>

              <GlassCard>
                <Bot className="h-8 w-8 text-secondary mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI Symptom Analysis</h3>
                <p className="text-muted-foreground">
                  Advanced AI helps understand your symptoms before your consultation.
                </p>
              </GlassCard>

              <GlassCard className="sm:col-span-2">
                <MessageCircle className="h-8 w-8 text-health-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Messaging</h3>
                <p className="text-muted-foreground">
                  HIPAA-compliant messaging with your healthcare team for continuous support.
                </p>
              </GlassCard>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full filter blur-2xl -z-10"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/10 rounded-full filter blur-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
