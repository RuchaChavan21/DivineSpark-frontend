import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import Sidebar from './components/Sidebar'
import DashboardOverview from './components/DashboardOverview'
import ManageSessions from './components/ManageSessions'
import RegisteredUsers from './components/RegisteredUsers'
import Payments from './components/Payments'
import Settings from './components/Settings'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [active, setActive] = useState('overview')

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (role !== 'admin') navigate('/login', { replace: true })
  }, [navigate])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active={active} onChange={setActive} />
      
      {/* Main Content */}
      <div className="flex-1 ml-72 flex flex-col">
        {/* Header */}
        <header className="bg-white border-gray-200 border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700">
              <Bell className="h-5 w-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
              A
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {active === 'overview' && <DashboardOverview />}
          {active === 'sessions' && <ManageSessions />}
          {active === 'users' && <RegisteredUsers />}
          {active === 'payments' && <Payments />}
          {active === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard


