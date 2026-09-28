import { apiSlice } from '../../app/api/apiSlice'

export const cartApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCart: builder.query({
      query: () => ({
        url: '/cart',
        method: 'GET'
      }),
      providesTags: ['Cart']
    }),

    addToCart: builder.mutation({
      query: ({ productId, quantity = 1 }) => ({
        url: '/cart',
        method: 'POST',
        data: { productId, quantity }
      }),
      invalidatesTags: ['Cart']
    }),

    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/cart/${productId}`,
        method: 'PUT',
        data: { quantity }
      }),
      invalidatesTags: ['Cart']
    }),

    removeFromCart: builder.mutation({
      query: productId => ({
        url: `/cart/${productId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Cart']
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: '/cart',
        method: 'DELETE'
      }),
      invalidatesTags: ['Cart']
    })
  })
})

export const { useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation, useClearCartMutation } = cartApi
