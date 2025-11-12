import { api } from "../api/api"

// --- TYPES --- //
export interface UseServiceUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  phone: string
}

export interface UseServiceCategory {
  id: number
  name: string
}

export interface UseServiceItem {
  id: number
  phone: string
  user: UseServiceUser
  service: {
    id: number
    image: string
    category: UseServiceCategory
    title: string
    description: string
    created_at: string
  }
  used_at: string
  note: string
}

export interface UseServiceListResponse {
  count: number
  next: string | null
  previous: string | null
  results: UseServiceItem[]
}


export interface ServiceCategory {
  name_uz: string
  name_ru: string
  name_en: string
}

export interface Service {
  id: number
  title_uz: string
  title_ru: string
  title_en: string
  description_uz: string
  description_ru: string
  description_en: string
  image?: string
  category?: ServiceCategory | null
  created_at?: Object
}



export interface ServiceListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Service[]
}

export interface ServiceInput {
  title_uz?: string
  title_ru?: string
  title_en?: string
  description_uz?: string
  description_ru?: string
  description_en?: string
  image?: File
  category?: number | string // backendda category ID yoki slug bo'lishi mumkin
}

// --- CRUD: SERVICES --- //
export const getServices = async (): Promise<Service[]> => {
  const res = await api.get("/services/admin/")
  return res.data.results
}

export const getServiceById = async (id: string): Promise<Service> => {
  const res = await api.get(`/services/admin/${id}/`)
  return res.data
}

export const createService = async (data: FormData): Promise<Service> => {
  
  
  const res = await api.post("/services/admin/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

export const updateService = async (id: string, data: FormData): Promise<Service> => {
  const res = await api.put(`/services/admin/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

export const deleteService = async (id: string): Promise<void> => {
  await api.delete(`/services/admin/${id}/`)
}

// --- CRUD: USE SERVICES --- //
export const getUseServices = async (): Promise<UseServiceItem[]> => {
  const res = await api.get("/services/admin/use-services/")
  return res.data.results
}

export const getUseServiceById = async (id: string): Promise<UseServiceItem> => {
  const res = await api.get(`/services/admin/use-services/${id}/`)
  return res.data
}

export const deleteUseService = async (id: string): Promise<void> => {
  await api.delete(`/services/admin/use-services/${id}/`)
}

