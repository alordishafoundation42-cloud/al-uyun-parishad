import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Firebase ID token if available (for admin requests)
api.interceptors.request.use(
  async (config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for consistent Bengali error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'একটি অপ্রত্যাশিত সমস্যা দেখা দিয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
    return Promise.reject(new Error(message));
  }
);

export default api;
