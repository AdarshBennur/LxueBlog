import axios from 'axios';

// RUTHLESS PRODUCTION-FIRST API URL CONFIGURATION
// This configuration GUARANTEES no localhost references in production builds
const getApiUrl = () => {
  // ALWAYS check for production environment variable FIRST
  const envUrl = import.meta.env.PUBLIC_API_URL;
  
  // Log configuration for debugging
  console.log('🔧 API Configuration Debug:', {
    envUrl,
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE,
    prod: import.meta.env.PROD
  });
  
  // PRODUCTION: Environment variable must be set
  if (envUrl && envUrl.trim()) {
    console.log('✅ Using production API URL:', envUrl);
    return envUrl.trim();
  }
  
  // DEVELOPMENT: Only allow localhost if explicitly in dev mode
  if (import.meta.env.DEV === true) {
    const devUrl = 'http://localhost:10000/api';
    console.log('🛠️ Using development API URL:', devUrl);
    return devUrl;
  }
  
  // FAIL FAST: No localhost allowed in production builds
  console.error('❌ FATAL: No API URL configured for production');
  console.error('❌ PUBLIC_API_URL environment variable is missing');
  console.error('❌ Current environment:', {
    envUrl,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    MODE: import.meta.env.MODE
  });
  
  // Throw detailed error to prevent silent failures
  throw new Error(
    `PRODUCTION BUILD ERROR: PUBLIC_API_URL environment variable is required. ` +
    `Current value: "${envUrl}". This prevents localhost fallbacks in production.`
  );
};

// Initialize API URL with error handling
let API_URL: string;
try {
  API_URL = getApiUrl();
  console.log('🔧 API Module Initialized:', { API_URL });
} catch (error) {
  console.error('❌ FATAL: API Module Initialization Failed:', error);
  throw error;
}

// Helper function to get the base API URL without the /api suffix
export const getApiBaseUrl = () => {
  const url = getApiUrl();
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

// Diagnostic function to help debug API configuration issues
export const debugApiConfiguration = () => {
  const config = {
    API_URL,
    baseApiUrl: getApiBaseUrl(),
    environment: {
      PUBLIC_API_URL: import.meta.env.PUBLIC_API_URL,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD,
      MODE: import.meta.env.MODE,
    },
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server-side',
    location: typeof window !== 'undefined' ? window.location.href : 'Server-side'
  };
  
  console.group('🔍 API Configuration Debug Report');
  console.log('Configuration:', config);
  console.groupEnd();
  
  return config;
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout for all requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available + LOCALHOST PREVENTION
api.interceptors.request.use(
  (config) => {
    // CRITICAL: Detect and prevent localhost requests in production
    const requestUrl = config.baseURL || '';
    const fullUrl = `${requestUrl}${config.url || ''}`;
    
    console.log('🌐 Making API Request:', {
      method: config.method?.toUpperCase(),
      baseURL: config.baseURL,
      url: config.url,
      fullUrl,
      headers: config.headers
    });
    
    // FAIL FAST: Block localhost requests in production
    if (fullUrl.includes('localhost') && import.meta.env.PROD) {
      const error = new Error(
        `BLOCKED: Localhost API request detected in production! URL: ${fullUrl}. ` +
        `This indicates a configuration error. Expected: https://lxueblog.onrender.com/api`
      );
      console.error('🚫 PRODUCTION LOCALHOST BLOCK:', error);
      throw error;
    }
    
    // Warn about localhost in development
    if (fullUrl.includes('localhost')) {
      console.warn('⚠️ Development mode: Using localhost API:', fullUrl);
    }
    
    // Add auth token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('🚫 Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Improve error handling for better debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information to console
    if (error.response) {
      // Server responded with non-2xx status
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        endpoint: error.config.url,
        method: error.config.method
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('API No Response:', {
        request: error.request,
        endpoint: error.config.url,
        method: error.config.method
      });
    } else {
      // Error in setting up request
      console.error('API Request Error:', error.message);
    }
    
    // Enhance error object with more context
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

// Posts API
export const postsAPI = {
  getPosts: (params?: any) => api.get('/posts', { params }),
  getPost: (id: string) => api.get(`/posts/${id}`),
  getPostBySlug: (slug: string) => api.get(`/posts/slug/${slug}`),
  getUserPosts: (userId: string) => api.get(`/posts/user/${userId}`),
  createPost: (postData: any) => api.post('/posts', postData),
  updatePost: (id: string, postData: any) => api.put(`/posts/${id}`, postData),
  deletePost: (id: string) => api.delete(`/posts/${id}`)
};

// Comments API
export const commentsAPI = {
  getCommentsByPost: (postId: string) => api.get(`/comments/post/${postId}`),
  addComment: (commentData: any) => api.post('/comments', commentData),
  updateComment: (id: string, content: string) => api.put(`/comments/${id}`, { content }),
  deleteComment: (id: string) => api.delete(`/comments/${id}`),
  approveComment: (id: string) => api.put(`/comments/${id}/approve`)
};

// Categories API
export const categoriesAPI = {
  getCategories: () => api.get('/categories'),
  getCategory: (id: string) => api.get(`/categories/${id}`),
  getCategoryBySlug: (slug: string) => api.get(`/categories/slug/${slug}`),
  createCategory: (categoryData: any) => api.post('/categories', categoryData),
  updateCategory: (id: string, categoryData: any) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`)
};

// Tags API
export const tagsAPI = {
  getTags: () => api.get('/tags'),
  getTag: (id: string) => api.get(`/tags/${id}`),
  getTagBySlug: (slug: string) => api.get(`/tags/slug/${slug}`),
  createTag: (tagData: any) => api.post('/tags', tagData),
  updateTag: (id: string, tagData: any) => api.put(`/tags/${id}`, tagData),
  deleteTag: (id: string) => api.delete(`/tags/${id}`)
};

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id: string) => api.get(`/users/${id}`),
  createUser: (userData: any) => api.post('/users', userData),
  updateUser: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  updateProfile: (userData: any) => api.put('/users/profile', userData)
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (data: any) => api.post('/newsletter/subscribe', data),
  unsubscribe: (email: string) => api.put('/newsletter/unsubscribe', { email }),
  getSubscribers: () => api.get('/newsletter')
};

// Upload API
export const uploadAPI = {
  uploadImage: (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default {
  auth: authAPI,
  posts: postsAPI,
  comments: commentsAPI,
  categories: categoriesAPI,
  tags: tagsAPI,
  users: usersAPI,
  newsletter: newsletterAPI,
  upload: uploadAPI
};
