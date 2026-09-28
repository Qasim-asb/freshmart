import { apiSlice } from '../../app/api/apiSlice'

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCategories: builder.query({
      query: () => ({
        url: '/categories',
        method: 'GET'
      }),
      providesTags: ['Categories']
    }),

    createCategory: builder.mutation({
      query: categoryData => ({
        url: '/categories',
        method: 'POST',
        data: categoryData
      }),
      invalidatesTags: ['Categories', 'Products']
    })
  })
})

export const { useGetCategoriesQuery, useCreateCategoryMutation } = categoryApi
