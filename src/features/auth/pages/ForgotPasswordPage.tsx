import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import type { ForgotPasswordFormData } from '../types';
import { motion } from 'framer-motion';
import { authService } from '../../../shared/services/auth.service';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await authService.forgotPassword({ email: data.email });
      
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.error || 'Failed to send reset email. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
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
              Reset Your Password
            </h1>
            <p className="text-[15px] text-text-secondary font-normal select-none">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              <p className="font-semibold mb-2">✅ Email sent successfully!</p>
              <p className="mb-2">Check your inbox (and spam folder) for a password reset link.</p>
              <p className="text-xs">The link will expire in 1 hour for security.</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Info Box */}
          {!success && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <p className="font-semibold mb-1">🔐 How it works</p>
              <p className="text-xs">We'll send you an email with a secure link to reset your password.</p>
            </div>
          )}

          {/* Form */}
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            onBackToSignIn={handleBackToSignIn}
            isLoading={isLoading}
            success={success}
          />
        </div>
      </div>
    </motion.div>
  );
};