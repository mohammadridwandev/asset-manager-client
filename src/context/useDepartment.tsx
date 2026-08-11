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
  const queryClient = useQueryClient();

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
        error?.response?.data?.message ||
        error?.response?.data?.error ||
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
    queryKey: ["departments", id],

    queryFn: async ({ signal }) => {
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

export const useGetDepartments = () => {
  return useQuery({
    queryKey: ["departments"],

    queryFn: async ({ signal }) => {
      const response =
        await axiosInstance.get(
          "/departments",
          {
            signal,
          },
        );

      return response.data?.data || [];
    },

    refetchOnWindowFocus: false,
  });
};

// =========================
// UPDATE DEPARTMENT
// =========================

export const useUpdateDepartment = () => {
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
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Update Department Error:",
        error,
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Department could not be updated. Please try again.";

      toast.error(message);
    },
  });
};

// =========================
// DELETE DEPARTMENT
// =========================

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token =
        localStorage.getItem("token");

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
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Delete Department Error:",
        error,
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
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

        queryClient.invalidateQueries({
          queryKey: ["assets"],
        });

        queryClient.invalidateQueries({
          queryKey: ["departments"],
        });

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "report-allocation",
          ],
        });
      },

      onError: (error: any) => {
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
// UNASSIGN ASSET FROM DEPARTMENT
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

        queryClient.invalidateQueries({
          queryKey: ["assets"],
        });

        queryClient.invalidateQueries({
          queryKey: ["departments"],
        });

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
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

// =========================
// SEND EMPLOYEE TO VACATION
// =========================

export const useSendEmployeeToVacation =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: async ({
        employeeId,
        departmentId,
      }: {
        employeeId: number;
        departmentId: number;
      }) => {
        const token =
          localStorage.getItem(
            "token",
          );

        return axiosInstance.patch(
          `/departments/employees/${employeeId}/vacation`,
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

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["employees"],
        });

        queryClient.invalidateQueries({
          queryKey: ["employee"],
        });

        queryClient.invalidateQueries({
          queryKey: ["assets"],
        });

        queryClient.invalidateQueries({
          queryKey: ["departments"],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "asset-assignments",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "report-allocation",
          ],
        });

        // =========================
        // VACATION RECORD REFRESH
        // =========================

        queryClient.invalidateQueries({
          queryKey: [
            "vacation-records",
          ],
        });
      },

      onError: (error: any) => {
        console.error(
          "Send Employee To Vacation Error:",
          error,
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.error ||
          "Failed to send employee to vacation.";

        toast.error(message);
      },
    });
  };

// =========================
// GET VACATION RECORDS
// =========================

export const useGetVacationRecords =
  () => {
    return useQuery({
      queryKey: [
        "vacation-records",
      ],

      queryFn: async ({
        signal,
      }) => {
        const response =
          await axiosInstance.get(
            "/departments/vacation-records",
            {
              signal,
            },
          );

        return (
          response.data?.data ||
          []
        );
      },

      refetchOnWindowFocus:
        false,
    });
  };

// =========================
// RETURN EMPLOYEE FROM VACATION
// =========================

export const useReturnEmployeeFromVacation =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: async (
        employeeId: number,
      ) => {
        const token =
          localStorage.getItem(
            "token",
          );

        return axiosInstance.patch(
          `/departments/employees/${employeeId}/return-active`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      },

      onSuccess: () => {
        // toast.success(
        //   "Employee returned to Active successfully.",
        // );

        queryClient.invalidateQueries({
          queryKey: [
            "vacation-records",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: ["employees"],
        });

        queryClient.invalidateQueries({
          queryKey: ["employee"],
        });

        queryClient.invalidateQueries({
          queryKey: ["assets"],
        });

        queryClient.invalidateQueries({
          queryKey: ["departments"],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "asset-assignments",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "report-allocation",
          ],
        });
      },

      onError: (error: any) => {
        console.error(
          "Return Employee From Vacation Error:",
          error,
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.error ||
          "Failed to return employee from vacation.";

        toast.error(message);
      },
    });
  };