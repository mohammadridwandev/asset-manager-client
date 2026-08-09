import {
  useMemo,
  useState,
} from "react";

import {
  FiSearch,
  FiUserPlus,
  FiX,
} from "react-icons/fi";

import { toast } from "react-hot-toast";

import { useGetEmployee } from "../../context/useEmployee";
import { useCreateAssetAssignment } from "../../context/useAssetAssignment";
import { useDebounce } from "../../context/useDebounce";

export default function Asset_to_Employee({
  asset,
  onClose,
}: {
  asset: any;
  onClose: () => void;
}) {
  const [searchText, setSearchText] =
    useState("");

  const debouncedSearchText =
    useDebounce(
      searchText.trim(),
      400,
    );

  const {
    data: employeeData,
    isLoading,
    isFetching,
    isError,
  } = useGetEmployee(
    1,
    20,
    debouncedSearchText,
    "",
    "",
    "ACTIVE",
  );

  const employees = Array.isArray(
    employeeData?.employees,
  )
    ? employeeData.employees
    : [];

  const createAssetAssignment =
    useCreateAssetAssignment();

  const API_BASE_URL =
    import.meta.env
      .VITE_BACKEND_URL_LINK || "";

  // =========================
  // AVAILABLE QUANTITY
  // =========================

  const totalQuantity =
    Number(
      asset?.quantity || 0,
    );

  const activeAssignments =
    asset?.assignments?.filter(
      (assignment: any) =>
        !assignment.returnedAt,
    ) || [];

  const departmentAssignments =
    asset?.departmentAssignments ||
    [];

  const assignedCount =
    activeAssignments.length +
    departmentAssignments.length;

  const availableQuantity =
    typeof asset?.availableQuantity ===
    "number"
      ? asset.availableQuantity
      : Math.max(
          totalQuantity -
            assignedCount,
          0,
        );

  const isOutOfStock =
    availableQuantity <= 0;

  const getImageUrl = (
    image?: string,
  ) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_BASE_URL.replace(
      /\/$/,
      "",
    )}/${image.replace(/^\//, "")}`;
  };

  const filteredEmployees =
    useMemo(() => {
      if (!debouncedSearchText) {
        return [];
      }

      return employees.filter(
        (employee: any) =>
          employee.status ===
          "ACTIVE",
      );
    }, [
      employees,
      debouncedSearchText,
    ]);

  // =========================
  // ASSIGN EMPLOYEE
  // =========================

  const handleAssignEmployee = (
    employee: any,
  ) => {
    // Quantity শেষ হলে block
    if (isOutOfStock) {
      toast.error(
        "No quantity available for assignment.",
      );

      return;
    }

    const alreadyAssigned =
      asset.assignments?.some(
        (assignment: any) =>
          Number(
            assignment.employeeId,
          ) ===
            Number(
              employee.id,
            ) &&
          !assignment.returnedAt,
      );

    if (alreadyAssigned) {
      toast.error(
        "This asset is already assigned to this employee.",
      );

      return;
    }

    createAssetAssignment.mutate(
      {
        assetId: asset.id,
        employeeId: employee.id,
      },
      {
        onSuccess: () => {
          toast.success(
            "Asset assigned successfully.",
          );

          onClose();
        },

        onError: (
          error: any,
        ) => {
          console.error(
            "Assign Asset Error:",
            error,
          );

          const status =
            error?.response?.status;

          let message =
            "Asset could not be assigned. Please try again.";

          if (status === 400) {
            message =
              error?.response?.data
                ?.message ||
              "Please check the assignment information.";
          } else if (
            status === 409
          ) {
            message =
              error?.response?.data
                ?.message ||
              "This asset is already assigned.";
          } else if (
            status === 401
          ) {
            message =
              "Your session has expired. Please log in again.";
          } else if (
            status === 403
          ) {
            message =
              "You do not have permission to assign this asset.";
          } else if (
            !error?.response
          ) {
            message =
              "Unable to connect to the server. Please check your connection.";
          }

          toast.error(message);
        },
      },
    );
  };

  const isTyping =
    searchText.trim() !==
    debouncedSearchText;

  const isSearching =
    isTyping ||
    isLoading ||
    isFetching;

  const hasSearchText =
    searchText.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm animate-fadeIn"
      onClick={() => {
        if (
          !createAssetAssignment.isPending
        ) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-app-gray/20 bg-app-bg p-6 shadow-xl animate-scaleIn"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="mb-4 flex items-center justify-between border-b border-app-gray/10 pb-3">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <FiUserPlus className="text-app-brand" />
            Assign Employee
          </h3>

          <button
            type="button"
            disabled={
              createAssetAssignment.isPending
            }
            onClick={onClose}
            className="cursor-pointer text-app-gray transition hover:text-app-text disabled:cursor-not-allowed disabled:opacity-50"
            title="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Asset Info */}

        <div className="mb-4 text-sm">
          <p>
            Asset:{" "}
            <b>
              {asset.assetName}
            </b>
          </p>

          <p className="text-app-gray">
            Type:{" "}
            {asset.assetType ||
              "N/A"}
          </p>

          <p
            className={`mt-1 text-xs font-medium ${
              isOutOfStock
                ? "text-red-500"
                : "text-app-brand"
            }`}
          >
            Available Quantity:{" "}
            {availableQuantity}
          </p>
        </div>

        {/* No Quantity */}

        {isOutOfStock ? (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-8 text-center">
            <p className="text-sm font-semibold text-red-500">
              No quantity
              available
            </p>

            <p className="mt-1 text-xs text-app-gray">
              All available
              quantities of this
              asset are already
              assigned.
            </p>
          </div>
        ) : (
          <>
            {/* Search */}

            <div className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-app-gray opacity-50">
                <FiSearch
                  size={17}
                />
              </div>

              <input
                type="text"
                value={
                  searchText
                }
                autoComplete="off"
                disabled={
                  isOutOfStock ||
                  createAssetAssignment.isPending
                }
                onChange={(
                  event,
                ) =>
                  setSearchText(
                    event.target
                      .value,
                  )
                }
                placeholder="Search active employee by name, email, Iqama or phone..."
                className="w-full rounded-lg border border-app-gray/30 bg-transparent py-3 pr-28 pl-10 text-sm placeholder:text-app-gray/40 focus:border-app-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />

              {isSearching &&
                hasSearchText && (
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2 text-xs text-app-brand">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-app-brand/20 border-t-app-brand" />

                    <span className="hidden sm:inline">
                      Searching...
                    </span>
                  </div>
                )}
            </div>

            {/* Employees */}

            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {!hasSearchText ? (
                <div className="py-6 text-center">
                  <p className="text-sm font-medium text-app-text">
                    Search for an
                    employee
                  </p>

                  <p className="mt-1 text-xs text-app-gray">
                    Enter a name,
                    email, Iqama
                    number or phone
                    number.
                  </p>
                </div>
              ) : isSearching ? (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-app-brand">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-app-brand/20 border-t-app-brand" />

                  <span>
                    Searching
                    employees...
                  </span>
                </div>
              ) : isError ? (
                <div className="py-6 text-center">
                  <p className="text-sm font-medium text-red-500">
                    Failed to
                    search
                    employees
                  </p>

                  <p className="mt-1 text-xs text-app-gray">
                    Please try
                    again.
                  </p>
                </div>
              ) : filteredEmployees.length >
                0 ? (
                filteredEmployees.map(
                  (
                    employee: any,
                  ) => {
                    const alreadyAssigned =
                      asset.assignments?.some(
                        (
                          assignment: any,
                        ) =>
                          Number(
                            assignment.employeeId,
                          ) ===
                            Number(
                              employee.id,
                            ) &&
                          !assignment.returnedAt,
                      );

                    return (
                      <div
                        key={
                          employee.id
                        }
                        className="flex items-center justify-between gap-3 rounded-lg border border-app-gray/10 p-3 transition-all hover:border-app-brand/20 hover:bg-app-brand/5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-app-gray/20 bg-app-brand/5">
                            {employee.image ? (
                              <img
                                src={getImageUrl(
                                  employee.image,
                                )}
                                alt={
                                  employee.fullName ||
                                  "Employee"
                                }
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-xs font-bold text-app-brand">
                                {(
                                  employee.fullName ||
                                  "E"
                                )
                                  .charAt(
                                    0,
                                  )
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-semibold text-app-text">
                              {
                                employee.fullName
                              }
                            </h4>

                            <p className="truncate text-xs text-app-gray">
                              {employee.position ||
                                "No Position"}
                            </p>

                            <p className="mt-0.5 truncate text-[11px] text-app-gray">
                              {employee.iqamaNumber ||
                                employee.email ||
                                employee.phoneNumber ||
                                "No additional information"}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={
                            createAssetAssignment.isPending ||
                            alreadyAssigned ||
                            isOutOfStock
                          }
                          onClick={() =>
                            handleAssignEmployee(
                              employee,
                            )
                          }
                          className="shrink-0 cursor-pointer rounded-md bg-app-brand px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {alreadyAssigned
                            ? "Assigned"
                            : createAssetAssignment.isPending
                              ? "Sending..."
                              : "Send"}
                        </button>
                      </div>
                    );
                  },
                )
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm font-medium text-app-text">
                    No active
                    employee found
                  </p>

                  <p className="mt-1 text-xs text-app-gray">
                    Try another
                    name, email,
                    Iqama number or
                    phone number.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}