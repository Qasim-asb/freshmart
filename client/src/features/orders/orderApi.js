import { apiSlice } from '../../app/api/apiSlice'

export const orderApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createOrder: builder.mutation({
      query: customer => ({
        url: '/orders',
        method: 'POST',
        data: { customer }
      }),
      invalidatesTags: ['Orders', 'Cart']
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: '/orders',
        method: 'GET'
      }),
      providesTags: ['Orders']
    }),

    getOrderById: builder.query({
      query: id => ({
        url: `/orders/${id}`,
        method: 'GET'
      }),
      providesTags: (result, error, id) => [{ type: 'Orders', id }]
    }),

    getAllOrders: builder.query({
      query: () => ({
        url: '/orders/admin',
        method: 'GET'
      }),
      providesTags: ['Orders']
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        data: { status }
      }),
      invalidatesTags: (result, error, { id }) => ['Orders', { type: 'Orders', id }]
    })
  })
})

export const { useCreateOrderMutation, useGetMyOrdersQuery, useGetOrderByIdQuery, useGetAllOrdersQuery, useUpdateOrderStatusMutation } = orderApi
