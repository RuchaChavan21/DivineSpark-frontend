import React from 'react'
import Navbar from '../components/common/Navbar'
import Sessions from '../components/common/Sessions'
import Footer from '../components/common/Footer'

const SessionsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Sessions />
      <Footer />
    </div>
  )
}

export default SessionsPage


