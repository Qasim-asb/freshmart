import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { products } from '../../data/products'
import ProductCard from '../products/ProductCard'

const FeaturedProducts = () => {
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

        <div className='mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {products.slice(0, 6).map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
