import { apiClient, API_ENDPOINTS } from '../config/api.config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      id: string;
      email: string;
      name?: string;
      avatar?: string;
      created_at: string;
      last_sign_in: string;
    };
    token: string;
  };
  error?: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  data?: {
    url: string;
  };
  error?: string;
}

export const authService = {
  // Login with email and password
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Register new user
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiClient(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Get user profile
  getProfile: async (): Promise<AuthResponse> => {
    return await apiClient(API_ENDPOINTS.AUTH.PROFILE);
  },

  // Forgot password - send reset email
  forgotPassword: async (data: ForgotPasswordData): Promise<AuthResponse> => {
    return await apiClient(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Reset password with token
  resetPassword: async (data: ResetPasswordData): Promise<AuthResponse> => {
    return await apiClient(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Google Sign-In - Get OAuth URL
  getGoogleAuthUrl: async (): Promise<GoogleAuthResponse> => {
    return await apiClient(API_ENDPOINTS.AUTH.GOOGLE);
  },

  // Verify Google OAuth token
  verifyGoogleToken: async (accessToken: string): Promise<AuthResponse> => {
    const response = await apiClient(API_ENDPOINTS.AUTH.GOOGLE_VERIFY, {
      method: 'POST',
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  // Get stored user
  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Handle OAuth callback
  handleOAuthCallback: async (): Promise<AuthResponse | null> => {
    // Check for hash parameters (Supabase uses hash)
    const hash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(hash);
    const accessToken = hashParams.get('access_token');

    if (accessToken) {
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Verify the token
      return await authService.verifyGoogleToken(accessToken);
    }

    return null;
  },
};