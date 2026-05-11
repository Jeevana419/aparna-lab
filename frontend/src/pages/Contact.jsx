import { useState } from 'react'
import { sendMessage } from '../services/api'
import { toast } from '../components/Toast'

export default function Contact() {
  const [form, setForm] = useState({ sender_name: '', contact: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.sender_name.trim() || !form.contact.trim() || !form.message.trim()) {
      toast('Please fill all fields', 'error'); return
    }
    setSubmitting(true)
    try {
      await sendMessage(form)
      setSent(true)
      toast('Message sent! We\'ll get back to you soon.')
    } catch {
      toast('Failed to send message. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="card">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="font-display text-3xl font-bold text-slate-800 mb-3">Message Sent!</h2>
          <p className="text-slate-500 mb-6">Thank you for contacting us. Our team will review your message and get back to you at <strong>{form.contact}</strong>.</p>
          <button onClick={() => { setSent(false); setForm({ sender_name: '', contact: '', message: '' }) }} className="btn-primary">
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-slate-800 mb-2">Contact Us</h1>
        <p className="text-slate-500">Have a question or need help? We're here for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Info */}
        <div className="space-y-6">
          <div className="card bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100">
            <h2 className="font-display text-2xl font-bold text-teal-800 mb-4">Get In Touch</h2>
            <p className="text-teal-700 mb-6">Send us a message and we'll respond as soon as possible. Our team is available during working hours.</p>
            {[
              { icon: '📍', label: 'Address', val: 'Vinukonda Road, Kurichedu, Prakasam District' },
              { icon: '📞', label: 'Phone', val: '90147 86264 | 90007 61921' },
              { icon: '🏥', label: 'Services', val: 'All blood, urine, stool tests & X-rays' },
              { icon: '🕐', label: 'Hours', val: '24 Hours Service Available, 7 Days a Week' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3 mb-4">
                <span className="text-xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-xs font-medium text-teal-500 uppercase tracking-wide">{item.label}</p>
                  <p className="text-teal-800 text-sm mt-0.5">{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <h2 className="font-display text-2xl font-bold text-slate-800 mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Your Name *</label>
              <input className="input" placeholder="Full name" value={form.sender_name}
                onChange={e => setForm({ ...form, sender_name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Contact (Phone / Email) *</label>
              <input className="input" placeholder="How can we reach you?" value={form.contact}
                onChange={e => setForm({ ...form, contact: e.target.value })} required />
            </div>
            <div>
              <label className="label">Message *</label>
              <textarea
                className="input resize-none"
                rows={5}
                placeholder="Type your message here..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? 'Sending...' : '✉️ Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
