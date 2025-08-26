import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <div className="flex h-screen">
      <Sidebar active={active} onChange={setActive} />
      <main className="flex-1 ml-64 overflow-y-auto bg-gray-50 p-6 text-gray-800">
        {active === 'overview' && <DashboardOverview />}
        {active === 'sessions' && <ManageSessions />}
        {active === 'users' && <RegisteredUsers />}
        {active === 'payments' && <Payments />}
        {active === 'settings' && <Settings />}
      </main>
    </div>
  )
}

export default AdminDashboard


