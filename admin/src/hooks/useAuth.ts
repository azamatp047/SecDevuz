import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAdminUserById, login, logout } from "../services/authService"
import toast from "react-hot-toast"

export const useAuth = () => {
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onMutate: () => {
      toast.loading("Kirish amalga oshirilmoqda...", { id: "login" })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
      toast.success("Tizimga kirildi!", { id: "login" })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || "Kirishda xatolik", { id: "login" })
    }
  })

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      toast.success("Tizimdan chiqildi ")
      window.location.href = "/login"
    },
  })

  // Users
  const useAdminUser = (id?: number) => {
    return useQuery({
      queryKey: ["admin-user", id],
      queryFn: () => getAdminUserById(id!),
      enabled: !!id,
    })
  }


  return {
    loginMutation,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    useAdminUser,
  }
}
