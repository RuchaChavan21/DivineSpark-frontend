import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

const Contact = () => {
  return (
    <section id="contact" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>Get in Touch</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 gap-4">
              <input className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-300" placeholder="Name" />
              <input className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-300" placeholder="Email" type="email" />
              <textarea className="w-full rounded-xl border border-gray-200 px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" placeholder="Message" />
              <Button className="bg-violet-700 hover:bg-violet-800 text-white rounded-xl hover:shadow-md">Send Message</Button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6"
          >
            <div className="space-y-3 text-gray-700" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
              <p><span className="font-medium text-gray-900">Email:</span> hello@divinespark.example</p>
              <p><span className="font-medium text-gray-900">Phone:</span> +91 99999 99999</p>
              <p><span className="font-medium text-gray-900">Location:</span> Pune, India</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact


