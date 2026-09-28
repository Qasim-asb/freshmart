import { Heart, LogOut, Package, Settings, ShieldCheck, ShoppingCart, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import { useLogoutMutation } from '../features/auth/authApi'
import { useGetCartQuery } from '../features/cart/cartApi'
import { useGetFavoritesQuery } from '../features/favorites/favoriteApi'
import { useGetMyOrdersQuery } from '../features/orders/orderApi'

const Account = () => {
  const { user, isAdmin, isAuthenticated } = useAuth()
  const [logout, { isLoading }] = useLogoutMutation()

  const navigate = useNavigate()

  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated })
  const { data: favoriteData } = useGetFavoritesQuery(undefined, { skip: !isAuthenticated })
  const { data: orderData } = useGetMyOrdersQuery(undefined, { skip: !isAuthenticated })

  const cartItems = cartData?.cart?.items || []
  const favoriteItems = favoriteData?.items || []
  const orders = orderData?.orders || []

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (!user) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16'>
        <p className='text-sm text-gray-500'>Loading account...</p>
      </section>
    )
  }

  return (
    <section className='bg-gray-50 px-4 py-10 sm:py-14'>
      <div className='mx-auto max-w-6xl'>
        <div className='rounded-3xl bg-green-600 p-6 text-white shadow-sm sm:p-8'>
          <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-4'>
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15'>
                <UserRound className='h-7 w-7' />
              </div>
              <div>
                <p className='text-sm text-green-100'>Welcome back</p>
                <h1 className='text-2xl font-bold'>{user.name}</h1>
                <p className='text-sm text-green-100'>{user.email}</p>
              </div>
            </div>
            <button type='button' onClick={handleLogout} disabled={isLoading} className='inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60'>
              <LogOut className='h-4 w-4' />
              {isLoading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>

        <div className='mt-6 grid gap-4 sm:grid-cols-3'>
          <Link to='/cart' className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:border-green-200'>
            <ShoppingCart className='h-5 w-5 text-green-600' />
            <p className='mt-4 text-2xl font-bold text-gray-900'>{cartItemCount}</p>
            <p className='text-sm text-gray-500'>Cart items</p>
          </Link>
          <Link to='/favorites' className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:border-green-200'>
            <Heart className='h-5 w-5 text-red-500' />
            <p className='mt-4 text-2xl font-bold text-gray-900'>{favoriteItems.length}</p>
            <p className='text-sm text-gray-500'>Saved favorites</p>
          </Link>
          <Link to='/my-orders' className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:border-green-200'>
            <Package className='h-5 w-5 text-green-600' />
            <p className='mt-4 text-2xl font-bold text-gray-900'>{orders.length}</p>
            <p className='text-sm text-gray-500'>Orders</p>
          </Link>
        </div>

        <div className='mt-6 grid gap-4 sm:grid-cols-2'>
          <Link to='/my-orders' className='flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:bg-green-50'>
            <Settings className='h-5 w-5 text-gray-500' />
            <div>
              <p className='font-semibold text-gray-900'>Order history</p>
              <p className='mt-1 text-sm text-gray-500'>Review your previous purchases.</p>
            </div>
          </Link>

          {isAdmin && (
            <Link to='/admin' className='flex items-center gap-4 rounded-2xl border border-green-100 bg-green-50 p-5 shadow-sm hover:bg-green-100'>
              <ShieldCheck className='h-5 w-5 text-green-600' />
              <div>
                <p className='font-semibold text-gray-900'>Admin dashboard</p>
                <p className='mt-1 text-sm text-gray-500'>Manage products and categories.</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default Account
