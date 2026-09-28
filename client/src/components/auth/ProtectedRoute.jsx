import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <p className='text-sm text-gray-500'>Loading account...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
