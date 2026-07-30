import { useEffect, useRef, useState } from "react";
import { FiFileText, FiSearch, FiUser, FiX } from "react-icons/fi";

import { useGetEmployee } from "../../../context/useEmployee";
import { useGetReports } from "../../../context/useReport";
import Add_Report from "./Add_Report";

export default function Select_Employee() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Delay API request while user is typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: employeeData,
    isLoading: employeesLoading,
    isFetching,
  } = useGetEmployee(1, 20, debouncedSearch, "", "", "");

  const employees = Array.isArray(employeeData?.employees)
    ? employeeData.employees
    : [];

  const { data: reportsData } = useGetReports();

  const reports = Array.isArray(reportsData)
    ? reportsData
    : Array.isArray(reportsData?.reports)
      ? reportsData.reports
      : [];

  // Only active employees without an existing clearance report
  const availableEmployees = employees.filter((employee: any) => {
    const alreadyHasReport = reports.some(
      (report: any) => Number(report.employeeId) === Number(employee.id),
    );

    return employee.status === "ACTIVE" && !alreadyHasReport;
  });




  // Close result box when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSelectEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setSearch(employee.fullName);
    setShowResults(false);
  };

  const handleClearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedEmployee(null);
    setShowResults(false);
  };

  return (
    <>
      <div className="rounded-xl border border-app-gray/20 bg-app-bg p-6 text-app-text shadow-xs transition-colors duration-300">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
          <FiFileText size={22} />
        </div>

        <div className="mb-5 space-y-1">
          <h2 className="text-xl font-bold">Generate Clearance Paper</h2>

          <p className="text-base text-app-gray opacity-80">
            Search for an employee and generate a clearance paper.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-base font-semibold text-app-text">
            Search Employee
          </label>

          <div ref={searchBoxRef} className="relative">
            <div className="relative">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-app-gray"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSelectedEmployee(null);
                  setShowResults(true);
                }}
                onFocus={() => {
                  if (search.trim()) {
                    setShowResults(true);
                  }
                }}
                placeholder="Search by name, Iqama, email or phone..."
                className="w-full rounded-lg border border-app-gray/30 bg-app-bg py-3 pl-11 pr-11 text-[14px] text-app-text outline-none transition focus:border-app-brand"
              />

              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-app-gray transition hover:text-red-500"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>

            {showResults && search.trim() && (
              <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-xl border border-app-gray/20 bg-app-bg p-2 shadow-xl">
                {employeesLoading || isFetching ? (
                  <div className="px-4 py-6 text-center text-sm text-app-gray">
                    Searching employees...
                  </div>
                ) : availableEmployees.length > 0 ? (
                  <div className="space-y-1">
                    {availableEmployees.map((employee: any) => (
                      <button
                        key={employee.id}
                        type="button"
                        onClick={() => handleSelectEmployee(employee)}
                        className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-app-brand/10"
                      >
                        <div className="mt-1 h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-app-gray/20 bg-app-brand/10">
                          {employee.image ? (
                            <img
                              src={`${import.meta.env.VITE_BACKEND_URL_LINK}${employee.image}`}
                              alt={employee.fullName}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-app-brand">
                              <FiUser size={18} />
                            </div>
                          )}
                        </div>


                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-app-text">
                            {employee.fullName}
                          </p>

                          <p className="mt-1 truncate text-xs text-app-gray">
                            Iqama: {employee.iqamaNumber || "Not available"}
                          </p>

                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-app-gray">
                            <span>{employee.email || "No email"}</span>

                            <span>{employee.phoneNumber || "No phone"}</span>
                          </div>

                          <p className="mt-1 text-xs text-app-gray">
                            {employee.department || "No Department"}
                            {" • "}
                            {employee.position || "No Position"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm font-medium text-app-text">
                      No employee found
                    </p>

                    <p className="mt-1 text-xs text-app-gray">
                      The employee may be inactive or already have a clearance
                      report.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-app-gray">
            Search using employee name, Iqama number, email address or phone
            number.
          </p>

          {/* <div className="mt-4 items-center justify-between gap-3 space-y-2 pb-1 lg:flex lg:space-y-0">

            <button
              type="button"
              className="w-full cursor-default rounded-lg border border-app-brand/30 bg-app-brand/10 py-2 font-normal capitalize text-app-text"
            >
              Active: {activeCount}
            </button>

            <button
              type="button"
              className="w-full cursor-default rounded-lg border border-app-brand/30 bg-app-brand/10 py-2 font-normal capitalize text-app-text"
            >
              Inactive: {inactiveCount}
            </button>

            <button
              type="button"
              className="w-full cursor-default rounded-lg border border-app-brand/30 bg-app-brand/10 py-2 font-normal capitalize text-app-text"
            >
              Resigned: {resignedCount}
            </button>

            <button
              type="button"
              className="w-full cursor-default rounded-lg border border-app-brand/30 bg-app-brand/10 py-2 font-normal capitalize text-app-text"
            >
              Vacation: {vacationCount}
            </button>





          </div> */}

        </div>
      </div>

      {selectedEmployee && (
        <Add_Report
          employee={selectedEmployee}
          onClose={() => {
            setSelectedEmployee(null);
            setSearch("");
            setDebouncedSearch("");
          }}
        />
      )}
    </>
  );
}
