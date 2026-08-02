import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";

// ====================================================
// CREATE REPORT
// ====================================================
export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createReport: any) => {
      return axiosInstance.post(
        "/reports",
        createReport,
      );
    },

    onSuccess: () => {
      // Report list refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      // Employee-related report data refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // Allocation Report refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });

      // Dashboard report count refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Create Report Error:",
        error,
      );

      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to create report";

      toast.error(errorMessage);
    },
  });
};

// ====================================================
// GET SINGLE REPORT
// ====================================================
export const useGetSingleReport = (
  id?: string,
) => {
  return useQuery({
    queryKey: ["report", id],

    queryFn: async ({ signal }) => {
      const response =
        await axiosInstance.get(
          `/reports/${id}`,
          {
            signal,
          },
        );

      return (
        response.data?.data ||
        response.data
      );
    },

    enabled: !!id,

    retry: 1,

    refetchOnWindowFocus: false,
  });
};

// ====================================================
// GET ALL REPORTS
// ====================================================
export const useGetReports = () => {
  return useQuery({
    queryKey: ["reports"],

    queryFn: async ({ signal }) => {
      const response =
        await axiosInstance.get(
          "/reports",
          {
            signal,
          },
        );

      return (
        response.data?.data ||
        response.data
      );
    },

    // ৩০ সেকেন্ড একই data fresh থাকবে
    staleTime: 30 * 1000,

    // Network problem হলে সর্বোচ্চ ২ বার retry করবে
    retry: 2,

    // Browser tab change করলে অপ্রয়োজনীয় refetch হবে না
    refetchOnWindowFocus: false,
  });
};

// ====================================================
// UPDATE REPORT
// ====================================================
export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updateData,
    }: {
      id: string;
      updateData:
        | Record<string, any>
        | FormData;
    }) => {
      const token =
        localStorage.getItem("token");

      const isFormData =
        updateData instanceof FormData;

      return axiosInstance.patch(
        `/reports/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,

            ...(isFormData
              ? {
                  "Content-Type":
                    "multipart/form-data",
                }
              : {
                  "Content-Type":
                    "application/json",
                }),
          },
        },
      );
    },

    onSuccess: () => {
      // Report list refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      // Single report cache refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["report"],
      });

      // Employee-related report data refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // Allocation Report refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });

      // Dashboard report count refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Update Report Error:",
        error,
      );

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update report.";

      toast.error(errorMessage);
    },
  });
};

// ====================================================
// DELETE REPORT
// ====================================================
export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token =
        localStorage.getItem("token");

      return axiosInstance.delete(
        `/reports/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },

    onSuccess: () => {
      // Report list refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      // Single report cache refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["report"],
      });

      // Employee-related report data refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // Allocation Report refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });

      // Dashboard report count refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Delete Report Error:",
        error,
      );

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete report!";

      toast.error(errorMessage);
    },
  });
};

// ====================================================
// GET ALLOCATION REPORT
// ====================================================
export const useGetAllocationReport =
  () => {
    return useQuery({
      queryKey: [
        "report-allocation",
      ],

      queryFn: async ({
        signal,
      }) => {
        const response =
          await axiosInstance.get(
            "/reports/allocation",
            {
              signal,
            },
          );

        return {
          // Department-wise report rows
          reportData:
            response.data?.data || [],

          // সব department-এর grand total
          summary:
            response.data?.summary || {
              employees: 0,
              assets: 0,
              assetValue: 0,
              licenses: 0,
              licenseValue: 0,
              totalValue: 0,
            },
        };
      },

      
      staleTime: 30 * 1000,

      
      retry: 2,

      // Browser tab change করলে অপ্রয়োজনীয় refetch হবে না
      refetchOnWindowFocus: false,
    });
  };