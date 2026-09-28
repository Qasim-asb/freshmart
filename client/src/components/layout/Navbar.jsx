import { useEffect, useRef, useState } from 'react'
import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { useLogoutMutation } from '../../features/auth/authApi'
import { useGetCartQuery } from '../../features/cart/cartApi'
import { useGetFavoritesQuery } from '../../features/favorites/favoriteApi'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  const { user, isAdmin, isAuthenticated } = useAuth()
  const [logout, { isLoading }] = useLogoutMutation()

  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated })
  const { data: favoriteData } = useGetFavoritesQuery(undefined, { skip: !isAuthenticated })

  const headerRef = useRef(null)
  const navigate = useNavigate()

  const cartItems = cartData?.cart?.items || []
  const favoriteItems = favoriteData?.items || []

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const favoriteCount = favoriteItems.length

  useEffect(() => {
    const handleClickOutside = (e) => {
      if ((isMenuOpen || isSearchOpen || isAccountOpen) && headerRef.current && !headerRef.current.contains(e.target)) {
        setIsMenuOpen(false)
        setIsSearchOpen(false)
        setIsAccountOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    document.body.style.overflow = isMenuOpen || isSearchOpen ? 'hidden' : ''

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isMenuOpen, isSearchOpen, isAccountOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
        setIsSearchOpen(false)
        setIsAccountOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => { document.removeEventListener('keydown', handleEscape) }
  }, [])

  const handleMenu = () => {
    setIsMenuOpen(prev => !prev)
    setIsSearchOpen(false)
    setIsAccountOpen(false)
  }

  const handleSearchInput = () => {
    setIsSearchOpen(prev => !prev)
    setIsMenuOpen(false)
    setIsAccountOpen(false)
  }

  const handleAccount = () => {
    setIsAccountOpen(prev => !prev)
    setIsMenuOpen(false)
    setIsSearchOpen(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()

    const trimmedSearchTerm = searchTerm.trim()

    setIsMenuOpen(false)
    setIsSearchOpen(false)

    if (!trimmedSearchTerm) {
      navigate('/shop')
      return
    }

    navigate(`/shop?search=${encodeURIComponent(trimmedSearchTerm)}`)
  }

  const handleLogout = async () => {
    setIsAccountOpen(false)
    setIsMenuOpen(false)

    try {
      await logout().unwrap()
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const accountLinks = !isAuthenticated
    ? []
    : isAdmin ? [
      { label: 'Admin Dashboard', to: '/admin' },
      { label: 'My Orders', to: '/my-orders' }
    ]
      : [
        { label: 'My Account', to: '/account' },
        { label: 'My Orders', to: '/my-orders' }
      ]

  return (
    <header ref={headerRef} className='fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <Link to='/' onClick={() => setIsMenuOpen(false)} className='text-2xl font-bold tracking-tight text-green-600'>FreshMart</Link>

        <nav className='hidden md:flex items-center gap-5 xl:gap-7'>
          <Link to='/' className='text-sm font-medium text-gray-700 transition-colors hover:text-green-600'>Home</Link>
          <Link to='/shop' className='text-sm font-medium text-gray-700 transition-colors hover:text-green-600'>Shop</Link>
          <Link to='/categories' className='text-sm font-medium text-gray-700 transition-colors hover:text-green-600'>Categories</Link>
          <Link to='/my-orders' className='text-sm font-medium text-gray-700 transition-colors hover:text-green-600'>My Orders</Link>
        </nav>

        <div className='flex items-center gap-1 sm:gap-2'>
          <form onSubmit={handleSearchSubmit} className='hidden lg:flex items-center'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <input type='text' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder='Search products...' className='w-40 rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white sm:w-56' />
            </div>
          </form>

          <div className='lg:hidden '>
            <button type='button' onClick={handleSearchInput} className='rounded-full p-2 text-gray-600 transition-colors hover:bg-green-50 hover:text-green-600'>
              <Search className='h-5 w-5' />
            </button>
          </div>

          <Link to='/favorites' className='relative rounded-full p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-500'>
            <Heart className='h-5 w-5' fill={favoriteCount > 0 ? 'currentColor' : 'none'} />
            {favoriteCount > 0 && <span className='absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white'>{favoriteCount}</span>}
          </Link>
          <Link to='/cart' className='relative rounded-full p-2 text-gray-600 transition-colors hover:bg-green-50 hover:text-green-600'>
            <ShoppingCart className='h-5 w-5' />
            {cartCount > 0 && <span className='absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-semibold text-white'>{cartCount}</span>}
          </Link>

          <div className='relative hidden md:block'>
            <button type='button' onClick={handleAccount} className={`rounded-full p-2 transition-colors ${isAccountOpen ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'}`}>
              <User className='h-5 w-5' />
            </button>

            {isAccountOpen && (
              <div className='absolute right-0 top-full mt-2 w-52 rounded-xl border border-gray-100 bg-white p-2 shadow-lg'>
                {isAuthenticated ? (
                  <>
                    <div className='border-b border-gray-100 px-3 py-2'>
                      <p className='text-xs text-gray-400'>Signed in as</p>
                      <p className='mt-0.5 text-sm font-semibold capitalize text-gray-900'>{user?.role}</p>
                    </div>

                    {accountLinks.map(link => (
                      <Link key={link.to} to={link.to} onClick={() => setIsAccountOpen(false)} className='block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600'>
                        {link.label}
                      </Link>
                    ))}

                    <button type='button' disabled={isLoading} onClick={handleLogout} className='w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50'>
                      {isLoading ? 'Logging out...' : 'Logout'}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to='/login' onClick={() => setIsAccountOpen(false)} className='block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600'>
                      Sign In
                    </Link>
                    <Link to='/signup' onClick={() => setIsAccountOpen(false)} className='block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600'>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button type='button' onClick={handleMenu} className='rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden'>
            {isMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <div className='border-t border-gray-100 bg-white px-4 py-3 lg:hidden'>
          <form onSubmit={handleSearchSubmit} className='flex items-center gap-2 max-w-2xl mx-auto'>
            <div className='relative min-w-0 flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <input type='text' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder='Search products...' autoFocus className='w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white' />
            </div>
            <button type='button' onClick={() => setIsSearchOpen(false)} className='shrink-0 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700'>
              <X className='h-5 w-5' />
            </button>
          </form>
        </div>
      )}

      <div className={`absolute left-0 right-0 top-full border-b border-gray-100 bg-white shadow-lg transition-all duration-200 md:hidden ${isMenuOpen && !isSearchOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}>
        <nav className='px-4 py-3 sm:px-6'>
          <div className='mx-auto max-w-7xl space-y-1'>
            <Link to='/' onClick={() => setIsMenuOpen(false)} className='block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600'>Home</Link>
            <Link to='/shop' onClick={() => setIsMenuOpen(false)} className='block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600'>Shop</Link>
            <Link to='/categories' onClick={() => setIsMenuOpen(false)} className='block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600'>Categories</Link>
            <Link to='/my-orders' onClick={() => setIsMenuOpen(false)} className='block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600'>My Orders</Link>
            <Link to='/favorites' onClick={() => setIsMenuOpen(false)} className='flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-red-50 hover:text-red-500'>
              <span>Favorites</span>
              {favoriteCount > 0 && <span className='rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white'>{favoriteCount}</span>}
            </Link>
            <Link to='/cart' onClick={() => setIsMenuOpen(false)} className='flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600'>
              <span>Cart</span>
              {cartCount > 0 && <span className='rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white'>{cartCount}</span>}
            </Link>

            {isAuthenticated ? (
              <>
                <div className='border-t border-gray-100 pt-2'>
                  <div className='px-3 py-2'>
                    <p className='text-xs text-gray-400'>Signed in as</p>
                    <p className='mt-0.5 text-sm font-semibold capitalize text-gray-900'>{user?.role}</p>
                  </div>

                  {accountLinks.map(link => (
                    <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className='block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600'>
                      {link.label}
                    </Link>
                  ))}

                  <button type='button' disabled={isLoading} onClick={handleLogout} className='w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50'>
                    {isLoading ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </>
            ) : (
              <div className='border-t border-gray-100 pt-2'>
                <Link to='/login' onClick={() => setIsMenuOpen(false)} className='block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600'>
                  Sign In
                </Link>
                <Link to='/signup' onClick={() => setIsMenuOpen(false)} className='block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600'>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
