import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import axiosInstance from "../config/axiosInstance";
import toast from "react-hot-toast";

// CREATE LICENSE ASSIGNMENT
export const useCreateLicenseAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentData: any) => {
      return axiosInstance.post(
        "/license-assignments",
        assignmentData,
      );
    },

    onSuccess: () => {
      // License assignment list refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["license-assignments"],
      });

      // License list এবং available/used quantity refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["licenses"],
      });

      // Employee license information refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // Allocation Report-এর license count/value refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });

      // Dashboard license count refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Create License Assignment Error:",
        error,
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to assign license!";

      toast.error(message);
    },
  });
};

// GET ALL LICENSE ASSIGNMENTS
export const useGetLicenseAssignments = () => {
  return useQuery({
    queryKey: ["license-assignments"],

    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get(
        "/license-assignments",
        {
          signal,
        },
      );

      return response.data?.data || response.data;
    },

    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// UNASSIGN LICENSE
export const useUnassignLicenseAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return axiosInstance.patch(
        `/license-assignments/${id}/unassign`,
      );
    },

    onSuccess: () => {
      // License assignment list refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["license-assignments"],
      });

      // License list এবং available/used quantity refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["licenses"],
      });

      // Employee license information refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // Allocation Report refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });

      // Dashboard refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Unassign License Error:",
        error,
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to unassign license!";

      toast.error(message);
    },
  });
};