import { useState, useEffect } from 'react'
import { getMedicineRequests, updateMedicineRequestStatus, deleteMedicineRequest, getMedicines } from '../services/api'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { toast } from '../components/Toast'

export default function AdminRequests() {
  const [requests, setRequests] = useState([])
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = async () => {
    const [rRes, mRes] = await Promise.all([getMedicineRequests(), getMedicines()])
    setRequests(rRes.data)
    setMedicines(mRes.data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const getMedName = (id) => medicines.find(m => m.id === id)?.name || `Medicine #${id}`
  const getMedPrice = (id) => medicines.find(m => m.id === id)?.price || 0

  const handleStatus = async (id, status) => {
    try {
      await updateMedicineRequestStatus(id, status)
      toast(`Request ${status}`)
      load()
    } catch {
      toast('Update failed', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this request?')) return
    try {
      await deleteMedicineRequest(id)
      toast('Request deleted')
      load()
    } catch {
      toast('Delete failed', 'error')
    }
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  if (loading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-800 mb-1">Medicine Requests</h1>
          <p className="text-slate-500">{requests.length} total requests</p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === s ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">📦</div>
          <p>No medicine requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(r => (
            <div key={r.id} className="card hover:shadow-md transition-all">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-800">{getMedName(r.medicine_id)}</h3>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                    <div>
                      <span className="text-slate-400 text-xs uppercase tracking-wide">Patient</span>
                      <p className="font-medium text-slate-700">{r.user_name}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs uppercase tracking-wide">Contact</span>
                      <p className="font-medium text-slate-700">{r.contact}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs uppercase tracking-wide">Qty</span>
                      <p className="font-medium text-slate-700">{r.quantity}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs uppercase tracking-wide">Total</span>
                      <p className="font-medium text-blue-700">₹{(getMedPrice(r.medicine_id) * r.quantity).toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs uppercase tracking-wide">Date</span>
                      <p className="font-medium text-slate-700">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                  </div>
                  {r.notes && (
                    <div className="mt-2 text-sm text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                      📝 {r.notes}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {r.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatus(r.id, 'approved')} className="btn-success text-sm">✓ Approve</button>
                      <button onClick={() => handleStatus(r.id, 'rejected')} className="btn-danger text-sm">✗ Reject</button>
                    </>
                  )}
                  {r.status !== 'pending' && (
                    <button
                      onClick={() => handleStatus(r.id, 'pending')}
                      className="px-3 py-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100"
                    >
                      Reset
                    </button>
                  )}
                  <button onClick={() => handleDelete(r.id)} className="px-3 py-1.5 text-xs text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
