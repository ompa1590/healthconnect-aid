
import React from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Mail, Lock } from "lucide-react";
import CaptchaComponent from "./CaptchaComponent";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  isGoogleLoading: boolean;
  errorMessage: string | null;
  captchaVerified: boolean;
  setCaptchaToken: (token: string) => void;
  setCaptchaVerified: (verified: boolean) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  isGoogleLoading,
  errorMessage,
  captchaVerified,
  setCaptchaToken,
  setCaptchaVerified,
  handleLogin,
  handleGoogleLogin
}) => {
  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setCaptchaVerified(true);
  };

  return (
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

      {/* hCaptcha container */}
      <div className="flex justify-center mt-4">
        <CaptchaComponent 
          captchaId="login-captcha"
          onVerify={handleCaptchaVerify}
          callbackName="loginCaptchaCallback"
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
            "Sign in with Email"
          )}
        </Button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || !captchaVerified}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
