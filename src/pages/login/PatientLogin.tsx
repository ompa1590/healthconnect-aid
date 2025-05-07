import React from "react";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuthLogin } from "@/hooks/useAuthLogin";
import LoginForm from "@/components/auth/LoginForm";
import LoginFooter from "@/components/auth/LoginFooter";

const PatientLogin = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isGoogleLoading,
    errorMessage,
    captchaToken,
    setCaptchaToken,
    captchaVerified,
    setCaptchaVerified,
    handleLogin,
    handleGoogleLogin
  } = useAuthLogin();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-background to-muted/30">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <span className="text-primary text-4xl font-bold tracking-tight">Vyra</span>
              <span className="text-secondary text-4xl font-bold tracking-tight">Health</span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-foreground">Patient Login</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access your healthcare dashboard
            </p>
          </div>

          <GlassCard className="px-6 py-8 mt-8">
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
              isGoogleLoading={isGoogleLoading}
              errorMessage={errorMessage}
              captchaVerified={captchaVerified}
              setCaptchaToken={setCaptchaToken}
              setCaptchaVerified={setCaptchaVerified}
              handleLogin={handleLogin}
              handleGoogleLogin={handleGoogleLogin}
            />

            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Are you a healthcare provider?{" "}
                <Link to="/provider-registration" className="text-primary font-medium hover:underline">
                  Register here
                </Link>
              </p>
            </div>

            <LoginFooter />
          </GlassCard>
        </div>
      </div>
      
      {/* Right side - Image and benefits */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary/10 to-secondary/10 hidden md:flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-opacity-10 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-lg p-8 z-10">
          <div className="rounded-2xl overflow-hidden shadow-2xl mb-8 transform transition-all hover:scale-105 duration-300">
            <img 
              src="https://images.unsplash.com/photo-1651008376326-f606cfcb08e9?q=80&w=1974&auto=format&fit=crop" 
              alt="Patient care" 
              className="w-full h-auto object-cover"
            />
          </div>
          
          <GlassCard className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Your health, our priority</h3>
            <p className="text-muted-foreground mb-6">
              Vyra Health connects you with top healthcare professionals for personalized care when you need it most.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mr-4">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <p>Access your medical records anytime, anywhere</p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mr-4">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <p>Schedule appointments with just a few clicks</p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mr-4">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <p>Connect with doctors via secure video consultations</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
