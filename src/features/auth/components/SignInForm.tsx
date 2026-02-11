import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import { Checkbox } from "../../../shared/components/ui/Checkbox";
import type { SignInFormData } from "../types";

interface SignInFormProps {
  onSubmit: (data: SignInFormData) => void;
  onSignUpClick: () => void;
  onForgotPasswordClick: () => void;
  onGoogleSignIn?: () => void;
  isLoading?: boolean;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  onSubmit,
  onSignUpClick,
  onForgotPasswordClick,
  onGoogleSignIn,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange =
    (field: keyof SignInFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      }));
    };

  return (
    <div className="w-full space-y-5">
      {/* Google Sign In Button */}
      {onGoogleSignIn && (
        <>
          <button
            type="button"
            onClick={onGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"></path>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"></path>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"></path>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"></path>
            </svg>
            <span className="font-medium text-gray-700">Continue with Google</span>
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
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange("email")}
          required
          autoComplete="email"
          disabled={isLoading}
        />

        {/* Password Input */}
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          onChange={handleChange("password")}
          required
          autoComplete="current-password"
          disabled={isLoading}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-text-primary transition-colors focus:outline-hidden cursor-pointer disabled:cursor-not-allowed"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <Checkbox
            label="Remember me"
            checked={formData.rememberMe}
            onChange={handleChange("rememberMe")}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={onForgotPasswordClick}
            className="text-sm underline text-gray-600 hover:text-primary-dark transition-colors font-medium cursor-pointer disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4 font-semibold"
          isLoading={isLoading}
        >
          Sign In
        </Button>

        {/* Sign Up Link */}
        <div className="text-center text-sm text-text-secondary pt-1 mb-10 select-none">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSignUpClick}
            className="text-primary hover:text-primary-dark font-normal transition-colors cursor-pointer disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};