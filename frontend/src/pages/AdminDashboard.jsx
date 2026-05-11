import { useState, useEffect } from 'react'
import { getTests, getMedicines, getBookings, getMedicineRequests, getMessages } from '../services/api'
import Spinner from '../components/Spinner'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getTests(), getMedicines(), getBookings(), getMedicineRequests(), getMessages()])
      .then(([t, m, b, r, msg]) => {
        const bookings = b.data
        const requests = r.data
        setStats({
          tests: t.data.length,
          medicines: m.data.length,
          bookings: bookings.length,
          requests: requests.length,
          messages: msg.data.length,
          pendingBookings: bookings.filter(b => b.status === 'pending').length,
          pendingRequests: requests.filter(r => r.status === 'pending').length,
          recentBookings: bookings.slice(0, 5),
          recentRequests: requests.slice(0, 5),
        })
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const cards = [
    { label: 'Lab Tests', value: stats.tests, icon: '🧪', color: 'bg-teal-50 border-teal-100', text: 'text-teal-700', link: '/admin/tests' },
    { label: 'Medicines', value: stats.medicines, icon: '💊', color: 'bg-blue-50 border-blue-100', text: 'text-blue-700', link: '/admin/medicines' },
    { label: 'Total Bookings', value: stats.bookings, icon: '📋', color: 'bg-purple-50 border-purple-100', text: 'text-purple-700', link: '/admin/bookings' },
    { label: 'Medicine Requests', value: stats.requests, icon: '📦', color: 'bg-amber-50 border-amber-100', text: 'text-amber-700', link: '/admin/requests' },
    { label: 'Messages', value: stats.messages, icon: '💬', color: 'bg-rose-50 border-rose-100', text: 'text-rose-700', link: '/admin/messages' },
    { label: 'Pending Actions', value: stats.pendingBookings + stats.pendingRequests, icon: '⏳', color: 'bg-orange-50 border-orange-100', text: 'text-orange-700', link: '/admin/bookings' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-slate-800 mb-1">Dashboard</h1>
        <p className="text-slate-500">Welcome back, Admin. Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {cards.map(c => (
          <Link key={c.label} to={c.link} className={`${c.color} border rounded-2xl p-4 hover:shadow-md transition-all hover:-translate-y-0.5`}>
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className={`text-2xl font-bold ${c.text}`}>{c.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{c.label}</div>
          </Link>
        ))}
      </div>

      {/* Pending Alerts */}
      {(stats.pendingBookings > 0 || stats.pendingRequests > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
          <h2 className="font-semibold text-amber-800 mb-2">⚠️ Pending Actions</h2>
          <div className="flex flex-wrap gap-4">
            {stats.pendingBookings > 0 && (
              <Link to="/admin/bookings" className="text-sm text-amber-700 hover:text-amber-900 font-medium underline">
                {stats.pendingBookings} pending booking{stats.pendingBookings > 1 ? 's' : ''} →
              </Link>
            )}
            {stats.pendingRequests > 0 && (
              <Link to="/admin/requests" className="text-sm text-amber-700 hover:text-amber-900 font-medium underline">
                {stats.pendingRequests} pending medicine request{stats.pendingRequests > 1 ? 's' : ''} →
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-slate-800">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-teal-600 hover:text-teal-800 font-medium">View all →</Link>
          </div>
          {stats.recentBookings.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentBookings.map(b => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-medium text-slate-700 text-sm">{b.user_name}</p>
                    <p className="text-xs text-slate-400">{b.contact}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    b.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    b.status === 'rejected' ? 'bg-red-100 text-red-600' :
                    'bg-amber-100 text-amber-700'
                  }`}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Medicine Requests */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-slate-800">Recent Requests</h2>
            <Link to="/admin/requests" className="text-sm text-teal-600 hover:text-teal-800 font-medium">View all →</Link>
          </div>
          {stats.recentRequests.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No requests yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentRequests.map(r => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-medium text-slate-700 text-sm">{r.user_name}</p>
                    <p className="text-xs text-slate-400">{r.contact} • Qty: {r.quantity}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    r.status === 'rejected' ? 'bg-red-100 text-red-600' :
                    'bg-amber-100 text-amber-700'
                  }`}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Add Test', link: '/admin/tests', icon: '➕🧪' },
          { label: 'Add Medicine', link: '/admin/medicines', icon: '➕💊' },
          { label: 'Manage Bookings', link: '/admin/bookings', icon: '📋' },
          { label: 'Read Messages', link: '/admin/messages', icon: '💬' },
        ].map(q => (
          <Link key={q.label} to={q.link} className="card text-center hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
            <div className="text-2xl mb-2">{q.icon}</div>
            <p className="text-sm font-medium text-slate-700">{q.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
