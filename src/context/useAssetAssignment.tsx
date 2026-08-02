import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import axiosInstance from "../config/axiosInstance";
import toast from "react-hot-toast";

// CREATE ASSET ASSIGNMENT
export const useCreateAssetAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentData: any) => {
      return axiosInstance.post(
        "/asset-assignments",
        assignmentData,
      );
    },

    onSuccess: () => {
      // Asset assignment list refresh
      queryClient.invalidateQueries({
        queryKey: ["asset-assignments"],
      });

      // Asset list এবং assigned/unassigned status refresh
      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });

      // Employee asset information refresh
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // Allocation report refresh
      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });

      // Dashboard count এবং recent assignment refresh
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Create Asset Assignment Error:",
        error,
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to assign asset!";

      toast.error(message);
    },
  });
};

// GET ALL ASSET ASSIGNMENTS
export const useGetAssetAssignments = () => {
  return useQuery({
    queryKey: ["asset-assignments"],

    queryFn: async () => {
      const response =
        await axiosInstance.get(
          "/asset-assignments",
        );

      return (
        response.data?.data ||
        response.data
      );
    },

    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

// UNASSIGN ASSET
export const useUnassignAssetAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return axiosInstance.patch(
        `/asset-assignments/${id}/unassign`,
      );
    },

    onSuccess: () => {
      // Asset assignment list refresh
      queryClient.invalidateQueries({
        queryKey: ["asset-assignments"],
      });

      // Asset list এবং assigned/unassigned status refresh
      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });

      // Employee asset information refresh
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // Allocation report refresh
      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });

      // Dashboard count এবং recent assignment refresh
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Unassign Asset Error:",
        error,
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to unassign asset!";

      toast.error(message);
    },
  });
};