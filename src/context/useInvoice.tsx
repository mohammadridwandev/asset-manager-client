import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance";

import toast from "react-hot-toast";

// Custom hook to create an invoice
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoiceData: FormData) => {
      return axiosInstance.post("/invoices", invoiceData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice created successfully");
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create invoice";
      console.error(errorMessage);
      toast.error("Failed to create invoice");
    },
  });
};

// Custom hook to fetch a single invoice by ID
export const useGetSingleInvoice = (id?: string) => {
  return useQuery({
    queryKey: ["invoice", id],

    queryFn: async () => {
      const response = await axiosInstance.get(`/invoices/${id}`);
      return response.data?.data || response.data;
    },

    enabled: !!id,
  });
};

// Custom hook to fetch invoices
export const useGetInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await axiosInstance.get("/invoices");
      return response.data?.data || response.data;
    },
  });
};


// UPDATE INVOICE
export const useUpdateInvoice = () => {
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

      return axiosInstance.patch(`/invoices/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      // toast.success("Invoice updated successfully!");
    },

    onError: (error: any) => {
      console.error(error);
      // toast.error("Failed to update invoice!");
    },
  });
};

// DELETE INVOICE
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");

      return axiosInstance.delete(`/invoices/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      // toast.success("Invoice deleted successfully!");
    },

    onError: (error: any) => {
      console.error(error);
      // toast.error("Failed to delete invoice!");
    },
  });
};