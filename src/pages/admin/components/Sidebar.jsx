import React from 'react'
import { LayoutDashboard, Calendar, Users, CreditCard, Settings } from 'lucide-react'

const items = [
  { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'sessions', label: 'Manage Sessions', icon: Calendar },
  { key: 'users', label: 'Registered Users', icon: Users },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'settings', label: 'Settings', icon: Settings }
]

const Sidebar = ({ active, onChange }) => {
  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-purple-900 text-white px-3 py-5 shadow-xl border-r border-purple-800">
      <div className="px-2 mb-4">
        <div className="text-lg font-semibold tracking-wide">Admin Panel</div>
      </div>
      <nav className="space-y-1">
        {items.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              active === key ? 'bg-purple-700 text-white' : 'text-gray-300 hover:bg-purple-700 hover:text-white'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar


