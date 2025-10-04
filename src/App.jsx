import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import DonationPage from './pages/DonationPage'
import DonateNowPage from './pages/DonateNowPage'
import ReviewsPage from './pages/ReviewsPage'
import SessionsPage from './pages/SessionsPage'
import SessionDetailPage from './pages/SessionDetailPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'

// Components
import { Toaster } from './components/ui/Toaster'

// Context (to be implemented)
// import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <Router>
      <div className="App">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LandingPage />
                </motion.div>
              } 
            />

            <Route 
              path="/donate" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DonateNowPage />
                </motion.div>
              } 
            />
            
            <Route 
              path="/login" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginPage />
                </motion.div>
              } 
            />
            
            <Route 
              path="/register" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <RegisterPage />
                </motion.div>
              } 
            />

            <Route 
              path="/about" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AboutPage />
                </motion.div>
              } 
            />

            <Route 
              path="/contact" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ContactPage />
                </motion.div>
              } 
            />

            <Route 
              path="/donation" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DonationPage />
                </motion.div>
              } 
            />

            <Route 
              path="/reviews" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReviewsPage />
                </motion.div>
              } 
            />

            <Route 
              path="/sessions" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SessionsPage />
                </motion.div>
              } 
            />

            <Route 
              path="/sessions/:id" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SessionDetailPage />
                </motion.div>
              } 
            />

            <Route 
              path="/admin/login" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminLoginPage />
                </motion.div>
              } 
            />

            <Route 
              path="/admin/dashboard" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminDashboard />
                </motion.div>
              } 
            />

            {/* Protected Routes - User Dashboard */}
            {/* <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/sessions" 
              element={
                <ProtectedRoute>
                  <SessionsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/sessions/:id" 
              element={
                <ProtectedRoute>
                  <SessionDetailPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            /> */}

            {/* Protected Routes - Admin Dashboard */}
            {/* <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            
            <Route 
              path="/admin/sessions" 
              element={
                <AdminRoute>
                  <AdminSessions />
                </AdminRoute>
              } 
            />
            
            <Route 
              path="/admin/users" 
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } 
            />
            
            <Route 
              path="/admin/payments" 
              element={
                <AdminRoute>
                  <AdminPayments />
                </AdminRoute>
              } 
            /> */}

            {/* Catch-all route */}
            <Route 
              path="*" 
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-6xl gradient-text font-bold mb-4"
                    >
                      404
                    </motion.div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                      Page Not Found
                    </h1>
                    <p className="text-gray-600 mb-8">
                      The page you're looking for doesn't exist or has been moved.
                    </p>
                    <motion.a
                      href="/"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary inline-block"
                    >
                      Back to Home
                    </motion.a>
                  </div>
                </motion.div>
              } 
            />
          </Routes>
        </AnimatePresence>

        {/* Global toast notifications */}
        <Toaster />
      </div>
    </Router>
  )
}

// Protected route component for authenticated users
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken') // Simple auth check
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Admin route component for admin users
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken')
  const userRole = localStorage.getItem('userRole') // You'd get this from your auth context
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

export default App
