import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance";
import toast from "react-hot-toast";

// Custom hook to create a new license
export const useCreateLicense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createLicense: any) => {
      return axiosInstance.post("/licenses", createLicense, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },

    onSuccess: (response: any) => {
      queryClient.invalidateQueries({
        queryKey: ["licenses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      toast.success(
        response?.data?.message || "License created successfully 🎉",
      );
    },

    onError: (error: any) => {
      console.error(error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create license";

      toast.error("Failed to create license");

      console.log(errorMessage);
    },
  });
};

// Custom hook to fetch a single license by ID
export const useGetSingleLicense = (id?: string) => {
  return useQuery({
    queryKey: ["license", id],

    queryFn: async () => {
      const response = await axiosInstance.get(`/licenses/${id}`);
      return response.data?.data || response.data;
    },

    enabled: !!id,
  });
};

// Custom hook to fetch all licenses
export const useLicenses = () => {
  return useQuery({
    queryKey: ["licenses"],
    queryFn: async () => {
      const response = await axiosInstance.get("/licenses");
      console.log("this is from license ", response);
      return response.data?.data || response.data;
    },
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
      queryClient.invalidateQueries({
        queryKey: ["licenses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },

    onError: (error: any) => {
      console.error(error);
      // toast.error("Failed to update license!");
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
      queryClient.invalidateQueries({
        queryKey: ["licenses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },

    onError: (error: any) => {
      console.error(error);
      // toast.error("Failed to delete license!");
    },
  });
};
