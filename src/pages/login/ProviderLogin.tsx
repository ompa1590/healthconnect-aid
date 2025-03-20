
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Lock, Mail, Shield, LogOut, Loader2, Stethoscope, CalendarDays, Users, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CaptchaComponent from "@/components/auth/CaptchaComponent";

const ProviderLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(Date.now().toString()); // Add unique key for captcha
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Force re-render of captcha on component mount to ensure it's visible
  useEffect(() => {
    // Reset and regenerate captcha with unique key
    setCaptchaKey(Date.now().toString());
    setCaptchaVerified(false);
    setCaptchaToken(null);
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/provider/dashboard');
      }
    };
    checkSession();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/provider/dashboard");
      }
    });
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const handleCaptchaVerify = (token: string) => {
    console.log("Captcha verified with token:", token);
    setCaptchaToken(token);
    setCaptchaVerified(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    if (!captchaVerified || !captchaToken) {
      setErrorMessage("Please complete the captcha verification before signing in.");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Attempting login with captcha token:", captchaToken);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: captchaToken,
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Login successful",
          description: "Welcome to Vyra Health Provider Portal!",
        });
        navigate("/provider/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message || "Failed to sign in. Please check your credentials.");
      
      // Reset captcha after failed login attempt
      setCaptchaKey(Date.now().toString());
      setCaptchaVerified(false);
      setCaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sign out successful",
        description: "You have been signed out from Vyra Health",
      });
      navigate("/provider-login");
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
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop" 
              alt="Healthcare provider" 
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
              {errorMessage && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              
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
                    onChange={e => setEmail(e.target.value)} 
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
                    onChange={e => setPassword(e.target.value)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/90">
                      Forgot your password?
                    </Link>
                  </div>
                </div>
              </div>

              {/* hCaptcha container */}
              <div className="flex justify-center mt-4">
                <CaptchaComponent 
                  captchaId={`provider-login-captcha-${captchaKey}`}
                  onVerify={handleCaptchaVerify}
                  callbackName="providerLoginCaptchaCallback"
                />
              </div>
              
              {captchaVerified && (
                <p className="text-green-500 text-sm font-medium text-center">
                  ✓ Captcha verification complete
                </p>
              )}

              <div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !captchaVerified}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
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
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/provider-registration">Register as a provider</Link>
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm font-medium text-primary hover:text-primary/90">
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

export default ProviderLogin;
