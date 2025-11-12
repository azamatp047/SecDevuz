// ./src/services/users.ts
import { api } from "../api/api"

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  phone: string
  date_joined: string
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
  last_login: string | null
}

export interface UserListResponse {
  count: number
  next: string | null
  previous: string | null
  results: User[]
}

export const getUsers = async (): Promise<UserListResponse> => {
  const res = await api.get("/auth/admin/users/")
  return res.data
}

export const getUserById = async (id: string): Promise<User> => {
  const res = await api.get(`/auth/admin/users/${id}/`)
  return res.data
}

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/auth/admin/users/${id}/`)
}
