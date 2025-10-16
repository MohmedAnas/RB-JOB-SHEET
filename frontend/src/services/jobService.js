import axios from 'axios';

// 1. Define the base URL from the environment variable.
//    VITE_API_URL should ONLY contain the host (e.g., https://rb-job-sheet.onrender.com)
//    If running locally, it falls back to the local host/port.
const API_HOST_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 2. Define the full base URL by explicitly adding the /api prefix.
//    This ensures all calls go to the correct backend endpoint.
const API_BASE_URL = `${API_HOST_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const jobService = {
  // All methods (like getAllJobs, login) now correctly use the API_BASE_URL:
  // API_BASE_URL + '/jobs' -> https://rb-job-sheet.onrender.com/api/jobs
  // API_BASE_URL + '/auth/login' -> https://rb-job-sheet.onrender.com/api/auth/login

  // Get all jobs
  getAllJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },

  // Get job by ID
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Search jobs by mobile number or job ID
  searchJobs: async (query) => {
    const response = await api.get(`/jobs/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Create new job
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update job
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete job
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Update job status
  updateJobStatus: async (id, status) => {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  // Get dashboard analytics
  getDashboardStats: async () => {
    const response = await api.get('/jobs/analytics');
    return response.data;
  },

  // Admin login with email and password
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password }, {
        timeout: 90000 // 90 seconds timeout for server startup
      });
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Server is taking longer than expected to respond. Please try again.');
      }
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },

  // Admin logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get current user data
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },
};

export default jobService;
