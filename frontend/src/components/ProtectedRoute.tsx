import { Navigate, Outlet } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

type ProtectedRouteProps = {
  allowedRoles?: Array<'USER' | 'ADMIN' | 'SUPER_ADMIN'>
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, currentUser, normalizeRole } = useAppContext()

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Loading your workspace...
      </div>
    )
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />
  }

  const userRole = normalizeRole(currentUser.role)
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
