import { api } from "../api/api"

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/admin/login/", { email, password })
  const { access, refresh } = res.data

  
  localStorage.setItem("secdevAccessToken", access)
  localStorage.setItem("secdevRefreshToken", refresh)

  return res.data
}

export const logout = async () => {
  try {
    await api.post("/auth/logout/")
  } catch (err) {
    console.error("Logout error:", err)
  } finally {
    localStorage.removeItem("secdevAccessToken")
    localStorage.removeItem("secdevRefreshToken")
  }
}

export const getAdminUserById = async (id: number)=> {
  const res = await api.get(`/auth/admin/users/${id}/`)
  return res.data
}
