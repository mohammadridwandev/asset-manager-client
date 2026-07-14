import { useState } from "react";
import { FiPlus, FiSearch, FiMinus } from "react-icons/fi";
import { MdKeyboardArrowRight } from "react-icons/md"; // UPDATED: dropdown icon
import Add_Employee from "../../components/Employee_comp/Add_Employee";
import Employee_Card from "../../components/Employee_comp/Employee_Card";
import { useGetEmployee } from "../../context/useEmployee";
import ExportData from "../../components/Employee_comp/ExportData";
import ImportData from "../../components/Employee_comp/ImportData";

const EmployeesPage = () => {
  const [openEmployee, setOpenEmployee] = useState(false);

  const [searchText, setSearchText] = useState("");

  // UPDATED: department filter state
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");

  // UPDATED: position filter state
  const [positionOpen, setPositionOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("All Positions");

  // UPDATED: status filter state
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const { data: employees = [] } = useGetEmployee();

  // UPDATED: dynamic departments from employees
  const departments: string[] = employees
    .map((employee: any) => String(employee.department || "").trim())
    .filter((department: string) => department.length > 0)
    .filter((department: string, index: number, array: string[]) => {
      return array.indexOf(department) === index;
    })
    .sort();

  // UPDATED: dynamic positions from employees
  const positions: string[] = employees
    .map((employee: any) => String(employee.position || "").trim())
    .filter((position: string) => position.length > 0)
    .filter((position: string, index: number, array: string[]) => {
      return array.indexOf(position) === index;
    })
    .sort();

 
  const employeeStatuses = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];


  // UPDATED: dynamic search + dropdown filters
  const filteredEmployees = employees.filter((employee: any) => {
    const search = searchText.toLowerCase();

    const matchSearch =
      employee.fullName?.toLowerCase().includes(search) ||
      employee.email?.toLowerCase().includes(search) ||
      employee.phoneNumber?.toLowerCase().includes(search) ||
      employee.iqamaNumber?.toLowerCase().includes(search) ||
      employee.department?.toLowerCase().includes(search) ||
      employee.position?.toLowerCase().includes(search);

    const matchDepartment =
      selectedDepartment === "All Departments" ||
      employee.department === selectedDepartment;

    const matchPosition =
      selectedPosition === "All Positions" ||
      employee.position === selectedPosition;

    const matchStatus =
      selectedStatus === "All Status" || employee.status === selectedStatus;

    return matchSearch && matchDepartment && matchPosition && matchStatus;
  });

  
  return (
    <>
      <div>
        <div className="py-4 md:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Employee Management
              </h1>
              <p className="opacity-60 text-sm mt-1">
                Manage employee profiles and assets
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <ExportData employees={employees} />
              <ImportData />

              <button
                onClick={() => setOpenEmployee(!openEmployee)}
                className="flex w-full md:w-auto items-center justify-center gap-2 px-5 py-2.5 bg-app-brand text-app-secondary rounded-md text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer"
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

          {/* UPDATED: Search + dropdown filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <FiSearch size={18} />
              </div>

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search employees by name, email, phone, iqama, department or position..."
                className="w-full bg-app-bg border border-app-gray/15 rounded-md py-3.5 pl-12 pr-4 outline-none focus:border-app-brand transition-all text-sm"
              />
            </div>

            {/* UPDATED: Department dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDepartmentOpen(!departmentOpen)}
                className="w-full sm:w-52 text-left px-4 py-3.5 flex items-center justify-between border rounded-md bg-transparent border-app-gray/30 shadow-xs hover:bg-app-gray/5 focus:outline-none text-sm font-medium"
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
                <ul className="absolute z-10 w-full sm:w-52 bg-app-bg border border-app-gray/20 rounded-lg shadow-md mt-1 py-1 text-sm max-h-64 overflow-y-auto">
                  <li
                    className="px-4 py-2 hover:bg-app-brand hover:text-white cursor-pointer transition-colors font-semibold"
                    onClick={() => {
                      setSelectedDepartment("All Departments"); // UPDATED
                      setDepartmentOpen(false); // UPDATED
                    }}
                  >
                    All Departments
                  </li>

                  {departments.map((department) => (
                    <li
                      key={department}
                      className="px-4 py-2 hover:bg-app-brand hover:text-white cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedDepartment(department); // UPDATED
                        setDepartmentOpen(false); // UPDATED
                      }}
                    >
                      {department}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* UPDATED: Position dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPositionOpen(!positionOpen)}
                className="w-full sm:w-52 text-left px-4 py-3.5 flex items-center justify-between border rounded-md bg-transparent border-app-gray/30 shadow-xs hover:bg-app-gray/5 focus:outline-none text-sm font-medium"
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
                <ul className="absolute z-10 w-full sm:w-52 bg-app-bg border border-app-gray/20 rounded-lg shadow-md mt-1 py-1 text-sm max-h-64 overflow-y-auto">
                  <li
                    className="px-4 py-2 hover:bg-app-brand hover:text-white cursor-pointer transition-colors font-semibold"
                    onClick={() => {
                      setSelectedPosition("All Positions"); // UPDATED
                      setPositionOpen(false); // UPDATED
                    }}
                  >
                    All Positions
                  </li>

                  {positions.map((position) => (
                    <li
                      key={position}
                      className="px-4 py-2 hover:bg-app-brand hover:text-white cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedPosition(position); // UPDATED
                        setPositionOpen(false); // UPDATED
                      }}
                    >
                      {position}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* UPDATED: Status dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setStatusOpen(!statusOpen)}
                className="w-full sm:w-48 text-left px-4 py-3.5 flex items-center justify-between border rounded-md bg-transparent border-app-gray/30 shadow-xs hover:bg-app-gray/5 focus:outline-none text-sm font-medium"
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
                <ul className="absolute z-10 w-full sm:w-48 bg-app-bg border border-app-gray/20 rounded-lg shadow-md mt-1 py-1 text-sm">
                  <li
                    className="px-4 py-2 hover:bg-app-brand hover:text-white cursor-pointer transition-colors font-semibold"
                    onClick={() => {
                      setSelectedStatus("All Status"); // UPDATED
                      setStatusOpen(false); // UPDATED
                    }}
                  >
                    All Status
                  </li>

                  {/* UPDATED: status dropdown with label/value */}
                  {employeeStatuses.map((status) => (
                    <li
                      key={status.value}
                      className="px-4 py-2 hover:bg-app-brand hover:text-white cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedStatus(status.value); // UPDATED
                        setStatusOpen(false); // UPDATED
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

      <Employee_Card employees={filteredEmployees} />

    </>
  );
};

export default EmployeesPage;
