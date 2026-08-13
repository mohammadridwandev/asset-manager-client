import { FiSearch } from "react-icons/fi";

import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { Helmet } from "react-helmet-async";

import DataLoading from "../../DataLoading";

import {
  useGetEmployeeFilterOptions,
} from "../../context/useEmployee";

import {
  useGetAssets,
} from "../../context/useAssets";

import {
  useDebounce,
} from "../../context/useDebounce";


export default function All_Department() {
  const navigate = useNavigate();

  const [searchText, setSearchText] =
    useState("");

  const debouncedSearchText =
    useDebounce(
      searchText.trim(),
      400,
    );

  // Same departments as AssetPage
  const {
    data: filterOptions,
    isLoading:
      departmentsLoading,
    isError:
      departmentsError,
  } =
    useGetEmployeeFilterOptions();

  const departments: string[] =
    filterOptions?.departments || [];

  // Get assets
  const {
    data: assetData,
    isLoading: assetsLoading,
    isError: assetsError,
  } = useGetAssets(
    1,
    100,
    "",
    "",
    "",
  );

  const assets =
    assetData?.assets || [];

  // Search departments
  const filteredDepartments =
    useMemo(() => {
      const keyword =
        debouncedSearchText
          .toLowerCase();

      if (!keyword) {
        return departments;
      }

      return departments.filter(
        (department: string) =>
          department
            .toLowerCase()
            .includes(keyword),
      );
    }, [
      departments,
      debouncedSearchText,
    ]);

  // Count assigned assets
  const getDepartmentAssetCount = (
    departmentName: string,
  ) => {
    return assets.filter(
      (asset: any) =>
        Array.isArray(
          asset.departmentAssignments,
        ) &&
        asset.departmentAssignments.some(
          (assignment: any) =>
            assignment.department?.name
              ?.trim()
              .toLowerCase() ===
            departmentName
              .trim()
              .toLowerCase(),
        ),
    ).length;
  };

  // Open department asset list
  const handleOpenDepartment = (
    departmentName: string,
  ) => {
    navigate(
      `/dashboard/department-assets/${encodeURIComponent(
        departmentName,
      )}`,
    );
  };

  if (departmentsLoading) {
    return (
      <DataLoading
        title="Loading Departments"
        message="Fetching department data..."
      />
    );
  }

  if (departmentsError) {
    return (
      <div className="flex min-h-75 items-center justify-center text-lg font-medium text-red-500">
        Failed to load department data!
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Asset Manager | Departments
        </title>
      </Helmet>

      <div className="pb-16">
        <div className="py-4 md:py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">
              Departments
            </h1>

            <p className="mt-1 text-sm text-app-gray opacity-80">
              View company departments
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6 w-full">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-app-gray opacity-60">
              <FiSearch size={18} />
            </div>

            <input
              type="text"
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target.value,
                )
              }
              placeholder="Search department..."
              className="w-full rounded-md border border-app-gray/30 bg-transparent py-2.5 pr-4 pl-12 text-sm outline-none transition-all placeholder:text-app-gray/50 focus:border-app-brand"
            />
          </div>

          {/* Total */}
          <div className="mb-4 text-sm text-app-gray">
            Total Departments:{" "}
            <span className="font-semibold text-app-text">
              {
                filteredDepartments.length
              }
            </span>
          </div>

          {assetsError && (
            <div className="mb-4 rounded-md border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
              Failed to load asset counts.
            </div>
          )}

          {/* Department Cards */}
          {filteredDepartments.length ===
          0 ? (
            <div className="rounded-md border border-app-gray/20 px-4 py-12 text-center text-sm text-app-gray">
              {searchText.trim()
                ? "No matching departments found."
                : "No departments found."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDepartments.map(
                (
                  department: string,
                ) => {
                  const assetCount =
                    getDepartmentAssetCount(
                      department,
                    );

                  return (
                    <button
                      key={department}
                      type="button"
                      onClick={() =>
                        handleOpenDepartment(
                          department,
                        )
                      }
                      className="group min-h-28 cursor-pointer rounded-md border border-app-gray/20 bg-app-bg p-5 text-left transition-all hover:border-app-brand hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold text-app-text transition-colors group-hover:text-app-brand">
                            {department}
                          </h3>

                          <p className="mt-1 text-xs text-app-gray">
                            Department
                          </p>
                        </div>

                        <span className="rounded-md bg-app-brand/10 px-2.5 py-1 text-xs font-semibold text-app-brand">
                          {assetsLoading
                            ? "..."
                            : assetCount}
                        </span>
                      </div>

                      <p className="mt-4 text-xs font-medium text-app-brand">
                        {assetsLoading
                          ? "Loading assets..."
                          : `${assetCount} ${
                              assetCount ===
                              1
                                ? "Asset"
                                : "Assets"
                            }`}
                      </p>
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}