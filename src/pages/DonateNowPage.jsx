import React, { useState } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { donationsAPI } from '../utils/api'

const ensureRazorpayLoaded = () => new Promise((resolve, reject) => {
  if (window.Razorpay) return resolve()
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = resolve
  script.onerror = () => reject(new Error('Failed to load Razorpay'))
  document.body.appendChild(script)
})

const DonateNowPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    amount: '',
    towards: [],
  })
  const [customCause, setCustomCause] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleTowards = (value) => {
    setForm((prev) => {
      const exists = prev.towards.includes(value)
      return { ...prev, towards: exists ? prev.towards.filter((c) => c !== value) : [...prev.towards, value] }
    })
  }

  const startDonation = async (e) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!form.firstName || !form.lastName || !form.email || !form.amount) {
      setError('Please fill all required fields (First name, Last name, Email, Amount).')
      return
    }

    const amountNumber = Number(form.amount)
    if (!amountNumber || amountNumber <= 0) {
      setError('Please enter a valid amount greater than 0.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        // Send as string with 2 decimals for BigDecimal compatibility
        amount: amountNumber.toFixed(2),
        towards: form.towards,
      }
      
      // Backend base is /api/donations -> use create-order
      const { data } = await donationsAPI.createOrder(payload)
      // Expected fields: orderId, amount (in paise), currency, key (razorpay key), donationId
      const orderId = data?.orderId || data?.id
      // Some backends may echo rupees; if so, convert to paise
      let amount = data?.amount
      if (amount && amount < 1000 && amountNumber >= 1 && amount < amountNumber * 100) {
        // Likely rupees; convert to paise
        amount = Math.round(Number(amount) * 100)
      }
      const currency = data?.currency || 'INR'
      const key = data?.key || data?.keyId || (import.meta?.env?.VITE_RAZORPAY_KEY_ID || '')

      if (!orderId || !amount || !key) {
        throw new Error('Invalid order details from server.')
      }

      await ensureRazorpayLoaded()

      const options = {
        key,
        amount,
        currency,
        name: 'DivineSpark',
        description: 'Donation',
        order_id: orderId,
        prefill: { name: `${form.firstName} ${form.lastName}`.trim(), email: form.email, contact: form.phone },
        theme: { color: '#6D28D9' },
        handler: async function (response) {
          try {
            const paymentId = response?.razorpay_payment_id
            const orderIdResp = response?.razorpay_order_id || orderId
            const signature = response?.razorpay_signature
            // Verify signature via /api/donations/verify-payment
            await donationsAPI.verifyPayment({
              razorpay_order_id: orderIdResp,
              razorpay_payment_id: paymentId,
              razorpay_signature: signature,
            })
            if (window.toast?.success) window.toast.success('Thank you for your donation!')
          } catch (err) {
            console.error('Donation confirmation failed', err)
            if (window.toast?.error) window.toast.error('Donation confirmed failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: function () {
            if (window.toast?.info) window.toast.info('Donation payment cancelled.')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error('Failed to start donation', err)
      setError(err?.response?.data?.message || err.message || 'Failed to start donation.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Donate to DivineSpark</h1>
        <p className="text-gray-600 mb-8">Enter your details and amount. You'll be redirected to Razorpay to complete the donation.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}

        <form onSubmit={startDonation} className="space-y-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input type="text" value={form.firstName} onChange={(e)=>setForm({...form, firstName:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input type="text" value={form.lastName} onChange={(e)=>setForm({...form, lastName:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (INR) *</label>
            <input type="number" min="1" step="1" value={form.amount} onChange={(e)=>setForm({...form, amount:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Donate Towards (optional)</label>
            <div className="flex flex-wrap gap-3">
              {['Free Sessions', 'Guide Support', 'Platform Development', 'Community Outreach'].map((c)=> (
                <label key={c} className={`px-3 py-1.5 rounded-full border cursor-pointer text-sm ${form.towards.includes(c) ? 'bg-violet-100 border-violet-300 text-violet-800' : 'bg-white border-gray-300 text-gray-700'}`}>
                  <input type="checkbox" className="hidden" checked={form.towards.includes(c)} onChange={()=>toggleTowards(c)} />
                  {c}
                </label>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input type="text" value={customCause} onChange={(e)=>setCustomCause(e.target.value)} placeholder="Custom cause" className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
              <button type="button" onClick={()=>{ if(customCause.trim()){ toggleTowards(customCause.trim()); setCustomCause('') } }} className="px-4 py-2 bg-gray-800 text-white rounded-lg">Add</button>
            </div>
          </div>

          <button type="submit" disabled={loading} className={`w-full py-3 px-4 rounded-xl font-semibold text-white ${loading ? 'bg-gray-400' : 'bg-violet-700 hover:bg-violet-800'} transition-colors`}>
            {loading ? 'Processing...' : 'Proceed to Pay'}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  )
}

export default DonateNowPage
