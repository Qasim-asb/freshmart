import { useState } from 'react'
import { PackagePlus, Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import FormInput from '../../components/ui/FormInput'
import { useCreateCategoryMutation, useGetCategoriesQuery } from '../../features/categories/categoryApi'
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation } from '../../features/products/productApi'
import { formatCurrency } from '../../utils/format'

const initialProductForm = {
  name: '',
  category: '',
  price: '',
  oldPrice: '',
  unitValue: '',
  unit: 'kg',
  stock: '100',
  image: null
}

const initialCategoryForm = {
  name: '',
  description: '',
  iconName: 'ShoppingBasket'
}

const getApiError = error => error?.data?.message || error?.data?.error || error?.message || 'Something went wrong'

const AdminDashboard = () => {
  const [productForm, setProductForm] = useState(initialProductForm)
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [productFormErrors, setProductFormErrors] = useState({})
  const [categoryFormErrors, setCategoryFormErrors] = useState({})

  const { data: productData, isLoading: productsLoading } = useGetProductsQuery()
  const { data: categoryData, isLoading: categoriesLoading } = useGetCategoriesQuery()
  const [createProduct, { isLoading: isCreatingProduct }] = useCreateProductMutation()
  const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation()

  const products = productData?.products || []
  const categories = categoryData?.categories || []
  const isProductSubmitting = isCreatingProduct || isUpdatingProduct

  const resetMessages = () => {
    setMessage('')
    setError('')
  }

  const handleProductsInputChange = (e) => {
    const { name, value, type, files } = e.target

    const fieldValue = type === 'file' ? files?.[0] || null : value

    setProductForm(prev => ({ ...prev, [name]: fieldValue }))

    if (productFormErrors[name]) {
      setProductFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target
    setCategoryForm(prev => ({ ...prev, [name]: value }))

    if (categoryFormErrors[name]) {
      setCategoryFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateCategoryForm = () => {
    const newErrors = {}

    if (!categoryForm.name.trim()) newErrors.name = 'Name is required'
    if (!categoryForm.description.trim()) newErrors.description = 'Description is required'

    setCategoryFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateProductForm = () => {
    const newErrors = {}

    if (!productForm.name.trim()) newErrors.name = 'Name is required'
    if (!productForm.category.trim()) newErrors.category = 'Category is required'
    if (productForm.price === '') newErrors.price = 'Price is required'
    if (productForm.unitValue === '') newErrors.unitValue = 'Unit value is required'
    if (!productForm.unit) newErrors.unit = 'Unit is required'
    if (productForm.stock === '') newErrors.stock = 'Stock is required'
    if (!editingId && !productForm.image) newErrors.image = 'Image is required'

    setProductFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEdit = (product) => {
    resetMessages()
    setEditingId(product._id)
    setProductForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : '',
      unitValue: String(product.unitValue),
      unit: product.unit,
      stock: String(product.stock ?? 0),
      image: null
    })
    setProductFormErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setProductForm(initialProductForm)
    setProductFormErrors({})
  }

  const submitCategory = async (e) => {
    e.preventDefault()
    resetMessages()
    if (!validateCategoryForm()) return

    try {
      await createCategory({
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim(),
        icon: categoryForm.iconName.trim()
      }).unwrap()

      setCategoryForm(initialCategoryForm)
      setCategoryFormErrors({})
      setMessage('Category created successfully')
    } catch (err) {
      setError(getApiError(err))
    }
  }

  const submitProduct = async (e) => {
    e.preventDefault()
    resetMessages()
    if (!validateProductForm()) return

    const formData = new FormData()
    formData.append('name', productForm.name.trim())
    formData.append('category', productForm.category)
    formData.append('price', productForm.price)
    formData.append('unitValue', productForm.unitValue)
    formData.append('unit', productForm.unit)
    formData.append('stock', productForm.stock)

    if (productForm.oldPrice !== '') {
      formData.append('oldPrice', productForm.oldPrice)
    }

    if (productForm.image) {
      formData.append('image', productForm.image)
    }

    try {
      if (editingId) {
        await updateProduct({ id: editingId, formData }).unwrap()
        setMessage('Product updated successfully')
      } else {
        await createProduct(formData).unwrap()
        setMessage('Product created successfully')
      }

      handleCancelEdit()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  const handleDelete = async (id) => {
    resetMessages()

    try {
      await deleteProduct(id).unwrap()
      if (editingId === id) handleCancelEdit()
      setMessage('Product deleted successfully')
    } catch (err) {
      setError(getApiError(err))
    }
  }

  return (
    <section className='bg-gray-50 px-4 py-10 sm:py-14'>
      <div className='mx-auto max-w-7xl'>
        <div className='rounded-3xl bg-gray-900 p-6 text-white sm:p-8'>
          <div className='flex items-center gap-3'>
            <div className='rounded-xl bg-green-500 p-2'>
              <ShieldCheck className='h-5 w-5' />
            </div>
            <div>
              <p className='text-sm text-gray-300'>FreshMart administration</p>
              <h1 className='text-2xl font-bold'>Catalog dashboard</h1>
            </div>
          </div>
          <p className='mt-4 max-w-2xl text-sm leading-6 text-gray-300'>Manage FreshMart products and categories.</p>
        </div>

        {message && <div className='mt-5 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700'>{message}</div>}
        {error && <div className='mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600'>{error}</div>}

        <div className='mt-6 grid gap-6 lg:grid-cols-[1fr_360px]'>
          <form onSubmit={submitProduct} className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
            <div className='flex items-center gap-3'>
              <PackagePlus className='h-5 w-5 text-green-600' />
              <h2 className='text-lg font-bold text-gray-900'>{editingId ? 'Edit product' : 'Add product'}</h2>
            </div>

            <div className='mt-6 grid gap-5 sm:grid-cols-2'>
              <FormInput placeholder='Product name' name='name' value={productForm.name} onChange={handleProductsInputChange} error={productFormErrors.name} />

              <div>
                <select name='category' value={productForm.category} onChange={handleProductsInputChange} disabled={categoriesLoading} className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 ${productFormErrors.category ? 'border-red-300' : 'border-gray-200'}`}>
                  <option value=''>{categoriesLoading ? 'Loading categories...' : 'Select category'}</option>
                  {categories.map(category => <option key={category._id} value={category.name}>{category.name}</option>)}
                </select>
                {productFormErrors.category && <p className='mt-1 text-xs text-red-500'>{productFormErrors.category}</p>}
              </div>

              <FormInput min='0' step='0.01' type='number' placeholder='Price' name='price' value={productForm.price} onChange={handleProductsInputChange} error={productFormErrors.price} />
              <FormInput min='0' step='0.01' type='number' placeholder='Old price' name='oldPrice' value={productForm.oldPrice} onChange={handleProductsInputChange} />
              <FormInput min='0' step='0.01' type='number' placeholder='Unit value e.g. 1' name='unitValue' value={productForm.unitValue} onChange={handleProductsInputChange} error={productFormErrors.unitValue} />

              <div>
                <select name='unit' value={productForm.unit} onChange={handleProductsInputChange} className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 ${productFormErrors.unit ? 'border-red-300' : 'border-gray-200'}`}>
                  <option value='kg'>kg</option>
                  <option value='g'>g</option>
                  <option value='l'>l</option>
                  <option value='ml'>ml</option>
                  <option value='piece'>piece</option>
                  <option value='pack'>pack</option>
                </select>
                {productFormErrors.unit && <p className='mt-1 text-xs text-red-500'>{productFormErrors.unit}</p>}
              </div>

              <FormInput min='0' type='number' placeholder='Stock' name='stock' value={productForm.stock} onChange={handleProductsInputChange} error={productFormErrors.stock} />
              <FormInput accept='image/*' type='file' name='image' onChange={handleProductsInputChange} error={productFormErrors.image} devSpan='sm:col-span-2' />
            </div>

            <div className='mt-5 flex flex-wrap gap-3'>
              <button type='submit' disabled={isProductSubmitting} className='inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60'>
                <Plus className='h-4 w-4' />
                {isProductSubmitting ? 'Saving...' : editingId ? 'Update product' : 'Add product'}
              </button>
              {editingId && (
                <button type='button' onClick={handleCancelEdit} className='rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700'>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <form onSubmit={submitCategory} className='h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
            <h2 className='text-lg font-bold text-gray-900'>Add category</h2>
            <div className='mt-5 space-y-4'>
              <FormInput placeholder='Category name' name='name' value={categoryForm.name} onChange={handleCategoryInputChange} error={categoryFormErrors.name} />
              <FormInput placeholder='Short description' name='description' value={categoryForm.description} onChange={handleCategoryInputChange} error={categoryFormErrors.description} />

              <div>
                <select name='iconName' value={categoryForm.iconName} onChange={handleCategoryInputChange} className='w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-500 border-gray-200'>
                  <option>ShoppingBasket</option>
                  <option>Apple</option>
                  <option>Beef</option>
                  <option>CakeSlice</option>
                  <option>Coffee</option>
                  <option>Milk</option>
                  <option>Utensils</option>
                </select>
              </div>
              <button type='submit' disabled={isCreatingCategory} className='w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60'>
                {isCreatingCategory ? 'Creating...' : 'Create category'}
              </button>
            </div>
          </form>
        </div>

        <div className='mt-8 rounded-2xl border border-gray-100 bg-white shadow-sm'>
          <div className='border-b border-gray-100 p-6'>
            <h2 className='text-lg font-bold text-gray-900'>Products ({products.length})</h2>
          </div>
          <div className='divide-y divide-gray-100'>
            {productsLoading ? (
              <p className='p-6 text-sm text-gray-500'>Loading products...</p>
            ) : products.length > 0 ? (
              products.map(product => (
                <div key={product._id} className='flex flex-col gap-4 p-5 sm:flex-row sm:items-center'>
                  <img src={product.image?.url} alt={product.name} className='h-16 w-16 rounded-xl object-cover' />
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs text-gray-400'>{product.category}</p>
                    <h3 className='font-semibold text-gray-900'>{product.name}</h3>
                    <p className='mt-1 text-sm text-green-600'>
                      {formatCurrency(product.price)} · {product.unitValue} {product.unit} · Stock: {product.stock}
                    </p>
                  </div>
                  <div className='flex gap-2'>
                    <button type='button' onClick={() => handleEdit(product)} className='inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50'>
                      <Pencil className='h-4 w-4' />
                      Edit
                    </button>
                    <button type='button' onClick={() => handleDelete(product._id)} className='inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50'>
                      <Trash2 className='h-4 w-4' />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className='p-6 text-sm text-gray-500'>No products found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard
