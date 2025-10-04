import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'
import { Heart, Shield, Award, Users, ChevronRight, Sparkles } from 'lucide-react'

const Donation = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <section id="donation" className="relative py-20 md:py-32 overflow-hidden">
      {/* Calming Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
              <Heart className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Support Our Mission
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-800 mb-8 leading-relaxed font-medium">
            Join us in creating a world where inner peace, spiritual growth, and divine connection 
            are accessible to everyone, everywhere.
          </p>
          
          <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Your generous contribution helps us provide free sessions to those in need, 
            support our spiritual guides, and build a global comm ty of seekers on their journey to enlightenment.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/donate">
                <button className="group relative px-10 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-orange-500/40 transform transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  <span className="relative flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Donate Now
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-purple-700 font-semibold text-lg rounded-full border-2 border-purple-200 shadow-lg hover:shadow-xl hover:bg-white/90 hover:border-purple-300 transition-all duration-300">
                Learn More
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Trust Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Payments</h3>
            <p className="text-gray-800 text-sm font-medium">Your donations are protected with bank-level security and SSL encryption.</p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">NGO Verified</h3>
            <p className="text-gray-800 text-sm font-medium">Registered non-profit organization with full transparency and accountability.</p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">10,000+ Lives Touched</h3>
            <p className="text-gray-800 text-sm font-medium">Join thousands of supporters making a real difference in spiritual wellness.</p>
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-center p-8 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Connected</h3>
          <p className="text-gray-800 mb-6 font-medium">Receive updates on our mission, upcoming sessions, and spiritual insights.</p>
          
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default Donation


