import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories'

const Categories = () => {
  return (
    <section className='bg-gray-50 py-10 sm:py-12 lg:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='max-w-2xl'>
          <p className='text-sm font-semibold uppercase tracking-wider text-green-600'>Browse groceries</p>
          <h1 className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Shop by category</h1>
          <p className='mt-3 text-sm leading-6 text-gray-500 sm:text-base'>
            Explore our grocery categories and find everything you need for your kitchen and everyday shopping.
          </p>
        </div>

        <div className='mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {categories.map(category => {
            const Icon = category.icon

            return (
              <Link key={category.name} to={`/shop?category=${encodeURIComponent(category.name)}`} className='group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-green-100 hover:shadow-lg'>
                <div className='flex items-center justify-between'>
                  <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white'>
                    <Icon className='h-7 w-7' />
                  </div>
                  <ArrowRight className='h-5 w-5 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-green-600' />
                </div>
                <h2 className='mt-5 text-lg font-bold text-gray-900'>{category.name}</h2>
                <p className='mt-1 text-sm text-gray-500'>{category.description}</p>
                <p className='mt-5 text-sm font-semibold text-green-600'>Explore {category.name.toLowerCase()}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Categories
