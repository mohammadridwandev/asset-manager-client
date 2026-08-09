import { useEffect, useMemo, useState } from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

import { useGetDepartments } from "../../context/useDepartment";
import {
  useAssignDepartmentAsset,
  useGetAssetDepartments,
  useUnassignDepartmentAsset,
} from "../../context/useDepartmentAsset";

type DepartmentType = {
  id: number;
  name: string;
};

type DepartmentAssignmentType = {
  id: number;
  assignedAt?: string;

  department: {
    id: number;
    name: string;
  };
};

type AssetType = {
  id: number;
  assetName: string;
  serialNumber?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  asset: AssetType | null;
};

export default function Assign_to_Department({
  open,
  onClose,
  asset,
}: Props) {
  const [departmentId, setDepartmentId] =
    useState("");

  const {
    data: departments = [],
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useGetDepartments();

  const {
    data: assignments = [],
    isLoading: isAssignmentsLoading,
    isError: isAssignmentsError,
  } = useGetAssetDepartments(
    asset ? String(asset.id) : undefined,
  );

  const {
    mutateAsync: assignDepartmentAsset,
    isPending: isAssigning,
  } = useAssignDepartmentAsset();

  const {
    mutateAsync: unassignDepartmentAsset,
    isPending: isUnassigning,
  } = useUnassignDepartmentAsset();

  useEffect(() => {
    if (open) {
      setDepartmentId("");
    }
  }, [open, asset]);

  const assignedDepartmentIds = useMemo(() => {
    return new Set(
      assignments.map(
        (
          assignment: DepartmentAssignmentType,
        ) => assignment.department.id,
      ),
    );
  }, [assignments]);

  const availableDepartments = useMemo(() => {
    return departments.filter(
      (department: DepartmentType) =>
        !assignedDepartmentIds.has(
          department.id,
        ),
    );
  }, [
    departments,
    assignedDepartmentIds,
  ]);

  if (!open || !asset) {
    return null;
  }

  const isBusy =
    isAssigning || isUnassigning;

  const handleClose = () => {
    if (isBusy) {
      return;
    }

    setDepartmentId("");
    onClose();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!departmentId) {
      toast.error(
        "Please select a department.",
      );

      return;
    }

    const selectedDepartmentId =
      Number(departmentId);

    if (
      assignedDepartmentIds.has(
        selectedDepartmentId,
      )
    ) {
      toast.error(
        "This asset is already assigned to the selected department.",
      );

      return;
    }

    try {
      await assignDepartmentAsset({
        assetId: String(asset.id),
        departmentId:
          selectedDepartmentId,
      });

      setDepartmentId("");
    } catch (error) {
      console.error(
        "Assign Department Submit Error:",
        error,
      );
    }
  };

  const handleUnassign = async (
    department: DepartmentType,
  ) => {
    try {
      await unassignDepartmentAsset({
        assetId: String(asset.id),
        departmentId: department.id,
      });
    } catch (error) {
      console.error(
        "Unassign Department Error:",
        error,
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-xl border border-app-gray/20 bg-app-bg shadow-xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-app-gray/20 px-6 py-4">
          
            <div>
              <h2 className="text-lg font-bold">
                Manage Departments
              </h2>

              <p className="mt-1 text-sm text-app-gray">
                Assign or remove departments
                from this asset
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isBusy}
              className="rounded-md p-2 transition hover:bg-app-gray/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[65vh] space-y-5 overflow-y-auto p-6">
            <div className="rounded-md border border-app-gray/20 bg-app-gray/5 p-4">
              <p className="text-xs font-medium text-app-gray">
                Asset
              </p>

              <p className="mt-1 font-semibold">
                {asset.assetName}
              </p>

              {asset.serialNumber && (
                <p className="mt-1 text-xs text-app-gray">
                  Serial:{" "}
                  {asset.serialNumber}
                </p>
              )}
            </div>

            {/* Assigned Departments */}
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="text-sm font-semibold">
                  Assigned Departments
                </label>

                <span className="rounded-md bg-app-brand/10 px-2.5 py-1 text-xs font-semibold text-app-brand">
                  {assignments.length}
                </span>
              </div>

              {isAssignmentsLoading ? (
                <div className="flex items-center gap-2 rounded-md border border-app-gray/20 p-4 text-sm text-app-gray">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-app-brand/20 border-t-app-brand" />

                  Loading assigned
                  departments...
                </div>
              ) : isAssignmentsError ? (
                <div className="rounded-md border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500">
                  Failed to load assigned
                  departments.
                </div>
              ) : assignments.length === 0 ? (
                <div className="rounded-md border border-app-gray/20 bg-app-gray/5 p-4 text-sm text-app-gray">
                  This asset has not been
                  assigned to any department.
                </div>
              ) : (
                <div className="space-y-2">
                  {assignments.map(
                    (
                      assignment: DepartmentAssignmentType,
                    ) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between gap-3 rounded-md border border-app-gray/20 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {
                              assignment
                                .department
                                .name
                            }
                          </p>

                          <p className="mt-0.5 text-xs text-app-gray">
                            Assigned
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleUnassign(
                              assignment.department,
                            )
                          }
                          disabled={isBusy}
                          title="Unassign Department"
                          className="shrink-0 rounded-md border border-red-500/20 p-2 text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FiTrash2
                            size={15}
                          />
                        </button>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Assign New Department */}
            <div>
              <label
                htmlFor="departmentId"
                className="mb-2 block text-sm font-semibold"
              >
                Assign New Department
              </label>

              <select
                id="departmentId"
                value={departmentId}
                onChange={(event) =>
                  setDepartmentId(
                    event.target.value,
                  )
                }
                disabled={
                  isDepartmentsLoading ||
                  isDepartmentsError ||
                  isBusy ||
                  availableDepartments.length ===
                    0
                }
                className="w-full rounded-md border border-app-gray/20 bg-app-bg px-3 py-2.5 text-sm outline-none focus:border-app-brand disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {isDepartmentsLoading
                    ? "Loading departments..."
                    : availableDepartments.length ===
                        0
                      ? "All departments are already assigned"
                      : "Select Department"}
                </option>

                {availableDepartments.map(
                  (
                    department: DepartmentType,
                  ) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </option>
                  ),
                )}
              </select>

              {isDepartmentsError && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  Failed to load departments.
                </p>
              )}

              {!isDepartmentsLoading &&
                !isDepartmentsError &&
                departments.length === 0 && (
                  <p className="mt-1.5 text-xs text-app-gray">
                    No departments found.
                    Please add a department
                    first.
                  </p>
                )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-app-gray/20 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isBusy}
              className="rounded-md border border-app-gray/20 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-app-gray/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={
                isBusy ||
                !departmentId ||
                isDepartmentsLoading ||
                isDepartmentsError
              }
              className="flex items-center justify-center gap-2 rounded-md bg-app-brand px-5 py-2.5 text-sm font-semibold text-app-secondary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAssigning && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}

              {isAssigning
                ? "Assigning..."
                : "Assign Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}