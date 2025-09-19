import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { formatCurrency } from '../data/mockData'
import { sessionsAPI } from '../utils/api'

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateString
  }
}

const formatTime = (timeString) => {
  try {
    const d = new Date(timeString)
    if (!isNaN(d.getTime())) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    // fallback for HH:mm strings
    return new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  } catch {
    return timeString
  }
}

const SessionsPage = () => {
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    const fetchSessions = async () => {
      setIsLoading(true)
      setError('')
      try {
        // Fetch from admin endpoint as requested
        const { data } = await sessionsAPI.getAllSessionsAdmin()
        if (!isMounted) return
        // Normalize fields to match UI expectations
        const normalized = (Array.isArray(data) ? data : data?.content || []).map((s) => ({
          id: s.id ?? s.sessionId ?? s._id,
          title: s.title ?? s.name ?? 'Untitled Session',
          description: s.description ?? '',
          host: {
            name: s.guideName ?? s.host?.name ?? 'Unknown Guide',
            avatar: s.host?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b0e4?w=150',
            title: s.host?.title || '',
          },
          category: s.category ?? s.categoryName ?? 'General',
          startTime: s.startTime ?? s.startDate ?? s.date ?? s.start,
          endTime: s.endTime ?? s.endDate ?? s.end,
          type: s.type ?? s.mode ?? (s.zoomLink ? 'ONLINE' : 'OFFLINE'),
          zoomLink: s.zoomLink ?? s.meetingLink ?? '',
          price: Number(s.price ?? s.amount ?? 0),
          maxAttendees: Number(s.capacity ?? s.maxAttendees ?? 0),
          currentAttendees: Number(s.currentAttendees ?? s.registeredCount ?? 0),
          active: s.active ?? s.isActive ?? s.status === 'ACTIVE' ?? true,
          createdAt: s.createdAt ?? s.createdDate,
          updatedAt: s.updatedAt ?? s.lastModifiedDate,
        }))
        setSessions(normalized)
      } catch (e) {
        console.error('Failed to fetch sessions', e)
        setError('Failed to load sessions. Please try again later.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    fetchSessions()
    return () => { isMounted = false }
  }, [])

  const computed = useMemo(() => {
    const now = new Date()
    return sessions.map((s) => {
      const start = s.startTime ? new Date(s.startTime) : null
      const end = s.endTime ? new Date(s.endTime) : null
      const upcoming = start ? start >= now : true
      const spotsLeft = Math.max(0, (s.maxAttendees || 0) - (s.currentAttendees || 0))
      const openForRegistration = Boolean(s.active) && upcoming && spotsLeft > 0
      return { ...s, upcoming, spotsLeft, openForRegistration, start, end }
    })
  }, [sessions])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">All Sessions</h1>
            <p className="text-gray-600 mt-1">Explore and click a session to view full details.</p>
          </div>

          {isLoading && (
            <div className="text-gray-600">Loading sessions...</div>
          )}
          {error && (
            <div className="text-red-600">{error}</div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {computed.map((s) => {
                const isFree = s.price === 0
                return (
                  <Link key={s.id} to={`/sessions/${s.id}`} className="group rounded-xl border border-gray-200 hover:border-primary-300 transition-colors bg-white overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700">{s.title}</h2>
                        <span className={`text-xs px-2 py-1 rounded-full ${s.openForRegistration ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{s.openForRegistration ? 'Open' : 'Closed'}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{s.description}</p>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-700">
                        <div>
                          <span className="block text-gray-500 text-xs">Start</span>
                          <span>{s.start ? `${formatDate(s.start)} · ${formatTime(s.start)}` : '—'}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500 text-xs">End</span>
                          <span>{s.end ? `${formatDate(s.end)} · ${formatTime(s.end)}` : '—'}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500 text-xs">Category</span>
                          <span>{s.category}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500 text-xs">Price</span>
                          <span className={isFree ? 'text-green-700' : ''}>{isFree ? 'Free' : formatCurrency(s.price)}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={s.host.avatar} alt={s.host.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{s.host.name}</div>
                            {s.host.title ? (<div className="text-xs text-gray-500">{s.host.title}</div>) : null}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">{s.spotsLeft} spots left</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default SessionsPage


