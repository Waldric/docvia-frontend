const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  endpoints: {
    auth: `${API_BASE_URL}/api/auth`,
    pdf: `${API_BASE_URL}/api/pdf`,
  },
  getHeaders: (token?: string): Record<string, string> => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }),
};