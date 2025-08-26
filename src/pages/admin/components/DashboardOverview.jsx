import React from 'react'
import { motion } from 'framer-motion'

const cards = [
  { label: 'Total Sessions', value: 42 },
  { label: 'Registered Users', value: 318 },
  { label: 'Total Payments', value: '₹ 1,24,500' },
  { label: 'Upcoming Sessions', value: 5 }
]

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-semibold text-gray-900">Overview</motion.h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-gray-200 bg-white shadow p-4"
          >
            <div className="text-sm text-gray-500">{c.label}</div>
            <div className="text-2xl font-bold text-gray-900">{c.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default DashboardOverview


