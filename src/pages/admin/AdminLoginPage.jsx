import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Button } from '../../components/ui/Button'

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email === 'admin@divinespark.com' && password === 'admin123') {
      localStorage.setItem('adminToken', 'true')
      setError('')
      navigate('/admin/dashboard', { replace: true })
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}>
              Admin Login — DivineSpark
            </h1>
            <p className="text-sm text-gray-500 mb-6">For authorized personnel only</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@divinespark.com"
                    className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300"
                  />
                </div>
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button type="submit" className="w-full bg-violet-700 hover:bg-violet-800 text-white rounded-xl">Login as Admin</Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminLoginPage


