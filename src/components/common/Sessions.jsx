import React from 'react'
import { motion } from 'framer-motion'

const cards = [
  {
    title: 'Children Workshops',
    text: 'Interactive sessions to nurture mindfulness and positivity in children.',
    img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Meditation Sundays',
    text: 'Weekly guided meditation to restore inner peace and clarity.',
    img: 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Workshops in Pune/Thailand',
    text: 'Transformative healing workshops conducted across Pune and Thailand.',
    img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop'
  }
]

const Sessions = () => {
  return (
    <section id="sessions" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>Our Healing Workshops</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white/70 shadow-sm backdrop-blur [background:radial-gradient(100%_100%_at_0%_0%,#ffffff80,transparent)] overflow-hidden"
            >
              <div className="h-44 w-full bg-cover bg-center" style={{ backgroundImage: `url(${card.img})` }} />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>{card.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Sessions


