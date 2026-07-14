import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance";
import toast from "react-hot-toast";

// CREATE REPORT
export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createReport: any) => {
      return axiosInstance.post("/reports", createReport);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reports"],
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
        "Failed to create report";

      console.log(errorMessage);
      toast.error("Failed to create report");
    },
  });
};

// GET SINGLE REPORT
export const useGetSingleReport = (id?: string) => {
  return useQuery({
    queryKey: ["report", id],

    queryFn: async () => {
      const response = await axiosInstance.get(`/reports/${id}`);
      return response.data?.data || response.data;
    },

    enabled: !!id,
  });
};

// GET ALL REPORTS
export const useGetReports = () => {
  return useQuery({
    queryKey: ["reports"],

    queryFn: async () => {
      const response = await axiosInstance.get("/reports");
      console.log("this is get all report data", response);
      return response.data?.data || response.data;
    },
  });
};

// UPDATE REPORT
// UPDATE REPORT
export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updateData,
    }: {
      id: string;
      updateData: Record<string, any> | FormData;
    }) => {
      const token = localStorage.getItem("token");

      // ========================= UPDATED: FormData কি না check =========================
      const isFormData = updateData instanceof FormData;

      return axiosInstance.patch(`/reports/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,

          // ========================= UPDATED: file upload হলে multipart/form-data =========================
          ...(isFormData
            ? {
                "Content-Type": "multipart/form-data",
              }
            : {
                "Content-Type": "application/json",
              }),
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },

    onError: (error: any) => {
      // ========================= UPDATED: backend error console-এ থাকবে =========================
      console.error("Update Report Error:", error);
    },
  });
};

// DELETE REPORT
export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");

      return axiosInstance.delete(`/reports/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },

    onError: (error: any) => {
      console.log(error);
      toast.error("Failed to delete report!");
    },
  });
};
