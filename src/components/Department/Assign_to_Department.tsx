import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiTrash2,
  FiX,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  useGetEmployeeFilterOptions,
} from "../../context/useEmployee";

import {
  useGetSingleAsset,
} from "../../context/useAssets";

import {
  useAssignAssetToDepartment,
  useUnassignAssetFromDepartment,
} from "../../context/useDepartment";


// Asset type
type AssetType = {
  id: number;
  assetName: string;
  serialNumber?: string | null;
};


// Props
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
  const [
    selectedDepartment,
    setSelectedDepartment,
  ] = useState("");


  // Current departments
  const {
    data: filterOptions,
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } =
    useGetEmployeeFilterOptions();


  const departments: string[] =
    filterOptions?.departments || [];


  // Get latest asset data
  const {
    data: assetDetails,
    isLoading:
      isAssetLoading,
  } = useGetSingleAsset(
    asset
      ? String(asset.id)
      : undefined,
  );


  // Current department assignments
  const assignments =
    assetDetails?.departmentAssignments ||
    [];


  // Assign
  const {
    mutateAsync:
      assignAssetToDepartment,
    isPending: isAssigning,
  } =
    useAssignAssetToDepartment();


  // Unassign
  const {
    mutateAsync:
      unassignAssetFromDepartment,
    isPending: isUnassigning,
  } =
    useUnassignAssetFromDepartment();


  // Reset
  useEffect(() => {
    if (open) {
      setSelectedDepartment("");
    }
  }, [
    open,
    asset,
  ]);


  // Already assigned names
  const assignedDepartmentNames =
    useMemo(() => {
      return new Set<string>(
        assignments
          .map(
            (assignment: any) =>
              assignment.department
                ?.name
                ?.trim()
                .toLowerCase(),
          )
          .filter(Boolean),
      );
    }, [
      assignments,
    ]);


  // Available departments
  const availableDepartments =
    useMemo(() => {
      return departments.filter(
        (department) =>
          !assignedDepartmentNames.has(
            department
              .trim()
              .toLowerCase(),
          ),
      );
    }, [
      departments,
      assignedDepartmentNames,
    ]);


  if (!open || !asset) {
    return null;
  }


  const isBusy =
    isAssigning ||
    isUnassigning;


  // Close
  const handleClose = () => {
    if (isBusy) {
      return;
    }

    setSelectedDepartment("");

    onClose();
  };


  // Assign department
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedDepartment) {
      toast.error(
        "Please select a department.",
      );

      return;
    }

    try {
      await assignAssetToDepartment({
        assetId: Number(asset.id),

        departmentName:
          selectedDepartment,
      });

      setSelectedDepartment("");
    } catch (error) {
      console.error(
        "Assign Department Error:",
        error,
      );
    }
  };


  // Unassign department
  const handleUnassign = async (
    assignment: any,
  ) => {
    try {
      await unassignAssetFromDepartment({
        assetId:
          Number(asset.id),

        departmentId:
          Number(
            assignment.departmentId,
          ),
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

            {/* Asset */}
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


            {/* Assigned departments */}
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="text-sm font-semibold">
                  Assigned Departments
                </label>

                <span className="rounded-md bg-app-brand/10 px-2.5 py-1 text-xs font-semibold text-app-brand">
                  {assignments.length}
                </span>
              </div>


              {isAssetLoading ? (
                <div className="rounded-md border border-app-gray/20 p-4 text-sm text-app-gray">
                  Loading assigned departments...
                </div>
              ) : assignments.length ===
                0 ? (
                <div className="rounded-md border border-app-gray/20 bg-app-gray/5 p-4 text-sm text-app-gray">
                  This asset has not been assigned
                  to any department.
                </div>
              ) : (
                <div className="space-y-2">
                  {assignments.map(
                    (
                      assignment: any,
                    ) => (
                      <div
                        key={
                          assignment.id
                        }
                        className="flex items-center justify-between gap-3 rounded-md border border-app-gray/20 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {
                              assignment
                                .department
                                ?.name
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
                              assignment,
                            )
                          }
                          disabled={
                            isBusy
                          }
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


            {/* Assign department */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Assign New Department
              </label>

              <select
                value={
                  selectedDepartment
                }
                onChange={(event) =>
                  setSelectedDepartment(
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
                    department:
                      string,
                  ) => (
                    <option
                      key={
                        department
                      }
                      value={
                        department
                      }
                    >
                      {
                        department
                      }
                    </option>
                  ),
                )}
              </select>

              {isDepartmentsError && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  Failed to load departments.
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
                !selectedDepartment ||
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