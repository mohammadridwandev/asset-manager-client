import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance";


// ---------------------------------------------------- GET DASHBOARD DATA

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],

    queryFn: async () => {
      const response =
        await axiosInstance.get("/dashboard");

      return response.data?.data;
    },
  });
};