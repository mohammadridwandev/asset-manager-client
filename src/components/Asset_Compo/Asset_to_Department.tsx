import { useState } from "react";
import {
  FiBarChart,
  FiSearch,
  FiX,
} from "react-icons/fi";

import {
  useAssignAssetToDepartment,
  useGetDepartments,
} from "../../context/useDepartment";

import { useDebounce } from "../../context/useDebounce";

type Props = {
  asset: any;
  onClose: () => void;
};

export default function Asset_to_Department({
  asset,
  onClose,
}: Props) {
  const [searchText, setSearchText] =
    useState("");

  // Already assigned departments
  const [assignedDepartmentIds, setAssignedDepartmentIds] =
    useState<number[]>(
      asset?.departmentAssignments?.map(
        (assignment: any) =>
          Number(assignment.departmentId),
      ) || [],
    );

  const debouncedSearchText =
    useDebounce(
      searchText.trim(),
      400,
    );

  const {
    data: departments = [],
    isLoading,
    isError,
  } = useGetDepartments();

  const assignDepartment =
    useAssignAssetToDepartment();

  // Search না করলে কিছু show হবে না
  const filteredDepartments =
    !debouncedSearchText
      ? []
      : departments.filter(
          (department: any) =>
            department.name
              ?.toLowerCase()
              .includes(
                debouncedSearchText.toLowerCase(),
              ),
        );

  const isTyping =
    searchText.trim() !==
    debouncedSearchText;

  const hasSearchText =
    searchText.trim().length > 0;

  // =========================
  // ASSIGN DEPARTMENT
  // =========================

  const handleAssign = (
    department: any,
  ) => {
    const departmentId =
      Number(department.id);

    // Already assigned
    if (
      assignedDepartmentIds.includes(
        departmentId,
      )
    ) {
      return;
    }

    assignDepartment.mutate(
      {
        assetId: Number(
          asset.id,
        ),

        departmentId,
      },
      {
        onSuccess: () => {
          // Local UI update
          setAssignedDepartmentIds(
            (previous) => [
              ...previous,
              departmentId,
            ],
          );

          // Modal close হবে না
          // আরেকটা department assign করা যাবে
        },
      },
    );
  };

  const handleClose = () => {
    if (
      assignDepartment.isPending
    ) {
      return;
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-app-gray/20 bg-app-bg p-6 shadow-xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-app-gray/10 pb-4">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-app-text">
              <FiBarChart className="text-app-brand" />

              Assign Department
            </h3>

            <p className="mt-1 text-sm text-app-gray">
              Assign this asset to
              departments
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={
              assignDepartment.isPending
            }
            className="cursor-pointer rounded-md p-2 text-app-gray transition hover:bg-app-gray/10 hover:text-app-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* Asset Information */}
        <div className="mb-5 rounded-lg border border-app-gray/20 bg-app-gray/5 p-4">
          <p className="text-xs text-app-gray">
            Asset
          </p>

          <h4 className="mt-1 font-semibold text-app-text">
            {asset?.assetName ||
              "Unnamed Asset"}
          </h4>

          {asset?.serialNumber && (
            <p className="mt-1 text-xs text-app-gray">
              Serial:{" "}
              {
                asset.serialNumber
              }
            </p>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FiSearch
            size={17}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-app-gray"
          />

          <input
            type="text"
            value={searchText}
            autoComplete="off"
            disabled={
              assignDepartment.isPending
            }
            onChange={(event) =>
              setSearchText(
                event.target.value,
              )
            }
            placeholder="Search department..."
            className="w-full rounded-lg border border-app-gray/20 bg-transparent py-3 pr-4 pl-10 text-sm outline-none transition focus:border-app-brand disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Department List */}
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {!hasSearchText ? (
            <div className="py-8 text-center">
              <FiSearch
                size={24}
                className="mx-auto mb-2 text-app-gray"
              />

              <p className="text-sm font-medium text-app-text">
                Search Department
              </p>

              <p className="mt-1 text-xs text-app-gray">
                Type a department
                name
              </p>
            </div>
          ) : isTyping ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-app-brand">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-app-brand/20 border-t-app-brand" />

              Searching...
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-app-brand">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-app-brand/20 border-t-app-brand" />

              Loading
              departments...
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-center text-sm text-red-500">
              Failed to load
              departments.
            </div>
          ) : filteredDepartments.length >
            0 ? (
            filteredDepartments.map(
              (
                department: any,
              ) => {
                const isAssigned =
                  assignedDepartmentIds.includes(
                    Number(
                      department.id,
                    ),
                  );

                return (
                  <div
                    key={
                      department.id
                    }
                    className="flex items-center justify-between gap-3 rounded-lg border border-app-gray/20 p-3 transition hover:border-app-brand/30 hover:bg-app-brand/5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-app-brand/10 text-app-brand">
                        <FiBarChart />
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold text-app-text">
                          {
                            department.name
                          }
                        </h4>

                        <p className="text-xs text-app-gray">
                          Department
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={
                        isAssigned ||
                        assignDepartment.isPending
                      }
                      onClick={() =>
                        handleAssign(
                          department,
                        )
                      }
                      className={`shrink-0 rounded-md px-4 py-2 text-xs font-semibold transition ${
                        isAssigned
                          ? "cursor-not-allowed bg-green-500/10 text-green-600"
                          : "cursor-pointer bg-app-brand text-app-secondary hover:opacity-90"
                      } disabled:opacity-70`}
                    >
                      {isAssigned
                        ? "Assigned"
                        : assignDepartment.isPending
                          ? "Assigning..."
                          : "Assign"}
                    </button>
                  </div>
                );
              },
            )
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-app-text">
                No department
                found
              </p>

              <p className="mt-1 text-xs text-app-gray">
                Try another
                department name.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end border-t border-app-gray/10 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={
              assignDepartment.isPending
            }
            className="cursor-pointer rounded-md border border-app-gray/20 px-5 py-2.5 text-sm font-medium transition hover:bg-app-gray/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}