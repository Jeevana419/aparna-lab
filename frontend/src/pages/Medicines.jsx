import { useState, useEffect } from 'react'
import { getMedicines, createMedicineRequest } from '../services/api'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal'
import { toast } from '../components/Toast'

export default function Medicines() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ user_name: '', contact: '', quantity: 1, notes: '' })
  const [prescriptionImage, setPrescriptionImage] = useState(null)
  const [prescriptionPreview, setPrescriptionPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getMedicines()
      .then(r => setMedicines(r.data))
      .catch(() => toast('Failed to load medicines', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.description || '').toLowerCase().includes(search.toLowerCase())
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

  const handleRequest = async (e) => {
    e.preventDefault()
    if (!form.user_name.trim() || !form.contact.trim()) {
      toast('Please fill all required fields', 'error'); return
    }
    if (form.quantity < 1) { toast('Quantity must be at least 1', 'error'); return }
    setSubmitting(true)
    try {
      await createMedicineRequest({ ...form, medicine_id: selected.id, quantity: Number(form.quantity), prescription_image: prescriptionImage || null })
      toast('Medicine request submitted! We will contact you soon.')
      setSelected(null)
      setForm({ user_name: '', contact: '', quantity: 1, notes: '' })
      setPrescriptionImage(null)
      setPrescriptionPreview(null)
    } catch {
      toast('Request failed. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-slate-800 mb-2">Medicines</h1>
        <p className="text-slate-500">Browse our medicine catalog and place a request.</p>
      </div>

      <div className="relative mb-8 max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          className="input pl-9"
          placeholder="Search medicines..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">💊</div>
          <p>No medicines found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(med => (
            <div key={med.id} className={`card hover:shadow-md transition-all duration-200 group ${med.stock === 0 ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">💊</div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-700">₹{med.price.toFixed(2)}</span>
                  <div className={`text-xs mt-0.5 font-medium ${med.stock > 10 ? 'text-emerald-600' : med.stock > 0 ? 'text-amber-600' : 'text-red-500'}`}>
                    {med.stock > 0 ? `${med.stock} in stock` : 'Out of stock'}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 text-lg mb-2 group-hover:text-blue-700 transition-colors">{med.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{med.description || 'No description available.'}</p>
              <button
                onClick={() => med.stock > 0 && setSelected(med)}
                disabled={med.stock === 0}
                className={`w-full text-center text-sm py-2.5 rounded-lg font-medium transition-all ${
                  med.stock > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {med.stock > 0 ? 'Request Medicine' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setPrescriptionImage(null); setPrescriptionPreview(null) }} title="Request Medicine">
        {selected && (
          <div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
              <p className="font-semibold text-blue-800">{selected.name}</p>
              <p className="text-blue-600 font-bold mt-1">₹{selected.price.toFixed(2)} per unit</p>
              <p className="text-blue-400 text-xs mt-1">{selected.stock} units available</p>
            </div>
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <input className="input" placeholder="Your full name" value={form.user_name}
                  onChange={e => setForm({ ...form, user_name: e.target.value })} required />
              </div>
              <div>
                <label className="label">Contact *</label>
                <input className="input" placeholder="Phone or email" value={form.contact}
                  onChange={e => setForm({ ...form, contact: e.target.value })} required />
              </div>
              <div>
                <label className="label">Quantity *</label>
                <input type="number" min="1" max={selected.stock} className="input" value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })} required />
              </div>
              <div>
                <label className="label">Notes / Prescription</label>
                <textarea className="input resize-none" rows={3} placeholder="Mention doctor's prescription or any notes..."
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>

              {/* ── NEW: Prescription Image Upload ─────────────────────── */}
              <div>
                <label className="label">Prescription Image <span className="text-slate-400 font-normal">(optional)</span></label>
                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-blue-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
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
                <button type="button" className="btn-secondary flex-1" onClick={() => { setSelected(null); setPrescriptionImage(null); setPrescriptionPreview(null) }}>Cancel</button>
                <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}
