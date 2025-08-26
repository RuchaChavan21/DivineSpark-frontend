import React from 'react'
import Navbar from '../components/common/Navbar'
import Donation from '../components/common/Donation'
import Footer from '../components/common/Footer'

const DonationPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Donation />
      <Footer />
    </div>
  )
}

export default DonationPage


