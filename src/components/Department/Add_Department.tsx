import {
  FiEdit2,
  FiMinus,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

import {
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";

import DataLoading from "../../DataLoading";

import {
  useCreateDepartment,
  useDeleteDepartment,
  useGetDepartments,
  useUpdateDepartment,
} from "../../context/useDepartment";

import { useGetEmployeeFilterOptions } from "../../context/useEmployee";

import { useGetDepartmentAssets } from "../../context/useDepartmentAsset";

import { useGetAssets } from "../../context/useAssets";

import { useDebounce } from "../../context/useDebounce";

type DepartmentType = {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

type DepartmentAssignmentType = {
  id: number;
  departmentAssetId: number;
  departmentId: number;
  assignedAt: string;

  department: {
    id: number;
    name: string;
  };
};

type DepartmentAssetType = {
  id: number;
  quantity: number;

  departmentAssignments?: DepartmentAssignmentType[];
};

type MainAssetDepartmentAssignmentType = {
  id: number;
  assetId: number;
  departmentId: number;
  assignedAt: string;

  department: {
    id: number;
    name: string;
  };
};

type MainAssetType = {
  id: number;
  quantity: number;

  departmentAssignments?: MainAssetDepartmentAssignmentType[];
};

export default function Add_Department() {
  const navigate = useNavigate();

  const [
    departmentOpen,
    setDepartmentOpen,
  ] = useState(false);

  const [searchText, setSearchText] =
    useState("");

  const debouncedSearchText =
    useDebounce(
      searchText.trim(),
      300,
    );

  const [
    departmentName,
    setDepartmentName,
  ] = useState("");

  const [
    editingDepartment,
    setEditingDepartment,
  ] =
    useState<DepartmentType | null>(
      null,
    );

  // =========================
  // DEPARTMENTS
  // =========================

  const {
    data: departments = [],
    isLoading,
    isError,
  } = useGetDepartments();

  // =========================
  // EMPLOYEE DEPARTMENT OPTIONS
  // =========================

  const {
    data: employeeFilterOptions,
    isLoading:
      isDepartmentOptionsLoading,
    isError:
      isDepartmentOptionsError,
  } =
    useGetEmployeeFilterOptions();

  const employeeDepartments:
    string[] =
    employeeFilterOptions?.departments ||
    [];

  // =========================
  // DEPARTMENT ASSETS
  // =========================

  const {
    data: departmentAssets = [],
    isLoading:
      isDepartmentAssetsLoading,
    isError:
      isDepartmentAssetsError,
  } = useGetDepartmentAssets();

  // =========================
  // MAIN ASSETS
  // =========================

  const {
    data: assetData,
    isLoading: isAssetsLoading,
    isError: isAssetsError,
  } = useGetAssets(
    1,
    100,
    "",
    "",
    "",
  );

  const regularAssets =
    assetData?.assets || [];

  const isAllAssetsLoading =
    isDepartmentAssetsLoading ||
    isAssetsLoading;

  // =========================
  // MUTATIONS
  // =========================

  const {
    mutateAsync:
      createDepartment,
    isPending: isCreating,
  } = useCreateDepartment();

  const {
    mutateAsync:
      updateDepartment,
    isPending: isUpdating,
  } = useUpdateDepartment();

  const {
    mutateAsync:
      deleteDepartment,
    isPending: isDeleting,
  } = useDeleteDepartment();

  // =========================
  // SEARCH
  // =========================

  const filteredDepartments =
    useMemo(() => {
      const keyword =
        debouncedSearchText.toLowerCase();

      if (!keyword) {
        return departments;
      }

      return departments.filter(
        (
          department: DepartmentType,
        ) =>
          department.name
            ?.toLowerCase()
            .includes(keyword),
      );
    }, [
      departments,
      debouncedSearchText,
    ]);

  // =========================
  // DEPARTMENT ASSET COUNT
  // =========================

  const getDepartmentAssetCount = (
    departmentId: number,
  ) => {
    // DepartmentAsset module
    const departmentAssetCount =
      Array.isArray(
        departmentAssets,
      )
        ? departmentAssets.filter(
            (
              asset: DepartmentAssetType,
            ) =>
              Array.isArray(
                asset.departmentAssignments,
              ) &&
              asset.departmentAssignments.some(
                (assignment) =>
                  Number(
                    assignment.departmentId,
                  ) ===
                  Number(
                    departmentId,
                  ),
              ),
          ).length
        : 0;

    // Main Asset -> multiple departments
    const regularAssetCount =
      Array.isArray(regularAssets)
        ? regularAssets.filter(
            (
              asset: MainAssetType,
            ) =>
              Array.isArray(
                asset.departmentAssignments,
              ) &&
              asset.departmentAssignments.some(
                (assignment) =>
                  Number(
                    assignment.departmentId,
                  ) ===
                  Number(
                    departmentId,
                  ),
              ),
          ).length
        : 0;

    return (
      departmentAssetCount +
      regularAssetCount
    );
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setDepartmentName("");
    setEditingDepartment(null);
  };

  const handleCloseForm = () => {
    resetForm();
    setDepartmentOpen(false);
  };

  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const name =
      departmentName.trim();

    if (!name) {
      return;
    }

    try {
      if (editingDepartment) {
        await updateDepartment({
          id: String(
            editingDepartment.id,
          ),

          updateData: {
            name,
          },
        });
      } else {
        await createDepartment({
          name,
        });
      }

      resetForm();
      setDepartmentOpen(false);
    } catch (error) {
      console.error(
        "Department Submit Error:",
        error,
      );
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (
    department: DepartmentType,
  ) => {
    setEditingDepartment(
      department,
    );

    setDepartmentName(
      department.name,
    );

    setDepartmentOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (
    department: DepartmentType,
  ) => {
    const confirmation =
      await Swal.fire({
        title:
          "Delete department?",

        text: `"${department.name}" will be removed permanently.`,

        icon: "warning",

        showCancelButton: true,

        confirmButtonText:
          "Delete",

        cancelButtonText:
          "Cancel",
      });

    if (
      !confirmation.isConfirmed
    ) {
      return;
    }

    try {
      await deleteDepartment(
        String(department.id),
      );
    } catch (error) {
      console.error(
        "Delete Department Error:",
        error,
      );
    }
  };

  // =========================
  // OPEN DEPARTMENT
  // =========================

  const handleOpenDepartment = (
    departmentId: number,
  ) => {
    navigate(
      `/dashboard/department/${departmentId}/assets`,
    );
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <DataLoading
        title="Loading Departments"
        message="Fetching department data..."
      />
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <div className="flex min-h-75 items-center justify-center text-lg font-medium text-red-500">
        Failed to load department
        data!
      </div>
    );
  }

  return (
    <div className="pb-16">
      <Helmet>
        <title>
          Asset Manager |
          Departments
        </title>
      </Helmet>

      {/* ================= HEADER ================= */}

      <div className="py-4 md:py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Departments
            </h1>

            <p className="mt-1 text-sm text-app-gray">
              Manage company
              departments
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (
                departmentOpen
              ) {
                handleCloseForm();
              } else {
                setDepartmentOpen(
                  true,
                );
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-app-brand px-4 py-2.5 text-sm font-semibold text-app-secondary hover:opacity-90 md:w-auto"
          >
            {departmentOpen ? (
              <>
                <FiMinus
                  size={17}
                />
                Close
              </>
            ) : (
              <>
                <FiPlus
                  size={17}
                />
                Add Department
              </>
            )}
          </button>
        </div>

        {/* ================= SEARCH ================= */}

        <div className="relative mb-5">
          <FiSearch
            size={18}
            className="absolute top-1/2 left-4 -translate-y-1/2 text-app-gray"
          />

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value,
              )
            }
            placeholder="Search department..."
            className="w-full rounded-md border border-app-gray/20 bg-transparent py-3 pr-4 pl-11 text-sm outline-none focus:border-app-brand"
          />
        </div>

        {/* ================= FORM ================= */}

        {departmentOpen && (
          <form
            onSubmit={
              handleSubmit
            }
            className="mb-6 rounded-md border border-app-gray/20 p-4"
          >
            <label
              htmlFor="departmentName"
              className="mb-2 block text-sm font-medium"
            >
              Department Name
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="w-full">
                <input
                  id="departmentName"
                  list="employee-department-list"
                  type="text"
                  value={
                    departmentName
                  }
                  onChange={(
                    event,
                  ) =>
                    setDepartmentName(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Enter or select department"
                  className="w-full rounded-md border border-app-gray/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-app-brand"
                />

                <datalist id="employee-department-list">
                  {employeeDepartments.map(
                    (
                      department: string,
                    ) => (
                      <option
                        key={
                          department
                        }
                        value={
                          department
                        }
                      />
                    ),
                  )}
                </datalist>

                {isDepartmentOptionsLoading && (
                  <p className="mt-1.5 text-xs text-app-gray">
                    Loading
                    departments...
                  </p>
                )}

                {isDepartmentOptionsError && (
                  <p className="mt-1.5 text-xs text-red-500">
                    Failed to load
                    department
                    suggestions.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  isCreating ||
                  isUpdating ||
                  !departmentName.trim()
                }
                className="rounded-md bg-app-brand px-5 py-2.5 text-sm font-semibold text-app-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating ||
                isUpdating
                  ? "Saving..."
                  : editingDepartment
                    ? "Update"
                    : "Save"}
              </button>

              <button
                type="button"
                onClick={
                  handleCloseForm
                }
                className="rounded-md border border-app-gray/20 px-5 py-2.5 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ================= LIST ================= */}

      <div className="rounded-md border border-app-gray/20">
        <div className="border-b border-app-gray/20 px-4 py-3">
          <h2 className="font-semibold">
            Department List
          </h2>

          <p className="mt-1 text-sm text-app-gray">
            Total{" "}
            {
              filteredDepartments.length
            }
          </p>
        </div>

        {(isDepartmentAssetsError ||
          isAssetsError) && (
          <div className="border-b border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
            Failed to load
            department asset
            counts.
          </div>
        )}

        {filteredDepartments.length ===
        0 ? (
          <div className="px-4 py-10 text-center text-sm text-app-gray">
            {searchText.trim()
              ? "No matching departments found."
              : "No departments found."}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDepartments.map(
              (
                department: DepartmentType,
              ) => {
                const assetCount =
                  getDepartmentAssetCount(
                    department.id,
                  );

                return (
                  <div
                    key={
                      department.id
                    }
                    className="group flex min-h-36 flex-col justify-between rounded-md border border-app-gray/20 bg-app-bg p-4 transition-all hover:border-app-brand"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenDepartment(
                          department.id,
                        )
                      }
                      className="w-full cursor-pointer text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold transition-colors group-hover:text-app-brand">
                            {
                              department.name
                            }
                          </h3>

                          <p className="mt-1 text-xs text-app-gray">
                            {isAllAssetsLoading
                              ? "Loading assets..."
                              : `${assetCount} ${
                                  assetCount ===
                                  1
                                    ? "Asset"
                                    : "Assets"
                                }`}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-md bg-app-brand/10 px-2.5 py-1 text-xs font-semibold text-app-brand">
                          {isAllAssetsLoading
                            ? "..."
                            : assetCount}
                        </span>
                      </div>

                      <p className="mt-3 text-xs font-medium text-app-brand">
                        Click to view
                        assets
                      </p>
                    </button>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            department,
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-md border border-app-gray/20 px-3 py-2 text-sm transition-colors hover:border-app-brand hover:text-app-brand"
                      >
                        <FiEdit2
                          size={15}
                        />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={
                          isDeleting
                        }
                        onClick={() =>
                          handleDelete(
                            department,
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-md border border-red-500/20 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FiTrash2
                          size={15}
                        />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
}