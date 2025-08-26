import React, { useState } from 'react'
import { Button } from '../../../components/ui/Button'

const Settings = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const onSave = (e) => {
    e.preventDefault()
    alert('Settings saved (dummy)')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      <form className="rounded-xl border border-violet-200 bg-white p-6 grid gap-4 max-w-lg shadow" onSubmit={onSave}>
        <input className="rounded-xl border border-violet-200 px-3 py-2.5 focus:ring-violet-300 focus:border-violet-300" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="rounded-xl border border-violet-200 px-3 py-2.5 focus:ring-violet-300 focus:border-violet-300" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="rounded-xl border border-violet-200 px-3 py-2.5 focus:ring-violet-300 focus:border-violet-300" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <div>
          <Button type="submit" className="bg-violet-700 hover:bg-violet-800 text-white rounded-xl">Save</Button>
        </div>
      </form>
    </div>
  )
}

export default Settings


