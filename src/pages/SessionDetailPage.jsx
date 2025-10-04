import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { formatCurrency, formatDate, formatTime } from '../data/mockData'
import { sessionsAPI, bookFreeSession, initiatePaidSessionBooking, confirmPaidSessionBooking } from '../utils/api'
import BookingConfirmationDialog from '../components/common/BookingConfirmationDialog'

// Safe date parsing utility function
const parseDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') {
    return null
  }
  
  try {
    let normalizedStr = dateStr.trim()
    
    // If the string ends with HH:mm (no seconds), add :00
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(normalizedStr)) {
      normalizedStr += ':00'
    }
    
    // Create date object
    const date = new Date(normalizedStr)
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return null
    }
    
    return date
  } catch (error) {
    console.warn('Failed to parse date:', dateStr, error)
    return null
  }
}

// Safe date formatting functions
const safeFormatDate = (dateObj) => {
  if (!dateObj || isNaN(dateObj.getTime())) {
    return 'TBD'
  }
  return formatDate(dateObj)
}

const safeFormatTime = (dateObj) => {
  if (!dateObj || isNaN(dateObj.getTime())) {
    return 'Time TBD'
  }
  return formatTime(dateObj)
}

const SessionDetailPage = () => {
  const { id } = useParams()
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    const fetchSession = async () => {
      setIsLoading(true)
      setError('')
      try {
        const { data } = await sessionsAPI.getSessionById(id)
        if (!isMounted) return
        const s = data || {}
        // Parse dates safely using our utility function
        const startTimeStr = s.startTime ?? s.start_time ?? s.startDate ?? s.date ?? s.start ?? null
        const endTimeStr = s.endTime ?? s.end_time ?? s.endDate ?? s.end ?? null
        
        const normalized = {
          id: s.id ?? s.sessionId ?? s._id ?? id,
          title: s.title ?? s.name ?? 'Untitled Session',
          description: s.description ?? '',
          host: {
            name: s.guideName ?? s.host?.name ?? 'Unknown Guide',
            avatar: s.host?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b0e4?w=150',
            title: s.host?.title || '',
          },
          category: s.category ?? s.categoryName ?? s.sessionCategory ?? s.SessionCategory ?? 'General',
          startTime: parseDate(startTimeStr),
          endTime: parseDate(endTimeStr),
          type: s.type ?? s.mode ?? (s.zoomLink ? 'ONLINE' : 'OFFLINE'),
          zoomLink: s.zoomLink ?? s.meetingLink ?? '',
          price: Number(s.price ?? s.amount ?? 0),
          maxAttendees: Number(s.capacity ?? s.maxAttendees ?? 0),
          currentAttendees: Number(s.currentAttendees ?? s.registeredCount ?? 0),
          active: s.active ?? s.isActive ?? s.status === 'ACTIVE' ?? true,
          createdAt: s.createdAt ?? s.createdDate,
          updatedAt: s.updatedAt ?? s.lastModifiedDate,
        }
        setSession(normalized)
        
      } catch (e) {
        console.error('Failed to fetch session', e)
        setError('Failed to load session. Please try again later.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    fetchSession()
    return () => { isMounted = false }
  }, [id])

  const computed = useMemo(() => {
    if (!session) return null
    const now = new Date()
    const start = session.startTime // Already parsed as Date object or null
    const end = session.endTime     // Already parsed as Date object or null
    const isUpcoming = start ? start >= now : true
    const spotsLeft = Math.max(0, (session.maxAttendees || 0) - (session.currentAttendees || 0))
    const isOnline = !!session.zoomLink
    const isFree = session.price === 0
    return { ...session, start, end, isUpcoming, spotsLeft, isOnline, isFree }
  }, [session])

  const startBooking = useCallback(async () => {
    if (!computed) return
    try {
      if (computed.price === 0) {
        await bookFreeSession(computed.id)
        if (window.toast?.success) window.toast.success('Successfully booked the session!')
        else alert('Successfully booked the session!')
        return
      }
      const { data } = await initiatePaidSessionBooking(computed.id)

      const ensureRazorpayLoaded = () => new Promise((resolve, reject) => {
        if (window.Razorpay) return resolve()
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = resolve
        script.onerror = () => reject(new Error('Failed to load Razorpay'))
        document.body.appendChild(script)
      })

      await ensureRazorpayLoaded()

      const orderId = data?.orderId || data?.id
      const amount = data?.amount
      const currency = data?.currency || 'INR'
      const key = data?.key || (import.meta?.env?.VITE_RAZORPAY_KEY_ID || '')

      if (!orderId || !amount || !key) {
        throw new Error('Invalid payment order details received')
      }

      const storedUser = (() => {
        try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
      })()
      const prefillName = storedUser?.name || localStorage.getItem('userName') || ''
      const prefillEmail = storedUser?.email || localStorage.getItem('userEmail') || ''

      const options = {
        key,
        amount,
        currency,
        name: 'DivineSpark',
        description: `Booking for ${computed.title}`,
        order_id: orderId,
        prefill: { name: prefillName, email: prefillEmail },
        theme: { color: '#6D28D9' },
        handler: async function (response) {
          try {
            const paymentId = response?.razorpay_payment_id
            if (!paymentId) throw new Error('Missing payment id')
            await confirmPaidSessionBooking(paymentId, computed.id)
            if (window.toast?.success) window.toast.success('Payment successful! Session booked.')
            else alert('Payment successful! Session booked.')
          } catch (err) {
            console.error('Payment confirmation failed', err)
            if (window.toast?.error) window.toast.error('Payment confirmed failed. Please contact support.')
            else alert('Payment confirm failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: function () {
            if (window.toast?.info) window.toast.info('Payment cancelled.')
            else console.log('Payment cancelled')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      console.error('Booking failed', e)
      if (window.toast?.error) window.toast.error('Booking failed. Please try again.')
      else alert('Booking failed. Please try again.')
    }
  }, [computed])

  const handleBook = () => {
    if (!computed) return
    setConfirmOpen(true)
  }

  const onConfirmBooking = async () => {
    setConfirmLoading(true)
    try {
      await startBooking()
    } finally {
      setConfirmLoading(false)
      setConfirmOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-2xl font-semibold text-gray-900">Loading session...</h1>
          <p className="text-gray-600 mt-2">Please wait while we fetch the details.</p>
          <Link to="/sessions" className="text-primary-600 mt-4 inline-block">Back to sessions</Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !computed) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-2xl font-semibold text-gray-900">Session not found</h1>
          <p className="text-gray-600 mt-2">{error || 'The session you are looking for does not exist.'}</p>
          <Link to="/sessions" className="text-primary-600 mt-4 inline-block">Back to sessions</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const { isFree, spotsLeft, isOnline, isUpcoming, start, end } = computed

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/sessions" className="text-sm text-primary-600">← Back to sessions</Link>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-semibold text-gray-900">{computed.title}</h1>
            <p className="text-gray-700 mt-3">{computed.description}</p>

            {/* Enhanced Session Details Grid */}
            <div className="mt-8 space-y-6">
              {/* Guide Information - Without Profile Icon */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Session Guide</h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    Expert
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-bold text-gray-900">{computed.host.name}</div>
                  <div className="text-gray-600">{computed.host.title}</div>
                </div>
              </div>

              {/* Session Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Category */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-500">Category</div>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{computed.category}</div>
                </div>

                {/* Schedule - Only Start Date and Time */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-500">Schedule</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-gray-900">
                      {safeFormatDate(start)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {safeFormatTime(start)}
                    </div>
                  </div>
                </div>

                {/* Session Type */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOnline ? "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" : "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"} />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-500">Session Type</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isOnline ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    {isOnline && computed.zoomLink && (
                      <div className="text-xs text-gray-500 break-all">
                        Meeting Link Available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Session Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{computed.maxAttendees}</div>
                    <div className="text-sm text-gray-500">Max Capacity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{spotsLeft}</div>
                    <div className="text-sm text-gray-500">Spots Left</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{computed.currentAttendees}</div>
                    <div className="text-sm text-gray-500">Registered</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      isUpcoming ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {isUpcoming ? '✓' : '✗'}
                    </div>
                    <div className="text-sm text-gray-500">Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6 shadow-lg">
              {/* Price Section */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {isFree ? (
                    <span className="text-green-600">Free Session</span>
                  ) : (
                    <span>₹{computed.price.toLocaleString('en-IN')}</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {isFree ? 'No payment required' : 'One-time payment'}
                </div>
              </div>

              {/* Session Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Capacity</span>
                  <span className="font-semibold text-gray-900">{computed.maxAttendees} people</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Available Spots</span>
                  <span className={`font-semibold ${
                    spotsLeft > 10 ? 'text-green-600' : spotsLeft > 0 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {spotsLeft} left
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isUpcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isUpcoming ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Booking Button */}
              <button 
                onClick={handleBook} 
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                  !isUpcoming || spotsLeft === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
                style={!isUpcoming || spotsLeft === 0 ? {} : {backgroundColor: '#2E8B57', border: '2px solid #228B22'}}
                onMouseEnter={(e) => {
                  if (isUpcoming && spotsLeft > 0) {
                    e.target.style.backgroundColor = '#228B22'
                  }
                }}
                onMouseLeave={(e) => {
                  if (isUpcoming && spotsLeft > 0) {
                    e.target.style.backgroundColor = '#2E8B57'
                  }
                }}
                disabled={!isUpcoming || spotsLeft === 0}
              >
                {isUpcoming ? (
                  spotsLeft === 0 ? (
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Session Full
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Book This Session
                    </span>
                  )
                ) : (
                  'Session Inactive'
                )}
              </button>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 text-center">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure booking with instant confirmation
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
      <BookingConfirmationDialog
        open={confirmOpen}
        title={computed ? (computed.price === 0 ? 'Confirm Free Booking' : 'Confirm Booking') : 'Confirm Booking'}
        message={computed ? (computed.price === 0 ? `Do you want to book '${computed.title}' for free?` : `Do you want to book '${computed.title}'?`) : ''}
        confirmLabel={computed && computed.price === 0 ? 'Book for Free' : 'Proceed'}
        cancelLabel="Cancel"
        onConfirm={onConfirmBooking}
        onCancel={() => (!confirmLoading ? setConfirmOpen(false) : null)}
        loading={confirmLoading}
      />
    </div>
  )
}

export default SessionDetailPage


