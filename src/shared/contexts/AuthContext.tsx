import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created_at: string;
  last_sign_in: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const initAuth = async () => {
      try {
        // Check for OAuth callback
        const oauthResult = await authService.handleOAuthCallback();
        if (oauthResult?.success && oauthResult.data?.user) {
          setUser(oauthResult.data.user);
          setIsLoading(false);
          return;
        }

        // Check for stored token
        if (authService.isAuthenticated()) {
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // Fetch user profile if token exists but user data doesn't
            try {
              const response = await authService.getProfile();
              if (response.success && response.data?.user) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
              }
            } catch (error) {
              // Token might be invalid, clear it
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.success && response.data?.user) {
      setUser(response.data.user);
    } else {
      throw new Error(response.error || 'Login failed');
    }
  };

  const register = async (email: string, password: string) => {
    const response = await authService.register({ email, password });
    if (response.success && response.data?.user) {
      setUser(response.data.user);
    } else {
      throw new Error(response.error || 'Registration failed');
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const loginWithGoogle = async () => {
    const response = await authService.getGoogleAuthUrl();
    if (response.success && response.data?.url) {
      window.location.href = response.data.url;
    } else {
      throw new Error(response.error || 'Failed to initiate Google sign-in');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};