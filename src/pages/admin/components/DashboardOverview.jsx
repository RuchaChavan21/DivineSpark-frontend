import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, CreditCard, Clock, TrendingUp, ArrowUpRight } from 'lucide-react'

const cards = [
  { 
    label: 'Total Sessions', 
    value: 42, 
    icon: Calendar,
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    darkBgGradient: 'from-blue-900/20 to-blue-800/20',
    change: '+12%',
    changeType: 'positive'
  },
  { 
    label: 'Registered Users', 
    value: 318, 
    icon: Users,
    gradient: 'from-emerald-500 to-emerald-600',
    bgGradient: 'from-emerald-50 to-emerald-100',
    darkBgGradient: 'from-emerald-900/20 to-emerald-800/20',
    change: '+8%',
    changeType: 'positive'
  },
  { 
    label: 'Total Payments', 
    value: '₹1,24,500', 
    icon: CreditCard,
    gradient: 'from-amber-500 to-yellow-500',
    bgGradient: 'from-amber-50 to-yellow-50',
    darkBgGradient: 'from-amber-900/20 to-yellow-800/20',
    change: '+15%',
    changeType: 'positive'
  },
  { 
    label: 'Upcoming Sessions', 
    value: 5, 
    icon: Clock,
    gradient: 'from-orange-500 to-orange-600',
    bgGradient: 'from-orange-50 to-orange-100',
    darkBgGradient: 'from-orange-900/20 to-orange-800/20',
    change: '+3',
    changeType: 'positive'
  }
]

const DashboardOverview = () => {
  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Dashboard Insights</h1>
          <p className="text-gray-500">Track your sessions, users, and payments at a glance.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-2xl bg-white border-gray-200 border shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${card.gradient}`} />
              
              {/* Card Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.bgGradient}`}>
                    <Icon className={`h-6 w-6 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    card.changeType === 'positive'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    {card.change}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
              </div>

              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </motion.div>
          )
        })}
      </div>

      {/* Additional Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-white border-gray-200 border shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Quick Actions
          </h3>
          <ArrowUpRight className="h-5 w-5 text-gray-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 rounded-xl text-left transition-all duration-200 bg-gray-50 hover:bg-gray-100 text-gray-900">
            <div className="font-medium">Create New Session</div>
            <div className="text-sm text-gray-600">
              Schedule a new meditation session
            </div>
          </button>
          <button className="p-4 rounded-xl text-left transition-all duration-200 bg-gray-50 hover:bg-gray-100 text-gray-900">
            <div className="font-medium">View Analytics</div>
            <div className="text-sm text-gray-600">
              Check detailed performance metrics
            </div>
          </button>
          <button className="p-4 rounded-xl text-left transition-all duration-200 bg-gray-50 hover:bg-gray-100 text-gray-900">
            <div className="font-medium">Manage Users</div>
            <div className="text-sm text-gray-600">
              Review and manage user accounts
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardOverview


