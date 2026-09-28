const FormInput = ({ label, name, type = 'text', value, onChange, placeholder, error, devSpan, className = '', ...props }) => {
  return (
    <div className={devSpan}>
      {label && <label htmlFor={name} className='text-sm font-medium text-gray-700'>{label}</label>}

      <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} {...props} className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 ${error ? 'border-red-300' : 'border-gray-200'} ${className}`} />

      {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
    </div>
  )
}

export default FormInput
