import React, { useState } from "react";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import type { ForgotPasswordFormData } from "../types";

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => void;
  onBackToSignIn: () => void;
  isLoading?: boolean;
  success?: boolean;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  onBackToSignIn,
  isLoading = false,
  success = false,
}) => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      email: e.target.value,
    }));
    // Clear error when user starts typing
    if (errors.email) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {!success && (
        <>
          {/* Email Input */}
          <div className="space-y-1">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Send Reset Link Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full mt-6 select-none"
            isLoading={isLoading}
          >
            Send Reset Link
          </Button>
        </>
      )}

      {/* Back to Sign In Link */}
      <div className="text-center text-sm text-text-secondary pt-2">
        <button
          type="button"
          onClick={onBackToSignIn}
          className="text-primary hover:text-primary-dark font-normal transition-colors cursor-pointer disabled:cursor-not-allowed select-none"
          disabled={isLoading}
        >
          {success ? '← Back to Sign In' : 'Back to Sign In'}
        </button>
      </div>
    </form>
  );
};