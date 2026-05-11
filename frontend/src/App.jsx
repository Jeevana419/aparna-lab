import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useToast, ToastContainer } from './components/Toast'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// User Pages
import Home from './pages/Home'
import Tests from './pages/Tests'
import Medicines from './pages/Medicines'
import MyRequests from './pages/MyRequests'
import Contact from './pages/Contact'

// Admin Pages
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminTests from './pages/AdminTests'
import AdminMedicines from './pages/AdminMedicines'
import AdminBookings from './pages/AdminBookings'
import AdminRequests from './pages/AdminRequests'
import AdminMessages from './pages/AdminMessages'

function AppContent() {
  const { toasts } = useToast()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/tests" element={<ProtectedRoute><AdminTests /></ProtectedRoute>} />
        <Route path="/admin/medicines" element={<ProtectedRoute><AdminMedicines /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />
        <Route path="/admin/requests" element={<ProtectedRoute><AdminRequests /></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-8xl mb-4">🔍</div>
            <h1 className="font-display text-4xl font-bold text-slate-800 mb-2">Page Not Found</h1>
            <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
            <a href="/" className="btn-primary">Go Home</a>
          </div>
        } />
      </Routes>
      <ToastContainer toasts={toasts} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}
