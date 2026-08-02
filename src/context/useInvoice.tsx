import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";

// CREATE INVOICE
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
      // Invoice list refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      // Employee details-এ invoice relation থাকলে refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      toast.success("Invoice created successfully");
    },

    onError: (error: any) => {
      // Full technical error developer console-এ থাকবে
      console.error("Create Invoice Error:", error);

      const status = error?.response?.status;

      let message = "Invoice could not be created. Please try again.";

      // Invoice image বা number missing
      if (status === 400) {
        message =
          error?.response?.data?.message ||
          "Please check the invoice information.";
      }

      // Duplicate invoice number
      else if (status === 409) {
        message =
          error?.response?.data?.message ||
          "This invoice number already exists.";
      }

      // Session expired
      else if (status === 401) {
        message = "Your session has expired. Please log in again.";
      }

      // Permission denied
      else if (status === 403) {
        message = "You do not have permission to create an invoice.";
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

// GET SINGLE INVOICE
export const useGetSingleInvoice = (id?: string) => {
  return useQuery({
    queryKey: ["invoice", id],

    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get(`/invoices/${id}`, {
        signal,
      });

      return response.data?.data || response.data;
    },

    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// GET INVOICES WITH PAGINATION
export const useGetInvoices = (
  page: number = 1,
  limit: number = 10,
  search: string = "",
) => {
  return useQuery({
    queryKey: ["invoices", page, limit, search],

    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get("/invoices", {
        params: {
          page,
          limit,
          search,
        },

        signal,
      });

      return {
        invoices: response.data?.invoices || [],

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
      // Invoice list refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      // Single invoice cache refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["invoice"],
      });

      // Employee details-এ invoice relation refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      toast.success("Invoice updated successfully");
    },

    onError: (error: any) => {
      // Full technical error developer console-এ থাকবে
      console.error("Update Invoice Error:", error);

      const status = error?.response?.status;

      let message = "Invoice could not be updated. Please try again.";

      // Invalid ID বা invoice number
      if (status === 400) {
        message =
          error?.response?.data?.message ||
          "Please check the invoice information.";
      }

      // Duplicate invoice number
      else if (status === 409) {
        message =
          error?.response?.data?.message ||
          "This invoice number is already used by another invoice.";
      }

      // Session expired
      else if (status === 401) {
        message = "Your session has expired. Please log in again.";
      }

      // Permission denied
      else if (status === 403) {
        message = "You do not have permission to update this invoice.";
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
      // Invoice list refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      // Single invoice cache remove/refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["invoice"],
      });

      // Employee details refresh করবে
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      toast.success("Invoice deleted successfully");
    },

    onError: (error: any) => {
      // Full technical error developer console-এ থাকবে
      console.error("Delete Invoice Error:", error);

      const status = error?.response?.status;

      let message = "Invoice could not be deleted. Please try again.";

      if (status === 404) {
        message = "The invoice was not found.";
      } else if (status === 401) {
        message = "Your session has expired. Please log in again.";
      } else if (status === 403) {
        message = "You do not have permission to delete this invoice.";
      } else if (!error?.response) {
        message =
          "Unable to connect to the server. Please check your connection.";
      }

      toast.error(message);
    },
  });
};
