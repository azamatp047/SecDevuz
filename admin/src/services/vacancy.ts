// ./src/services/vacancy.ts
import { api } from "../api/api"

export type VacancyStatus = "waiting" | "active" | "expired";

export interface Vacancy {
  id: number
  title_uz: string
  title_ru: string
  title_en: string
  description_uz: string // 'body_uz' o'rniga
  description_ru: string // 'body_ru' o'rniga
  description_en: string // 'body_en' o'rniga
  deadline: string // Yangi maydon
  status: VacancyStatus // Yangi maydon
  image?: string  // Bitta rasm URL
  created_at?: string
}

export interface VacancyListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Vacancy[]
}

export interface VacancyInput {
  title_uz: string
  title_ru: string
  title_en: string
  description_uz: string
  description_ru: string
  description_en: string
  deadline: string // Yangi maydon
  status: VacancyStatus // Yangi maydon
  image?: File  // Bitta fayl
}

export const getVacancies = async (): Promise<VacancyListResponse> => {
  const res = await api.get("/vacancies/admin/vacancies/")
  return res.data
}

export const getVacancyById = async (id: string): Promise<Vacancy> => {
  const res = await api.get(`/vacancies/admin/vacancies/${id}/`)
  return res.data
}

export const createVacancy = async (data: FormData): Promise<Vacancy> => {
  const res = await api.post("/vacancies/admin/vacancies/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

export const updateVacancy = async (id: string, data: FormData): Promise<Vacancy> => {
  const res = await api.put(`/vacancies/admin/vacancies/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

export const deleteVacancy = async (id: string): Promise<void> => {
  await api.delete(`/vacancies/admin/vacancies/${id}/`)
}