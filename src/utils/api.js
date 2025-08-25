import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
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
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden')
    } else if (error.response?.status >= 500) {
      // Server errors
      console.error('Server error:', error.response.data)
    }
    
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  sendOTP: (email) => api.post('/auth/send-otp', { email }),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
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

// Mock API responses (for development)
const mockDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

export const mockAPI = {
  // Auth mock responses
  login: async (credentials) => {
    await mockDelay()
    if (credentials.email === 'admin@divinespark.com') {
      return {
        data: {
          user: { id: 3, email: 'admin@divinespark.com', role: 'admin', firstName: 'Admin', lastName: 'User' },
          token: 'mock_admin_token'
        }
      }
    } else if (credentials.email === 'user@example.com') {
      return {
        data: {
          user: { id: 1, email: 'user@example.com', role: 'user', firstName: 'John', lastName: 'Doe' },
          token: 'mock_user_token'
        }
      }
    } else {
      throw new Error('Invalid credentials')
    }
  },

  sendOTP: async (email) => {
    await mockDelay()
    return { data: { success: true, message: 'OTP sent successfully' } }
  },

  verifyOTP: async (email, otp) => {
    await mockDelay()
    if (otp === '123456') {
      return { data: { success: true, verified: true } }
    } else {
      throw new Error('Invalid OTP')
    }
  },

  register: async (userData) => {
    await mockDelay()
    return {
      data: {
        user: { id: Date.now(), ...userData, role: 'user' },
        token: 'mock_new_user_token'
      }
    }
  },

  // Sessions mock responses
  getAllSessions: async (params) => {
    await mockDelay(500)
    const { mockSessions } = await import('../data/mockData')
    
    let filteredSessions = [...mockSessions]
    
    // Apply filters
    if (params?.category) {
      filteredSessions = filteredSessions.filter(s => s.category === params.category)
    }
    if (params?.isPaid !== undefined) {
      filteredSessions = filteredSessions.filter(s => s.isPaid === params.isPaid)
    }
    if (params?.isUpcoming !== undefined) {
      filteredSessions = filteredSessions.filter(s => s.isUpcoming === params.isUpcoming)
    }
    
    return { data: filteredSessions }
  },

  bookSession: async (sessionId) => {
    await mockDelay()
    return { data: { success: true, message: 'Session booked successfully' } }
  },

  // Users mock responses
  getCurrentUser: async () => {
    await mockDelay()
    const token = localStorage.getItem('authToken')
    if (token === 'mock_admin_token') {
      return { data: { id: 3, email: 'admin@divinespark.com', role: 'admin', firstName: 'Admin', lastName: 'User' } }
    } else {
      return { data: { id: 1, email: 'user@example.com', role: 'user', firstName: 'John', lastName: 'Doe' } }
    }
  },

  getUserSessions: async () => {
    await mockDelay()
    const { getUserSessions } = await import('../data/mockData')
    return { data: getUserSessions(1) }
  },

  // Admin mock responses
  getDashboardStats: async () => {
    await mockDelay()
    const { mockStats } = await import('../data/mockData')
    return { data: mockStats }
  },

  getAllUsers: async () => {
    await mockDelay()
    const { mockUsers } = await import('../data/mockData')
    return { data: mockUsers }
  },
}

export default api
