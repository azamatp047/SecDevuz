// ./src/hooks/useVacancy.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getVacancies, getVacancyById, createVacancy, updateVacancy, deleteVacancy } from "../services/vacancy"
import toast from "react-hot-toast"

export const useVacancies = () => {
    return useQuery({
        queryKey: ["vacancies"],
        queryFn: getVacancies,
    })
}

export const useVacancy = (id: string) => {
    return useQuery({
        queryKey: ["vacancy", id],
        queryFn: () => getVacancyById(id),
        enabled: !!id,
    })
}

export const useVacancyMutations = () => {
    const queryClient = useQueryClient()

    const create = useMutation({
        mutationFn: createVacancy,
        onMutate: () => {
            toast.loading("Creating vacancy...", { id: "createVacancy" })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vacancies"] })
            toast.success("Vacancy created successfully", { id: "createVacancy" })
        },
        onError: () => {
            toast.error("Failed to create vacancy", { id: "createVacancy" })
        },
    })

    const update = useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) => updateVacancy(id, data),
        onMutate: () => {
            toast.loading("Updating vacancy...", { id: "updateVacancy" })
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["vacancies"] })
            queryClient.invalidateQueries({ queryKey: ["vacancy", id] })
            toast.success("Vacancy updated successfully", { id: "updateVacancy" })
        },
        onError: (error) => {
            toast.error("Failed to update vacancy", { id: "updateVacancy" })
            console.error("Failed to update vacancy:", error);
        }
    })

    const remove = useMutation({
        mutationFn: deleteVacancy,
        onMutate: () => {
            toast.loading("Deleting vacancy...", { id: "deleteVacancy" })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vacancies"] })
            toast.success("Vacancy deleted successfully", { id: "deleteVacancy" })
        },
        onError: () => {
            toast.error("Failed to delete vacancy", { id: "deleteVacancy" })
        }
    })

    return { create, update, remove }
}