import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { SignUpForm } from '../components/SignUpForm';
import type { SignUpFormData } from '../types';
import { motion } from 'framer-motion';
import { useAuth } from '../../../shared/contexts/AuthContext';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await register(data.email, data.password);
      // Navigation will be handled by auth state change
      navigate('/dashboard'); // Or wherever your main app is
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-up failed. Please try again.');
    }
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeIn' }}
      className="min-h-screen w-full bg-background flex items-center justify-center p-4"
    >
      <div className="w-full max-w-lg">
        <div className="bg-card border border-gray-100 rounded-3xl shadow-lg px-12 py-12 select-none">
          {/* Logo */}
          <Logo />

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-[35px] text-gray-800 font-medium text-shadow-md mb-2 tracking-normal leading-tight select-none">
              Create Your Account
            </h1>
            <p className="text-[15px] text-text-secondary font-normal select-none">
              Join Docvia and start your journey.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <SignUpForm
            onSubmit={handleSignUp}
            onSignInClick={handleSignInClick}
            onGoogleSignUp={handleGoogleSignUp}
            isLoading={isLoading}
          />
        </div>
      </div>
    </motion.div>
  );
};