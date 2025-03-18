
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Lock, Mail, Shield, LogOut, Stethoscope, CalendarDays, Users, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is already logged in, redirect to dashboard
        navigate('/provider/dashboard');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication - in a real app, this would call an API
    setTimeout(() => {
      // For demo purposes, any login works
      toast({
        title: "Login successful",
        description: "Welcome to Vyra Health Provider Portal!",
      });
      navigate("/provider/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sign out successful",
        description: "You have been signed out from Vyra Health",
      });
      navigate("/admin-login");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-background to-muted/30">
      {/* Left side - Provider benefits and statistics */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary/10 to-secondary/10 hidden md:flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-opacity-10 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-lg p-8 z-10">
          <div className="rounded-2xl overflow-hidden shadow-2xl mb-8 transform transition-all hover:scale-105 duration-300">
            <img 
              src="/lovable-uploads/b9f0d1ad-bb96-48d0-a255-8f124b36ec4b.png" 
              alt="Doctor dashboard" 
              className="w-full h-auto object-cover"
            />
          </div>
          
          <GlassCard className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Provider Dashboard</h3>
            <p className="text-muted-foreground mb-6">
              Streamline your practice and deliver exceptional care with our comprehensive provider portal.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg bg-white/20 p-4 flex flex-col items-center">
                <CalendarDays className="h-8 w-8 text-primary mb-2" />
                <span className="text-xl font-bold">30%</span>
                <span className="text-sm text-muted-foreground">Less scheduling time</span>
              </div>
              <div className="rounded-lg bg-white/20 p-4 flex flex-col items-center">
                <Users className="h-8 w-8 text-primary mb-2" />
                <span className="text-xl font-bold">1000+</span>
                <span className="text-sm text-muted-foreground">Providers use Vyra</span>
              </div>
              <div className="rounded-lg bg-white/20 p-4 flex flex-col items-center">
                <ClipboardList className="h-8 w-8 text-primary mb-2" />
                <span className="text-xl font-bold">40%</span>
                <span className="text-sm text-muted-foreground">Less paperwork</span>
              </div>
              <div className="rounded-lg bg-white/20 p-4 flex flex-col items-center">
                <Stethoscope className="h-8 w-8 text-primary mb-2" />
                <span className="text-xl font-bold">24/7</span>
                <span className="text-sm text-muted-foreground">Technical support</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <span className="text-primary text-4xl font-bold tracking-tight">Vyra</span>
              <span className="text-secondary text-4xl font-bold tracking-tight">Health</span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-foreground">Healthcare Provider Login</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access your provider dashboard
            </p>
          </div>

          <GlassCard className="px-6 py-8 mt-8">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Professional email address"
                    autoComplete="email"
                    required
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-primary hover:text-primary/90"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    Not registered as a provider?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link to="/provider-registration">Register as a provider</Link>
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="text-sm font-medium text-primary hover:text-primary/90"
                >
                  Patient? Login here
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
