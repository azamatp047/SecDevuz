import { api } from "../api/api"

export interface Comment {
    id: number
    name: string
    email: string
    phone: string
    sent_at: string
    message: string
}

export interface CommentListResponse {
    count: number
    next: string | null
    previous: string | null
    results: Comment[]
}

export const getComments = async (): Promise<Comment[]> => {
    const res = await api.get("/comments/admin/")
    // API returns a paginated response with `results`.
    // Normalize to return the array of comments directly.
    return res.data.results as Comment[]
}

export const deleteComment = async (id: string): Promise<void> => {
    await api.delete(`/comments/admin/${id}/`)
}

export const getCommentById = async (id: string): Promise<Comment> => {
    const res = await api.get(`/comments/admin/${id}/`)
    return res.data
}