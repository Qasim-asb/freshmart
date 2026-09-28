import { apiSlice } from '../../app/api/apiSlice'

export const favoriteApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getFavorites: builder.query({
      query: () => ({
        url: '/favorites',
        method: 'GET'
      }),
      providesTags: ['Favorites']
    }),

    toggleFavorite: builder.mutation({
      query: productId => ({
        url: `/favorites/${productId}`,
        method: 'POST'
      }),
      invalidatesTags: ['Favorites']
    }),

    clearFavorites: builder.mutation({
      query: () => ({
        url: '/favorites',
        method: 'DELETE'
      }),
      invalidatesTags: ['Favorites']
    })
  })
})

export const { useGetFavoritesQuery, useToggleFavoriteMutation, useClearFavoritesMutation } = favoriteApi
