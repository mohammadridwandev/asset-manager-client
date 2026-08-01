import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance";
import toast from "react-hot-toast";

// CREATE LICENSE ASSIGNMENT
export const useCreateLicenseAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentData: any) => {
      return axiosInstance.post("/license-assignments", assignmentData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["license-assignments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["licenses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // toast.success("License assigned successfully!");
    },

    onError: (error: any) => {
      console.error(error);
      toast.error("Failed to assign license!");
    },
  });
};

// GET ALL LICENSE ASSIGNMENTS
export const useGetLicenseAssignments = () => {
  return useQuery({
    queryKey: ["license-assignments"],

    queryFn: async () => {
      const response = await axiosInstance.get("/license-assignments");
      return response.data?.data || response.data;
    },
  });
};

// UNASSIGN LICENSE
export const useUnassignLicenseAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return axiosInstance.patch(`/license-assignments/${id}/unassign`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["license-assignments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["licenses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // toast.success("License unassigned successfully!");
    },

    onError: (error: any) => {
      console.error(error);
      toast.error("Failed to unassign license!");
    },
  });
};
