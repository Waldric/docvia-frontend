import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import type { ForgotPasswordFormData } from '../types';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log('Forgot password data:', data);
    
    // TODO: Implement actual password reset logic
    setIsLoading(false);
    
    alert('Password reset link sent to your email! (Mock)');
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Card - exact styling from design */}
        <div className="bg-card border rounded-2xl border-gray-100 shadow-md px-12 py-12">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-[34px] text-gray-800 font-medium mb-2 tracking-normal leading-tight text-shadow-md">
              Reset your password
            </h1>
            <p className="text-[15px] text-text-secondary font-normal">
              We'll help you get back into your account
            </p>
          </div>

          {/* Form */}
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            onSignInClick={handleSignInClick}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
