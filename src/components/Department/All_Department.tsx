import { FiSearch } from "react-icons/fi";

import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import DataLoading from "../../DataLoading";
import { useGetAssetFilterOptions } from "../../context/useAssets";

import { useDebounce } from "../../context/useDebounce";

type DepartmentCountType = {
  department: string;
  count: number;
};

export default function All_Department() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");

  const debouncedSearchText = useDebounce(searchText.trim(), 400);

  // Get only departments with assigned assets
  const {
    data: filterOptions,
    isLoading,
    isError,
  } = useGetAssetFilterOptions();

  const directDepartmentCounts: DepartmentCountType[] =
    filterOptions?.directDepartmentCounts || [];

  // Search assigned departments
  const filteredDepartments = useMemo(() => {
    const keyword = debouncedSearchText.toLowerCase();

    if (!keyword) {
      return directDepartmentCounts;
    }

    return directDepartmentCounts.filter((item) =>
      item.department.toLowerCase().includes(keyword),
    );
  }, [directDepartmentCounts, debouncedSearchText]);

  // Open department asset list
  const handleOpenDepartment = (departmentName: string) => {
    navigate(
      `/dashboard/department-assets/${encodeURIComponent(departmentName)}`,
    );
  };



  if (isLoading) {
    return (
      <DataLoading
        title="Loading Departments"
        message="Fetching assigned department assets..."
      />
    );
  }



  if (isError) {
    return (
      <div className="flex min-h-75 items-center justify-center text-lg font-medium text-red-500">
        Failed to load department data!
      </div>
    );
  }

  


  return (
    <>
      <Helmet>
        <title>Asset Manager | Departments</title>
      </Helmet>

      <div className="pb-16">
        <div className="py-4 md:py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">
              Assigned Departments
            </h1>

            <p className="mt-1 text-sm text-app-gray opacity-80">
              View departments with directly assigned assets
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
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search assigned department..."
              className="w-full rounded-md border border-app-gray/30 bg-transparent py-2.5 pr-4 pl-12 text-sm outline-none transition-all placeholder:text-app-gray/50 focus:border-app-brand"
            />
          </div>

          {/* Total */}
          <div className="mb-4 text-sm text-app-gray">
            Total Assigned Departments:{" "}
            <span className="font-semibold text-app-text">
              {filteredDepartments.length}
            </span>
          </div>

          {/* Department Cards */}
          {filteredDepartments.length === 0 ? (
            <div className="rounded-md border border-app-gray/20 px-4 py-12 text-center text-sm text-app-gray">
              {searchText.trim()
                ? "No matching assigned departments found."
                : "No department assets found."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDepartments.map((item: DepartmentCountType) => (
                <button
                  key={item.department}
                  type="button"
                  onClick={() => handleOpenDepartment(item.department)}
                  className="group min-h-28 cursor-pointer rounded-md border border-app-gray/20 bg-app-bg p-5 text-left transition-all hover:border-app-brand hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3
                        className="truncate text-base font-semibold text-app-text transition-colors group-hover:text-app-brand"
                        title={item.department}
                      >
                        {item.department}
                      </h3>

                      <p className="mt-1 text-xs text-app-gray">
                        Assigned Department
                      </p>
                    </div>

                    <span className="shrink-0 rounded-md bg-app-brand/10 px-2.5 py-1 text-xs font-semibold text-app-brand">
                      {item.count}
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-medium text-app-brand">
                    {item.count} {item.count === 1 ? "Asset" : "Assets"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
