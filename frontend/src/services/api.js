import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/login/', credentials),
  refresh: (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken }),
  getMe: () => api.get('/auth/me/'),
  updateMe: (data, isFormData = false) => {
    // If it's FormData, don't set Content-Type header (browser will set it with boundary)
    if (isFormData) {
      return api.patch('/auth/me/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    }
    return api.patch('/auth/me/', data);
  },
  updateMeFull: (data) => api.put('/auth/me/', data),
};

// Listings API
export const listingsAPI = {
  getAll: (params) => api.get('/listings/', { params }),
  getOne: (id) => api.get(`/listings/${id}/`),
  create: (data) => api.post('/listings/', data),
  update: (id, data) => api.patch(`/listings/${id}/`, data),
  delete: (id) => api.delete(`/listings/${id}/`),
  getMatch:(id) => api.get(`/matches/${id}/`),
  getMatches: (params) => api.get('/matches/', { params }),
  getMyListings: () => api.get('/auth/my-listings/'),
};

export const matchesAPI = {
  getMyMatches: () => api.get('/matches/'),
  getMatchDetail: (id) => api.get(`/matches/${id}/`),
};

// Chat API
export const chatAPI = {
  getRooms: () => api.get('/chat/rooms/'),
  getRoom: (roomId) => api.get(`/chat/rooms/${roomId}/`),
  createRoom: (data) => api.post('/chat/rooms/', data),
  getMessages: (roomId, page = 1, pageSize = 50) => 
    api.get(`/chat/rooms/${roomId}/messages/?page=${page}&page_size=${pageSize}`),
  sendMessage: (roomId, content) => 
    api.post(`/chat/rooms/${roomId}/messages/`, { content }),
};

export const moderationAPI = {
  reportContent: (id, data) => api.post(`/listings/${id}/report/`, data),
  blockUser: (userId) => api.post(`/auth/block/`, {   blocked: userId  }),
  unblockUser: (userId) => api.delete(`/auth/unblock/${userId}/`, {user_id: userId  }),
  getBlockedUsers: () => api.get('/auth/blocked/'),
};
export default api;