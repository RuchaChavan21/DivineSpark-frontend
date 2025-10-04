import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Heart
} from 'lucide-react'

const Footer = () => {

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-600' }
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg mr-3">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  DivineSpark
                </h3>
              </div>
              <p className="text-gray-200 mb-6 leading-relaxed font-medium">
                Connecting souls through transformative spiritual experiences. Join our global community of seekers on the path to enlightenment.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-200">
                  <Mail className="h-4 w-4 mr-3 text-purple-300" />
                  <span className="text-sm font-medium">hello@divinespark.com</span>
                </div>
                <div className="flex items-center text-gray-200">
                  <Phone className="h-4 w-4 mr-3 text-purple-300" />
                  <span className="text-sm font-medium">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-200">
                  <MapPin className="h-4 w-4 mr-3 text-purple-300" />
                  <span className="text-sm font-medium">San Francisco, CA</span>
                </div>
              </div>
            </motion.div>

            {/* Platform Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">Platform</h4>
              <ul className="space-y-3">
                <li><Link to="/sessions" className="text-gray-200 hover:text-purple-200 transition-colors duration-200 text-sm font-medium">Browse Sessions</Link></li>
                <li><Link to="/about" className="text-gray-200 hover:text-purple-200 transition-colors duration-200 text-sm font-medium">Become a Guide</Link></li>
                <li><Link to="/donation" className="text-gray-200 hover:text-purple-200 transition-colors duration-200 text-sm font-medium">Support Mission</Link></li>
                <li><Link to="/" className="text-gray-200 hover:text-purple-200 transition-colors duration-200 text-sm font-medium">Features</Link></li>
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                <li><Link to="/contact" className="text-gray-200 hover:text-purple-200 transition-colors duration-200 text-sm font-medium">Help Center</Link></li>
                <li><Link to="/contact" className="text-gray-200 hover:text-purple-200 transition-colors duration-200 text-sm font-medium">Contact Us</Link></li>
                <li><a href="#" className="text-gray-200 hover:text-purple-200 transition-colors duration-200 text-sm font-medium">Community Guidelines</a></li>
                <li><a href="#" className="text-gray-200 hover:text-purple-200 transition-colors duration-200 text-sm font-medium">Privacy Policy</a></li>
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
              <ul className="space-y-3 mb-6">
                <li><Link to="/about" className="text-gray-200 hover:text-purple-200 transition-colors duration-200 text-sm font-medium">About Us</Link></li>
                <li><Link to="/reviews" className="text-gray-200 hover:text-purple-200 transition-colors duration-200 text-sm font-medium">Testimonials</Link></li>
                <li><a href="#" className="text-gray-200 hover:text-purple-200 transition-colors duration-200 text-sm font-medium">Careers</a></li>
                <li><a href="#" className="text-gray-200 hover:text-purple-200 transition-colors duration-200 text-sm font-medium">Press Kit</a></li>
              </ul>
              
              {/* Social Links */}
              <div>
                <h5 className="text-sm font-medium mb-4 text-white">Follow Us</h5>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 bg-white/20 backdrop-blur-sm rounded-lg text-gray-200 ${social.color} transition-all duration-200 hover:bg-white/30 hover:text-white`}
                        aria-label={social.label}
                      >
                        <Icon className="h-5 w-5" />
                      </motion.a>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col md:flex-row justify-between items-center"
            >
              <div className="text-gray-300 text-sm mb-4 md:mb-0 font-medium">
                © 2024 DivineSpark. All rights reserved. Made with ❤️ for spiritual growth.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-300 hover:text-purple-200 transition-colors duration-200 font-medium">Terms of Service</a>
                <a href="#" className="text-gray-300 hover:text-purple-200 transition-colors duration-200 font-medium">Privacy Policy</a>
                <a href="#" className="text-gray-300 hover:text-purple-200 transition-colors duration-200 font-medium">Cookies</a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
