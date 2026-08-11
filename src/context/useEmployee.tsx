import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";

// CREATE EMPLOYEE
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

      queryClient.invalidateQueries({
        queryKey: ["employee-filter-options"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });
    },

    onError: (error: any) => {
      // ========================= UPDATED: Full backend error for developers =========================
      console.error("Create Employee Error:", error);

      const status = error?.response?.status;

      // ========================= UPDATED: Default professional message =========================
      let userMessage = "Employee could not be created. Please try again.";

      // Validation error
      if (status === 400) {
        userMessage =
          error?.response?.data?.message ||
          "Please check the employee information.";
      }

      // Duplicate Iqama / Phone / Email
      else if (status === 409) {
        userMessage =
          error?.response?.data?.message ||
          "Employee information already exists.";
      }

      // Unauthorized
      else if (status === 401) {
        userMessage = "Your session has expired. Please log in again.";
      }

      // Permission denied
      else if (status === 403) {
        userMessage = "You do not have permission to create an employee.";
      }

      // Server error
      else if (status >= 500) {
        userMessage =
          "Unable to create employee at the moment. Please try again later.";
      }

      // Network error
      else if (!error?.response) {
        userMessage =
          "Unable to connect to the server. Please check your internet connection.";
      }

      toast.error(userMessage);
    },
  });
};

// GET SINGLE EMPLOYEE
export const useGetSingleEmployee = (id?: string) => {
  return useQuery({
    queryKey: ["employee", id],

    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get(`/employees/${id}`, {
        signal,
      });
      return response.data?.data || response.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useGetEmployee = (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  department: string = "",
  position: string = "",
  status: string = "",

  // UPDATED:
  // false হলে employee API request যাবে না
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [
      "employees",
      page,
      limit,
      search,
      department,
      position,
      status,
    ],

    queryFn: async ({ signal }) => {
      const response =
        await axiosInstance.get(
          "/employees",
          {
            params: {
              page,
              limit,
              search,
              department,
              position,
              status,
            },

            signal,
          },
        );

      return {
        employees:
          response.data?.employees || [],

        pagination:
          response.data?.pagination || {
            currentPage: page,
            limit,
            totalData: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
      };
    },

    // নতুন result আসা পর্যন্ত previous data রাখবে
    placeholderData: (
      previousData,
    ) => previousData,

    // UPDATED:
    // false হলে এই query run করবে না
    enabled,

    refetchOnWindowFocus: false,

    retry: 1,
  });
};

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

      queryClient.invalidateQueries({
        queryKey: ["employee-filter-options"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });
    },

    onError: (error: any) => {
      // ========================= UPDATED: Full backend error for developers =========================
      console.error("Update Employee Error:", error);

      const status = error?.response?.status;

      let userMessage = "Employee could not be updated. Please try again.";

      if (status === 400) {
        userMessage =
          error?.response?.data?.message ||
          "Please check the employee information.";
      } else if (status === 409) {
        userMessage =
          error?.response?.data?.message ||
          "Employee information already exists.";
      } else if (status === 401) {
        userMessage = "Your session has expired. Please log in again.";
      } else if (status === 403) {
        userMessage = "You do not have permission to update this employee.";
      } else if (status >= 500) {
        userMessage =
          "Unable to update employee at the moment. Please try again later.";
      } else if (!error?.response) {
        userMessage =
          "Unable to connect to the server. Please check your internet connection.";
      }

      toast.error(userMessage);
    },
  });
};

// DELETE EMPLOYEE
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

      queryClient.invalidateQueries({
        queryKey: ["employee-filter-options"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["report-allocation"],
      });
    },

    onError: (error: any) => {
      console.error("Delete Employee Error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete employee.";

      toast.error(message);
    },
  });
};

// EXPORT EMPLOYEES
export const useExportEmployees = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get("/employees/export");

      return response.data?.data || [];
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to export employees.";

      toast.error(message);
    },
  });
};

export const useGetEmployeeFilterOptions = () => {
  return useQuery({
    queryKey: ["employee-filter-options"],

    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get("/employees/filter-options", {
        signal,
      });

      return {
        departments: response.data?.data?.departments || [],

        positions: response.data?.data?.positions || [],
      };
    },

    staleTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,

    retry: 1,
  });
};

// UPDATE EMPLOYEE NOTE
export const useUpdateEmployeeNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      note,
    }: {
      id: string;
      note: string;
    }) => {
      
      const token = localStorage.getItem("token");

      return axiosInstance.patch(
        `/employees/${id}`,
        { note },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },

    onSuccess: () => {
      toast.success("Note updated.");

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employee"],
      });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Failed to update note.";

      toast.error(message);
    },
  });
};

// ========================= GET EMPLOYEE ASSET DOCUMENTS =========================
export const useGetEmployeeAssetDocuments = (
  employeeId?: number,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: [
      "employee-asset-documents",
      employeeId,
    ],

    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get(
        `/employees/${employeeId}/asset-documents`,
        {
          signal,
        },
      );

      return response.data?.data || [];
    },

    enabled: !!employeeId && enabled,

    refetchOnWindowFocus: false,

    retry: 1,
  });
};


// ========================= UPLOAD EMPLOYEE ASSET DOCUMENTS =========================
export const useUploadEmployeeAssetDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      employeeId,
      formData,
    }: {
      employeeId: number;
      formData: FormData;
    }) => {
      return axiosInstance.post(
        `/employees/${employeeId}/asset-documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "employee-asset-documents",
          variables.employeeId,
        ],
      });

      toast.success(
        "Asset document uploaded successfully.",
      );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Asset document upload failed.";

      toast.error(message);
    },
  });
};


// ========================= DELETE EMPLOYEE ASSET DOCUMENT =========================
export const useDeleteEmployeeAssetDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
    }: {
      documentId: number;
      employeeId: number;
    }) => {
      return axiosInstance.delete(
        `/employees/asset-documents/${documentId}`,
      );
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "employee-asset-documents",
          variables.employeeId,
        ],
      });

      toast.success(
        "Asset document deleted successfully.",
      );
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Asset document delete failed.";

      toast.error(message);
    },
  });
};