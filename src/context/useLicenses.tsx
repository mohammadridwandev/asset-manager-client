import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";

// CREATE LICENSE
export const useCreateLicense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createLicense: any) => {
      return axiosInstance.post("/licenses", createLicense, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onSuccess: (response: any) => {
      // License list refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["licenses"],
      });

      // Employee license information refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // Dashboard license count refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      // Allocation Report license value/count refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });

      toast.success(
        response?.data?.message || "License created successfully 🎉",
      );
    },

    onError: (error: any) => {
      // Full technical error developer console-এ থাকবে
      console.error("Create License Error:", error);

      const status = error?.response?.status;

      let message = "License could not be created. Please try again.";

      // Duplicate license key
      if (status === 409) {
        message =
          error?.response?.data?.message || "This license key already exists.";
      }

      // Validation problem
      else if (status === 400) {
        message = "Please check the license information.";
      }

      // Network problem
      else if (!error?.response) {
        message =
          "Unable to connect to the server. Please check your connection.";
      }

      toast.error(message);
    },
  });
};


export const useGetSingleLicense = (id?: string) => {
  return useQuery({
    queryKey: ["license", id],

    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get(`/licenses/${id}`, {
        signal,
      });

      return response.data?.data || response.data;
    },

    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// GET LICENSES WITH PAGINATION
export const useLicenses = (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  licenseType: string = "",
) => {
  return useQuery({
    queryKey: ["licenses", page, limit, search, licenseType],

    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get("/licenses", {
        params: {
          page,
          limit,
          search,
          licenseType,
        },

        signal,
      });

      return {
        licenses: response.data?.licenses || [],

        pagination: response.data?.pagination || {
          currentPage: page,
          limit,
          totalData: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    },

    placeholderData: (previousData) => previousData,

    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// UPDATE LICENSE
export const useUpdateLicense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updateData,
    }: {
      id: string;
      updateData: FormData;
    }) => {
      const token = localStorage.getItem("token");

      return axiosInstance.patch(`/licenses/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onSuccess: () => {
      // License list এবং single license cache refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["licenses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["license"],
      });

      // Employee license information refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // Dashboard refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      // Allocation Report refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });

      toast.success("License updated successfully.");
    },

    onError: (error: any) => {
      console.error("Update License Error:", error);

      const status = error?.response?.status;

      let message = "License could not be updated. Please try again.";

      // Duplicate license key
      if (status === 409) {
        message =
          error?.response?.data?.message ||
          "This license key is already used by another license.";
      }

      // Validation problem
      else if (status === 400) {
        message = "Please check the license information.";
      }

      // Network problem
      else if (!error?.response) {
        message =
          "Unable to connect to the server. Please check your connection.";
      }

      toast.error(message);
    },



  });
};

// DELETE LICENSE
export const useDeleteLicense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");

      return axiosInstance.delete(`/licenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: () => {
      // License list refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["licenses"],
      });

      // Single license cache refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["license"],
      });

      // Employee license information refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // Dashboard license count refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      // Allocation Report refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });

      toast.success("License deleted successfully.");
    },

    onError: (error: any) => {
      console.error("Delete License Error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete license.";

      toast.error(message);
    },
  });
};
