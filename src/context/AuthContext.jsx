import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => localStorage.getItem('ghe_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- guard clause for the no-token case
    if (!token) { setLoading(false); return }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(({ user }) => setUser(user))
      .catch(() => { localStorage.removeItem('ghe_token'); setToken(null) })
      .finally(() => setLoading(false))
  }, [token])

  const authenticate = async (path, payload, fallback) => {
    const res  = await fetch(path, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || fallback)
    localStorage.setItem('ghe_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const login    = (email, password) => authenticate('/api/auth/login', { email, password }, 'Login failed')
  const register = (name, email, password) =>
    authenticate('/api/auth/register', { name, email, password }, 'Registration failed')

  const logout = () => {
    localStorage.removeItem('ghe_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, updateUser: setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with its provider; splitting would touch every import
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
