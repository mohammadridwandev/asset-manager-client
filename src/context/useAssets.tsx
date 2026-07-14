import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance";
import toast from "react-hot-toast";

// create asset:
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

// get all assets:
export const useGetAssets = () => {
  return useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const response = await axiosInstance.get("/assets");
      console.log("this is get all employee data", response);
      return response.data?.data || response.data;
    },
  });
};

// UPDATE ASSET
export const useUpdateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updateData }: { id: string; updateData: any }) => {
      const token = localStorage.getItem("token");

      return axiosInstance.patch(`/assets/${id}`, updateData, {
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
    },

    onError: (error: any) => {
      console.error(error);
      // toast.error("Failed to update asset!",);
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
    },

    onError: (error: any) => {
      console.error(error);
      // toast.error("Failed to delete asset!");
    },
  });
};
