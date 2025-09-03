import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  exp: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

// Get user from token
const getUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<any>(token);
    return {
      id: decoded.id,
      name: decoded.name || '',
      email: decoded.email || '',
      role: decoded.role || 'user'
    };
  } catch (error) {
    return null;
  }
};

// Get current auth state
export const getAuthState = (): AuthState => {
  const token = localStorage.getItem('token');
  
  if (!token || isTokenExpired(token)) {
    return {
      isAuthenticated: false,
      user: null,
      token: null
    };
  }
  
  return {
    isAuthenticated: true,
    user: getUserFromToken(token),
    token
  };
};

// Set authentication token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Remove authentication token
export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
};

// Check if user has a specific role
export const hasRole = (role: string | string[]): boolean => {
  const { user } = getAuthState();
  
  if (!user) return false;
  
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  
  return user.role === role;
};
