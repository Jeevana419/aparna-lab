import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    setIsAdmin(!!token)
    setLoading(false)
  }, [])

  const adminLogin = (token) => {
    localStorage.setItem('admin_token', token)
    setIsAdmin(true)
  }

  const adminLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isAdmin, adminLogin, adminLogout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
