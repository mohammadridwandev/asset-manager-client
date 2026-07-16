import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";

// CREATE EMPLOYEE HERE
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createEmployee: any) => {
      return axiosInstance.post("/employees", createEmployee, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
    },

    onSuccess: () => {
      toast.success("Successfully employee created!");
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },

    onError: (error: any) => {
      console.error(error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create employee";
      console.log(errorMessage);

      toast.error("Failed to create employee");
    },
  });
};

export const useGetSingleEmployee = (id?: string) => {
  return useQuery({
    queryKey: ["employee", id],

    queryFn: async () => {
      const response = await axiosInstance.get(`/employees/${id}`);
      return response.data?.data || response.data;
    },
    enabled: !!id,
  });
};

// GET ALL DATA:
export const useGetEmployee = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await axiosInstance.get("/employees");
      console.log("this is get all employee data", response);
      return response.data?.data || response.data;
    },
  });
};

// update employee data here
export const useUpdateEmployee = () => {
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

      return axiosInstance.patch(`/employees/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },

    onError: (error: any) => {
      console.log(error);
      // toast.error("Failed to update employee!");
    },
  });
};


export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");

      return axiosInstance.delete(`/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },

    onError: (error: any) => {
      // ========================= UPDATED: Log backend error for debugging =========================
      console.error("Delete Employee Error:", error);

      // ========================= UPDATED: Get backend error message =========================
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete employee!";

      // ========================= UPDATED: Show actual backend message to user =========================
      // toast.error("Failed to delete employee: ");
      console.log("Delete Employee Error Message:", errorMessage);

    },
  });
};
