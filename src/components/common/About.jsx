import React from 'react'
import { motion } from 'framer-motion'

const About = () => {
  return (
    <section id="about" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 gap-10 md:gap-12 items-center"
        >
          <div>
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm h-64 md:h-80 overflow-hidden">
              <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1533646933040-1f0e2f6b1c02?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>About DivineSpark</h2>
            <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
              Founded by Suvir Sabnis, DivineSpark offers energy-based healing that involves no touch and no drug therapy. Our approach focuses on restoring balance and harmony to bring peace, health, and happiness.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About


