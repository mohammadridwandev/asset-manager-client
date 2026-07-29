import { useMemo, useState } from "react";
import { FiSearch, FiUser } from "react-icons/fi";
import { useGetEmployee } from "../../context/useEmployee";

export default function Employee_Details() {
  const {
    data: employeeData,
    isLoading,
    isError,
  } = useGetEmployee(
    1,
    100,
    "",
    "",
    "",
    "",
  );

  const employees = Array.isArray(employeeData?.employees)
    ? employeeData.employees
    : [];

  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("department");

  const filteredEmployees = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    const filtered = employees.filter((employee: any) => {
      return (
        employee.fullName?.toLowerCase().includes(search) ||
        employee.email?.toLowerCase().includes(search) ||
        employee.iqamaNumber?.toLowerCase().includes(search) ||
        employee.department?.toLowerCase().includes(search) ||
        employee.position?.toLowerCase().includes(search) ||
        employee.status?.toLowerCase().includes(search)
      );
    });

    return [...filtered].sort((a: any, b: any) => {
      if (sortBy === "name") {
        return (a.fullName || "").localeCompare(b.fullName || "");
      }

      if (sortBy === "status") {
        return (a.status || "").localeCompare(b.status || "");
      }

      if (sortBy === "department") {
        return (a.department || "").localeCompare(
          b.department || "",
        );
      }

      return 0;
    });
  }, [employees, searchText, sortBy]);

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/5 text-emerald-500 border-emerald-500/20";

      case "VACATION":
        return "bg-blue-500/5 text-blue-500 border-blue-500/20";

      case "ON_LEAVE":
        return "bg-amber-500/5 text-amber-500 border-amber-500/20";

      case "INACTIVE":
        return "bg-gray-500/5 text-gray-500 border-gray-500/20";

      case "RESIGNED":
        return "bg-red-500/5 text-red-500 border-red-500/20";

      default:
        return "bg-app-gray/5 text-app-gray border-app-gray/20";
    }
  };

  if (isLoading) {
    return (
      <div className="mt-20 mb-10 w-full rounded-xl border border-app-gray/20 bg-app-bg p-6 text-center text-sm text-app-gray shadow-xs">
        Loading employees...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-20 mb-10 w-full rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-red-500 shadow-xs">
        Failed to load employees.
      </div>
    );
  }

  return (
    <div className="mt-20 mb-10 w-full rounded-xl border border-app-gray/20 bg-app-bg p-4 text-app-text shadow-xs transition-colors duration-300 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiUser size={18} className="text-app-brand" />

          <h2 className="text-base font-bold tracking-tight">
            Employee Details{" "}
            {employees.length > 0 && `(${employees.length})`}
          </h2>
        </div>

        <span className="text-xs font-medium text-app-gray">
          Total: {employees.length}
        </span>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-app-gray opacity-50">
            <FiSearch size={16} />
          </div>

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            placeholder="Search by name, email, iqama, department, position, or status..."
            className="w-full rounded-lg border border-app-gray/30 bg-transparent py-2 pr-4 pl-10 text-sm transition-colors placeholder:text-app-gray/40 focus:border-app-brand focus:outline-none"
          />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
            className="w-full cursor-pointer appearance-none rounded-lg border border-app-gray/30 bg-app-bg px-4 py-2 text-sm font-medium text-app-text focus:border-app-brand focus:outline-none sm:w-52"
          >
            <option value="department">
              Sort by Department
            </option>

            <option value="name">
              Name (A-Z)
            </option>

            <option value="status">
              Sort by Status
            </option>
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-app-gray/10">
        <table className="w-full min-w-200 border-collapse text-left">
          <thead>
            <tr className="border-b border-app-gray/10 bg-app-brand/10 font-medium text-app-text capitalize">
              <th className="p-4 pl-6">
                Employee Name
              </th>

              <th className="p-4">
                Department
              </th>

              <th className="p-4">
                Position
              </th>

              <th className="p-4">
                Email
              </th>

              <th className="p-4">
                Iqama Number
              </th>

              <th className="p-4 pr-6 text-center">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-app-gray/10 text-sm">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee: any) => (
                <tr
                  key={employee.id}
                  className="transition-colors hover:bg-app-gray/5"
                >
                  <td className="p-4 pl-6 font-medium text-app-text">
                    {employee.fullName || "N/A"}
                  </td>

                  <td className="p-4 text-app-text opacity-90">
                    {employee.department || "N/A"}
                  </td>

                  <td className="p-4 text-app-text opacity-90">
                    {employee.position || "N/A"}
                  </td>

                  <td className="p-4 font-medium text-app-text">
                    {employee.email || "N/A"}
                  </td>

                  <td className="p-4 font-medium text-app-text">
                    {employee.iqamaNumber || "N/A"}
                  </td>

                  <td className="p-4 pr-6 text-center">
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                        employee.status,
                      )}`}
                    >
                      {employee.status || "UNKNOWN"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="p-10 text-center text-sm text-app-gray"
                >
                  {searchText
                    ? "No employees match your search."
                    : "No employee data found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {searchText && (
        <div className="mt-4 text-right text-xs text-app-gray">
          Showing {filteredEmployees.length} of{" "}
          {employees.length} employees
        </div>
      )}
    </div>
  );
}