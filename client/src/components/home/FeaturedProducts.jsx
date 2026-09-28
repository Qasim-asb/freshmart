import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGetProductsQuery } from '../../features/products/productApi'
import ProductCard from '../products/ProductCard'

const FeaturedProducts = () => {
  const { data, isLoading, isError, refetch } = useGetProductsQuery()

  const products = data?.products || []

  return (
    <section className='bg-gray-50 py-14 sm:py-16 lg:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-wider text-green-600'>Fresh picks</p>
            <h2 className='mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>Featured products</h2>
            <p className='mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base'>
              Discover some of our most popular fresh grocery essentials.
            </p>
          </div>
          <Link to='/shop' className='group inline-flex w-fit items-center gap-2 text-sm font-semibold text-green-600 transition-colors hover:text-green-700'>
            View all products
            <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
          </Link>
        </div>

        <div className='mt-8'>
          {isLoading ? (
            <p className='text-sm text-gray-500'>Loading products...</p>
          ) : isError ? (
            <div className='rounded-2xl bg-white p-6 text-center'>
              <p className='text-sm text-red-500'>Failed to load featured products.</p>
              <button type='button' onClick={refetch} className='mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700'>
                Try again
              </button>
            </div>
          ) : products.length > 0 ? (
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {products.slice(0, 6).map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : (
            <p className='mt-8 text-center text-gray-500'>No products available yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
