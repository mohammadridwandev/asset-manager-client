import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import axiosInstance from "../config/axiosInstance";

// =========================
// CREATE DEPARTMENT
// =========================

export const useCreateDepartment = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      createDepartment: any,
    ) => {
      return axiosInstance.post(
        "/departments",
        createDepartment,
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Create Department Error:",
        error,
      );

      const message =
        error?.response?.data
          ?.message ||
        error?.response?.data
          ?.error ||
        "Department could not be created. Please try again.";

      toast.error(message);
    },
  });
};

// =========================
// GET SINGLE DEPARTMENT
// =========================

export const useGetSingleDepartment = (
  id?: string,
) => {
  return useQuery({
    queryKey: [
      "departments",
      id,
    ],

    queryFn: async ({
      signal,
    }) => {
      const response =
        await axiosInstance.get(
          `/departments/${id}`,
          {
            signal,
          },
        );

      return (
        response.data?.data ||
        response.data
      );
    },

    enabled: !!id,

    refetchOnWindowFocus: false,
  });
};

// =========================
// GET ALL DEPARTMENTS
// =========================

export const useGetDepartments =
  () => {
    return useQuery({
      queryKey: ["departments"],

      queryFn: async ({
        signal,
      }) => {
        const response =
          await axiosInstance.get(
            "/departments",
            {
              signal,
            },
          );

        return (
          response.data?.data ||
          []
        );
      },

      refetchOnWindowFocus: false,
    });
  };

// =========================
// UPDATE DEPARTMENT
// =========================

export const useUpdateDepartment =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: async ({
        id,
        updateData,
      }: {
        id: string;
        updateData: any;
      }) => {
        const token =
          localStorage.getItem(
            "token",
          );

        return axiosInstance.patch(
          `/departments/${id}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      },

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "departments",
            ],
          },
        );
      },

      onError: (
        error: any,
      ) => {
        console.error(
          "Update Department Error:",
          error,
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.error ||
          "Department could not be updated. Please try again.";

        toast.error(message);
      },
    });
  };

// =========================
// DELETE DEPARTMENT
// =========================

export const useDeleteDepartment =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: async (
        id: string,
      ) => {
        const token =
          localStorage.getItem(
            "token",
          );

        return axiosInstance.delete(
          `/departments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      },

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "departments",
            ],
          },
        );

        queryClient.invalidateQueries(
          {
            queryKey: ["assets"],
          },
        );
      },

      onError: (
        error: any,
      ) => {
        console.error(
          "Delete Department Error:",
          error,
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.error ||
          "Failed to delete department.";

        toast.error(message);
      },
    });
  };

// =========================
// ASSIGN MAIN ASSET TO DEPARTMENT
// =========================

export const useAssignAssetToDepartment =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: async ({
        assetId,
        departmentId,
      }: {
        assetId: number;
        departmentId: number;
      }) => {
        const token =
          localStorage.getItem(
            "token",
          );

        return axiosInstance.patch(
          `/departments/assets/${assetId}/assign`,
          {
            departmentId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      },

      onSuccess: (
        response,
      ) => {
        const departmentName =
          response?.data?.data
            ?.department?.name;

        toast.success(
          departmentName
            ? `Asset assigned to ${departmentName} successfully.`
            : "Asset assigned to department successfully.",
        );

        queryClient.invalidateQueries(
          {
            queryKey: ["assets"],
          },
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "departments",
            ],
          },
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "dashboard",
            ],
          },
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "report-allocation",
            ],
          },
        );
      },

      onError: (
        error: any,
      ) => {
        console.error(
          "Assign Asset To Department Error:",
          error,
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.error ||
          "Failed to assign asset to department.";

        toast.error(message);
      },
    });
  };

// =========================
// UNASSIGN MAIN ASSET FROM ONE DEPARTMENT
// =========================

export const useUnassignAssetFromDepartment =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: async ({
        assetId,
        departmentId,
      }: {
        assetId: number;
        departmentId: number;
      }) => {
        const token =
          localStorage.getItem(
            "token",
          );

        return axiosInstance.delete(
          `/departments/assets/${assetId}/departments/${departmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      },

      onSuccess: () => {
        toast.success(
          "Asset unassigned from department successfully.",
        );

        queryClient.invalidateQueries(
          {
            queryKey: ["assets"],
          },
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "departments",
            ],
          },
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "dashboard",
            ],
          },
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "report-allocation",
            ],
          },
        );
      },

      onError: (
        error: any,
      ) => {
        console.error(
          "Unassign Asset From Department Error:",
          error,
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.error ||
          "Failed to unassign asset from department.";

        toast.error(message);
      },
    });
  };