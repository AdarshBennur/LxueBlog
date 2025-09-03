import axios from 'axios';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout for all requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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

export default {
  auth: authAPI,
  posts: postsAPI,
  comments: commentsAPI,
  categories: categoriesAPI,
  tags: tagsAPI,
  users: usersAPI,
  newsletter: newsletterAPI
};
