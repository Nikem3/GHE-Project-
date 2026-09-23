import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_HOME = {
  student: '/student/dashboard',
  staff:   '/staff/dashboard',
  admin:   '/admin/dashboard',
}

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user.role)) return <Navigate to={ROLE_HOME[user.role]} replace />
  return <Outlet />
}
