import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FiFileText,
  FiSearch,
  FiUser,
  FiX,
} from "react-icons/fi";

import { useGetEmployee } from "../../../context/useEmployee";
import { useGetReports } from "../../../context/useReport";

import Add_Report from "./Add_Report";
import { useDebounce } from "../../../context/useDebounce";

export default function Select_Employee() {
  const [search, setSearch] = useState("");

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] = useState<any>(null);

  const [showResults, setShowResults] =
    useState(false);

  const searchBoxRef =
    useRef<HTMLDivElement>(null);

  // User typing বন্ধ করার 400ms পরে
  // employee search API request যাবে
  const debouncedSearch = useDebounce(
    search.trim(),
    400,
  );

  const {
    data: employeeData,
    isLoading: employeesLoading,
    isFetching,
    isError: employeesError,
  } = useGetEmployee(
    1,
    20,
    debouncedSearch,
    "",
    "",
    "",
  );

  const employees = Array.isArray(
    employeeData?.employees,
  )
    ? employeeData.employees
    : [];

  const {
    data: reportsData,
    isLoading: reportsLoading,
    isError: reportsError,
  } = useGetReports();

  const reports = Array.isArray(reportsData)
    ? reportsData
    : Array.isArray(reportsData?.reports)
      ? reportsData.reports
      : [];

  // Active employee এবং যাদের আগে clearance report নেই,
  // শুধুমাত্র তাদের search result-এ দেখাবে
  const availableEmployees = useMemo(() => {
    return employees.filter(
      (employee: any) => {
        const alreadyHasReport =
          reports.some(
            (report: any) =>
              Number(report.employeeId) ===
              Number(employee.id),
          );

        return (
          employee.status === "ACTIVE" &&
          !alreadyHasReport
        );
      },
    );
  }, [employees, reports]);

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL_LINK ||
    "";

  const getImageUrl = (
    image?: string | null,
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

  // Search box-এর বাইরে click করলে
  // result dropdown বন্ধ হবে
  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(
          event.target as Node,
        )
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  const handleSelectEmployee = (
    employee: any,
  ) => {
    setSelectedEmployee(employee);
    setSearch(employee.fullName || "");
    setShowResults(false);
  };

  const handleClearSearch = () => {
    setSearch("");
    setSelectedEmployee(null);
    setShowResults(false);
  };

  const isTyping =
    search.trim() !== debouncedSearch;

  const isSearching =
    isTyping ||
    employeesLoading ||
    isFetching ||
    reportsLoading;

  const shouldShowResults =
    showResults &&
    search.trim().length > 0;

  return (
    <>
      <div className="rounded-xl border border-app-gray/20 bg-app-bg p-6 text-app-text shadow-xs transition-colors duration-300">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
          <FiFileText size={22} />
        </div>

        <div className="mb-5 space-y-1">
          <h2 className="text-xl font-bold">
            Generate Clearance Paper
          </h2>

          <p className="text-base text-app-gray opacity-80">
            Search for an employee and
            generate a clearance paper.
          </p>
        </div>

        <div className="space-y-4">
          <label
            htmlFor="clearance-employee-search"
            className="block text-base font-semibold text-app-text"
          >
            Search Employee
          </label>

          <div
            ref={searchBoxRef}
            className="relative"
          >
            <div className="relative">
              <FiSearch
                size={18}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-app-gray"
              />

              <input
                id="clearance-employee-search"
                type="text"
                value={search}
                autoComplete="off"
                onChange={(event) => {
                  setSearch(
                    event.target.value,
                  );

                  setSelectedEmployee(null);
                  setShowResults(true);
                }}
                onFocus={() => {
                  if (search.trim()) {
                    setShowResults(true);
                  }
                }}
                placeholder="Search by name, Iqama, email or phone..."
                className="w-full rounded-lg border border-app-gray/30 bg-app-bg py-3 pr-11 pl-11 text-[14px] text-app-text outline-none transition focus:border-app-brand"
              />

              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  title="Clear search"
                  className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-app-gray transition hover:text-red-500"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>

            {shouldShowResults && (
              <div className="absolute top-full right-0 left-0 z-40 mt-2 max-h-80 overflow-y-auto rounded-xl border border-app-gray/20 bg-app-bg p-2 shadow-xl">
                {isSearching ? (
                  <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-app-brand">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-app-brand/20 border-t-app-brand" />

                    <span>
                      Searching employees...
                    </span>
                  </div>
                ) : employeesError ||
                  reportsError ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm font-medium text-red-500">
                      Failed to search employees
                    </p>

                    <p className="mt-1 text-xs text-app-gray">
                      Please try again.
                    </p>
                  </div>
                ) : debouncedSearch.length ===
                  0 ? (
                  <div className="px-4 py-6 text-center text-sm text-app-gray">
                    Start typing to search
                    employees.
                  </div>
                ) : availableEmployees.length >
                  0 ? (
                  <div className="space-y-1">
                    {availableEmployees.map(
                      (employee: any) => (
                        <button
                          key={employee.id}
                          type="button"
                          onClick={() =>
                            handleSelectEmployee(
                              employee,
                            )
                          }
                          className="flex w-full cursor-pointer items-start gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-app-brand/10"
                        >
                          <div className="mt-1 h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-app-gray/20 bg-app-brand/10">
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
                              <div className="flex h-full w-full items-center justify-center text-app-brand">
                                <FiUser
                                  size={18}
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-app-text">
                              {employee.fullName ||
                                "Unnamed Employee"}
                            </p>

                            <p className="mt-1 truncate text-xs text-app-gray">
                              Iqama:{" "}
                              {employee.iqamaNumber ||
                                "Not available"}
                            </p>

                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-app-gray">
                              <span>
                                {employee.email ||
                                  "No email"}
                              </span>

                              <span>
                                {employee.phoneNumber ||
                                  "No phone"}
                              </span>
                            </div>

                            <p className="mt-1 text-xs text-app-gray">
                              {employee.department ||
                                "No Department"}
                              {" • "}
                              {employee.position ||
                                "No Position"}
                            </p>
                          </div>
                        </button>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm font-medium text-app-text">
                      No employee found
                    </p>

                    <p className="mt-1 text-xs text-app-gray">
                      The employee may be
                      inactive or already have a
                      clearance report.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-app-gray">
            Search using employee name,
            Iqama number, email address or
            phone number.
          </p>
        </div>
      </div>

      {selectedEmployee && (
        <Add_Report
          employee={selectedEmployee}
          onClose={() => {
            setSelectedEmployee(null);
            setSearch("");
            setShowResults(false);
          }}
        />
      )}
    </>
  );
}