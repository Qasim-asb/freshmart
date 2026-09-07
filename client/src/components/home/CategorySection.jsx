import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../../data/categories'

const CategorySection = () => {
  return (
    <section className='bg-white py-14 sm:py-16 lg:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-wider text-green-600'>Shop by category</p>
            <h2 className='mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>Fresh groceries for every need</h2>
            <p className='mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base'>
              Explore our selection of fresh, quality groceries and find everything you need for your kitchen.
            </p>
          </div>
          <Link to='/categories' className='group inline-flex w-fit items-center gap-2 text-sm font-semibold text-green-600 transition-colors hover:text-green-700'>
            View all categories
            <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
          </Link>
        </div>

        <div className='mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6'>
          {categories.map(category => {
            const Icon = category.icon

            return (
              <Link key={category.name} to={`/shop?category=${encodeURIComponent(category.name)}`} className='group rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-green-100 hover:bg-green-50 hover:shadow-md'>
                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white'>
                  <Icon className='h-8 w-8' />
                </div>
                <h3 className='mt-4 text-sm font-semibold text-gray-900'>{category.name}</h3>
                <p className='mt-1 text-xs text-gray-500'>{category.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
