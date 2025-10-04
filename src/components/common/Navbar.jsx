import React, { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import logoImg from '../../assets/DivineSpark-Logo.jpg'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/sessions', label: 'Sessions' },
  { href: '/donation', label: 'Donation' },
  { href: '/reviews', label: 'Review' },
  { href: '/contact', label: 'Contact' }
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'))
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > 8)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Re-evaluate auth state on route changes and storage changes
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('authToken'))
    setUserRole(localStorage.getItem('userRole') || null)
  }, [location.pathname])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'authToken' || e.key === 'userRole') {
        setIsAuthenticated(!!localStorage.getItem('authToken'))
        setUserRole(localStorage.getItem('userRole') || null)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')
      localStorage.removeItem('adminToken')
      setIsAuthenticated(false)
      setUserRole(null)
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      isSticky 
        ? 'backdrop-blur-xl bg-white/90 border-b border-gray-200/50 shadow-xl shadow-gray-900/10' 
        : 'bg-white/80 backdrop-blur-lg border-b border-gray-100/50 shadow-lg'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center group transition-transform duration-200 hover:scale-105"
          >
            <div className="relative">
              <img 
                src={logoImg} 
                alt="DivineSpark Logo" 
                className="h-12 w-12 rounded-2xl object-cover shadow-lg ring-2 ring-white/50 group-hover:ring-purple-200/50 transition-all duration-200" 
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/10 to-blue-400/10 group-hover:from-purple-400/20 group-hover:to-blue-400/20 transition-all duration-200"></div>
            </div>
            <div className="ml-4">
              <span className="font-bold text-2xl text-gray-900 group-hover:text-purple-700 transition-all duration-200">
                DivineSpark
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-5 py-3 text-lg font-bold transition-all duration-200 group ${
                    isActive 
                      ? 'text-purple-800 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl shadow-md' 
                      : 'text-gray-800 hover:text-purple-700'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {/* Animated underline */}
                  <div className={`absolute bottom-1 left-1 right-1 h-1 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'
                  }`}></div>
                  {/* Hover background */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 transition-all duration-200 ${
                    isActive 
                      ? 'opacity-100' 
                      : 'opacity-0 group-hover:opacity-100'
                  }`}></div>
                </Link>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAuthenticated ? (
              <Link to="/login">
                <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                  Login
                </button>
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                {userRole === 'admin' && (
                  <Link to="/admin/dashboard">
                    <button className="px-8 py-3 font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400/50" style={{backgroundColor: '#D4AF37', color: '#FFFFFF', border: '2px solid #B8941F'}}>
                      Dashboard
                    </button>
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="px-8 py-3 font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400/50" style={{backgroundColor: '#555555', color: '#FFFFFF', border: '2px solid #333333'}}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle menu"
            className="md:hidden inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
            onClick={() => setIsOpen(prev => !prev)}
          >
            <div className="relative">
              <Menu className={`h-6 w-6 text-gray-700 transition-all duration-200 ${
                isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
              }`} />
              <X className={`absolute inset-0 h-6 w-6 text-gray-700 transition-all duration-200 ${
                isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
              }`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Slide-out Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white backdrop-blur-xl border-l border-gray-200 shadow-2xl z-50"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                  <div className="flex items-center">
                    <img 
                      src={logoImg} 
                      alt="DivineSpark Logo" 
                      className="h-10 w-10 rounded-xl object-cover shadow-md" 
                    />
                    <span className="ml-3 font-bold text-xl text-gray-900">
                      DivineSpark
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl bg-gray-100/50 hover:bg-gray-200/50 transition-colors duration-200"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 px-6 py-8 space-y-2">
                  {navLinks.map((link, index) => {
                    const isActive = location.pathname === link.href
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <Link
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`block px-5 py-4 rounded-2xl text-xl font-bold transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-purple-200 to-blue-200 text-purple-900 shadow-lg border-2 border-purple-300'
                              : 'text-gray-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t border-gray-200/50 space-y-3">
                  {!isAuthenticated ? (
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-800 transform hover:scale-[1.02] transition-all duration-200">
                        Login
                      </button>
                    </Link>
                  ) : (
                    <div className="space-y-3">
                      {userRole === 'admin' && (
                        <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                          <button className="w-full px-8 py-4 font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400/50" style={{backgroundColor: '#D4AF37', color: '#FFFFFF', border: '2px solid #B8941F'}}>
                            Dashboard
                          </button>
                        </Link>
                      )}
                      <button 
                        onClick={() => { setIsOpen(false); handleLogout() }} 
                        className="w-full px-8 py-4 font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400/50" style={{backgroundColor: '#555555', color: '#FFFFFF', border: '2px solid #333333'}}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navbar


