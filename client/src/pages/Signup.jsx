import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/ui/FormInput'
import { useRegisterMutation } from '../features/auth/authApi'

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

  const [register, { isLoading }] = useRegisterMutation()

  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (form.password.trim() === '') {
      newErrors.password = 'Password is required'
    } else if (typeof form.password !== 'string' || form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    const userData = {
      name: form.name,
      email: form.email,
      password: form.password
    }

    try {
      await register(userData).unwrap()
      navigate('/account', { replace: true })
    } catch (error) {
      setError(error?.data?.message || 'Unable to create your account. Please try again.')
    }
  }

  return (
    <section className='bg-gray-50 px-4 py-12 sm:py-16'>
      <div className='mx-auto max-w-xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10'>
        <div className='mx-auto max-w-md'>
          <p className='text-sm font-semibold uppercase tracking-wider text-green-600'>Join FreshMart</p>
          <h1 className='mt-2 text-3xl font-bold text-gray-900'>Create your account</h1>
          <p className='mt-2 text-sm text-gray-500'>Save favorites, manage your cart and keep your shopping experience organized.</p>
          {error && <div className='mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600'>{error}</div>}
          <form onSubmit={handleSubmit} className='mt-7 space-y-5'>
            <FormInput label='Full name' name='name' type='text' value={form.name} onChange={handleInputChange} placeholder='Enter your name' error={errors.name} className='mt-2' />

            <FormInput label='Email address' name='email' type='email' value={form.email} onChange={handleInputChange} placeholder='Enter your email' error={errors.email} className='mt-2' />

            <FormInput label='Password' name='password' type='password' value={form.password} onChange={handleInputChange} placeholder='Enter your password' error={errors.password} className='mt-2' />

            <FormInput label='Confirm password' name='confirmPassword' type='password' value={form.confirmPassword} onChange={handleInputChange} placeholder='Confirm your password' error={errors.confirmPassword} className='mt-2' />

            <button type='submit' disabled={isLoading} className='w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60'>
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className='mt-7 text-center text-sm text-gray-500'>
            Already have an account?{' '}
            <Link to='/login' className='font-semibold text-green-600 hover:text-green-700'>Sign in</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Signup
