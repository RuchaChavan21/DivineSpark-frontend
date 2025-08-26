import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../../components/ui/Button'

const initialSessions = [
  { id: 1, title: 'Meditation Sunday', description: 'Guided meditation', datetime: '2025-09-01 10:00', type: 'Free', zoom: 'https://zoom.us/j/abc' },
  { id: 2, title: 'Energy Healing Basics', description: 'Intro workshop', datetime: '2025-09-05 18:30', type: 'Paid', zoom: 'https://zoom.us/j/def' }
]

const ManageSessions = () => {
  const [sessions, setSessions] = useState(initialSessions)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', datetime: '', type: 'Free', zoom: '' })

  const onSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setSessions(sessions.map(s => s.id === editingId ? { ...s, ...form } : s))
    } else {
      const next = { id: Date.now(), ...form }
      setSessions([next, ...sessions])
    }
    setForm({ title: '', description: '', datetime: '', type: 'Free', zoom: '' })
    setEditingId(null)
    setIsOpen(false)
  }

  const onDelete = (id) => setSessions(sessions.filter(s => s.id !== id))
  const onEdit = (session) => {
    setEditingId(session.id)
    setForm({ title: session.title, description: session.description, datetime: session.datetime, type: session.type, zoom: session.zoom })
    setIsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Manage Sessions</h2>
        <Button className="bg-violet-700 hover:bg-violet-800 text-white rounded-xl" onClick={() => setIsOpen(true)}>Create New Session</Button>
      </div>

      <div className="rounded-xl border border-violet-200 bg-white overflow-hidden shadow">
        <table className="w-full text-sm">
          <thead className="bg-violet-50">
            <tr className="text-left text-gray-800">
              <th className="px-4 py-2 text-black">Title</th>
              <th className="px-4 py-2 text-black">Description</th>
              <th className="px-4 py-2 text-black">Date/Time</th>
              <th className="px-4 py-2 text-black">Type</th>
              <th className="px-4 py-2 text-black">Zoom Link</th>
              <th className="px-4 py-2 text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, idx) => (
              <tr key={s.id} className={idx % 2 ? 'bg-white' : 'bg-violet-50/50'}>
                <td className="px-4 py-2 font-medium text-gray-900">{s.title}</td>
                <td className="px-4 py-2 text-gray-700">{s.description}</td>
                <td className="px-4 py-2 text-gray-700">{s.datetime}</td>
                <td className="px-4 py-2 text-gray-700">{s.type}</td>
                <td className="px-4 py-2 text-violet-700 truncate max-w-[160px]">{s.zoom}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3">
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
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl border border-gray-200">Cancel</button>
                  <Button type="submit" className="bg-violet-700 hover:bg-violet-800 text-white rounded-xl">{editingId ? 'Save Changes' : 'Create'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageSessions


