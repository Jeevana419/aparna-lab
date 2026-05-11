import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAdmin, adminLogout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive(to)
          ? 'bg-teal-600 text-white shadow-sm'
          : 'text-slate-600 hover:text-teal-700 hover:bg-teal-50'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <span className="font-display text-lg font-bold text-slate-800">Aparna Laboratory</span>
              <span className="hidden sm:block text-xs text-slate-400 -mt-1">Clinical Reference Diagnostic Centre</span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {!isAdmin ? (
              <>
                {navLink('/', 'Home')}
                {navLink('/tests', 'Lab Tests')}
                {navLink('/medicines', 'Medicines')}
                {navLink('/my-requests', 'My Requests')}
                {navLink('/contact', 'Contact')}
                <Link
                  to="/admin/login"
                  className="ml-2 px-4 py-2 text-sm font-medium text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-50 transition-all"
                >
                  Admin
                </Link>
              </>
            ) : (
              <>
                {navLink('/admin/dashboard', 'Dashboard')}
                {navLink('/admin/tests', 'Tests')}
                {navLink('/admin/medicines', 'Medicines')}
                {navLink('/admin/bookings', 'Bookings')}
                {navLink('/admin/requests', 'Requests')}
                {navLink('/admin/messages', 'Messages')}
                <button
                  onClick={adminLogout}
                  className="ml-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
