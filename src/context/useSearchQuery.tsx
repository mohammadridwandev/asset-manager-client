import { useMutation } from "@tanstack/react-query";

import toast from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";

// ======================================================
// SEARCH EMPLOYEE PROFILE
// ======================================================

export const useSearchEmployeeProfile = () => {
  return useMutation({
    mutationFn: async (searchText: string) => {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.get(
        "/search/profile",
        {
          params: {
            query: searchText,
          },

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data?.data;
    },

    onError: (error: any) => {
      console.error(
        "Search Employee Error:",
        error,
      );

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Employee not found.";

      toast.error(errorMessage);
    },
  });
};