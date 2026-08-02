import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";

// CREATE ASSET
export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createAsset: any) => {
      return axiosInstance.post("/assets", createAsset);
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
    },

    onError: (error: any) => {
      console.error(error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create assets";

      console.log(errorMessage);

      toast.error("Failed to create assets");
    },
  });
};

// GET SINGLE ASSET
export const useGetSingleAsset = (id?: string) => {
  return useQuery({
    queryKey: ["assets", id],

    queryFn: async () => {
      const response = await axiosInstance.get(`/assets/${id}`);

      return response.data?.data || response.data;
    },

    enabled: !!id,
  });
};

// GET ALL ASSETS
export const useGetAssets = (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  assetType: string = "",
  assignmentStatus: string = "",
) => {
  return useQuery({
    queryKey: [
      "assets",
      page,
      limit,
      search,
      assetType,
      assignmentStatus,
    ],

    queryFn: async () => {
      const response = await axiosInstance.get("/assets", {
        params: {
          page,
          limit,
          search,
          assetType,
          assignmentStatus,
        },
      });

      return {
        assets: response.data?.data || [],
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
  });
};

// UPDATE ASSET
export const useUpdateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updateData,
    }: {
      id: string;
      updateData: any;
    }) => {
      const token = localStorage.getItem("token");

      return axiosInstance.patch(
        `/assets/${id}`,
        updateData,
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
    },

    onError: (error: any) => {
      console.error(error);
    },
  });
};

// DELETE ASSET
export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");

      return axiosInstance.delete(`/assets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    },

    onError: (error: any) => {
      console.error(error);
    },
  });
};

// EXPORT ASSETS
export const useExportAssets = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get(
        "/assets/export",
      );

      return response.data?.data || [];
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to export assets.";

      toast.error(message);
    },
  });
};

// GET ASSET FILTER OPTIONS
export const useGetAssetFilterOptions = () => {
  return useQuery({
    queryKey: ["asset-filter-options"],

    queryFn: async () => {
      const response = await axiosInstance.get(
        "/assets/filter-options",
      );

      return {
        assetTypes:
          response.data?.data?.assetTypes || [],
      };
    },

    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};