import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { getSessionById, formatCurrency, formatDate, formatTime } from '../data/mockData'

const SessionDetailPage = () => {
  const { id } = useParams()
  const session = getSessionById(id)

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-2xl font-semibold text-gray-900">Session not found</h1>
          <p className="text-gray-600 mt-2">The session you are looking for does not exist.</p>
          <Link to="/sessions" className="text-primary-600 mt-4 inline-block">Back to sessions</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const isFree = !session.isPaid || session.price === 0
  const spotsLeft = Math.max(0, session.maxAttendees - session.currentAttendees)
  const isOnline = !!session.zoomLink

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/sessions" className="text-sm text-primary-600">← Back to sessions</Link>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-semibold text-gray-900">{session.title}</h1>
            <p className="text-gray-700 mt-3">{session.description}</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs text-gray-500">Guide</div>
                <div className="mt-1 flex items-center gap-3">
                  <img src={session.host.avatar} alt={session.host.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-gray-900 font-medium">{session.host.name}</div>
                    <div className="text-xs text-gray-500">{session.host.title}</div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs text-gray-500">Category</div>
                <div className="mt-1 text-gray-900">{session.category}</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs text-gray-500">Schedule</div>
                <div className="mt-1 text-gray-900">{formatDate(session.date)} · {formatTime(session.time)} · {session.duration} minutes</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs text-gray-500">Type</div>
                <div className="mt-1 text-gray-900">{isOnline ? 'Online' : 'Offline'}</div>
                {isOnline && (
                  <div className="text-xs text-gray-600 mt-1 break-all">Zoom: {session.zoomLink}</div>
                )}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 p-5 sticky top-6">
              <div className="text-2xl font-semibold text-gray-900">{isFree ? 'Free' : formatCurrency(session.price)}</div>
              <div className="text-sm text-gray-600 mt-1">Capacity: {session.maxAttendees} · {spotsLeft} spots left</div>
              <div className="text-sm mt-1">
                <span className={`px-2 py-1 rounded-full text-xs ${session.isUpcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{session.isUpcoming ? 'Active' : 'Inactive'}</span>
              </div>

              <button className="mt-5 w-full bg-primary-600 hover:bg-primary-700 text-white rounded-md py-2.5 font-medium disabled:opacity-50" disabled={!session.isUpcoming || spotsLeft === 0}>
                {session.isUpcoming ? (spotsLeft === 0 ? 'Full' : 'Book Session') : 'Not Active'}
              </button>

              <div className="mt-4 text-xs text-gray-500">Auto-tracked: created and updated timestamps are kept server-side.</div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SessionDetailPage


