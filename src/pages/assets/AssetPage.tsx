import {
  FiMinus,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import Add_Asset from "../../components/Asset_Compo/Add_Asset";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  MdKeyboardArrowRight,
} from "react-icons/md";
import Asset_Card from "../../components/Asset_Compo/Asset_Card";
import {
  useGetAssets,
  useGetAssetFilterOptions,
} from "../../context/useAssets";
import {
  useGetEmployeeFilterOptions,
} from "../../context/useEmployee";
import Asset_Import from "../../components/Asset_Compo/Asset_Import";
import Asset_Export from "../../components/Asset_Compo/Asset_Export";
import Asset_Pagination from "../../components/Asset_Compo/Asset_Pagination";
import {
  Helmet,
} from "react-helmet-async";
import DataLoading from "../../DataLoading";
import {
  useDebounce,
} from "../../context/useDebounce";
type DepartmentCountType = {
  department: string;
  count: number;
};
export default function AssetPage() {
  const [
    assetOpen,
    setAssetOpen,
  ] = useState(false);
  const [
    searchText,
    setSearchText,
  ] = useState("");
  const debouncedSearchText =
    useDebounce(
      searchText.trim(),
      400,
    );
  const [
    page,
    setPage,
  ] = useState(1);
  const assetListRef =
    useRef<HTMLDivElement>(
      null,
    );
  // Asset type filter
  const [
    assetTypeOpen,
    setAssetTypeOpen,
  ] = useState(false);
  // Keep backend value unchanged
  const [
    selectedType,
    setSelectedType,
  ] = useState("All Types");
  // Assignment filter
  const [
    assignmentOpen,
    setAssignmentOpen,
  ] = useState(false);
  const [
    selectedAssignment,
    setSelectedAssignment,
  ] = useState(
    "All Status",
  );
  const assignmentTypes = [
    "Assigned",
    "Unassigned",
     "Available",
  ];
  // Employee department filter
  const [
    departmentOpen,
    setDepartmentOpen,
  ] = useState(false);
  const [
    selectedDepartment,
    setSelectedDepartment,
  ] = useState(
    "All Departments",
  );
  // Direct department filter
  const [
    directDepartmentOpen,
    setDirectDepartmentOpen,
  ] = useState(false);
  const [
    selectedDirectDepartment,
    setSelectedDirectDepartment,
  ] = useState(
    "All Assigned Departments",
  );
  // Display labels only
  const employeeDepartmentLabel =
    selectedDepartment ===
    "All Departments"
      ? "All Employee Departments"
      : selectedDepartment;
  const directDepartmentLabel =
    selectedDirectDepartment ===
    "All Assigned Departments"
      ? "All Assigned Departments"
      : selectedDirectDepartment;
  const assetTypeLabel =
    selectedType === "All Types"
      ? "All Asset Types"
      : selectedType;
  const assignmentLabel =
    selectedAssignment ===
    "All Status"
      ? "All Assignment Status"
      : selectedAssignment;
  // Active department
  const activeDepartmentName =
    selectedDirectDepartment !==
    "All Assigned Departments"
      ? selectedDirectDepartment
      : selectedDepartment !==
          "All Departments"
        ? selectedDepartment
        : "";
  // DIRECT or EMPLOYEE
  const activeDepartmentSource:
    | "DIRECT"
    | "EMPLOYEE"
    | "" =
    selectedDirectDepartment !==
    "All Assigned Departments"
      ? "DIRECT"
      : selectedDepartment !==
          "All Departments"
        ? "EMPLOYEE"
        : "";
  // Get assets
  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetAssets(
    page,
    10,
    debouncedSearchText,
    selectedType,
    selectedAssignment,
    false,
    activeDepartmentName,
    activeDepartmentSource,
  );
  // Asset filter options
  const {
    data: filterOptions,
    isLoading:
      filterOptionsLoading,
    isError:
      filterOptionsError,
  } =
    useGetAssetFilterOptions();
  // Employee departments
  const {
    data:
      employeeFilterOptions,
    isLoading:
      departmentsLoading,
    isError:
      departmentsError,
  } =
    useGetEmployeeFilterOptions();
  const assets =
    data?.assets || [];
  const pagination =
    data?.pagination;
  // Asset types
  const assetTypes: string[] =
    filterOptions?.assetTypes ||
    [];
  // Direct department counts
  const directDepartmentCounts:
    DepartmentCountType[] =
    filterOptions
      ?.directDepartmentCounts ||
    [];
  // Employee departments
  const departments: string[] =
    employeeFilterOptions
      ?.departments || [];
  // Select asset type
  const handleSelect = (
    assetType: string,
  ) => {
    setSelectedType(
      assetType,
    );
    setAssetTypeOpen(false);
  };
  // Select assignment status
  const handleAssignmentSelect =
    (
      assignmentType: string,
    ) => {
      setSelectedAssignment(
        assignmentType,
      );
      setAssignmentOpen(
        false,
      );
    };
  // Select employee department
  const handleDepartmentSelect =
    (
      department: string,
    ) => {
      setSelectedDepartment(
        department,
      );
      // Clear direct filter
      setSelectedDirectDepartment(
        "All Assigned Departments",
      );
      setDepartmentOpen(false);
    };
  // Select direct department
  const handleDirectDepartmentSelect =
    (
      department: string,
    ) => {
      setSelectedDirectDepartment(
        department,
      );
      // Clear employee filter
      setSelectedDepartment(
        "All Departments",
      );
      setDirectDepartmentOpen(
        false,
      );
    };
  // Reset page after filter change
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearchText,
    selectedType,
    selectedAssignment,
    selectedDepartment,
    selectedDirectDepartment,
  ]);
  // Pagination
  const handlePageChange = (
    newPage: number,
  ) => {
    setPage(newPage);
    setTimeout(() => {
      assetListRef.current
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };
  if (
    isLoading &&
    !data
  ) {
    return (
      <DataLoading
        title="Loading Assets"
        message="Fetching asset inventory..."
      />
    );
  }
  if (
    isError &&
    !data
  ) {
    return (
      <div className="flex min-h-75 items-center justify-center text-lg font-medium text-red-500">
        Failed to load asset
        data!
      </div>
    );
  }
  return (
    <>
      <Helmet>
        <title>
          Asset Manager |
          Assets
        </title>
      </Helmet>

      <div className="mt-3 bg-app-bg pb-16 text-app-text transition-colors duration-300">
        <div className="py-4">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Asset Management
              </h1>
              <p className="mt-1 text-sm text-app-gray opacity-80">
                Track and manage
                company assets
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Asset_Export />
              <Asset_Import />
              <button
                type="button"
                onClick={() =>
                  setAssetOpen(
                    (
                      previous,
                    ) =>
                      !previous,
                  )
                }
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-app-brand px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95 md:w-auto"
              >
                {assetOpen ? (
                  <>
                    <FiMinus
                      size={18}
                    />
                    <span>
                      Close
                    </span>
                  </>
                ) : (
                  <>
                    <FiPlus
                      size={18}
                    />
                    <span>
                      Add Asset
                    </span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Search */}
          <div className="mb-3">
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-app-gray opacity-60">
                <FiSearch
                  size={18}
                />
              </div>
              <input
                type="text"
                value={
                  searchText
                }
                onChange={(
                  event,
                ) =>
                  setSearchText(
                    event.target
                      .value,
                  )
                }
                placeholder="Search by asset name, serial number, invoice number, type, employee name, email, or Iqama..."
                className="w-full rounded-md border border-app-gray/30 bg-transparent py-2.5 pr-30 pl-12 text-sm outline-none transition-all placeholder:text-app-gray/50 focus:border-app-brand"
              />
              {isFetching &&
                !isLoading && (
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-xs font-medium text-app-brand">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-app-brand/20 border-t-app-brand" />
                    <span className="hidden lg:inline">
                      Loading...
                    </span>
                  </div>
                )}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {/* Employee Department */}
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => {
                  setDepartmentOpen(
                    (
                      previous,
                    ) =>
                      !previous,
                  );
                  setDirectDepartmentOpen(
                    false,
                  );
                  setAssetTypeOpen(
                    false,
                  );
                  setAssignmentOpen(
                    false,
                  );
                }}
                className="flex min-h-14 w-full cursor-pointer items-center justify-between rounded-md border border-app-gray/30 bg-transparent px-4 py-2.5 text-left shadow-xs transition hover:bg-app-gray/5 focus:outline-none"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-app-text">
                    {
                      employeeDepartmentLabel
                    }
                  </p>
                  <p className="mt-0.5 text-[10px] font-normal text-app-gray">
                    Employee Department
                  </p>
                </div>
                <MdKeyboardArrowRight
                  className={`shrink-0 transform text-app-gray transition-transform duration-200 ${
                    departmentOpen
                      ? "rotate-90"
                      : ""
                  }`}
                  size={18}
                />
              </button>
              {departmentOpen && (
                <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-app-gray/20 bg-app-bg py-1 text-sm shadow-md">
                  <li
                    className="cursor-pointer px-4 py-2 font-semibold transition-colors hover:bg-app-brand hover:text-white"
                    onClick={() =>
                      handleDepartmentSelect(
                        "All Departments",
                      )
                    }
                  >
                    All Employee
                    Departments
                  </li>
                  {departmentsLoading ? (
                    <li className="px-4 py-2 text-app-gray">
                      Loading
                      departments...
                    </li>
                  ) : departmentsError ? (
                    <li className="px-4 py-2 text-red-500">
                      Failed to load
                      departments
                    </li>
                  ) : departments.length >
                    0 ? (
                    departments.map(
                      (
                        department:
                          string,
                      ) => (
                        <li
                          key={
                            department
                          }
                          className="cursor-pointer px-4 py-2 transition-colors hover:bg-app-brand hover:text-white"
                          onClick={() =>
                            handleDepartmentSelect(
                              department,
                            )
                          }
                        >
                          {
                            department
                          }
                        </li>
                      ),
                    )
                  ) : (
                    <li className="px-4 py-2 text-app-gray">
                      No employee
                      departments found
                    </li>
                  )}
                </ul>
              )}
            </div>
            {/* Direct Department */}
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => {
                  setDirectDepartmentOpen(
                    (
                      previous,
                    ) =>
                      !previous,
                  );
                  setDepartmentOpen(
                    false,
                  );
                  setAssetTypeOpen(
                    false,
                  );
                  setAssignmentOpen(
                    false,
                  );
                }}
                className="flex min-h-14 w-full cursor-pointer items-center justify-between rounded-md border border-app-gray/30 bg-transparent px-4 py-2.5 text-left shadow-xs transition hover:bg-app-gray/5 focus:outline-none"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-app-text">
                    {
                      directDepartmentLabel
                    }
                  </p>
                  <p className="mt-0.5 text-[10px] font-normal text-app-gray">
                    Assigned Department
                  </p>
                </div>
                <MdKeyboardArrowRight
                  className={`shrink-0 transform text-app-gray transition-transform duration-200 ${
                    directDepartmentOpen
                      ? "rotate-90"
                      : ""
                  }`}
                  size={18}
                />
              </button>
              {directDepartmentOpen && (
                <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-app-gray/20 bg-app-bg py-1 text-sm shadow-md">
                  <li
                    className="cursor-pointer px-4 py-2 font-semibold transition-colors hover:bg-app-brand hover:text-white"
                    onClick={() =>
                      handleDirectDepartmentSelect(
                        "All Assigned Departments",
                      )
                    }
                  >
                    All Assigned Departments
                  </li>
                  {filterOptionsLoading ? (
                    <li className="px-4 py-2 text-app-gray">
                      Loading
                      departments...
                    </li>
                  ) : filterOptionsError ? (
                    <li className="px-4 py-2 text-red-500">
                      Failed to load
                      department assets
                    </li>
                  ) : directDepartmentCounts.length >
                    0 ? (
                    directDepartmentCounts.map(
                      (
                        item:
                          DepartmentCountType,
                      ) => (
                        <li
                          key={
                            item.department
                          }
                          onClick={() =>
                            handleDirectDepartmentSelect(
                              item.department,
                            )
                          }
                          className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2 transition-colors hover:bg-app-brand hover:text-white"
                        >
                          <span className="min-w-0 truncate">
                            {
                              item.department
                            }
                          </span>
                          <span className="shrink-0 rounded-md bg-app-gray/10 px-2 py-0.5 text-xs font-bold">
                            {
                              item.count
                            }
                          </span>
                        </li>
                      ),
                    )
                  ) : (
                    <li className="px-4 py-2 text-app-gray">
                      No direct
                      department assets
                    </li>
                  )}
                </ul>
              )}
            </div>
            {/* Asset Type */}
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => {
                  setAssetTypeOpen(
                    (
                      previous,
                    ) =>
                      !previous,
                  );
                  setAssignmentOpen(
                    false,
                  );
                  setDepartmentOpen(
                    false,
                  );
                  setDirectDepartmentOpen(
                    false,
                  );
                }}
                className="flex min-h-14 w-full cursor-pointer items-center justify-between rounded-md border border-app-gray/30 bg-transparent px-4 py-2.5 text-left shadow-xs transition hover:bg-app-gray/5 focus:outline-none"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-app-text">
                    {
                      assetTypeLabel
                    }
                  </p>
                  <p className="mt-0.5 text-[10px] font-normal text-app-gray">
                    Asset Type
                  </p>
                </div>
                <MdKeyboardArrowRight
                  className={`shrink-0 transform text-app-gray transition-transform duration-200 ${
                    assetTypeOpen
                      ? "rotate-90"
                      : ""
                  }`}
                  size={18}
                />
              </button>
              {assetTypeOpen && (
                <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-app-gray/20 bg-app-bg py-1 text-sm shadow-md">
                  <li
                    className="cursor-pointer px-4 py-2 font-semibold transition-colors hover:bg-app-brand hover:text-white"
                    onClick={() =>
                      handleSelect(
                        "All Types",
                      )
                    }
                  >
                    All Asset Types
                  </li>
                  {filterOptionsLoading ? (
                    <li className="px-4 py-2 text-app-gray">
                      Loading asset
                      types...
                    </li>
                  ) : filterOptionsError ? (
                    <li className="px-4 py-2 text-red-500">
                      Failed to load
                      asset types
                    </li>
                  ) : assetTypes.length >
                    0 ? (
                    assetTypes.map(
                      (
                        assetType:
                          string,
                      ) => (
                        <li
                          key={
                            assetType
                          }
                          className="cursor-pointer px-4 py-2 transition-colors hover:bg-app-brand hover:text-white"
                          onClick={() =>
                            handleSelect(
                              assetType,
                            )
                          }
                        >
                          {
                            assetType
                          }
                        </li>
                      ),
                    )
                  ) : (
                    <li className="px-4 py-2 text-app-gray">
                      No asset types
                      found
                    </li>
                  )}
                </ul>
              )}
            </div>
            {/* Assignment Status */}
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => {
                  setAssignmentOpen(
                    (
                      previous,
                    ) =>
                      !previous,
                  );
                  setAssetTypeOpen(
                    false,
                  );
                  setDepartmentOpen(
                    false,
                  );
                  setDirectDepartmentOpen(
                    false,
                  );
                }}
                className="flex min-h-14 w-full cursor-pointer items-center justify-between rounded-md border border-app-gray/30 bg-transparent px-4 py-2.5 text-left shadow-xs transition hover:bg-app-gray/5 focus:outline-none"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-app-text">
                    {
                      assignmentLabel
                    }
                  </p>
                  <p className="mt-0.5 text-[10px] font-normal text-app-gray">
                    Assignment Status
                  </p>
                </div>
                <MdKeyboardArrowRight
                  className={`shrink-0 transform text-app-gray transition-transform duration-200 ${
                    assignmentOpen
                      ? "rotate-90"
                      : ""
                  }`}
                  size={18}
                />
              </button>
              {assignmentOpen && (
                <ul className="absolute z-20 mt-1 w-full rounded-lg border border-app-gray/20 bg-app-bg py-1 text-sm shadow-md">
                  <li
                    className="cursor-pointer px-4 py-2 font-semibold transition-colors hover:bg-app-brand hover:text-white"
                    onClick={() =>
                      handleAssignmentSelect(
                        "All Status",
                      )
                    }
                  >
                    All Assignment Status
                  </li>
                  {assignmentTypes.map(
                    (
                      assignmentType,
                    ) => (
                      <li
                        key={
                          assignmentType
                        }
                        className="cursor-pointer px-4 py-2 transition-colors hover:bg-app-brand hover:text-white"
                        onClick={() =>
                          handleAssignmentSelect(
                            assignmentType,
                          )
                        }
                      >
                        {
                          assignmentType
                        }
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Active Department Filter */}
          {activeDepartmentName && (
            <div className="mb-5 flex flex-wrap items-center gap-2 rounded-lg border border-app-brand/15 bg-app-brand/5 px-4 py-3">
              <span className="text-xs text-app-gray">
                Active Filter:
              </span>
              <span className="text-sm font-semibold text-app-brand">
                {
                  activeDepartmentName
                }
              </span>
              <span className="rounded-md border border-app-brand/20 px-2 py-0.5 text-[10px] font-bold text-app-brand">
                {activeDepartmentSource ===
                "DIRECT"
                  ? "Assigned Department"
                  : "Employee Department"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedDepartment(
                    "All Departments",
                  );
                  setSelectedDirectDepartment(
                    "All Assigned Departments",
                  );
                }}
                className="ml-auto cursor-pointer text-xs font-semibold text-app-brand hover:underline"
              >
                Clear
              </button>
            </div>
          )}

          {/* Add Asset */}
          <div className="transition-all duration-300">
            {assetOpen && (
              <Add_Asset
                setAssetOpen={
                  setAssetOpen
                }
              />
            )}
          </div>
        </div>

        {/* Asset List */}
        <div>
          <div
            ref={assetListRef}
            className="scroll-mt-24"
          >
            <Asset_Card
              assets={assets}
              totalAssets={
                pagination?.totalData
              }
              isLoading={
                isLoading
              }
              isError={
                isError
              }
            />
          </div>
          {/* Pagination */}
          <Asset_Pagination
            currentPage={
              pagination?.currentPage ||
              1
            }
            totalPages={
              pagination?.totalPages ||
              1
            }
            hasNextPage={
              pagination?.hasNextPage ||
              false
            }
            hasPreviousPage={
              pagination
                ?.hasPreviousPage ||
              false
            }
            onPageChange={
              handlePageChange
            }
          />
        </div>


      </div>
    </>
  );
}