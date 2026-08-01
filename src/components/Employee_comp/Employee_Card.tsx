import { BiSolidUserCircle } from "react-icons/bi";

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

import Asset_Doc from "./Asset_Doc";

export default function Employee_Card({
  employees: filteredEmployees,
  totalEmployees,
}: {
  employees?: any[];
  totalEmployees?: number;
}) {
  const employees = filteredEmployees || [];

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const [isUpdateOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_LINK || "";

  const getImageUrl = (image?: string) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_BASE_URL.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;
  };






  return (
    <>
      <div>
        <h1 className="font-bold">
          Total Employee: {totalEmployees ?? employees.length}
        </h1>
      </div>

      <div className="bg-app-bg py-4 text-app-text transition-colors duration-300 md:py-6">
        {employees.length === 0 ? (

          <div className="flex min-h-75 items-center justify-center text-lg font-medium text-app-gray">
            No employee found!
          </div>

          
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {employees.map((employee: any) => (
              <div
                key={employee.id}
                className="rounded-2xl border border-app-gray/10 bg-app-bg p-5 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start gap-3 border-b border-app-gray/10 pb-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-app-brand/20 bg-app-brand/5">
                    {employee.image ? (
                      <img
                        src={getImageUrl(employee.image)}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                        alt={employee.fullName || "Employee"}
                        className="h-full w-full rounded-full object-cover object-center"
                      />
                    ) : (
                      <BiSolidUserCircle className="text-5xl text-app-gray/40" />
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 ">
                      <h3
                        className="block max-w-full truncate text-base font-semibold text-app-text md:text-lg"
                        title={employee.fullName || "Not Available"}
                      >
                        {employee.fullName || "Not Available"}
                      </h3>

                      <div className="mt-1 flex items-center gap-2">
                        <p
                          className=" inline-block max-w-full truncate rounded-full border border-app-brand/20 bg-app-brand/5 px-2.5 py-1 text-[10px] font-medium text-app-brand"
                          title={employee.position || "Not Available"}
                        >
                          {employee.position || "Not Available"}
                        </p>

                        {/* Asset Document */}
                        <Asset_Doc
                          employeeId={employee.id}
                          initialDocuments={employee.assetDocuments || []}
                        />
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-normal capitalize ${
                        employee.status === "ACTIVE"
                          ? "border border-green-500/20 bg-green-500/10 text-green-600"
                          : employee.status === "ON_LEAVE"
                            ? "border border-yellow-500/20 bg-yellow-500/10 text-yellow-600"
                            : employee.status === "VACATION"
                              ? "border border-blue-500/20 bg-blue-500/10 text-blue-600"
                              : employee.status === "RESIGNED"
                                ? "border border-red-500/20 bg-red-500/10 text-red-600"
                                : "border border-gray-500/20 bg-red-500/10 text-red-600"
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
                  className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-app-brand/20 bg-app-brand/5 px-4 py-2.5 text-sm font-medium text-app-brand transition-all hover:bg-app-brand/10"
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
      <span className="flex shrink-0 items-center gap-2 text-app-gray">
        {icon}
        {label}
      </span>

      <span
        className="min-w-0 truncate text-right font-medium text-app-text"
        title={value}
      >
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
