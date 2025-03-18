
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Video, ArrowRight, Clock, Calendar, ShieldCheck, Headphones, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 health-pattern-bg"></div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* CTA Content */}
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <span className="text-primary font-medium text-sm">VIRTUAL APPOINTMENTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Connect with Specialists <span className="text-primary">Anytime, Anywhere</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get the care you need from the comfort of your home with our secure telehealth platform. No waiting rooms, no commute—just quality healthcare on your schedule.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="medical-icon-bg">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">HD Video Calls</h4>
                  <p className="text-sm text-muted-foreground">Crystal-clear connections</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="wellness-icon-bg">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">HIPAA Compliant</h4>
                  <p className="text-sm text-muted-foreground">Your data stays private</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="medical-icon-bg">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">24/7 Availability</h4>
                  <p className="text-sm text-muted-foreground">Care when you need it</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="care-icon-bg">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Ongoing Support</h4>
                  <p className="text-sm text-muted-foreground">Continuous care access</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Button size="lg" className="rounded-full text-base font-medium px-8 group" asChild>
                <Link to="/signup">
                  Book Your First Visit
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full text-base font-medium px-8" asChild>
                <Link to="/services">Browse Services</Link>
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Most insurance plans accepted. Virtual visits start at just $49.
            </p>
          </div>

          {/* Right side - Visual content */}
          <div className="relative">
            <GlassCard className="overflow-hidden border-none shadow-xl">
              <div className="aspect-video relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                    <Stethoscope className="h-10 w-10 text-primary" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h3 className="text-white text-xl font-semibold mb-2">Vyra Health Telehealth</h3>
                  <p className="text-white/90 text-sm">
                    Connect with our board-certified healthcare providers via secure video consultations.
                  </p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-sm font-medium">Live Now</div>
                  </div>
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Next Available: <span className="text-primary">Today</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground">Wait Time</div>
                    <div className="text-sm font-medium">~5 min</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground">Avg. Visit</div>
                    <div className="text-sm font-medium">15 min</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground">Providers</div>
                    <div className="text-sm font-medium">30+ Online</div>
                  </div>
                </div>
              </div>
            </GlassCard>
            
            {/* Floating elements */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-secondary/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
