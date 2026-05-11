import { useState } from 'react'
import { getBookingsByContact, getMedicineRequestsByContact, getTests, getMedicines } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import Spinner from '../components/Spinner'
import { toast } from '../components/Toast'

export default function MyRequests() {
  const [contact, setContact] = useState('')
  const [bookings, setBookings] = useState([])
  const [medRequests, setMedRequests] = useState([])
  const [tests, setTests] = useState([])
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!contact.trim()) { toast('Please enter your contact number', 'error'); return }
    setLoading(true)
    try {
      const [bRes, mRes, tRes, medRes] = await Promise.all([
        getBookingsByContact(contact.trim()),
        getMedicineRequestsByContact(contact.trim()),
        getTests(),
        getMedicines(),
      ])
      setBookings(bRes.data)
      setMedRequests(mRes.data)
      setTests(tRes.data)
      setMedicines(medRes.data)
      setSearched(true)
      if (bRes.data.length === 0 && mRes.data.length === 0) {
        toast('No requests found for this contact.', 'info')
      }
    } catch {
      toast('Failed to fetch requests. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getTestName = (id) => tests.find(t => t.id === id)?.name || `Test #${id}`
  const getMedName = (id) => medicines.find(m => m.id === id)?.name || `Medicine #${id}`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-slate-800 mb-2">My Requests</h1>
        <p className="text-slate-500">Enter your contact number to view all your bookings and requests.</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="card mb-8">
        <label className="label">Your Contact Number or Email</label>
        <div className="flex gap-3">
          <input
            className="input flex-1"
            placeholder="Enter the contact you used when booking..."
            value={contact}
            onChange={e => setContact(e.target.value)}
          />
          <button type="submit" className="btn-primary whitespace-nowrap" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {loading && <Spinner />}

      {searched && !loading && (
        <div className="space-y-8 animate-fade-in">
          {/* Lab Test Bookings */}
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-700 mb-4 flex items-center gap-2">
              🧪 Lab Test Bookings
              <span className="text-sm font-sans font-normal text-slate-400">({bookings.length})</span>
            </h2>
            {bookings.length === 0 ? (
              <div className="card text-center text-slate-400 py-8">No lab test bookings found.</div>
            ) : (
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id} className="card hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">{getTestName(b.test_id)}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">👤 {b.user_name} • 📞 {b.contact}</p>
                        {b.notes && <p className="text-sm text-slate-400 mt-1">📝 {b.notes}</p>}
                        <p className="text-xs text-slate-400 mt-1">
                          {b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                        </p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medicine Requests */}
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-700 mb-4 flex items-center gap-2">
              💊 Medicine Requests
              <span className="text-sm font-sans font-normal text-slate-400">({medRequests.length})</span>
            </h2>
            {medRequests.length === 0 ? (
              <div className="card text-center text-slate-400 py-8">No medicine requests found.</div>
            ) : (
              <div className="space-y-3">
                {medRequests.map(r => (
                  <div key={r.id} className="card hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">{getMedName(r.medicine_id)}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">👤 {r.user_name} • 📞 {r.contact} • Qty: {r.quantity}</p>
                        {r.notes && <p className="text-sm text-slate-400 mt-1">📝 {r.notes}</p>}
                        <p className="text-xs text-slate-400 mt-1">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                        </p>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
