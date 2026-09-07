import { useEffect, useMemo, useRef } from 'react'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/products/ProductCard'
import { categories } from '../data/categories'
import { products } from '../data/products'

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryFromUrl = searchParams.get('category') || 'All'
  const searchFromUrl = searchParams.get('search') || ''

  const searchTimerRef = useRef(null)

  const categoryNames = ['All', ...categories.map(category => category.name),]

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current)
      }
    }
  }, [])

  const handleSearchChange = (e) => {
    const value = e.target.value.trim()

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current)
    }

    searchTimerRef.current = setTimeout(() => {
      setSearchParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams)
        if (value) {
          nextParams.set('search', value)
        } else {
          nextParams.delete('search')
        }

        return nextParams
      }, { replace: true })
    }, 500)
  }

  const handleCategoryChange = (category) => {
    const nextParams = new URLSearchParams(searchParams)

    if (category === 'All') {
      nextParams.delete('category')
    } else {
      nextParams.set('category', category)
    }

    setSearchParams(nextParams)
  }

  const filteredProducts = useMemo(() => {
    const normalizedSearchTerm = searchFromUrl.trim().toLowerCase()

    return products.filter(product => {
      const matchesCategory = categoryFromUrl === 'All' || product.category === categoryFromUrl

      const matchesSearch = !normalizedSearchTerm || product.name.toLowerCase().includes(normalizedSearchTerm) || product.category.toLowerCase().includes(normalizedSearchTerm)

      return matchesCategory && matchesSearch
    })
  }, [categoryFromUrl, searchFromUrl])

  return (
    <section className='bg-gray-50 py-10 sm:py-12 lg:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div>
          <p className='text-sm font-semibold uppercase tracking-wider text-green-600'>FreshMart shop</p>
          <h1 className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Shop fresh groceries</h1>
          <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base'>
            Find fresh fruits, vegetables, dairy, bakery items and more.
          </p>
        </div>

        <div className='mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='relative w-full lg:max-w-md'>
            <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
            <input key={searchFromUrl} type='search' defaultValue={searchFromUrl} onChange={handleSearchChange} placeholder='Search products...' className='w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-green-500' />
          </div>

          <div className='flex gap-2 overflow-x-auto pb-3 snap-x snap-mandatory'>
            {categoryNames.map(category => (
              <button key={category} type='button' onClick={() => handleCategoryChange(category)} className={`shrink-0 snap-start rounded-full px-4 py-2 text-sm font-medium transition-colors ${categoryFromUrl === category ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600'}`}>
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className='mt-8'>
          <p className='text-sm text-gray-500'>
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1
              ? 'product'
              : 'products'}{' '}
            found
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className='mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className='mt-4 rounded-2xl bg-white px-6 py-16 text-center'>
            <h2 className='text-lg font-semibold text-gray-900'>No products found</h2>
            <p className='mt-2 text-sm text-gray-500'>Try a different search term or category.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Shop
