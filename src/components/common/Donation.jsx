import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'

const Donation = () => {
  return (
    <section id="donation" className="py-16 md:py-20" style={{ backgroundColor: '#EDE9FE' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>Support Our Mission</h2>
          <p className="text-gray-700 mb-8" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
            Help us spread healing, peace, and happiness to more people.
          </p>
          <Link to="/donation">
            <Button size="lg" className="min-w-[200px] bg-violet-700 hover:bg-violet-800 text-white rounded-xl hover:shadow-md">
              Donate Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Donation


