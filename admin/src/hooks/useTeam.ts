// src/hooks/useTeam.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../services/team";
import toast from "react-hot-toast";

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ["teamMembers"],
    queryFn: getTeamMembers,
  });
};

export const useTeamMember = (id: string) => {
  return useQuery({
    queryKey: ["teamMember", id],
    queryFn: () => getTeamMemberById(id),
    enabled: !!id,
  });
};

export const useTeamMemberMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createTeamMember,
    onMutate: () => {
      toast.loading("Creating team member...", { id: "createTeamMember" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast.success("Team member created successfully", { id: "createTeamMember" });
    },
    onError: () => {
      toast.error("Failed to create team member", { id: "createTeamMember" });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateTeamMember(id, data),
    onMutate: () => {
      toast.loading("Updating team member...", { id: "updateTeamMember" });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      queryClient.invalidateQueries({ queryKey: ["teamMember", id] });
      toast.success("Team member updated successfully", { id: "updateTeamMember" });
    },
    onError: (error) => {
      toast.error("Failed to update team member", { id: "updateTeamMember" });
      console.error("Failed to update team member:", error);
    },
  });

  const remove = useMutation({
    mutationFn: deleteTeamMember,
    onMutate: () => {
      toast.loading("Deleting team member...", { id: "deleteTeamMember" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast.success("Team member deleted successfully", { id: "deleteTeamMember" });
    },
    onError: () => {
      toast.error("Failed to delete team member", { id: "deleteTeamMember" });
    },
  });

  return { create, update, remove };
};