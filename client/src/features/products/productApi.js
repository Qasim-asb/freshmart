import { apiSlice } from '../../app/api/apiSlice'

export const productApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query({
      query: ({ search, category } = {}) => ({
        url: '/products',
        method: 'GET',
        params: {
          ...(search && { search }),
          ...(category && category !== 'All' && { category })
        }
      }),
      providesTags: ['Products']
    }),

    getProductById: builder.query({
      query: id => ({
        url: `/products/${id}`,
        method: 'GET'
      }),
      providesTags: (result, error, id) => [{ type: 'Products', id }]
    }),

    createProduct: builder.mutation({
      query: formData => ({
        url: '/products',
        method: 'POST',
        data: formData
      }),
      invalidatesTags: ['Products']
    }),

    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        data: formData
      }),
      invalidatesTags: (result, error, { id }) => [
        'Products',
        { type: 'Products', id }
      ]
    }),

    deleteProduct: builder.mutation({
      query: id => ({
        url: `/products/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Products']
    })
  })
})

export const { useGetProductsQuery, useGetProductByIdQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } = productApi
