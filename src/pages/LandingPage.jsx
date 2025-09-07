import React from 'react'
import Navbar from '../components/common/Navbar'
import Hero from '../components/common/Hero'
import About from '../components/common/About'
import Sessions from '../components/common/Sessions'
import Donation from '../components/common/Donation'
import Reviews from '../components/common/Reviews'
import Contact from '../components/common/Contact'
import Footer from '../components/common/Footer'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <About />
      <Sessions />
      <Donation />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  )
}

export default LandingPage