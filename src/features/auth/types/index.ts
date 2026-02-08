export interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}