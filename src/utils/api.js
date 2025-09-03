import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      console.error('Access forbidden')
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data)
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  sendOTP: (email) => api.post('/auth/request-otp', { email }), // FIXED
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }), // ✅ matches backend
  // logout & refreshToken only if you add them later in Spring Boot
}

export const sessionsAPI = {
  getAllSessions: (params) => api.get('/sessions', { params }),
  getSessionById: (id) => api.get(`/sessions/${id}`),
  createSession: (sessionData) => api.post('/sessions', sessionData),
  updateSession: (id, sessionData) => api.put(`/sessions/${id}`, sessionData),
  deleteSession: (id) => api.delete(`/sessions/${id}`),
  bookSession: (sessionId) => api.post(`/sessions/${sessionId}/book`),
  cancelBooking: (sessionId) => api.delete(`/sessions/${sessionId}/book`),
  getSessionAttendees: (sessionId) => api.get(`/sessions/${sessionId}/attendees`),
}

export const usersAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (userData) => api.put('/users/me', userData),
  getUserSessions: () => api.get('/users/me/sessions'),
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
}

export const paymentsAPI = {
  createPaymentIntent: (sessionId) => api.post('/payments/create-intent', { sessionId }),
  confirmPayment: (paymentIntentId) => api.post('/payments/confirm', { paymentIntentId }),
  getPaymentHistory: () => api.get('/payments/history'),
  getPaymentById: (id) => api.get(`/payments/${id}`),
  refundPayment: (paymentId) => api.post(`/payments/${paymentId}/refund`),
}

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/stats'),
  getAllPayments: (params) => api.get('/admin/payments', { params }),
  getUserAnalytics: () => api.get('/admin/analytics/users'),
  getSessionAnalytics: () => api.get('/admin/analytics/sessions'),
  getRevenueAnalytics: () => api.get('/admin/analytics/revenue'),
}

export default api
