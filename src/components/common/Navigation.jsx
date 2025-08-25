import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Menu, X, User, Calendar, Settings, LogOut } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

const Navigation = ({ isAuthenticated = false, userType = 'user' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="gradient-text text-2xl font-bold hover:opacity-80 transition-opacity">
              DivineSpark
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <a href="#features" className="nav-link">Features</a>
                <a href="#about" className="nav-link">About</a>
                <a href="#contact" className="nav-link">Contact</a>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/sessions" className="nav-link">Sessions</Link>
                {userType === 'admin' && (
                  <Link to="/admin" className="nav-link">Admin</Link>
                )}
                
                {/* User Menu */}
                <div className="relative group">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 glass-card rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      <Link to="/profile" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 rounded-xl">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                      <Link to="/settings" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 rounded-xl">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                      <button className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20 mt-2 pt-4 pb-4"
          >
            <div className="flex flex-col space-y-3">
              {!isAuthenticated ? (
                <>
                  <a href="#features" className="nav-link">Features</a>
                  <a href="#about" className="nav-link">About</a>
                  <a href="#contact" className="nav-link">Contact</a>
                  <div className="flex space-x-3 pt-3">
                    <Link to="/login" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">Login</Button>
                    </Link>
                    <Link to="/register" className="flex-1">
                      <Button size="sm" className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/sessions" className="nav-link">Sessions</Link>
                  {userType === 'admin' && (
                    <Link to="/admin" className="nav-link">Admin</Link>
                  )}
                  <Link to="/profile" className="nav-link">Profile</Link>
                  <Link to="/settings" className="nav-link">Settings</Link>
                  <button className="nav-link text-left text-red-600">Logout</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
