import React, { useMemo, useState } from 'react'

// Mock sessions and users with a sessionId for filtering
const sessions = [
  { id: 1, title: 'Meditation Sunday' },
  { id: 2, title: 'Energy Healing Basics' }
]

const users = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav@example.com', sessionId: 1, status: 'Active' },
  { id: 2, name: 'Priya Patel', email: 'priya@example.com', sessionId: 2, status: 'Pending' },
  { id: 3, name: 'Rahul Verma', email: 'rahul@example.com', sessionId: 1, status: 'Active' }
]

const RegisteredUsers = () => {
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id || 1)

  const filteredUsers = useMemo(
    () => users.filter(u => u.sessionId === selectedSessionId),
    [selectedSessionId]
  )

  const selectedSessionTitle = useMemo(
    () => sessions.find(s => s.id === selectedSessionId)?.title || 'Session',
    [selectedSessionId]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Registered Users</h2>
          <p className="text-sm text-gray-500">Showing users for: {selectedSessionTitle}</p>
        </div>
        <div className="grid gap-1">
          <label className="text-xs text-gray-500">Select session</label>
          <select
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm bg-white"
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(Number(e.target.value))}
          >
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-violet-200 bg-white overflow-hidden shadow">
        <div className="px-4 py-3 bg-violet-50 text-sm text-gray-700 flex items-center justify-between">
          <span>Users registered for {selectedSessionTitle}</span>
          <span className="text-gray-500">Total: {filteredUsers.length}</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-white">
            <tr className="text-left text-gray-800">
              <th className="px-4 py-2 text-black">Name</th>
              <th className="px-4 py-2 text-black">Email</th>
              <th className="px-4 py-2 text-black">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, idx) => (
              <tr key={u.id} className={idx % 2 ? 'bg-white' : 'bg-violet-50/50'}>
                <td className="px-4 py-2 font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-2 text-gray-700">{u.email}</td>
                <td className="px-4 py-2 text-gray-700">{u.status}</td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={3}>No users registered for this session.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RegisteredUsers


