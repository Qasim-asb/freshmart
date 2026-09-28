import { useState } from 'react'
import { ShieldCheck, UserRound } from "lucide-react"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormInput from '../components/ui/FormInput'
import { useLoginMutation } from '../features/auth/authApi'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

  const [login, { isLoading }] = useLoginMutation()

  const navigate = useNavigate()
  const location = useLocation()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (form.password.trim() === '') {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    try {
      await login(form).unwrap()
      navigate(location.state?.from || '/account', { replace: true })
    } catch (error) {
      setError(error?.data?.message || 'Invalid email or password.')
    }
  }

  return (
    <section className='bg-gray-50 px-4 py-12 sm:py-16'>
      <div className='mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm lg:grid-cols-2'>
        <div className='hidden lg:flex h-full flex-col justify-between bg-green-600 p-10 text-white'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-wider text-green-100'>Welcome back</p>
            <h1 className='mt-3 text-4xl font-bold'>Fresh groceries, simpler shopping.</h1>
            <p className='mt-5 leading-7 text-green-50'>
              Sign in to keep your favorites, cart, account details and FreshMart experience together.
            </p>
          </div>
          <div className='rounded-2xl bg-white/10 p-5 backdrop-blur'>
            <ShieldCheck className='h-7 w-7' />
            <p className='mt-3 text-sm font-semibold'>Secure authentication</p>
            <p className='mt-1 text-sm text-green-50'>Your FreshMart session is securely managed by the backend.</p>
          </div>
        </div>

        <div className='p-6 sm:p-10'>
          <div className='mx-auto max-w-md'>
            <p className='text-sm font-semibold uppercase tracking-wider text-green-600'>Account</p>
            <h2 className='mt-2 text-3xl font-bold text-gray-900'>Sign in</h2>
            <p className='mt-2 text-sm text-gray-500'>Access your FreshMart account.</p>

            {error && <div className='mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600'>{error}</div>}

            <form onSubmit={handleSubmit} className='mt-7 space-y-5'>
              <FormInput label='Email' name='email' type='email' value={form.email} onChange={handleInputChange} placeholder='Enter your email' error={errors.email} className='mt-2' />
              <FormInput label='Password' name='password' type='password' value={form.password} onChange={handleInputChange} placeholder='Enter your password' error={errors.password} className='mt-2' />
              <button type='submit' disabled={isLoading} className='w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60'>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className='mt-6 grid gap-3 sm:grid-cols-2'>
              <button type='button' className='rounded-xl border border-gray-200 px-4 py-3 text-left hover:bg-gray-50'>
                <UserRound className='h-4 w-4 text-green-600' />
                <p className='mt-2 text-xs font-semibold text-gray-900'>Demo customer</p>
                <p className='mt-1 text-xs text-gray-500'>user@freshmart.com</p>
              </button>

              <button type='button' className='rounded-xl border border-gray-200 px-4 py-3 text-left hover:bg-gray-50'>
                <ShieldCheck className='h-4 w-4 text-green-600' />
                <p className='mt-2 text-xs font-semibold text-gray-900'>Demo admin</p>
                <p className='mt-1 text-xs text-gray-500'>admin@freshmart.com</p>
              </button>
            </div>

            <p className='mt-7 text-center text-sm text-gray-500'>
              Don't have an account?{' '}
              <Link to='/signup' className='font-semibold text-green-600 hover:text-green-700'>Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
