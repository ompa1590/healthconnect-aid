
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock } from "lucide-react";
import { SignupFormData } from "@/pages/login/PatientSignup";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AccountInfoStepProps {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
}

const AccountInfoStep: React.FC<AccountInfoStepProps> = ({ formData, updateFormData }) => {
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must include at least one uppercase letter";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must include at least one special character";
    }
    return null;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    updateFormData({ password: newPassword });
    setPasswordError(validatePassword(newPassword));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            className="pl-10"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            className="pl-10"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            className={`pl-10 ${passwordError ? "border-destructive" : ""}`}
            value={formData.password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        {passwordError ? (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="text-xs">{passwordError}</AlertDescription>
          </Alert>
        ) : (
          <p className="text-xs text-muted-foreground">
            Password must be at least 8 characters and include an uppercase letter and a special character
          </p>
        )}
      </div>
    </div>
  );
};

export default AccountInfoStep;
