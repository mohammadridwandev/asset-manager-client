import { useMutation } from "@tanstack/react-query";

import toast from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";

// ======================================================
// SEARCH EMPLOYEE PROFILE
// ======================================================

export const useSearchEmployeeProfile = () => {
  return useMutation({
    // UPDATED: search api call
    mutationFn: async (searchText: string) => {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.get(
        `/search/profile?query=${encodeURIComponent(searchText)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.data;
    },

    // UPDATED: success message
    onSuccess: () => {
      // optional
    },

    // UPDATED: error handling
    onError: (error: any) => {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Employee not found.",
      );
    },
  });
};