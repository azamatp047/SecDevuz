import { api } from "../api/api"

export interface BlogPost {
  id: number
  title_uz: string
  title_ru: string
  title_en: string
  body_uz: string
  body_ru: string
  body_en: string
  image?: string  // Bitta rasm URL
  created_at?: string
}

export interface BlogListResponse {
  count: number
  next: string | null
  previous: string | null
  results: BlogPost[]
}

export interface BlogInput {
  title_uz?: string
  title_ru?: string
  title_en?: string
  body_uz?: string
  body_ru?: string
  body_en?: string
  image?: File  // Bitta fayl
}

export const getBlogs = async (): Promise<BlogListResponse[]> => {
  const res = await api.get("/blog/admin/blog-posts/")
  return res.data.results
}

export const getBlogById = async (id: string): Promise<BlogPost> => {
  const res = await api.get(`/blog/admin/blog-posts/${id}/`)
  return res.data
}

export const createBlog = async (data: FormData): Promise<BlogPost> => {
  const res = await api.post("/blog/admin/blog-posts/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

export const updateBlog = async (id: string, data: FormData): Promise<BlogPost> => {
  const res = await api.put(`/blog/admin/blog-posts/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

export const deleteBlog = async (id: string): Promise<void> => {
  await api.delete(`/blog/admin/blog-posts/${id}/`)
}