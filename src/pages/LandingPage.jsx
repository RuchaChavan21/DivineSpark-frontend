import React from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Shield, 
  Users, 
  Video, 
  Sparkles, 
  ArrowRight,
  Clock,
  Star,
  CheckCircle
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import FeatureCard from '../components/common/FeatureCard'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'

const LandingPage = () => {
  const features = [
    {
      icon: Calendar,
      title: "Instant Booking",
      description: "Book sessions in seconds with our streamlined booking system. No complicated forms or lengthy processes."
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Your payments are protected with enterprise-grade security. Pay with confidence using multiple payment methods."
    },
    {
      icon: Users,
      title: "Expert Hosts",
      description: "Learn from industry experts and thought leaders who are passionate about sharing their knowledge."
    },
    {
      icon: Video,
      title: "Zoom Integration",
      description: "Seamless integration with Zoom for high-quality video sessions. Join meetings with one click."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center p-2 rounded-full mb-6" style={{ backgroundColor: '#EDE9FE' }}>
              <Sparkles className="h-7 w-7" color="#7C3AED" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 mb-5 leading-tight">
              Book Live Sessions That <span className="bg-gradient-to-r from-[#C4B5FD] to-[#A78BFA] bg-clip-text text-transparent">Spark Your Growth</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with mentors and guides for your spiritual journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" className="min-w-[200px] bg-violet-600 hover:bg-violet-700 text-white rounded-lg">
                Book Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="min-w-[200px] rounded-lg">
                Explore Sessions
              </Button>
            </div>
            
            {/* Hero Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm h-64 md:h-80 flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-20 w-20 mx-auto mb-3" color="#7C3AED" />
                  <p className="text-gray-700">A calm space for live learning</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">Why Choose DivineSpark?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">A calm, reliable platform connecting seekers with expert mentors.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #C4B5FD 0%, #A78BFA 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-white"
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Ready to begin your journey?</h2>
            <p className="text-lg mb-8 text-white/90">Join a calm community of seekers and mentors.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="min-w-[200px] bg-white text-gray-900 hover:bg-gray-100 rounded-lg">
                Get Started
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage
