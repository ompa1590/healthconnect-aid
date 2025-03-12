
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Lock, Mail, User } from "lucide-react";

const PatientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication - in a real app, this would call an API
    setTimeout(() => {
      // For demo purposes, any login works
      toast({
        title: "Login successful",
        description: "Welcome back to CloudCure!",
      });
      navigate("/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="text-primary text-4xl font-bold tracking-tight">Cloud</span>
            <span className="text-secondary text-4xl font-bold tracking-tight">Cure</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-foreground">Patient Login</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your healthcare dashboard
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
                  placeholder="Email address"
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
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <Link to="/signup">Create an account</Link>
              </Button>
            </div>
            
            <div className="mt-4 text-center">
              <Link
                to="/admin-login"
                className="text-sm font-medium text-primary hover:text-primary/90"
              >
                Healthcare Provider? Login here
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default PatientLogin;
