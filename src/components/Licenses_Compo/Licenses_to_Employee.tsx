import { useState } from "react";
import { FiSearch, FiUserPlus, FiX } from "react-icons/fi";

import { useGetEmployee } from "../../context/useEmployee";

import { toast } from "react-hot-toast";
import { useCreateLicenseAssignment } from "../../context/useLicenseAssignment";

export default function Licenses_to_Employee({
  license,
  onClose,
}: {
  license: any;
  onClose: () => void;
}) {
  const { data: employees = [] } = useGetEmployee();


  const createLicenseAssignment = useCreateLicenseAssignment();

  const [searchText, setSearchText] = useState("");

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_LINK;

  const getImageUrl = (image?: string) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_BASE_URL}${image}`;
  };

  const activeEmployees = employees.filter(
    (employee: any) => employee.status === "ACTIVE",
  );

  const filteredEmployees =
    searchText.trim().length > 0
      ? activeEmployees.filter((employee: any) => {
          const search = searchText.toLowerCase();

          return (
            employee.fullName?.toLowerCase().includes(search) ||
            employee.iqamaNumber?.toLowerCase().includes(search) ||
            employee.email?.toLowerCase().includes(search) ||
            employee.phoneNumber?.toLowerCase().includes(search)
          );
        })
      : [];




 const handleAssignLicense = (employee: any) => {
  const alreadyAssigned = license.assignments?.some(
    (assignment: any) =>
      assignment.employeeId === employee.id && !assignment.returnedAt,
  );

  if (alreadyAssigned) {
    toast.error("License already assigned to this employee.");
    return;
  }

  createLicenseAssignment.mutate(
    {
      licenseId: license.id,
      employeeId: employee.id,
    },
    {
      onSuccess: () => {
        onClose();
      },

      onError: (error: any) => {
        console.error("Failed to assign license:", error);
        toast.error("Failed to assign license. Please try again.");
      },
    },
  );
};




  

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-xl border border-app-gray/20 bg-app-bg p-6 shadow-xl animate-scaleIn">
        <div className="flex items-center justify-between border-b border-app-gray/10 pb-3 mb-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <FiUserPlus className="text-app-brand" />
            Assign License
          </h3>

          <button
            onClick={onClose}
            className="text-app-gray hover:text-app-text cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="mb-4 text-sm">
          <p>
            License: <b>{license.softwareName}</b>
          </p>
          <p className="text-app-gray">Type: {license.licenseType || "N/A"}</p>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-app-gray opacity-50">
            <FiSearch size={17} />
          </div>

          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search active employee by name, email, iqama number, phone..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-app-gray/30 bg-transparent text-sm focus:outline-none focus:border-app-brand placeholder:text-app-gray/40"
          />
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee: any) => (
              <div
                key={employee.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-app-gray/10 p-3 hover:border-app-brand/20 hover:bg-app-brand/5 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-app-gray/20 bg-app-brand/5 flex items-center justify-center">
                    {employee.image ? (
                      <img
                        src={getImageUrl(employee.image)}
                        alt={employee.fullName || "Employee"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-app-brand">
                        {(employee.fullName || "E").charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-app-text truncate">
                      {employee.fullName}
                    </h4>

                    <p className="text-xs text-app-gray truncate">
                      {employee.position || "No Position"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={createLicenseAssignment.isPending}
                  onClick={() => handleAssignLicense(employee)}
                  className="shrink-0 px-4 py-1.5 rounded-lg bg-app-brand text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {createLicenseAssignment.isPending ? "Sending..." : "Send"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-app-gray py-6">
              {searchText.trim()
                ? "No active employee found"
                : "Search employee to assign license"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
