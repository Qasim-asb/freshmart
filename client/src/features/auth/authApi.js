import { apiSlice } from '../../app/api/apiSlice'

export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    register: builder.mutation({
      query: userData => ({
        url: '/auth/register',
        method: 'POST',
        data: userData
      }),
      invalidatesTags: ['Auth']
    }),

    login: builder.mutation({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials
      }),
      invalidatesTags: ['Auth']
    }),

    getCurrentUser: builder.query({
      query: () => ({
        url: '/auth/getCurrentUser',
        method: 'GET'
      }),
      providesTags: ['Auth']
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      }),
      invalidatesTags: ['Auth']
    })
  })
})

export const { useRegisterMutation, useLoginMutation, useGetCurrentUserQuery, useLogoutMutation } = authApi
