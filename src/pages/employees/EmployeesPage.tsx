import { useEffect, useRef, useState } from "react";
import { FiPlus, FiSearch, FiMinus } from "react-icons/fi";
import { MdKeyboardArrowRight } from "react-icons/md";
import Add_Employee from "../../components/Employee_comp/Add_Employee";
import Employee_Card from "../../components/Employee_comp/Employee_Card";
import { useGetEmployee } from "../../context/useEmployee";
import ExportData from "../../components/Employee_comp/ExportData";
import ImportData from "../../components/Employee_comp/ImportData";
import Pagination_Employee from "../../components/Employee_comp/Pagination_Employee";
import { Helmet } from "react-helmet-async";

const EmployeesPage = () => {
  const [openEmployee, setOpenEmployee] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");

  const [positionOpen, setPositionOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("All Positions");

  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [page, setPage] = useState(1);

  const employeeListRef = useRef<HTMLDivElement>(null);


  const { data, isLoading, isError } = useGetEmployee(
    page,
    10,
    searchText,
    selectedDepartment,
    selectedPosition,
    selectedStatus,
  );

  const employees = data?.employees || [];
  const pagination = data?.pagination;

  const departments: string[] = employees
    .map((employee: any) => String(employee.department || "").trim())
    .filter((department: string) => department.length > 0)
    .filter(
      (department: string, index: number, array: string[]) =>
        array.indexOf(department) === index,
    )
    .sort();

  const positions: string[] = employees
    .map((employee: any) => String(employee.position || "").trim())
    .filter((position: string) => position.length > 0)
    .filter(
      (position: string, index: number, array: string[]) =>
        array.indexOf(position) === index,
    )
    .sort();

  const employeeStatuses = [
    {
      label: "Active",
      value: "ACTIVE",
    },
    {
      label: "Inactive",
      value: "INACTIVE",
    },
  ];

  useEffect(() => {
    setPage(1);
  }, [searchText, selectedDepartment, selectedPosition, selectedStatus]);


  const handlePageChange = (newPage: number) => {
  setPage(newPage);

  setTimeout(() => {
    employeeListRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};


  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center text-lg font-medium text-app-brand">
        Loading Employees...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-75 items-center justify-center text-lg font-medium text-red-500">
        Failed to load employee data!
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Asset Manager | Employees</title>
      </Helmet>

      <div>
        <div className="py-4 md:py-8">
          <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Employee Management
              </h1>

              <p className="mt-1 text-sm opacity-60">
                Manage employee profiles and assets
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <ExportData employees={employees} />

              <ImportData />

              <button
                type="button"
                onClick={() => setOpenEmployee((previous) => !previous)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-app-brand px-5 py-2.5 text-sm font-bold text-app-secondary shadow-md transition-all hover:opacity-90 active:scale-95 md:w-auto"
              >
                {openEmployee ? (
                  <>
                    <FiMinus size={18} />
                    <span>Close</span>
                  </>
                ) : (
                  <>
                    <FiPlus size={18} />
                    <span>Add Employees</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <FiSearch size={18} />
              </div>

              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search employees by name, email, phone, iqama, department or position..."
                className="w-full rounded-md border border-app-gray/15 bg-app-bg py-3.5 pr-4 pl-12 text-sm outline-none transition-all focus:border-app-brand"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setDepartmentOpen((previous) => !previous)}
                className="flex w-full items-center justify-between rounded-md border border-app-gray/30 bg-transparent px-4 py-3.5 text-left text-sm font-medium shadow-xs hover:bg-app-gray/5 focus:outline-none sm:w-52"
              >
                <span>{selectedDepartment}</span>

                <MdKeyboardArrowRight
                  className={`transform transition-transform duration-200 ${
                    departmentOpen ? "rotate-90" : ""
                  }`}
                  size={18}
                />
              </button>

              {departmentOpen && (
                <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-app-gray/20 bg-app-bg py-1 text-sm shadow-md sm:w-52">
                  <li
                    className="cursor-pointer px-4 py-2 font-semibold transition-colors hover:bg-app-brand hover:text-white"
                    onClick={() => {
                      setSelectedDepartment("All Departments");
                      setDepartmentOpen(false);
                    }}
                  >
                    All Departments
                  </li>

                  {departments.map((department) => (
                    <li
                      key={department}
                      className="cursor-pointer px-4 py-2 transition-colors hover:bg-app-brand hover:text-white"
                      onClick={() => {
                        setSelectedDepartment(department);
                        setDepartmentOpen(false);
                      }}
                    >
                      {department}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setPositionOpen((previous) => !previous)}
                className="flex w-full items-center justify-between rounded-md border border-app-gray/30 bg-transparent px-4 py-3.5 text-left text-sm font-medium shadow-xs hover:bg-app-gray/5 focus:outline-none sm:w-52"
              >
                <span>{selectedPosition}</span>

                <MdKeyboardArrowRight
                  className={`transform transition-transform duration-200 ${
                    positionOpen ? "rotate-90" : ""
                  }`}
                  size={18}
                />
              </button>

              {positionOpen && (
                <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-app-gray/20 bg-app-bg py-1 text-sm shadow-md sm:w-52">
                  <li
                    className="cursor-pointer px-4 py-2 font-semibold transition-colors hover:bg-app-brand hover:text-white"
                    onClick={() => {
                      setSelectedPosition("All Positions");
                      setPositionOpen(false);
                    }}
                  >
                    All Positions
                  </li>

                  {positions.map((position) => (
                    <li
                      key={position}
                      className="cursor-pointer px-4 py-2 transition-colors hover:bg-app-brand hover:text-white"
                      onClick={() => {
                        setSelectedPosition(position);
                        setPositionOpen(false);
                      }}
                    >
                      {position}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setStatusOpen((previous) => !previous)}
                className="flex w-full items-center justify-between rounded-md border border-app-gray/30 bg-transparent px-4 py-3.5 text-left text-sm font-medium shadow-xs hover:bg-app-gray/5 focus:outline-none sm:w-48"
              >
                <span>{selectedStatus}</span>

                <MdKeyboardArrowRight
                  className={`transform transition-transform duration-200 ${
                    statusOpen ? "rotate-90" : ""
                  }`}
                  size={18}
                />
              </button>

              {statusOpen && (
                <ul className="absolute z-10 mt-1 w-full rounded-lg border border-app-gray/20 bg-app-bg py-1 text-sm shadow-md sm:w-48">
                  <li
                    className="cursor-pointer px-4 py-2 font-semibold transition-colors hover:bg-app-brand hover:text-white"
                    onClick={() => {
                      setSelectedStatus("All Status");
                      setStatusOpen(false);
                    }}
                  >
                    All Status
                  </li>

                  {employeeStatuses.map((status) => (
                    <li
                      key={status.value}
                      className="cursor-pointer px-4 py-2 transition-colors hover:bg-app-brand hover:text-white"
                      onClick={() => {
                        setSelectedStatus(status.value);
                        setStatusOpen(false);
                      }}
                    >
                      {status.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="transition-all duration-700">
            {openEmployee && <Add_Employee setOpenEmployee={setOpenEmployee} />}
          </div>
        </div>
      </div>

     <div ref={employeeListRef} className="scroll-mt-24">
  <Employee_Card
    employees={employees}
    totalEmployees={pagination?.totalData}
  />
</div>

      <Pagination_Employee
        currentPage={pagination?.currentPage || 1}
        totalPages={pagination?.totalPages || 1}
        hasNextPage={pagination?.hasNextPage || false}
        hasPreviousPage={pagination?.hasPreviousPage || false}
        onPageChange={handlePageChange}



      />
    </>
  );
};

export default EmployeesPage;
