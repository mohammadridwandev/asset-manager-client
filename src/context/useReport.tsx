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

      // Employee-related report information refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // UPDATED:
      // Allocation Report-এর cached data refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
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

export const useGetSingleReport = (
  id?: string,
) => {
  return useQuery({
    queryKey: ["report", id],

    queryFn: async () => {
      const response =
        await axiosInstance.get(
          `/reports/${id}`,
        );

      return (
        response.data?.data ||
        response.data
      );
    },

    enabled: !!id,
  });
};



export const useGetReports = () => {
  return useQuery({
    queryKey: ["reports"],

    queryFn: async () => {
      const response =
        await axiosInstance.get(
          "/reports",
        );

      return (
        response.data?.data ||
        response.data
      );
    },

    // Report page-এ ফিরে এলে অপ্রয়োজনীয় request কমাবে
    staleTime: 30 * 1000,

    // Browser tab change করলে auto refetch বন্ধ থাকবে
    refetchOnWindowFocus: false,
  });
};




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

            // File upload হলে multipart,
            // সাধারণ update হলে JSON পাঠাবে
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

      // Employee data refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // UPDATED:
      // Allocation Report refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
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

      // Employee data refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // UPDATED:
      // Allocation Report refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
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


export const useGetAllocationReport = () => {
  return useQuery({
    queryKey: ["report-allocation"],

    queryFn: async ({ signal }) => {
      const response =
        await axiosInstance.get(
          "/reports/allocation",
          {
            // নতুন request হলে পুরোনো request cancel করতে সাহায্য করবে
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

    // ৩০ সেকেন্ড একই data fresh ধরা হবে
    staleTime: 30 * 1000,

    // Browser tab change করলে অপ্রয়োজনীয় request যাবে না
    refetchOnWindowFocus: false,

    // Network problem হলে ২ বার retry করবে
    retry: 2,
  });
};