
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/30">
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

          <LoginFooter />
        </GlassCard>
      </div>
    </div>
  );
};

export default PatientLogin;
