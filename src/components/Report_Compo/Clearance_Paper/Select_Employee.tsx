import { FiFileText, } from "react-icons/fi";
import { useGetEmployee } from "../../../context/useEmployee";
import { useState } from "react";
import Add_Report from "./Add_Report";
import { useGetReports } from "../../../context/useReport";

export default function Select_Employee() {

  const { data: employees = [] } = useGetEmployee();

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const { data: reports = [] } = useGetReports();

  const activeEmployees = employees.filter((employee: any) => {
  const alreadyHasReport = reports.some(
    (report: any) => report.employeeId === employee.id,
  );

  return (
    employee.status === "ACTIVE" &&
    !alreadyHasReport
  );
});




  const activeCount = employees.filter(
    (employee: any) => employee.status === "ACTIVE",
  ).length;

  const inactiveCount = employees.filter(
    (employee: any) => employee.status === "INACTIVE",
  ).length;

  const vacationCount = employees.filter(
    (employee: any) => employee.status === "VACATION",
  ).length;



  const resignedCount = employees.filter(
    (employee: any) => employee.status === "RESIGNED",
  ).length;
  

  const handleSelectEmployee = (e: React.ChangeEvent<HTMLSelectElement>) => {
    
    const employeeId = e.target.value;

    if (!employeeId) return;

    const employee = employees.find(
      (item: any) => String(item.id) === String(employeeId),
    );
    setSelectedEmployee(employee);
  };






  return (
    <>
      <div className="  bg-app-bg text-app-text p-6 border border-app-gray/20 rounded-xl shadow-xs transition-colors duration-300">
        {/* Top Icon Badge */}
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4">
          <FiFileText size={22} />
        </div>

        {/* Header Titles */}
        <div className="space-y-1 mb-5">
          <h2 className="text-xl font-bold">Generate Clearance Paper</h2>
          <p className="text-base text-app-gray opacity-80">
            Inspect devices and generate clearance papers for departing
            employees
          </p>
        </div>

        {/* Form Fields Area */}
        <div className="space-y-4">
          {/* Input Label */}

          <label className="block text-base font-semibold text-app-text">
            Select Employee
          </label>

          {/* Search Input Box */}
          {/* <div className="relative">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-app-gray opacity-50">
              <FiSearch size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by name or department..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-app-gray/30 bg-transparent text-base focus:outline-none focus:border-app-brand placeholder:text-app-gray/40 transition-colors"
            />
          </div> */}

          {/* show active employee name dept  */}

          <div className="relative">
            <select
              onChange={handleSelectEmployee}
              defaultValue=""
              className="w-full px-4 py-3 text-[14px] rounded-lg border border-app-gray/30 bg-app-bg text-app-text focus:outline-none focus:border-app-brand cursor-pointer appearance-none"
            >
              <option value="">Choose employee...</option>


              {activeEmployees.map((employee: any) => (
                <option
                  className="text-app-text"
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.fullName} • {employee.department || "No Department"}
                </option>
              ))}

              

            </select>
          </div>


          <div className="lg:flex lg:space-y-0 space-y-2 items-center pb-1 justify-between gap-3 mt-4">
            
            <button className="w-full py-2 bg-app-brand/10 border border-app-brand/30 text-app-text rounded-lg capitalize font-normal hover:bg-app-brand/20 cursor-pointer transition-colors">
              Active: {activeCount}
            </button>

            <button className="w-full py-2 bg-app-brand/10 border border-app-brand/30 text-app-text rounded-lg capitalize font-normal hover:bg-app-brand/20 cursor-pointer transition-colors">
              Inactive: {inactiveCount}
            </button>

          
            <button className="w-full py-2 bg-app-brand/10 border border-app-brand/30 text-app-text rounded-lg capitalize font-normal hover:bg-app-brand/20 cursor-pointer transition-colors">
              Resigned: {resignedCount}
            </button>

            <button className="w-full py-2 bg-app-brand/10 border border-app-brand/30 text-app-text rounded-lg capitalize font-normal hover:bg-app-brand/20 cursor-pointer transition-colors">
              Vacation: {vacationCount}
            </button>

          </div>


        </div>
      </div>

      {selectedEmployee && (
        <Add_Report
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}



    </>
  );
}
