import { useGetCurrentUserQuery } from './authApi'

export const useAuth = () => {
  const { data, isLoading, isFetching, isError } = useGetCurrentUserQuery()

  const user = isError ? null : data?.user || null

  return {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isLoading: isLoading || isFetching,
    isError
  }
}
