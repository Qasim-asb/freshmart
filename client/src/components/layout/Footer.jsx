const Footer = () => {
  return (
    <footer className='border-t border-gray-100 bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-xl font-bold text-green-600'>FreshMart</h2>
            <p className='mt-1 text-sm text-gray-500'>Fresh groceries delivered to your door</p>
          </div>

          <p className='text-sm text-gray-500'>© {new Date().getFullYear()} FreshMart</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
