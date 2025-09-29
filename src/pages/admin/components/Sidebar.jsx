import React from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Calendar, Users, CreditCard, Settings, Home } from 'lucide-react'

const items = [
  { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'sessions', label: 'Manage Sessions', icon: Calendar },
  { key: 'users', label: 'Registered Users', icon: Users },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'settings', label: 'Settings', icon: Settings }
]

const Sidebar = ({ active, onChange }) => {
  return (
    <aside className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-slate-50 to-slate-100 border-gray-200 px-6 py-8 shadow-2xl border-r transition-all duration-300">
      <div className="mb-8">
        <div className="text-xl font-bold tracking-tight text-gray-900">
          Admin Panel
        </div>
        <div className="text-sm text-gray-500 mt-1">
          DivineSpark Dashboard
        </div>
      </div>
      
      <nav className="space-y-2">
        <Link
          to="/"
          className="group w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md"
        >
          <Home className="h-5 w-5 transition-colors text-gray-400 group-hover:text-blue-600" />
          <span className="font-medium">Home</span>
        </Link>
        
        <div className="pt-4 pb-2">
          <hr className="border-gray-300" />
        </div>
        
        {items.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`group w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              active === key
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md'
            }`}
            aria-current={active === key ? 'page' : undefined}
          >
            <Icon className={`h-5 w-5 transition-colors ${
              active === key
                ? 'text-white'
                : 'text-gray-400 group-hover:text-blue-600'
            }`} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar


