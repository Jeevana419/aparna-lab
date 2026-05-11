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
  const [prescriptionImage, setPrescriptionImage] = useState(null)
  const [prescriptionPreview, setPrescriptionPreview] = useState(null)
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

  // ── NEW: handle prescription image selection ──────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast('Please select a valid image file', 'error'); return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPrescriptionImage(ev.target.result)
      setPrescriptionPreview(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleBook = async (e) => {
    e.preventDefault()
    if (!form.user_name.trim() || !form.contact.trim()) {
      toast('Please fill all required fields', 'error'); return
    }
    setSubmitting(true)
    try {
      // prescription_image is sent as base64; backend stores it if it accepts the field
      await createBooking({ ...form, test_id: selectedTest.id, prescription_image: prescriptionImage || null })
      toast('Test booked successfully! We will contact you soon.')
      setSelectedTest(null)
      setForm({ user_name: '', contact: '', notes: '' })
      setPrescriptionImage(null)
      setPrescriptionPreview(null)
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
      <Modal isOpen={!!selectedTest} onClose={() => { setSelectedTest(null); setPrescriptionImage(null); setPrescriptionPreview(null) }} title="Book Lab Test">
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

              {/* ── NEW: Prescription Image Upload ─────────────────────── */}
              <div>
                <label className="label">Prescription Image <span className="text-slate-400 font-normal">(optional)</span></label>
                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-teal-200 rounded-xl p-4 cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors">
                  {prescriptionPreview ? (
                    <img src={prescriptionPreview} alt="Prescription preview" className="max-h-40 rounded-lg object-contain" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <span className="text-3xl mb-1">📄</span>
                      <span className="text-sm">Click to upload prescription image</span>
                      <span className="text-xs mt-0.5">JPG, PNG, WEBP supported</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                {prescriptionPreview && (
                  <button
                    type="button"
                    className="mt-1 text-xs text-red-500 hover:text-red-700"
                    onClick={() => { setPrescriptionImage(null); setPrescriptionPreview(null) }}
                  >
                    Remove image
                  </button>
                )}
              </div>
              {/* ─────────────────────────────────────────────────────────── */}

              <div className="flex gap-3 pt-2">
                <button type="button" className="btn-secondary flex-1" onClick={() => { setSelectedTest(null); setPrescriptionImage(null); setPrescriptionPreview(null) }}>Cancel</button>
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
