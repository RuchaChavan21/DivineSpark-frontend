import React from 'react'
import Navbar from '../components/common/Navbar'
import Reviews from '../components/common/Reviews'
import Footer from '../components/common/Footer'

const ReviewsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Reviews />
      <Footer />
    </div>
  )
}

export default ReviewsPage


