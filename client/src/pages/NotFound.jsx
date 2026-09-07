import { ArrowLeft, Home, SearchX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/', { replace: true })
  }

  return (
    <section className='flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16'>
      <div className='w-full max-w-lg text-center'>
        <div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600'>
          <SearchX className='h-12 w-12' />
        </div>
        <p className='mt-8 text-6xl font-bold tracking-tight text-green-600'>404</p>
        <h1 className='mt-4 text-2xl font-bold text-gray-900 sm:text-3xl'>Page not found</h1>
        <p className='mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base'>
          Sorry, the page you are looking for doesn't exist or may have been moved.
        </p>
        <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
          <button type='button' onClick={handleGoHome} className='inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700'>
            <Home className='h-4 w-4' />
            Go to home
          </button>
          <button type='button' onClick={() => navigate(-1)} className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-green-200 hover:bg-green-50 hover:text-green-600'>
            <ArrowLeft className='h-4 w-4' />
            Go back
          </button>
        </div>
      </div>
    </section>
  )
}

export default NotFound
