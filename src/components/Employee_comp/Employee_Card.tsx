import { BiSolidUserCircle } from "react-icons/bi";
import { useGetEmployee } from "../../context/useEmployee";
import {
  FaEnvelope,
  FaPhone,
  FaEye,
  FaBuilding,
  FaIdCard,
} from "react-icons/fa6";
import { useState } from "react";

import { Button } from "@heroui/react/button";
import View_Employee from "./View_Employee";

// UPDATED: employees props optional করা হয়েছে
export default function Employee_Card({
  employees: filteredEmployees,
}: {
  employees?: any[];
}) {
  
  const {
    data: allEmployees = [],
    isLoading,
    isError,
  } = useGetEmployee();

  // UPDATED: filtered data থাকলে সেটা দেখাবে, না হলে সব employee দেখাবে
  const employees = filteredEmployees ?? allEmployees;

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const [isUpdateOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_LINK;

  const getImageUrl = (image?: string) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_BASE_URL}${image}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-75 text-lg font-medium text-app-brand">
        Loading Employees...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-75 text-lg font-medium text-red-500">
        Failed to load employee data!
      </div>
    );
  }
  

  return (
    <>


      <div>
        {/* UPDATED: filtered হলে filtered count, না হলে total count */}
        <h1 className="font-bold">Total Employee: {employees.length}</h1>
      </div>

      <div className="min-h-screen bg-app-bg text-app-text py-4 md:py-6 transition-colors duration-300">
        {/* UPDATED: no result message */}
        {employees.length === 0 ? (
          <div className="flex items-center justify-center min-h-75 text-lg font-medium text-app-gray">
            No employee found!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
            {employees.map((employee: any) => (
              <div
                key={employee.id}
                className="rounded-2xl border border-app-gray/10 bg-app-bg p-5 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-content-between items-center gap-3 border-b border-app-gray/10 pb-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-app-brand/20 bg-app-brand/5 flex items-center justify-center">
                    {employee.image ? (
                      <img
                        src={getImageUrl(employee.image)}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        alt={employee.fullName || "Employee"}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <BiSolidUserCircle className="text-app-gray/40 text-5xl" />
                    )}
                  </div>

                  <div className="flex items-center justify-between w-full">
                    <div className="">
                      <h3
                        className="text-base md:text-lg font-semibold text-app-text truncate"
                        title={employee.fullName}
                      >
                        {employee.fullName || "Not Available"}
                      </h3>

                      <p className="mt-1 inline-flex rounded-full border border-app-brand/20 bg-app-brand/5 px-2.5 py-1 text-[10px] font-medium text-app-brand">
                        {employee.position || "Not Available"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-normal capitalize ${
                        employee.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-600 border border-green-500/20"
                          : employee.status === "ON_LEAVE"
                            ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
                            : employee.status === "VACATION"
                              ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                              : employee.status === "RESIGNED"
                                ? "bg-red-500/10 text-red-600 border border-red-500/20"
                                : "bg-red-500/10 text-red-600 border border-gray-500/20"
                      }`}
                    >
                      {employee.status?.replace("_", " ") || "ACTIVE"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <InfoRow
                    icon={<FaIdCard />}
                    label="Position"
                    value={employee.position || "Not Available"}
                  />

                  <InfoRow
                    icon={<FaIdCard />}
                    label="Iqama / Passport"
                    value={employee.iqamaNumber || "Not Available"}
                  />

                  <InfoRow
                    icon={<FaEnvelope />}
                    label="Email"
                    value={employee.email || "Not Available"}
                  />

                  <InfoRow
                    icon={<FaBuilding />}
                    label="Department"
                    value={employee.department || "Not Available"}
                  />

                  <InfoRow
                    icon={<FaPhone />}
                    label="Phone"
                    value={employee.phoneNumber || "Not Available"}
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <StatBox
                    label="Assets"
                    value={employee.assetAssignments?.length || 0}
                  />

                  <StatBox
                    label="Licenses"
                    value={employee.licenseAssignments?.length || 0}
                  />

                  <StatBox
                    label="Reports"
                    value={employee.reports?.length || 0}
                  />
                </div>

                <Button
                  onClick={() => setSelectedEmployee(employee)}
                  className="mt-5 cursor-pointer w-full rounded-lg border border-app-brand/20 bg-app-brand/5 px-4 py-2.5 text-sm font-medium text-app-brand hover:bg-app-brand/10 transition-all flex items-center justify-center gap-2"
                >
                  <FaEye />
                  View Profile
                </Button>
                
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedEmployee && !isUpdateOpen && (
        <View_Employee
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </>
  );
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-app-gray/7 px-3 py-2.5">
      <span className="flex items-center gap-2 text-app-gray shrink-0">
        {icon}
        {label}
      </span>

      <span className="font-medium text-app-text text-right truncate">
        {value}
      </span>
    </div>
  );
};

const StatBox = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="rounded-lg border border-app-gray/7 p-3 text-center">
      <p className="text-base font-semibold text-app-text">{value}</p>
      <p className="text-xs text-app-gray">{label}</p>
    </div>
  );
};