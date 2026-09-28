import { Apple, ArrowRight, Beef, CakeSlice, Coffee, Milk, ShoppingBasket, Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGetCategoriesQuery } from '../features/categories/categoryApi'

const iconMap = { Apple, Beef, CakeSlice, Coffee, Milk, ShoppingBasket, Utensils }

const Categories = () => {
  const { data, isLoading, isError, refetch } = useGetCategoriesQuery()

  const categories = data?.categories || []

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

        {isLoading ? (
          <p className='mt-8 text-sm text-gray-500'>Loading categories...</p>
        ) : isError ? (
          <div className='mt-8 rounded-2xl bg-white p-6 text-center'>
            <p className='text-sm text-red-500'>Failed to load categories.</p>
            <button type='button' onClick={refetch} className='mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700'>
              Try again
            </button>
          </div>
        ) : categories.length > 0 ? (
          <div className='mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {categories.map(category => {
              const Icon = iconMap[category.icon] || ShoppingBasket

              return (
                <Link key={category._id} to={`/shop?category=${encodeURIComponent(category.name)}`} className='group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-green-100 hover:shadow-lg'>
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
        ) : (
          <p className='mt-8 text-gray-500'>No categories available yet.</p>
        )}
      </div>
    </section>
  )
}

export default Categories
