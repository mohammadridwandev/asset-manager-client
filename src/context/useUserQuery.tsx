import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import Swal from "sweetalert2";
import toast from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";

interface UserType {
  id: string;
  name: string;
  email: string;
  role:
    | "ADMIN"
    | "MANAGER"
    | "FINANCE"
    | "IT"
    | "GUEST";
  image?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
}

// CREATE USER
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: any) => {
      return axiosInstance.post(
        "/auth/register",
        newUser,
      );
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success(
        response?.data?.message ||
          "Account created successfully!",
      );
    },

    onError: (error: any) => {
      console.error(
        "Create User Error:",
        error,
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to create account.";

      toast.error(message);
    },
  });
};

// GET ALL USERS
export const useGetUsers = () => {
  return useQuery<UserType[]>({
    queryKey: ["users"],

    queryFn: async ({ signal }) => {
      const token =
        localStorage.getItem("token");

      const response =
        await axiosInstance.get(
          "/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal,
          },
        );

      return response.data?.data || [];
    },

    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// UPDATE USER
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
      const token =
        localStorage.getItem("token");

      return axiosInstance.patch(
        `/users/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        },
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success(
        "User updated successfully!",
      );
    },

    onError: (error: any) => {
      console.error(
        "Update User Error:",
        error,
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update user!";

      toast.error(message);
    },
  });
};

// DELETE USER
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token =
        localStorage.getItem("token");

      return axiosInstance.delete(
        `/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      Swal.fire({
        title: "Deleted!",
        text: "User has been deleted.",
        icon: "success",
      });
    },

    onError: (error: any) => {
      console.error(
        "Delete User Error:",
        error,
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete user!";

      toast.error(message);
    },
  });
};

// UPDATE LOGGED-IN USER PROFILE
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
      const token =
        localStorage.getItem("token");

      return axiosInstance.patch(
        `/users/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        },
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success(
        "Profile updated successfully!",
      );
    },

    onError: (error: any) => {
      console.error(
        "Update Profile Error:",
        error,
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update profile!";

      toast.error(message);
    },
  });
};