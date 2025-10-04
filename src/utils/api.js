import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  // Ensure no trailing slash to avoid double slashes when joining paths
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8081/api').replace(/\/$/, ''),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Derive the API origin (strip trailing "/api" when present) for building absolute asset URLs
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8081/api').replace(/\/$/, '')
const API_ORIGIN = API_BASE.replace(/\/?api$/i, '')

// Safely convert possibly-relative backend paths (e.g. "uploads/img.jpg" or "/files/..")
// into absolute URLs rooted at the backend origin. If already absolute, return as-is.
export const toAbsoluteUrl = (path) => {
  if (!path) return ''
  if (typeof path !== 'string') return ''
  if (/^https?:\/\//i.test(path)) return path
  const rel = path.replace(/^\//, '')
  const origin = API_ORIGIN || ''
  return `${origin}/${rel}`
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const urlPath = (config.url || '')
      .replace(/^https?:\/\/[^/]+/i, '') // strip absolute base if present
      .replace(/^\//, '')

    // Do NOT attach Authorization for public auth endpoints
    const isPublicAuthEndpoint = urlPath.startsWith('auth/request-otp') ||
      urlPath.startsWith('auth/verify-otp') ||
      urlPath.startsWith('auth/login') ||
      urlPath.startsWith('auth/register')

    const token = localStorage.getItem('authToken')
    if (token && !isPublicAuthEndpoint) {
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
      localStorage.removeItem('userRole')
      localStorage.removeItem('adminToken')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions')
      // Show user-friendly error message
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('Access denied. You do not have permission to perform this action.')
      }
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data)
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('auth/login', credentials),
  register: (userData) => api.post('auth/register', userData),
  sendOTP: (email) => api.post('auth/request-otp', { email }),
  verifyOTP: (email, otp) => api.post('auth/verify-otp', { email, otp }),
  // logout & refreshToken only if you add them later in Spring Boot
}

export const sessionsAPI = {
  getAllSessions: (params) => api.get('sessions', { params }),
  getAllSessionsAdmin: (params) => api.get('sessions/admin', { params }),
  getSessionById: (id) => api.get(`sessions/${id}`),
  createSession: (sessionData) => api.post('sessions/admin/create', sessionData, {
    headers: { 'Content-Type': sessionData instanceof FormData ? 'multipart/form-data' : 'application/json' }
  }),
  updateSession: (id, sessionData) => api.put(`sessions/admin/${id}`, sessionData, {
    headers: { 'Content-Type': sessionData instanceof FormData ? 'multipart/form-data' : 'application/json' }
  }),
  deleteSession: (id) => api.delete(`sessions/admin/${id}`),
  bookSession: (sessionId) => api.post(`sessions/${sessionId}/book`),
  cancelBooking: (sessionId) => api.delete(`sessions/${sessionId}/book`),
  getSessionAttendees: (sessionId) => api.get(`sessions/${sessionId}/attendees`),
  // getSessionRegistrants: (sessionId) => api.get(`sessions/admin/${sessionId}/registrants`), // TODO: Implement in backend
}

export const usersAPI = {
  getCurrentUser: () => api.get('users/me'),
  updateProfile: (userData) => api.put('users/me', userData),
  getUserSessions: () => api.get('users/me/sessions'),
  getAllUsers: (params) => api.get('users', { params }),
  getUserById: (id) => api.get(`users/${id}`),
  updateUser: (id, userData) => api.put(`users/${id}`, userData),
  deleteUser: (id) => api.delete(`users/${id}`),
}

export const paymentsAPI = {
  createPaymentIntent: (sessionId) => api.post('payments/create-intent', { sessionId }),
  confirmPayment: (paymentIntentId) => api.post('payments/confirm', { paymentIntentId }),
  getPaymentHistory: () => api.get('payments/history'),
  getPaymentById: (id) => api.get(`payments/${id}`),
  refundPayment: (paymentId) => api.post(`payments/${paymentId}/refund`),
}

// Donations API (Razorpay-backed similar to sessions booking)
export const donationsAPI = {
  // Backend base @RequestMapping("/api/donations")
  // Create Razorpay order and persist pending Donation
  createOrder: (payload) => api.post('donations/create-order', payload),
  // Verify payment signature and mark donation as COMPLETED
  verifyPayment: ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) =>
    api.post('donations/verify-payment', { razorpay_order_id, razorpay_payment_id, razorpay_signature }),
}

export const adminAPI = {
  getDashboardStats: () => api.get('admin/stats'),
  getAllPayments: (params) => api.get('admin/payments', { params }),
  getUserAnalytics: () => api.get('admin/analytics/users'),
  getSessionAnalytics: () => api.get('admin/analytics/sessions'),
  getRevenueAnalytics: () => api.get('admin/analytics/revenue'),
}

// Booking APIs (free and paid with Razorpay)
export const bookFreeSession = (sessionId) => api.post(`book/free/${sessionId}`)
export const initiatePaidSessionBooking = (sessionId) => api.post(`book/paid/${sessionId}`)
export const confirmPaidSessionBooking = (paymentId, sessionId) =>
  api.post('book/paid/confirm', null, { params: { paymentId, sessionId } })

export default api
