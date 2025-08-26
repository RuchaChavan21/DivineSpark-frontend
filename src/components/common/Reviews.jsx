import React from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: 'I felt an immediate sense of calm and relief after the session.',
    name: 'A. Sharma'
  },
  {
    quote: 'The workshops brought clarity and improved my sleep. Highly recommended!',
    name: 'R. Patel'
  },
  {
    quote: 'Gentle, powerful, and transformative experience.',
    name: 'M. Khan'
  }
]

const Reviews = () => {
  return (
    <section id="reviews" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>What People Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-center"
            >
              <p className="text-gray-700 mb-4" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                “{t.quote}”
              </p>
              <span className="text-sm text-gray-500">— {t.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reviews


