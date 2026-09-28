import { Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/products/ProductCard'
import { useClearFavoritesMutation, useGetFavoritesQuery } from '../features/favorites/favoriteApi'

const Favorites = () => {
  const { data, isLoading, isError } = useGetFavoritesQuery()
  const [clearFavorites, { isLoading: isClearing }] = useClearFavoritesMutation()

  const favoriteItems = data?.items || []

  if (isLoading) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center bg-gray-50'>
        <p className='text-sm text-gray-500'>Loading favorites...</p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16'>
        <div className='text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500'>
            <Heart className='h-10 w-10' />
          </div>
          <h1 className='mt-6 text-2xl font-bold text-gray-900'>Unable to load favorites</h1>
          <p className='mt-2 text-sm text-gray-500'>Something went wrong while loading your saved products.</p>
        </div>
      </section>
    )
  }

  if (favoriteItems.length === 0) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16'>
        <div className='text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500'>
            <Heart className='h-10 w-10' />
          </div>
          <h1 className='mt-6 text-2xl font-bold text-gray-900'>No favorites yet</h1>
          <p className='mt-2 text-sm text-gray-500'>Save products you love and find them here later.</p>
          <Link to='/shop' className='mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700'>
            <ShoppingBag className='h-4 w-4' />
            Browse products
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className='bg-gray-50 py-10 sm:py-12 lg:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-wider text-green-600'>Your favorites</p>
            <h1 className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Saved products</h1>
            <p className='mt-3 text-sm leading-6 text-gray-500 sm:text-base'>
              {favoriteItems.length}{' '}
              {favoriteItems.length === 1 ? 'product' : 'products'} saved to
              your favorites.
            </p>
          </div>
          <button type='button' onClick={() => clearFavorites()} disabled={isClearing} className='w-fit rounded-lg border border-red-100 bg-white px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:opacity-60'>
            {isClearing ? 'Clearing...' : 'Clear favorites'}
          </button>
        </div>

        <div className='mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {favoriteItems.map(product => <ProductCard key={product._id} product={product} />)}
        </div>
      </div>
    </section>
  )
}

export default Favorites
