import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance";
import toast from "react-hot-toast";

// CREATE ASSET ASSIGNMENT
export const useCreateAssetAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentData: any) => {
      return axiosInstance.post("/asset-assignments", assignmentData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["asset-assignments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // toast.success("Asset assigned successfully!");
    },

    onError: (error: any) => {
      console.error(error);
      toast.error("Failed to assign asset!");
    },
  });
};

// GET ALL ASSET ASSIGNMENTS
export const useGetAssetAssignments = () => {
  return useQuery({
    queryKey: ["asset-assignments"],

    queryFn: async () => {
      const response = await axiosInstance.get("/asset-assignments");
      return response.data?.data || response.data;
    },
  });
};

// UNASSIGN ASSET
export const useUnassignAssetAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return axiosInstance.patch(`/asset-assignments/${id}/unassign`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["asset-assignments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

    },

    onError: (error: any) => {
      console.error(error);
      toast.error("Failed to unassign asset!");
    },
  });
};