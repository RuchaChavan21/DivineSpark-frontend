import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { formatCurrency, formatDate, formatTime } from '../data/mockData'
import { sessionsAPI, bookFreeSession, initiatePaidSessionBooking, confirmPaidSessionBooking } from '../utils/api'
import BookingConfirmationDialog from '../components/common/BookingConfirmationDialog'

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
          startTime: s.startTime ?? s.start_time ?? s.startDate ?? s.date ?? s.start ?? null,
          endTime: s.endTime ?? s.end_time ?? s.endDate ?? s.end ?? null,
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
    const start = session.startTime ? new Date(session.startTime) : null
    const end = session.endTime ? new Date(session.endTime) : null
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

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs text-gray-500">Guide</div>
                <div className="mt-1 flex items-center gap-3">
                  <img src={computed.host.avatar} alt={computed.host.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-gray-900 font-medium">{computed.host.name}</div>
                    <div className="text-xs text-gray-500">{computed.host.title}</div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs text-gray-500">Category</div>
                <div className="mt-1 text-gray-900">{computed.category}</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs text-gray-500">Schedule</div>
                <div className="mt-1 text-gray-900">{start ? `${formatDate(start)} · ${formatTime(start)}` : '—'}{end ? ` · Ends ${formatTime(end)}` : ''}</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs text-gray-500">Type</div>
                <div className="mt-1 text-gray-900">{isOnline ? 'Online' : 'Offline'}</div>
                {isOnline && (
                  <div className="text-xs text-gray-600 mt-1 break-all">Zoom: {computed.zoomLink}</div>
                )}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 p-5 sticky top-6">
              <div className="text-2xl font-semibold text-gray-900">{isFree ? 'Free' : formatCurrency(computed.price)}</div>
              <div className="text-sm text-gray-600 mt-1">Capacity: {computed.maxAttendees} · {spotsLeft} spots left</div>
              <div className="text-sm mt-1">
                <span className={`px-2 py-1 rounded-full text-xs ${isUpcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{isUpcoming ? 'Active' : 'Inactive'}</span>
              </div>

              <button onClick={handleBook} className="mt-5 w-full bg-primary-600 hover:bg-primary-700 text-white rounded-md py-2.5 font-medium disabled:opacity-50" disabled={!isUpcoming || spotsLeft === 0}>
                {isUpcoming ? (spotsLeft === 0 ? 'Full' : 'Book Session') : 'Not Active'}
              </button>

              <div className="mt-4 text-xs text-gray-500">Auto-tracked: created and updated timestamps are kept server-side.</div>
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


