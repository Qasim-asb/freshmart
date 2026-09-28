import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

const axiosBaseQuery = async ({ url, method, data, params }) => {
  try {
    const result = await axiosInstance({ url, method, data, params })

    return {
      data: result.data
    }
  } catch (error) {
    return {
      error: {
        status: error.response?.status,
        data: error.response?.data || error.message
      }
    }
  }
}

export default axiosBaseQuery
