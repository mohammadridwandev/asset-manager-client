import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";


// CREATE DEPARTMENT ASSET
export const useCreateDepartmentAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      createDepartmentAsset: any,
    ) => {
      return axiosInstance.post(
        "/department-assets",
        createDepartmentAsset,
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["department-assets"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Create Department Asset Error:",
        error,
      );

      const status = error?.response?.status;

      const message =
        status === 409
          ? error?.response?.data?.message ||
            "This serial number already exists."
          : error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Department asset could not be created. Please try again.";

      toast.error(message);
    },
  });
};

// GET SINGLE DEPARTMENT ASSET
export const useGetSingleDepartmentAsset = (
  id?: string,
) => {
  return useQuery({
    queryKey: ["department-assets", id],

    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get(
        `/department-assets/${id}`,
        {
          signal,
        },
      );

      return response.data?.data || response.data;
    },

    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

// GET ALL DEPARTMENT ASSETS
export const useGetDepartmentAssets = () => {
  return useQuery({
    queryKey: ["department-assets"],

    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get(
        "/department-assets",
        {
          signal,
        },
      );

      return response.data?.data || [];
    },

    refetchOnWindowFocus: false,
  });
};

// GET ASSIGNED DEPARTMENTS OF ONE ASSET
export const useGetAssetDepartments = (
  assetId?: string,
) => {
  return useQuery({
    queryKey: [
      "department-assets",
      assetId,
      "departments",
    ],

    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get(
        `/department-assets/${assetId}/departments`,
        {
          signal,
        },
      );

      return response.data?.data || [];
    },

    enabled: !!assetId,
    refetchOnWindowFocus: false,
  });
};


// UPDATE DEPARTMENT ASSET
export const useUpdateDepartmentAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updateData,
    }: {
      id: string;
      updateData: any;
    }) => {
      const token =
        localStorage.getItem("token");

      return axiosInstance.patch(
        `/department-assets/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },

    onSuccess: (
      _response,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey: ["department-assets"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "department-assets",
          variables.id,
        ],
      });
    },

    onError: (error: any) => {
      console.error(
        "Update Department Asset Error:",
        error,
      );

      const status = error?.response?.status;

      const message =
        status === 409
          ? error?.response?.data?.message ||
            "This serial number is already used by another department asset."
          : error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Department asset could not be updated. Please try again.";

      toast.error(message);
    },
  });
};


// DELETE DEPARTMENT ASSET
export const useDeleteDepartmentAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token =
        localStorage.getItem("token");

      return axiosInstance.delete(
        `/department-assets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["department-assets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Delete Department Asset Error:",
        error,
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete department asset.";

      toast.error(message);
    },
  });
};

// ASSIGN ASSET TO DEPARTMENT
export const useAssignDepartmentAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assetId,
      departmentId,
    }: {
      assetId: string;
      departmentId: number;
    }) => {
      const token =
        localStorage.getItem("token");

      return axiosInstance.post(
        `/department-assets/${assetId}/departments`,
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
      variables,
    ) => {
      const message =
        response?.data?.message ||
        "Asset assigned to department successfully.";

      toast.success(message);

      queryClient.invalidateQueries({
        queryKey: ["department-assets"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "department-assets",
          variables.assetId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "department-assets",
          variables.assetId,
          "departments",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Assign Asset To Department Error:",
        error,
      );

      const status = error?.response?.status;

      let message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to assign asset to department.";

      if (status === 400) {
        message =
          error?.response?.data?.message ||
          "Please select a valid department.";
      } else if (status === 401) {
        message =
          "Your session has expired. Please log in again.";
      } else if (status === 403) {
        message =
          "You do not have permission to assign this asset.";
      } else if (status === 404) {
        message =
          error?.response?.data?.message ||
          "Asset or department was not found.";
      } else if (status === 409) {
        message =
          error?.response?.data?.message ||
          "This asset is already assigned to the selected department.";
      } else if (status >= 500) {
        message =
          error?.response?.data?.message ||
          "Unable to assign the asset at the moment. Please try again later.";
      } else if (!error?.response) {
        message =
          "Unable to connect to the server. Please check your internet connection.";
      }

      toast.error(message);
    },
  });
};


// UNASSIGN ASSET FROM DEPARTMENT
export const useUnassignDepartmentAsset =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: async ({
        assetId,
        departmentId,
      }: {
        assetId: string;
        departmentId: number;
      }) => {
        const token =
          localStorage.getItem("token");

        return axiosInstance.delete(
          `/department-assets/${assetId}/departments/${departmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      },

      onSuccess: (
        response,
        variables,
      ) => {
        const message =
          response?.data?.message ||
          "Asset unassigned from department successfully.";

        toast.success(message);

        queryClient.invalidateQueries({
          queryKey: [
            "department-assets",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "department-assets",
            variables.assetId,
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "department-assets",
            variables.assetId,
            "departments",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: ["departments"],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "report-allocation",
          ],
        });
      },

      onError: (error: any) => {
        console.error(
          "Unassign Asset From Department Error:",
          error,
        );

        const status =
          error?.response?.status;

        let message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to unassign asset from department.";

        if (status === 400) {
          message =
            error?.response?.data?.message ||
            "Invalid asset or department.";
        } else if (status === 401) {
          message =
            "Your session has expired. Please log in again.";
        } else if (status === 403) {
          message =
            "You do not have permission to unassign this asset.";
        } else if (status === 404) {
          message =
            error?.response?.data?.message ||
            "The department assignment was not found.";
        } else if (status >= 500) {
          message =
            error?.response?.data?.message ||
            "Unable to unassign the asset at the moment. Please try again later.";
        } else if (!error?.response) {
          message =
            "Unable to connect to the server. Please check your internet connection.";
        }

        toast.error(message);
      },
    });
  };