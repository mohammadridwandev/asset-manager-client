import { FiPackage, FiUserCheck } from "react-icons/fi";

import Swal from "sweetalert2";

import {
  useGetVacationRecords,
  useReturnEmployeeFromVacation,
} from "../../context/useDepartment";
import DataLoading from "../../DataLoading";

export default function Vacation_Records() {
  const { data: records = [], isLoading, isError } = useGetVacationRecords();

  const returnEmployee = useReturnEmployeeFromVacation();

  const handleReturnActive = async (record: any) => {
    const employee = record?.employee;

    if (!employee?.id) {
      return;
    }

    const confirm = await Swal.fire({
      title: "Return Employee to Active?",

      text: `${employee.fullName}'s vacation assets will be removed from the department and automatically reassigned to the employee.`,

      icon: "question",

      showCancelButton: true,

      confirmButtonText: "Yes, Return Active",

      cancelButtonText: "Cancel",

      confirmButtonColor: "#2563eb",
    });

    if (!confirm.isConfirmed) {
      return;
    }

    try {
      await returnEmployee.mutateAsync(Number(employee.id));

      await Swal.fire({
        title: "Completed!",

        text: "Employee is now Active and the vacation assets have been reassigned successfully.",

        icon: "success",

        timer: 1700,

        showConfirmButton: false,
      });
    } catch {
      // Error toast hook থেকে আসবে
    }
  };

  if (isLoading) {
    return (
      <DataLoading
        title="Loading Vacation Records"
        message="Please wait while we fetch the vacation records."
      />
    );
  }

  return (
    <div className="rounded-xl mt-16 border border-app-gray/10 bg-app-bg p-5">
      {/* =========================
          HEADER
      ========================= */}

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-app-brand/10 text-app-brand">
          <FiUserCheck size={20} />
        </div>

        <div>
          <h3 className="font-semibold text-app-text">Vacation Records</h3>

          <p className="text-sm text-app-gray">
            Employees currently on vacation and their transferred assets
          </p>
        </div>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-app-brand">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-app-brand/20 border-t-app-brand" />
          Loading vacation records...
        </div>
      ) : isError ? (
        /* =========================
            ERROR
        ========================= */

        <div className="py-8 text-center text-sm text-red-500">
          Failed to load vacation records.
        </div>
      ) : records.length === 0 ? (
        /* =========================
            EMPTY
        ========================= */

        <div className="py-8 text-center text-sm text-app-gray">
          No vacation records found.
        </div>
      ) : (
        /* =========================
            RECORDS
        ========================= */

        <div className="mt-5 space-y-3">
          {records.map((record: any) => {
            const employee = record.employee;

            const assets = record.assets || [];

            return (
              <div
                key={employee?.id}
                className="rounded-lg border border-app-gray/10 p-4"
              >
                {/* =========================
                      EMPLOYEE INFO
                  ========================= */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-app-text">
                      {employee?.fullName || "Unknown Employee"}
                    </p>

                    <p className="mt-1 text-xs text-app-gray">
                      Status: {employee?.status || "VACATION"}
                    </p>

                    {employee?.position && (
                      <p className="mt-1 text-xs text-app-gray">
                        Position: {employee.position}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-app-gray">
                      Total Assets: {assets.length}
                    </p>
                  </div>

                  {/* =========================
                        RETURN ACTIVE
                    ========================= */}

                  <button
                    type="button"
                    disabled={returnEmployee.isPending}
                    onClick={() => handleReturnActive(record)}
                    className="cursor-pointer rounded-md bg-app-brand px-4 py-2 text-xs font-semibold text-app-secondary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {returnEmployee.isPending
                      ? "Processing..."
                      : "Return to Active"}
                  </button>
                </div>

                {/* =========================
                      ASSETS
                  ========================= */}

                {assets.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-app-gray/10 pt-4">
                    {assets.map((asset: any) => (
                      <div
                        key={asset.assignmentId || asset.id}
                        className="flex flex-col gap-2 rounded-md border border-app-gray/10 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <FiPackage className="shrink-0 text-app-brand" />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-app-text">
                              {asset.assetName || "Unnamed Asset"}
                            </p>

                            <p className="truncate text-xs text-app-gray">
                              {asset.serialNumber || asset.assetType || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs text-app-gray">
                          Department:{" "}
                          <span className="font-medium text-app-text">
                            {asset.department?.name || "N/A"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
