import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { formatCurrency } from '../data/mockData'
import { sessionsAPI, toAbsoluteUrl } from '../utils/api'

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
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchSessions = async () => {
      setIsLoading(true)
      setError('')
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken')
      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      try {
        const { data } = await sessionsAPI.getAllSessions()
        if (!isMounted) return
        console.log("Raw API response data:", data); // Debug log
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
          category: s.category ?? s.categoryName ?? s.sessionCategory ?? s.SessionCategory ?? 'General',
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
          imageUrl: (() => {
            const raw = s.imageUrl ?? s.image ?? s.thumbnailUrl ?? s.imagePath ?? s.bannerUrl ?? ''
            return toAbsoluteUrl(raw)
          })(),
        }))
        console.log("Normalized sessions data:", normalized); // Debug log
        setSessions(normalized)
      } catch (e) {
        console.error('Failed to fetch sessions', e)
        if (e.response?.status === 401) {
          setIsAuthenticated(false)
        } else {
          setError('Failed to load sessions. Please try again later.')
        }
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Discover Sessions
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
              Explore our curated collection of transformative sessions. Click on any session to view detailed information and book your spot.
            </p>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6"></div>
                  <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-blue-600 animate-pulse mx-auto"></div>
                </div>
                <p className="text-gray-700 text-xl font-medium">Loading sessions...</p>
              </div>
            </div>
          )}
          
          {!isAuthenticated && (
            <div className="text-center py-24">
              <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-10">
                <div className="mb-8">
                  <div className="mx-auto h-20 w-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">Welcome to DivineSpark</h3>
                <p className="text-gray-700 mb-10 leading-relaxed text-lg">Join our community to explore transformative sessions, connect with expert guides, and embark on your spiritual journey. Please log in to access all available sessions.</p>
                <Link 
                  to="/login" 
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
                >
                  <svg className="-ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Log In to Continue
                </Link>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto bg-red-50/80 backdrop-blur-lg border border-red-200/50 rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-red-900 mb-3">Unable to Load Sessions</h3>
                <p className="text-red-700 text-lg">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && !error && isAuthenticated && (
            <>
              {computed.length === 0 ? (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="mb-8">
                      <div className="mx-auto h-20 w-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                        <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Sessions Available</h3>
                    <p className="text-gray-600 text-lg">Check back soon for new sessions or contact us for more information.</p>
                  </div>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  computed.length === 1 
                    ? 'grid-cols-1 max-w-md mx-auto' 
                    : computed.length === 2 
                    ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                    : computed.length === 3 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {computed.map((s) => {
                    const isFree = s.price === 0
                    return (
                      <div 
                        key={s.id} 
                        className="group relative bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-300 overflow-hidden transform hover:scale-105 h-auto"
                      >
                        {/* Status Badge - Only show if available */}
                        {s.openForRegistration && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg bg-gradient-to-r from-green-400 to-green-500 text-white">
                              Available
                            </span>
                          </div>
                        )}

                        {/* Image Section */}
                        {s.imageUrl ? (
                          <div className={`relative w-full overflow-hidden ${
                            computed.length === 1 ? 'h-64' : computed.length <= 3 ? 'h-48' : 'h-40'
                          }`}>
                            <img 
                              src={s.imageUrl} 
                              alt={s.title} 
                              className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>
                        ) : (
                          <div className={`w-full bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-500 flex items-center justify-center relative overflow-hidden ${
                            computed.length === 1 ? 'h-64' : computed.length <= 3 ? 'h-48' : 'h-40'
                          }`}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                            <svg className={`text-white/80 ${
                              computed.length === 1 ? 'h-16 w-16' : computed.length <= 3 ? 'h-14 w-14' : 'h-12 w-12'
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                          <Link 
                            to={`/sessions/${s.id}`}
                            className={`bg-white/90 backdrop-blur-sm text-gray-900 rounded-full font-semibold shadow-lg hover:bg-white transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 ${
                              computed.length === 1 ? 'px-8 py-3 text-base' : computed.length <= 3 ? 'px-6 py-2.5 text-sm' : 'px-4 py-2 text-sm'
                            }`}
                          >
                            View Details
                          </Link>
                        </div>

                        {/* Content Section */}
                        <div className={`${
                          computed.length === 1 ? 'p-8' : computed.length <= 3 ? 'p-6' : 'p-4'
                        }`}>
                          {/* Title */}
                          <h2 className={`font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-purple-700 transition-colors duration-300 ${
                            computed.length === 1 ? 'text-2xl' : computed.length <= 3 ? 'text-xl' : 'text-lg'
                          }`}>
                            {s.title}
                          </h2>
                          
                          {/* Description */}
                          {s.description && (
                            <p className={`text-gray-600 mb-4 line-clamp-2 leading-relaxed ${
                              computed.length === 1 ? 'text-base' : computed.length <= 3 ? 'text-sm' : 'text-xs'
                            }`}>
                              {s.description}
                            </p>
                          )}

                          {/* Session Details */}
                          <div className={`space-y-3 mb-6 ${
                            computed.length === 1 ? 'space-y-4' : 'space-y-3'
                          }`}>
                            {/* Date & Time */}
                            <div className={`flex items-center ${
                              computed.length === 1 ? 'text-base' : computed.length <= 3 ? 'text-sm' : 'text-xs'
                            }`}>
                              <svg className={`text-purple-500 mr-3 flex-shrink-0 ${
                                computed.length === 1 ? 'h-5 w-5' : computed.length <= 3 ? 'h-4 w-4' : 'h-3 w-3'
                              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <div>
                                {s.start ? (
                                  <>
                                    <span className="text-gray-900 font-medium">{formatDate(s.start)}</span>
                                    <span className="text-gray-500 ml-2">{formatTime(s.start)}</span>
                                  </>
                                ) : (
                                  <span className="text-gray-400">Date TBD</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Category */}
                            <div className={`flex items-center ${
                              computed.length === 1 ? 'text-base' : computed.length <= 3 ? 'text-sm' : 'text-xs'
                            }`}>
                              <svg className={`text-blue-500 mr-3 flex-shrink-0 ${
                                computed.length === 1 ? 'h-5 w-5' : computed.length <= 3 ? 'h-4 w-4' : 'h-3 w-3'
                              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              <span className="text-gray-700 font-medium">{s.category}</span>
                            </div>
                            
                            {/* Price */}
                            <div className={`flex items-center ${
                              computed.length === 1 ? 'text-base' : computed.length <= 3 ? 'text-sm' : 'text-xs'
                            }`}>
                              <svg className={`text-green-500 mr-3 flex-shrink-0 ${
                                computed.length === 1 ? 'h-5 w-5' : computed.length <= 3 ? 'h-4 w-4' : 'h-3 w-3'
                              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              <span className={`font-bold ${
                                isFree ? 'text-green-600' : 'text-gray-900'
                              }`}>
                                {isFree ? 'Free' : `₹${s.price.toLocaleString('en-IN')}`}
                              </span>
                            </div>
                          </div>

                          {/* Host & Spots - Without Profile Icon */}
                          <div className={`flex items-center justify-between pt-4 border-t border-gray-200/50 ${
                            computed.length === 1 ? 'pt-6' : 'pt-4'
                          }`}>
                            <div className="flex-1">
                              <div className={`font-semibold text-gray-900 truncate ${
                                computed.length === 1 ? 'text-base' : computed.length <= 3 ? 'text-sm' : 'text-xs'
                              }`}>
                                Guide: {s.host.name}
                              </div>
                              {s.host.title && (
                                <div className={`text-gray-500 truncate ${
                                  computed.length === 1 ? 'text-sm' : computed.length <= 3 ? 'text-xs' : 'text-xs'
                                }`}>
                                  {s.host.title}
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <div className={`text-gray-500 mb-1 ${
                                computed.length === 1 ? 'text-sm' : computed.length <= 3 ? 'text-xs' : 'text-xs'
                              }`}>Spots</div>
                              <div className={`font-bold px-3 py-1.5 rounded-full ${
                                s.spotsLeft <= 5 
                                  ? 'bg-orange-100 text-orange-600' 
                                  : 'bg-green-100 text-green-600'
                              } ${
                                computed.length === 1 ? 'text-base px-4 py-2' : computed.length <= 3 ? 'text-sm px-3 py-1.5' : 'text-xs px-2 py-1'
                              }`}>
                                {s.spotsLeft}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default SessionsPage


