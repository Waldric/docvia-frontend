import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import { Checkbox } from "../../../shared/components/ui/Checkbox";
import type { SignUpFormData } from "../types";

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => void;
  onSignInClick: () => void;
  onGoogleSignUp?: () => void;
  isLoading?: boolean;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  onSignInClick,
  onGoogleSignUp,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms of Service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange =
    (field: keyof SignUpFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const getPasswordStrength = (password: string): { level: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: 33, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { level: 66, label: 'Medium', color: 'bg-yellow-500' };
    return { level: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

  return (
    <div className="w-full space-y-5">
      {/* Google Sign Up Button */}
      {onGoogleSignUp && (
        <>
          <button
            type="button"
            onClick={onGoogleSignUp}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"></path>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"></path>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"></path>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"></path>
            </svg>
            <span className="font-medium text-gray-700">Sign up with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-gray-500">OR</span>
            </div>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        {/* Email Input */}
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange("email")}
            required
            autoComplete="email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange("password")}
            required
            autoComplete="new-password"
            disabled={isLoading}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-text-primary transition-colors focus:outline-hidden cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
          {formData.password && passwordStrength && (
            <div className="mt-2">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.level}%` }}
                />
              </div>
              <p className="text-xs mt-1 text-gray-600">{passwordStrength.label}</p>
            </div>
          )}
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange("confirmPassword")}
            required
            autoComplete="new-password"
            disabled={isLoading}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="hover:text-text-primary transition-colors focus:outline-hidden cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div>
          <Checkbox
            label={
              <span className="text-sm">
                I agree to the{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>
              </span>
            }
            checked={formData.agreeToTerms}
            onChange={handleChange("agreeToTerms")}
            disabled={isLoading}
          />
          {errors.agreeToTerms && (
            <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
          )}
        </div>

        {/* Sign Up Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4 font-semibold"
          isLoading={isLoading}
        >
          Create Account
        </Button>

        {/* Sign In Link */}
        <div className="text-center text-sm text-text-secondary pt-1 mb-10 select-none">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSignInClick}
            className="text-primary hover:text-primary-dark font-normal transition-colors cursor-pointer disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};