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
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setUserRole(null)
    navigate('/login', { replace: true })
  }

  return (
    <div className={`fixed top-0 inset-x-0 z-50 transition-colors ${
      isSticky ? 'backdrop-blur bg-white/80 border-b border-gray-200' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logoImg} alt="DivineSpark Logo" className="h-12 max-h-12 w-auto rounded-xl object-cover mr-3" />
            <span className="font-semibold text-gray-900 text-xl">DivineSpark</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="text-gray-600 hover:text-gray-900 transition-colors px-4 text-[16px] md:text-[18px]"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-6 w-px bg-gray-200" />
            {!isAuthenticated ? (
              <Link to="/login">
                <Button className="rounded-xl bg-violet-700 hover:bg-violet-800 text-white px-6 py-2 text-sm md:text-base">Login</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                {userRole === 'admin' ? (
                  <Link to="/admin/dashboard">
                    <Button className="rounded-xl bg-violet-700 hover:bg-violet-800 text-white px-6 py-2 text-sm md:text-base">Dashboard</Button>
                  </Link>
                ) : (
                  <Link to="/sessions">
                    <Button className="rounded-xl bg-violet-700 hover:bg-violet-800 text-white px-6 py-2 text-sm md:text-base">Sessions</Button>
                  </Link>
                )}
                <Button onClick={handleLogout} className="rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-2 text-sm md:text-base">Logout</Button>
              </div>
            )}
          </div>

          <button
            aria-label="Toggle menu"
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
            onClick={() => setIsOpen(prev => !prev)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex flex-col gap-2">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-[16px]"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px w-full bg-gray-200 my-2" />
                {!isAuthenticated ? (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="px-3 py-3 rounded-xl">
                    <Button className="w-full rounded-xl bg-violet-700 hover:bg-violet-800 text-white px-6 py-2 text-sm md:text-base">Login</Button>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2">
                    {userRole === 'admin' ? (
                      <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="px-3 py-3 rounded-xl">
                        <Button className="w-full rounded-xl bg-violet-700 hover:bg-violet-800 text-white px-6 py-2 text-sm md:text-base">Dashboard</Button>
                      </Link>
                    ) : (
                      <Link to="/sessions" onClick={() => setIsOpen(false)} className="px-3 py-3 rounded-xl">
                        <Button className="w-full rounded-xl bg-violet-700 hover:bg-violet-800 text-white px-6 py-2 text-sm md:text-base">Sessions</Button>
                      </Link>
                    )}
                    <div className="px-3 py-3">
                      <Button onClick={() => { setIsOpen(false); handleLogout() }} className="w-full rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-2 text-sm md:text-base">Logout</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navbar


