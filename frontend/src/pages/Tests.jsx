import { useState, useEffect } from 'react'
import { getTests } from '../services/api'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal'
import { createBooking } from '../services/api'
import { toast } from '../components/Toast'

export default function Tests() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTest, setSelectedTest] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ user_name: '', contact: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getTests()
      .then(r => setTests(r.data))
      .catch(() => toast('Failed to load tests', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = tests.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleBook = async (e) => {
    e.preventDefault()
    if (!form.user_name.trim() || !form.contact.trim()) {
      toast('Please fill all required fields', 'error'); return
    }
    setSubmitting(true)
    try {
      await createBooking({ ...form, test_id: selectedTest.id })
      toast('Test booked successfully! We will contact you soon.')
      setSelectedTest(null)
      setForm({ user_name: '', contact: '', notes: '' })
    } catch {
      toast('Booking failed. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-slate-800 mb-2">Lab Tests</h1>
        <p className="text-slate-500">Browse and book diagnostic tests. Results delivered with care.</p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          className="input pl-9"
          placeholder="Search tests..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tests Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">🧪</div>
          <p>No tests found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(test => (
            <div key={test.id} className="card hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-xl">🧬</div>
                <span className="text-lg font-bold text-teal-700">₹{test.price.toFixed(2)}</span>
              </div>
              <h3 className="font-semibold text-slate-800 text-lg mb-2 group-hover:text-teal-700 transition-colors">{test.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{test.description || 'No description available.'}</p>
              <button
                onClick={() => setSelectedTest(test)}
                className="btn-primary w-full text-center text-sm"
              >
                Book This Test
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <Modal isOpen={!!selectedTest} onClose={() => setSelectedTest(null)} title="Book Lab Test">
        {selectedTest && (
          <div>
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-5">
              <p className="font-semibold text-teal-800">{selectedTest.name}</p>
              <p className="text-teal-600 font-bold mt-1">₹{selectedTest.price.toFixed(2)}</p>
            </div>
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <input className="input" placeholder="Your full name" value={form.user_name}
                  onChange={e => setForm({ ...form, user_name: e.target.value })} required />
              </div>
              <div>
                <label className="label">Contact Number *</label>
                <input className="input" placeholder="Phone number or email" value={form.contact}
                  onChange={e => setForm({ ...form, contact: e.target.value })} required />
              </div>
              <div>
                <label className="label">Additional Notes</label>
                <textarea className="input resize-none" rows={3} placeholder="Any special requirements..." value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="btn-secondary flex-1" onClick={() => setSelectedTest(null)}>Cancel</button>
                <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}
