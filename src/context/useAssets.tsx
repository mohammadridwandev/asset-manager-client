import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";

// =========================
// CREATE ASSET
// =========================

export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      createAsset: FormData,
    ) => {
      return axiosInstance.post(
        "/assets",
        createAsset,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        },
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      queryClient.invalidateQueries({
        queryKey: ["asset-filter-options"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Create Asset Error:",
        error,
      );

      const status =
        error?.response?.status;

      const message =
        status === 409
          ? error?.response?.data
              ?.message ||
            "This serial number already exists."
          : error?.response?.data
              ?.message ||
            "Asset could not be created. Please try again.";

      toast.error(message);
    },
  });
};

// =========================
// GET SINGLE ASSET
// =========================

export const useGetSingleAsset = (
  id?: string,
) => {
  return useQuery({
    queryKey: ["assets", id],

    queryFn: async ({ signal }) => {
      const response =
        await axiosInstance.get(
          `/assets/${id}`,
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
    refetchOnWindowFocus: false,
  });
};



export const useGetAssets = (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  assetType: string = "",
  assignmentStatus: string = "",
  departmentOnly: boolean = false,

  // Department filter
  departmentName: string = "",

  // DIRECT | EMPLOYEE
  departmentSource:
    | "DIRECT"
    | "EMPLOYEE"
    | "" = "",
) => {
  return useQuery({
    queryKey: [
      "assets",
      page,
      limit,
      search,
      assetType,
      assignmentStatus,
      departmentOnly,
      departmentName,
      departmentSource,
    ],

    queryFn: async ({
      signal,
    }) => {
      const response =
        await axiosInstance.get(
          "/assets",
          {
            params: {
              page,
              limit,
              search,
              assetType,
              assignmentStatus,
              departmentOnly,

              // Department name
              departmentName,

              // DIRECT or EMPLOYEE
              departmentSource,
            },

            signal,
          },
        );

      return {
        assets:
          response.data?.data || [],

        pagination:
          response.data
            ?.pagination || {
            currentPage: page,
            limit,
            totalData: 0,
            totalPages: 0,
            hasNextPage:
              false,
            hasPreviousPage:
              false,
          },
      };
    },

    // Keep old page while loading new page
    placeholderData: (
      previousData,
    ) => previousData,

    refetchOnWindowFocus:
      false,
  });
};



// =========================
// UPDATE ASSET
// =========================

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updateData,
    }: {
      id: string;
      updateData: FormData;
    }) => {
      const token =
        localStorage.getItem("token");

      return axiosInstance.patch(
        `/assets/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        },
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      queryClient.invalidateQueries({
        queryKey: ["asset-filter-options"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Update Asset Error:",
        error,
      );

      const status =
        error?.response?.status;

      const message =
        status === 409
          ? error?.response?.data
              ?.message ||
            "This serial number is already used by another asset."
          : error?.response?.data
              ?.message ||
            "Asset could not be updated. Please try again.";

      toast.error(message);
    },
  });
};

// =========================
// DELETE ASSET
// =========================

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string,
    ) => {
      const token =
        localStorage.getItem("token");

      return axiosInstance.delete(
        `/assets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      queryClient.invalidateQueries({
        queryKey: ["asset-filter-options"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Delete Asset Error:",
        error,
      );

      const errorMessage =
        error?.response?.data
          ?.message ||
        error?.response?.data?.error ||
        "Failed to delete asset.";

      toast.error(errorMessage);
    },
  });
};

// =========================
// EXPORT ALL ASSETS
// =========================

export const useExportAssets = () => {
  return useMutation({
    mutationFn: async () => {
      const response =
        await axiosInstance.get(
          "/assets/export",
        );

      return (
        response.data?.data || []
      );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data
          ?.message ||
        error?.response?.data?.error ||
        "Failed to export assets.";

      toast.error(message);
    },
  });
};



export const useGetAssetFilterOptions = () => {
    return useQuery({
      queryKey: [
        "asset-filter-options",
      ],

      queryFn: async ({
        signal,
      }) => {
        const response =
          await axiosInstance.get(
            "/assets/filter-options",
            {
              signal,
            },
          );

        return {
          // Asset types
          assetTypes:
            response.data?.data
              ?.assetTypes || [],

          // Direct department asset counts
          directDepartmentCounts:
            response.data?.data
              ?.directDepartmentCounts ||
            [],

          // Employee department asset counts
          employeeDepartmentCounts:
            response.data?.data
              ?.employeeDepartmentCounts ||
            [],
        };
      },

      staleTime:
        5 * 60 * 1000,

      refetchOnWindowFocus:
        false,
    });
  };