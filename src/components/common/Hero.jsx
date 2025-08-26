import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'
import heroBg from '../../assets/homePage1.jpg'

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative bg-no-repeat bg-cover bg-center min-h-[60vh] md:min-h-[80vh] flex items-center justify-center px-6 md:px-12 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/70 before:to-[#EDE9FE]/80"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-5 leading-tight" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
            Feed the Soul with Divine Healing
          </h1>
          <p className="text-lg text-gray-700 md:text-gray-700 mb-8" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
            Energy-based healing to bring peace, health, and happiness into your life.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/sessions">
              <Button size="lg" className="min-w-[200px] bg-violet-600 hover:bg-violet-700 text-white rounded-xl hover:shadow-md">
                Book a Session
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero


