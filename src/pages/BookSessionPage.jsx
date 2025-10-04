import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CreditCard, 
  CheckCircle,
  ArrowLeft,
  AlertCircle
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";import { sessionsAPI } from '../utils/api'
import { formatCurrency } from '../data/mockData'

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  } catch {
    return dateString
  }
}

const formatTime = (timeString) => {
  try {
    const d = new Date(timeString)
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })
    }
    return new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })
  } catch {
    return timeString
  }
}

const BookSessionPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  
  // Booking form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequests: '',
    agreeToTerms: false
  })

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true)
        const { data } = await sessionsAPI.getSessionById(id)
        
        // Normalize session data
        const normalized = {
          id: data.id ?? data.sessionId ?? data._id,
          title: data.title ?? data.name ?? 'Untitled Session',
          description: data.description ?? '',
          host: {
            name: data.guideName ?? data.host?.name ?? 'Unknown Guide',
            avatar: data.host?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b0e4?w=150',
            title: data.host?.title || '',
          },
          category: data.category ?? data.categoryName ?? 'General',
          startTime: data.startTime ?? data.startDate ?? data.date ?? data.start,
          endTime: data.endTime ?? data.endDate ?? data.end,
          type: data.type ?? data.mode ?? (data.zoomLink ? 'ONLINE' : 'OFFLINE'),
          zoomLink: data.zoomLink ?? data.meetingLink ?? '',
          price: Number(data.price ?? data.amount ?? 0),
          maxAttendees: Number(data.capacity ?? data.maxAttendees ?? 0),
          currentAttendees: Number(data.currentAttendees ?? data.registeredCount ?? 0),
          active: data.active ?? data.isActive ?? data.status === 'ACTIVE' ?? true,
        }
        
        setSession(normalized)
      } catch (err) {
        console.error('Failed to fetch session:', err)
        setError('Failed to load session details. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions')
      return
    }

    setIsBooking(true)
    setError('')
    
    try {
      await sessionsAPI.bookSession(id)
      setBookingSuccess(true)
      
      // Redirect to sessions page after 3 seconds
      setTimeout(() => {
        navigate('/sessions')
      }, 3000)
    } catch (err) {
      console.error('Booking failed:', err)
      setError(err.response?.data?.message || 'Failed to book session. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading session details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Session Not Found</h1>
            <p className="text-gray-600 mb-6">The session you're looking for doesn't exist or has been removed.</p>
            <Link to="/sessions">
              <Button>Back to Sessions</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const isFree = session.price === 0
  const spotsLeft = Math.max(0, session.maxAttendees - session.currentAttendees)
  const isOnline = session.type === 'ONLINE' || !!session.zoomLink
  const canBook = session.active && spotsLeft > 0

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              You have successfully booked "{session.title}". 
              You will receive a confirmation email shortly.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to sessions page in a few seconds...
            </p>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link to={`/sessions/${id}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Session Details
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Session Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl">{session.title}</CardTitle>
                <CardDescription>{session.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {session.startTime ? formatDate(session.startTime) : 'TBD'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {session.startTime ? formatTime(session.startTime) : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{session.host.name}</div>
                    <div className="text-xs text-gray-500">{session.host.title}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div className="text-sm text-gray-900">
                    {isOnline ? 'Online Session' : 'In-Person Session'}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {isFree ? 'Free' : formatCurrency(session.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Spots Available</span>
                    <span className="text-sm text-gray-900">{spotsLeft} of {session.maxAttendees}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Booking</CardTitle>
                <CardDescription>
                  Fill in your details to secure your spot in this session.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!canBook && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-700 font-medium">
                        {spotsLeft === 0 ? 'This session is full' : 'This session is not available for booking'}
                      </span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-700">{error}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests or Notes</Label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Any special requirements or questions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                        required
                      />
                      <span className="text-sm text-gray-600 leading-relaxed">
                        I agree to the{' '}
                        <a href="#" className="text-primary-600 hover:text-primary-700">
                          Terms of Service
                        </a>
                        {' '}and{' '}
                        <a href="#" className="text-primary-600 hover:text-primary-700">
                          Privacy Policy
                        </a>
                        . I understand that this booking is subject to the session's cancellation policy.
                      </span>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={!canBook || isBooking}
                  >
                    {isBooking ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Booking...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        {isFree ? 'Confirm Free Booking' : `Book Session - ${formatCurrency(session.price)}`}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default BookSessionPage
