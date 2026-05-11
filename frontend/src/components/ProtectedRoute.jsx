import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'

export default function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return <Spinner />
  if (!isAdmin) return <Navigate to="/admin/login" replace />
  return children
}
