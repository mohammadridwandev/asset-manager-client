import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Swal from "sweetalert2";
import toast from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";

interface UserType {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "FINANCE" | "IT" | "GUEST";
  image?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
}

// create users
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: any) => {
      return axiosInstance.post("/auth/register", newUser);
    },

    onSuccess: (response) => {
      if (response.data.success || response.status === 201) {
        toast.success("Account created successfully!");
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },

    onError: (error: any) => {
      console.error(error);
      toast.error("Failed to create account.");
    },
  });
};

// get all users
export const useGetUsers = () => {
  return useQuery<UserType[]>({
    queryKey: ["users"],
    queryFn: async () => {
      // protect route
      const token = localStorage.getItem("token");
      // api response
      const response = await axiosInstance.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Full API Response:", response);

      // backend data return
      return response.data.data;
    },
  });
};

// user update
export const useUpdateUser = () => {
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

      return axiosInstance.patch(`/users/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
    },

    onError: (error: any) => {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update user!");
    },
  });
};

// delete users
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");

      return axiosInstance.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      Swal.fire({
        title: "Deleted!",
        text: "User has been deleted.",
        icon: "success",
      });
    },

    // error handling
    onError: (error: any) => {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete user!");
    },
  });
};

// UPDATED: logged-in user profile update hook
// UPDATED: logged-in user profile update
export const useUpdateProfile = () => {
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

      return axiosInstance.patch(`/users/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Profile updated successfully!");
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile!");
      console.error(error);
      // toast.error("Failed to update profile!");
    },
  });
};
