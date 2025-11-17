import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const productAPI = {
  getAll: () => api.get('/products'),
  create: (productData) => api.post('/products', productData),
  getMyProducts: () => api.get('/products/my-products'),
};

//Add order API
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/y-orders'),
  getFarmerOrders: () => api.get('/orders/farmer-orders'),
  updateStatus: (orderId, status) =>api.put('/orders/${orderId}/status',{
    status}),
  };

  // Add these API endpoints
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (notificationId) => api.delete(`/notifications/${notificationId}`)
};

export const analyticsAPI = {
  getFarmerAnalytics: () => api.get('/analytics/farmer'),
  getPlatformAnalytics: () => api.get('/analytics/platform')
};

export default api;