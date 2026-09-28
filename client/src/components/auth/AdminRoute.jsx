import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'

const AdminRoute = () => {
  const { isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <p className='text-sm text-gray-500'>Loading...</p>
      </div>
    )
  }

  return isAdmin ? <Outlet /> : <Navigate to='/' replace />
}

export default AdminRoute
