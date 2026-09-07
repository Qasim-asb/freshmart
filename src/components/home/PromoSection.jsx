import { ArrowRight, Percent } from 'lucide-react'
import { Link } from 'react-router-dom'

const PromoSection = () => {
  return (
    <section className='bg-white py-14 sm:py-16 lg:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='overflow-hidden rounded-3xl bg-green-700'>
          <div className='grid items-center md:grid-cols-2'>
            <div className='px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16'>
              <span className='inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white'>
                <Percent className='h-4 w-4' />
                Special offer
              </span>
              <h2 className='mt-5 max-w-lg text-3xl font-bold tracking-tight text-white sm:text-4xl'>
                Fresh groceries,
                <span className='block text-green-200'>better prices</span>
              </h2>
              <p className='mt-4 max-w-lg text-sm leading-6 text-green-100 sm:text-base'>
                Save more on your everyday essentials with our latest grocery deals and seasonal offers.
              </p>
              <Link to='/shop' className='group mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50'>
                Shop deals
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Link>
            </div>

            <div className='flex min-h-64 items-center justify-center bg-green-800 px-6 py-10 sm:min-h-72'>
              <div className='text-center'>
                <p className='text-sm font-semibold uppercase tracking-widest text-green-200'>Save up to</p>
                <p className='mt-2 text-7xl font-black tracking-tight text-white sm:text-8xl'>30%</p>
                <p className='mt-2 text-sm font-medium text-green-200'>on selected products</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromoSection
