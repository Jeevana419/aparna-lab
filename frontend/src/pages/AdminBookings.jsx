import { useState, useEffect } from 'react'
import { getBookings, updateBookingStatus, deleteBooking, getTests } from '../services/api'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { toast } from '../components/Toast'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = async () => {
    const [bRes, tRes] = await Promise.all([getBookings(), getTests()])
    setBookings(bRes.data)
    setTests(tRes.data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const getTestName = (id) => tests.find(t => t.id === id)?.name || `Test #${id}`

  const handleStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status)
      toast(`Booking ${status}`)
      load()
    } catch {
      toast('Update failed', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this booking?')) return
    try {
      await deleteBooking(id)
      toast('Booking deleted')
      load()
    } catch {
      toast('Delete failed', 'error')
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  if (loading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-800 mb-1">Lab Test Bookings</h1>
          <p className="text-slate-500">{bookings.length} total bookings</p>
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
          <div className="text-5xl mb-3">📋</div>
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => (
            <div key={b.id} className="card hover:shadow-md transition-all">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-800">{getTestName(b.test_id)}</h3>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-slate-400 text-xs uppercase tracking-wide">Patient</span>
                      <p className="font-medium text-slate-700">{b.user_name}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs uppercase tracking-wide">Contact</span>
                      <p className="font-medium text-slate-700">{b.contact}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs uppercase tracking-wide">Date</span>
                      <p className="font-medium text-slate-700">
                        {b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                    {b.notes && (
                      <div>
                        <span className="text-slate-400 text-xs uppercase tracking-wide">Notes</span>
                        <p className="text-slate-500 truncate">{b.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatus(b.id, 'approved')} className="btn-success text-sm">✓ Approve</button>
                      <button onClick={() => handleStatus(b.id, 'rejected')} className="btn-danger text-sm">✗ Reject</button>
                    </>
                  )}
                  {b.status !== 'pending' && (
                    <button
                      onClick={() => handleStatus(b.id, 'pending')}
                      className="px-3 py-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                  <button onClick={() => handleDelete(b.id)} className="px-3 py-1.5 text-xs text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
