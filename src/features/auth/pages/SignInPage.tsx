import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { SignInForm } from '../components/SignInForm';
import type { SignInFormData } from '../types';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log('Sign in data:', data);
    
    // TODO: Implement actual authentication logic
    setIsLoading(false);
    // navigate('/dashboard');
    
    alert('Sign in successful! (Mock)');
  };

  const handleSignUpClick = () => {
    // navigate('/signup');
    alert('Navigate to Sign Up page');
  };

  const handleForgotPasswordClick = () => {
    // navigate('/forgot-password');
    alert('Navigate to Forgot Password page');
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[510px]">
        {/* Card - exact styling from design */}
        <div className="bg-card border border-gray-100 rounded-[32px] shadow px-12 py-12">
          {/* Logo */}
          <Logo />

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-[35px] text-gray-800 font-medium mb-2 tracking-normal leading-tight">
              Welcome to Docvia
            </h1>
            <p className="text-[15px] text-text-secondary font-normal">
              Enter you details to continue
            </p>
          </div>

          {/* Form */}
          <SignInForm
            onSubmit={handleSignIn}
            onSignUpClick={handleSignUpClick}
            onForgotPasswordClick={handleForgotPasswordClick}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};