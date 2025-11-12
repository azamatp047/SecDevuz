import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteComment, getCommentById, getComments } from "../services/comments"
import toast from "react-hot-toast"

export const useComments = () => {
    return useQuery({
        queryKey: ["comments"],
        queryFn: getComments,
    })
}

export const useComment = (id: string) => {
    return useQuery({
        queryKey: ["comment", id],
        queryFn: () => getCommentById(id),
        enabled: !!id,
    })
}

export const useDeleteComment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteComment(id),
        onMutate: () => {
            toast.loading("Deleting comment...", { id: "delete-comment" })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] })
            toast.success("Comment deleted successfully", { id: "delete-comment" })
        },
        onError: () => {
            toast.error("Failed to delete comment", { id: "delete-comment" })
        }
    })
    
}