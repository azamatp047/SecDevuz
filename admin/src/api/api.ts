import axios, { AxiosError } from "axios"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
})

// ✅ Har bir requestdan oldin access token qo‘shiladi
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("secdevAccessToken")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ✅ Agar access token muddati tugasa — refresh orqali yangilanadi
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem("secdevRefreshToken")

      if (refreshToken) {
        try {
          const res = await axios.post(`${BASE_URL}/auth/token-refresh/`, {
            refresh: refreshToken,
          })

          const newAccessToken = res.data.access
          localStorage.setItem("secdevAccessToken", newAccessToken)

          if (res.data.refresh) {
            localStorage.setItem("secdevRefreshToken", res.data.refresh)
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest)
        } catch (refreshErr) {
          localStorage.removeItem("secdevAccessToken")
          localStorage.removeItem("secdevRefreshToken")
          window.location.href = "/login"
        }
      }
    }

    return Promise.reject(error)
  }
)
