import { ArrowRight, ShoppingBasket } from 'lucide-react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className='bg-green-50'>
      <div className='mx-auto grid min-h-[520px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20 lg:px-8'>
        <div>
          <span className='inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm'>
            <ShoppingBasket className='h-4 w-4' />
            Fresh groceries, every day
          </span>
          <h1 className='mt-6 max-w-xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl'>
            Fresh food,
            <span className='block text-green-600'>delivered to you</span>
          </h1>
          <p className='mt-5 max-w-lg text-base leading-7 text-gray-600 sm:text-lg'>
            Shop fresh fruits, vegetables, dairy, bakery items and everyday essentials from the comfort of your home.
          </p>
          <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <Link to='/shop' className='inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700'>
              Shop now
              <ArrowRight className='h-4 w-4' />
            </Link>
            <Link to='/categories' className='inline-flex items-center justify-center rounded-lg border border-green-200 bg-white px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-green-50'>
              Explore categories
            </Link>
          </div>
          <div className='mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600'>
            <span>✓ Fresh products</span>
            <span>✓ Fast delivery</span>
            <span>✓ Easy shopping</span>
          </div>
        </div>

        <div className='hidden md:block'>
          <div className='flex aspect-square items-center justify-center rounded-full bg-green-100'>
            <ShoppingBasket className='h-32 w-32 text-green-600 lg:h-40 lg:w-40' />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
