import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance";

// ---------------------------------------------------- GET DASHBOARD DATA

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],

    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get(
        "/dashboard",
        {
          signal,
        },
      );

      return response.data?.data;
    },

    // Dashboard data 30 seconds fresh থাকবে
    staleTime: 30 * 1000,

    // Tab change করলে unnecessary API call হবে না
    refetchOnWindowFocus: false,

    // Error হলে ১ বার retry করবে
    retry: 1,
  });
};