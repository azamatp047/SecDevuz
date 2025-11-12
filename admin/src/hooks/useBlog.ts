import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from "../services/blog"
import toast from "react-hot-toast"

export const useBlogs = () => {
    return useQuery({
        queryKey: ["blogs"],
        queryFn: getBlogs,
    })
}

export const useBlog = (id: string) => {
    return useQuery({
        queryKey: ["blog", id],
        queryFn: () => getBlogById(id),
        enabled: !!id,
    })
}

export const useBlogMutations = () => {
    const queryClient = useQueryClient()

    const create = useMutation({
        mutationFn: createBlog,
        onMutate: () => {
            toast.loading("Creating blog...", { id: "createBlog" })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] })
            toast.success("Blog created successfully", { id: "createBlog" })
        },
        onError: () => {
            toast.error("Failed to create blog", { id: "createBlog" })
        },

    })

    const update = useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) => updateBlog(id, data),
        onMutate: () => {
            toast.loading("Updating blog...", { id: "updateBlog" })
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] })
            queryClient.invalidateQueries({ queryKey: ["blog", id] })
            toast.success("Blog updated successfully", { id: "updateBlog" })
        },
        onError: (error) => {
            toast.error("Failed to update blog", { id: "updateBlog" })
            console.log(error);
            
        }
    })

    const remove = useMutation({
        mutationFn: deleteBlog,
            onMutate: () => {
            toast.loading("Deleting blog...", { id: "deleteBlog" })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] })
            toast.success("Blog deleted successfully", { id: "deleteBlog" })
        },
        onError: () => {
            toast.error("Failed to delete blog", { id: "deleteBlog" })
        }
    })

    return { create, update, remove }
}
