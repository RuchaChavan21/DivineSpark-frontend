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
    <aside className="fixed inset-y-0 left-0 w-64 bg-white text-gray-900 px-4 py-6 shadow-xl border-r border-gray-200">
      <div className="px-1 mb-5">
        <div className="text-base font-semibold tracking-wide">Admin Panel</div>
      </div>
      <nav className="space-y-1">
        {items.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
              active === key
                ? 'bg-violet-100 text-violet-900'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
            aria-current={active === key ? 'page' : undefined}
          >
            <Icon className={`h-5 w-5 ${active === key ? 'text-violet-700' : 'text-gray-500'}`} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar


