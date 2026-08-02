import { useState } from "react";
import {
  FiSearch,
  FiUserPlus,
  FiX,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import { useGetEmployee } from "../../context/useEmployee";
import { useCreateLicenseAssignment } from "../../context/useLicenseAssignment";

export default function Licenses_to_Employee({
  license,
  onClose,
}: {
  license: any;
  onClose: () => void;
}) {
  const [searchText, setSearchText] =
    useState("");

  const {
    data: employeeData,
    isLoading,
    isError,
  } = useGetEmployee(1, 100, searchText);

  const employees = Array.isArray(
    employeeData?.employees,
  )
    ? employeeData.employees
    : [];

  const createLicenseAssignment =
    useCreateLicenseAssignment();

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL_LINK || "";

  const getImageUrl = (image?: string) => {
    if (!image) return "";

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

  const activeEmployees = employees.filter(
    (employee: any) =>
      employee.status === "ACTIVE",
  );


  const filteredEmployees =
  searchText.trim().length > 0
    ? activeEmployees.filter(
        (employee: any) => {
          const search = searchText
            .trim()
            .toLowerCase();

          return (
            employee.fullName
              ?.toLowerCase()
              .includes(search) ||
            String(employee.iqamaNumber || "")
              .toLowerCase()
              .includes(search) ||
            employee.email
              ?.toLowerCase()
              .includes(search) ||
            String(employee.phoneNumber || "")
              .toLowerCase()
              .includes(search)
          );
        },
      )
    : [];






  const handleAssignLicense = (
    employee: any,
  ) => {
    const alreadyAssigned =
      license.assignments?.some(
        (assignment: any) =>
          assignment.employeeId ===
            employee.id &&
          !assignment.returnedAt,
      );

    if (alreadyAssigned) {
      toast.error(
        "License already assigned to this employee.",
      );
      return;
    }

    createLicenseAssignment.mutate(
      {
        licenseId: license.id,
        employeeId: employee.id,
      },
      {
        onSuccess: () => {
          toast.success(
            "License assigned successfully.",
          );

          onClose();
        },

        onError: (error: any) => {
          console.error(
            "Failed to assign license:",
            error,
          );

          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to assign license. Please try again.";

          toast.error(errorMessage);
        },
      },
    );
  };



  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
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
            Assign License
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-app-gray transition hover:text-app-text"
            title="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="mb-4 text-sm">
          <p>
            License:{" "}
            <b>{license.softwareName}</b>
          </p>

          <p className="text-app-gray">
            Type:{" "}
            {license.licenseType || "N/A"}
          </p>
        </div>

        <div className="relative mb-4">
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-app-gray opacity-50">
            <FiSearch size={17} />
          </div>

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value,
              )
            }
            placeholder="Search active employee by name, email, iqama number, phone..."
            className="w-full rounded-lg border border-app-gray/30 bg-transparent py-3 pr-4 pl-10 text-sm placeholder:text-app-gray/40 focus:border-app-brand focus:outline-none"
          />
        </div>

        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {isLoading ? (
            <p className="py-6 text-center text-sm text-app-brand">
              Loading employees...
            </p>
          ) : isError ? (
            <p className="py-6 text-center text-sm text-red-500">
              Failed to load employees
            </p>
          ) : filteredEmployees.length >
            0 ? (
            filteredEmployees.map(
              (employee: any) => {
                const alreadyAssigned =
                  license.assignments?.some(
                    (
                      assignment: any,
                    ) =>
                      assignment.employeeId ===
                        employee.id &&
                      !assignment.returnedAt,
                  );

                return (
                  <div
                    key={employee.id}
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
                          />
                        ) : (
                          <span className="text-xs font-bold text-app-brand">
                            {(
                              employee.fullName ||
                              "E"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold text-app-text">
                          {employee.fullName}
                        </h4>

                        <p className="truncate text-xs text-app-gray">
                          {employee.position ||
                            "No Position"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={
                        createLicenseAssignment.isPending ||
                        alreadyAssigned
                      }
                      onClick={() =>
                        handleAssignLicense(
                          employee,
                        )
                      }
                      className="shrink-0 cursor-pointer rounded-lg bg-app-brand px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {alreadyAssigned
                        ? "Assigned"
                        : createLicenseAssignment.isPending
                          ? "Sending..."
                          : "Send"}
                    </button>
                  </div>
                );
              },
            )
          ) : (
            <p className="py-6 text-center text-sm text-app-gray">
              Search an active employee to assign this license.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}