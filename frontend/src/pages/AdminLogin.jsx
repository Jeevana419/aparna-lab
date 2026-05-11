import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { toast } from '../components/Toast'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { adminLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(form)
      adminLogin(res.data.access_token)
      toast('Welcome back, Admin!')
      navigate('/admin/dashboard')
    } catch (err) {
      toast(err.response?.data?.detail || 'Invalid credentials', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-teal-900 flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl shadow-xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Admin Login</h1>
          <p className="text-slate-400 text-sm mt-1">MediLab Management Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                placeholder="Enter username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all pr-12"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-5 pt-5 border-t border-white/10 text-center">
            <p className="text-slate-400 text-xs">Default credentials: <span className="font-mono text-teal-400">admin / admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
