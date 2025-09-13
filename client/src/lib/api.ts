// /client/lib/api.ts
import axios from 'axios';

// PRODUCTION-SAFE: Always use env for production, localhost only in development
const getApiUrl = (): string => {
  const envUrl = import.meta.env.PUBLIC_API_URL;
  
  if (envUrl && envUrl.trim()) return envUrl.trim();
  if (import.meta.env.DEV) return 'http://localhost:10000/api';

  // Fail in prod if env missing—never fallback to localhost
  throw new Error(
    `PRODUCTION BUILD ERROR: PUBLIC_API_URL env var is required but is missing or blank (got: "${envUrl}"). No fallbacks (like localhost) are allowed in production.`
  );
};

const API_URL = getApiUrl();

// Diagnostic/logging tool
export const debugApiConfiguration = () => {
  console.group('🔍 API Configuration Debug');
  console.log('API_URL:', API_URL);
  console.log('PUBLIC_API_URL:', import.meta.env.PUBLIC_API_URL);
  console.log('NODE_ENV:', import.meta.env.MODE);
  console.groupEnd();
  return API_URL;
};

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Auth token + FAIL for localhost in prod
api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
    if (fullUrl.includes('localhost') && import.meta.env.PROD) {
      throw new Error(`BLOCKED: Localhost API request detected in production! fullUrl: ${fullUrl}`);
    }
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Error interceptor (slightly simplified for clarity)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.friendlyMessage =
      error.response?.data?.message ||
      'Unable to connect to the server. Please try again later.';
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};
// Posts, Comments, Categories, Tags, Users, Newsletter, Upload API—(use as you already have)
// ... (keep your other APIs as in your posted code) ...
export default {
  auth: authAPI,
  /* ...your other APIs... */
};
