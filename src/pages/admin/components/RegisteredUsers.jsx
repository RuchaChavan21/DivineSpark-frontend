import React from 'react'

const users = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav@example.com', session: 'Meditation Sunday', status: 'Active' },
  { id: 2, name: 'Priya Patel', email: 'priya@example.com', session: 'Energy Healing Basics', status: 'Pending' },
  { id: 3, name: 'Rahul Verma', email: 'rahul@example.com', session: 'Meditation Sunday', status: 'Active' }
]

const RegisteredUsers = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Registered Users</h2>
      <div className="rounded-xl border border-violet-200 bg-white overflow-hidden shadow">
        <table className="w-full text-sm">
          <thead className="bg-violet-50">
            <tr className="text-left text-gray-800">
              <th className="px-4 py-2 text-black">Name</th>
              <th className="px-4 py-2 text-black">Email</th>
              <th className="px-4 py-2 text-black">Session Booked</th>
              <th className="px-4 py-2 text-black">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u.id} className={idx % 2 ? 'bg-white' : 'bg-violet-50/50'}>
                <td className="px-4 py-2 font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-2 text-gray-700">{u.email}</td>
                <td className="px-4 py-2 text-gray-700">{u.session}</td>
                <td className="px-4 py-2 text-gray-700">{u.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RegisteredUsers


