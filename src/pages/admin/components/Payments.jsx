import React from 'react'

const payments = [
  { id: 1, user: 'Aarav Sharma', session: 'Energy Healing Basics', amount: '₹ 999', status: 'Paid' },
  { id: 2, user: 'Priya Patel', session: 'Meditation Sunday', amount: '₹ 0', status: 'Pending' },
  { id: 3, user: 'Rahul Verma', session: 'Healing Intensive', amount: '₹ 1,499', status: 'Paid' }
]

const Payments = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Payments</h2>
      <div className="rounded-xl border border-violet-200 bg-white overflow-hidden shadow">
        <table className="w-full text-sm">
          <thead className="bg-violet-50">
            <tr className="text-left text-gray-800">
              <th className="px-4 py-2 text-black">User</th>
              <th className="px-4 py-2 text-black">Session</th>
              <th className="px-4 py-2 text-black">Amount</th>
              <th className="px-4 py-2 text-black">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, idx) => (
              <tr key={p.id} className={idx % 2 ? 'bg-white' : 'bg-violet-50/50'}>
                <td className="px-4 py-2 font-medium text-gray-900">{p.user}</td>
                <td className="px-4 py-2 text-gray-700">{p.session}</td>
                <td className="px-4 py-2 text-gray-700">{p.amount}</td>
                <td className="px-4 py-2 text-gray-700">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Payments


