
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, CheckCircle, Video, Calendar, Shield, MessageCircle, Stethoscope, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Hero = () => {
  const benefits = [
    "24/7 access to healthcare professionals", 
    "Secure, HIPAA-compliant telehealth platform", 
    "Prescription management & delivery", 
    "Follow-up care & monitoring"
  ];
  
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full health-pattern-bg"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl blob-animation-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl blob-animation"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="max-w-2xl animate-fade-in" style={{
            animationDelay: "0.2s"
          }}>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6">
              <span className="pulse-dot mr-2"></span>
              <span>Telehealth reimagined for better care</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance">
              <span className="block">Healthcare at Your</span>
              <span className="block text-primary">Fingertips</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Connect with board-certified healthcare professionals through secure video consultations. 
              Get diagnosed, treated, and prescribed medication—all from the comfort of your home.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-2" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full text-base font-medium px-8 group" asChild>
                <Link to="/signup">
                  Start Your Visit
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full text-base font-medium px-8 border-primary/20 hover:bg-primary/5 hover:border-primary/30" asChild>
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative animate-fade-in" style={{
            animationDelay: "0.4s"
          }}>
            {/* Decorative floating elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/10 rounded-2xl rotate-12 floating-fast"></div>
            <div className="absolute top-1/3 -right-8 w-16 h-16 bg-secondary/10 rounded-full floating" style={{
              animationDelay: "1s"
            }}></div>
            <div className="absolute -bottom-8 left-1/4 w-24 h-24 bg-primary/5 rounded-full floating-slow" style={{
              animationDelay: "0.5s"
            }}></div>
            
            <GlassCard className="relative z-10 overflow-hidden p-8 gradient-border telehealth-card">
              <div className="absolute top-2 right-2 z-10 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="medical-icon-bg">
                  <Video className="h-5 w-5" />
                </div>
                <h4 className="font-semibold">Secure Video Consultation</h4>
              </div>
              
              <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-tr from-primary/10 to-secondary/10 mb-6 relative">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/lovable-uploads/15f04839-7fe9-4e25-acca-3cac2453305a.png')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col items-center justify-end p-4">
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-primary font-medium">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Live Consultation
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src="/lovable-uploads/15f04839-7fe9-4e25-acca-3cac2453305a.png" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">Dr. Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">Family Medicine</p>
                    </div>
                  </div>
                  <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 group">
                    Connect Now
                    <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Wait Time</div>
                    <div className="text-sm font-medium flex items-center justify-center">
                      <Clock className="h-3 w-3 mr-1 text-primary" />
                      ~5 min
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Available</div>
                    <div className="text-sm font-medium flex items-center justify-center">
                      <Calendar className="h-3 w-3 mr-1 text-primary" />
                      24/7
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Security</div>
                    <div className="text-sm font-medium flex items-center justify-center">
                      <Shield className="h-3 w-3 mr-1 text-primary" />
                      HIPAA
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-muted/50">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    <span>Secure messaging available after consultation</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Decorative Element */}
            <div className="absolute -bottom-8 -right-8 w-56 h-56 bg-secondary/10 rounded-full filter blur-2xl blob-animation-slow"></div>
          </div>
        </div>
      </div>

      {/* Floating medical icons */}
      <div className="absolute top-1/4 right-10 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center floating-slow">
        <Stethoscope className="h-6 w-6 text-primary/50" />
      </div>
      <div className="absolute bottom-1/4 left-10 w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center floating" style={{
        animationDelay: "1.5s"
      }}>
        <div className="w-8 h-8 border-2 border-t-0 border-l-0 border-secondary/50 rounded-full transform rotate-45"></div>
      </div>
    </section>
  );
};

export default Hero;
