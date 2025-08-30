import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../../components/ui/Button'

const initialSessions = [
  { id: 1, title: 'Meditation Sunday', description: 'Guided meditation', datetime: '2025-09-01 10:00', type: 'Free', zoom: 'https://zoom.us/j/abc', thumbnail: '' },
  { id: 2, title: 'Energy Healing Basics', description: 'Intro workshop', datetime: '2025-09-05 18:30', type: 'Paid', zoom: 'https://zoom.us/j/def', thumbnail: '' }
]

const ManageSessions = () => {
  const [sessions, setSessions] = useState(initialSessions)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', datetime: '', type: 'Free', zoom: '', thumbnail: '' })
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  // Mock registrants mapped by session id for demo purposes
  const registrantsBySession = useMemo(() => ({
    1: [
      { id: 11, name: 'Aarav Sharma', email: 'aarav@example.com', bookedAt: '2025-08-20 09:10' },
      { id: 12, name: 'Priya Patel', email: 'priya@example.com', bookedAt: '2025-08-21 15:42' },
      { id: 13, name: 'Rahul Verma', email: 'rahul@example.com', bookedAt: '2025-08-22 18:05' }
    ],
    2: [
      { id: 21, name: 'Sneha Iyer', email: 'sneha@example.com', bookedAt: '2025-08-23 11:25' },
      { id: 22, name: 'Ankit Kumar', email: 'ankit@example.com', bookedAt: '2025-08-24 13:37' }
    ]
  }), [])

  const onSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setSessions(sessions.map(s => s.id === editingId ? { ...s, ...form } : s))
    } else {
      const next = { id: Date.now(), ...form }
      setSessions([next, ...sessions])
    }
    setForm({ title: '', description: '', datetime: '', type: 'Free', zoom: '', thumbnail: '' })
    setEditingId(null)
    setIsOpen(false)
  }

  const onDelete = (id) => setSessions(sessions.filter(s => s.id !== id))
  const onEdit = (session) => {
    setEditingId(session.id)
    setForm({ title: session.title, description: session.description, datetime: session.datetime, type: session.type, zoom: session.zoom, thumbnail: session.thumbnail || '' })
    setIsOpen(true)
  }

  const openDetails = (id) => {
    setSelectedId(id)
    setDetailOpen(true)
  }

  const selectedSession = useMemo(() => sessions.find(s => s.id === selectedId) || null, [selectedId, sessions])
  const selectedRegistrants = useMemo(() => registrantsBySession[selectedId] || [], [registrantsBySession, selectedId])

  const downloadCsv = () => {
    if (!selectedSession) return
    const headers = ['Name', 'Email', 'Booked At', 'Session Title']
    const rows = selectedRegistrants.map(r => [r.name, r.email, r.bookedAt, selectedSession.title])
    const csvContent = [headers, ...rows].map(cols => cols.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${selectedSession.title.replace(/\s+/g, '_')}_registrants.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Manage Sessions</h2>
          <p className="text-sm text-gray-500">Create, edit, and view registrations for each session.</p>
        </div>
        <Button className="bg-violet-700 hover:bg-violet-800 text-white rounded-xl" onClick={() => setIsOpen(true)}>Create New Session</Button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow">
        <table className="w-full text-sm">
          <thead className="bg-violet-50">
            <tr className="text-left text-gray-800">
              <th className="px-4 py-2 text-black">Thumbnail</th>
              <th className="px-4 py-2 text-black">Title</th>
              <th className="px-4 py-2 text-black">Description</th>
              <th className="px-4 py-2 text-black">Date/Time</th>
              <th className="px-4 py-2 text-black">Type</th>
              <th className="px-4 py-2 text-black">Zoom Link</th>
              <th className="px-4 py-2 text-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, idx) => (
              <tr key={s.id} className={idx % 2 ? 'bg-white' : 'bg-violet-50/50'}>
                <td className="px-4 py-2">
                  {s.thumbnail ? (
                    <img src={s.thumbnail} alt={s.title} className="h-10 w-10 rounded-md object-cover border border-gray-200" />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] text-gray-500">No Img</div>
                  )}
                </td>
                <td className="px-4 py-2 font-medium text-gray-900">{s.title}</td>
                <td className="px-4 py-2 text-gray-700">{s.description}</td>
                <td className="px-4 py-2 text-gray-700">{s.datetime}</td>
                <td className="px-4 py-2 text-gray-700">{s.type}</td>
                <td className="px-4 py-2 text-violet-700 truncate max-w-[160px]">{s.zoom}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3 justify-end">
                    <button className="text-violet-700 hover:underline" onClick={() => openDetails(s.id)}>View Registrants</button>
                    <span className="text-gray-300">|</span>
                    <button className="text-violet-700 hover:underline" onClick={() => onEdit(s)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => onDelete(s.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-lg rounded-2xl border border-violet-200 bg-white shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Session' : 'Create Session'}</h3>
                <button className="text-gray-500" onClick={() => setIsOpen(false)}>Close</button>
              </div>
              <form className="grid grid-cols-1 gap-4" onSubmit={onSubmit}>
                <input className="rounded-xl border border-violet-200 px-3 py-2.5 focus:ring-violet-300 focus:border-violet-300" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <textarea className="rounded-xl border border-violet-200 px-3 py-2.5 h-24 focus:ring-violet-300 focus:border-violet-300" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <input className="rounded-xl border border-violet-200 px-3 py-2.5 focus:ring-violet-300 focus:border-violet-300" type="datetime-local" value={form.datetime} onChange={(e) => setForm({ ...form, datetime: e.target.value })} />
                <select className="rounded-xl border border-violet-200 px-3 py-2.5 focus:ring-violet-300 focus:border-violet-300" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                </select>
                <input className="rounded-xl border border-violet-200 px-3 py-2.5 focus:ring-violet-300 focus:border-violet-300" placeholder="Zoom Link" value={form.zoom} onChange={(e) => setForm({ ...form, zoom: e.target.value })} />
                {/* Thumbnail uploader */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Thumbnail</label>
                  {form.thumbnail ? (
                    <div className="flex items-center gap-3">
                      <img src={form.thumbnail} alt="thumbnail" className="h-16 w-16 rounded-md object-cover border border-gray-200" />
                      <button type="button" onClick={() => setForm({ ...form, thumbnail: '' })} className="text-sm text-red-600 hover:underline">Remove</button>
                    </div>
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = (ev) => {
                        setForm(prev => ({ ...prev, thumbnail: String(ev.target?.result || '') }))
                      }
                      reader.readAsDataURL(file)
                    }}
                    className="rounded-xl border border-violet-200 px-3 py-2.5 focus:ring-violet-300 focus:border-violet-300 bg-white"
                  />
                  <p className="text-xs text-gray-500">PNG/JPG up to ~2MB. Shown as session thumbnail.</p>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl border border-gray-200">Cancel</button>
                  <Button type="submit" className="bg-violet-700 hover:bg-violet-800 text-white rounded-xl">{editingId ? 'Save Changes' : 'Create'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session detail / registrants drawer */}
      <AnimatePresence>
        {detailOpen && selectedSession && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-start justify-end">
            <motion.aside initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }} className="h-full w-full max-w-xl bg-white shadow-2xl border-l border-gray-200 p-6 overflow-y-auto">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedSession.title}</h3>
                  <p className="text-sm text-gray-500">{selectedSession.description}</p>
                  <p className="text-sm text-gray-500">{selectedSession.datetime} • {selectedSession.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={downloadCsv} className="bg-violet-700 hover:bg-violet-800 text-white rounded-xl">Download CSV</Button>
                  <button className="text-gray-500" onClick={() => setDetailOpen(false)}>Close</button>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="px-4 py-3 bg-violet-50 text-sm font-medium text-gray-800 flex items-center justify-between">
                  <span>Registrants</span>
                  <span className="text-gray-500">Total: {selectedRegistrants.length}</span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-800">
                      <th className="px-4 py-2 text-black">Name</th>
                      <th className="px-4 py-2 text-black">Email</th>
                      <th className="px-4 py-2 text-black">Booked At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRegistrants.map((r, idx) => (
                      <tr key={r.id} className={idx % 2 ? 'bg-white' : 'bg-violet-50/50'}>
                        <td className="px-4 py-2 font-medium text-gray-900">{r.name}</td>
                        <td className="px-4 py-2 text-gray-700">{r.email}</td>
                        <td className="px-4 py-2 text-gray-700">{r.bookedAt}</td>
                      </tr>
                    ))}
                    {selectedRegistrants.length === 0 && (
                      <tr>
                        <td className="px-4 py-6 text-center text-gray-500" colSpan={3}>No registrants yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageSessions


