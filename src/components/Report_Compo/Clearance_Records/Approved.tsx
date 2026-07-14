import { useState } from "react";

import { FiPrinter, FiEdit, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";

import { useDeleteReport } from "../../../context/useReport";

import { usePrint } from "../../../context/PrintContext"; // UPDATED
import Report_Edit from "./Report_Edit";
import { useUpdateEmployee } from "../../../context/useEmployee";
import { useUnassignAssetAssignment } from "../../../context/useAssetAssignment";
import { useUnassignLicenseAssignment } from "../../../context/useLicenseAssignment";

export default function Approved({ reports = [] }: { reports?: any[] }) {
  const deleteReport = useDeleteReport();

  // UPDATED: shared print context
  const { printDocument, isPrinting } = usePrint();

  const [selectedReport, setSelectedReport] = useState<any>(null);

  const updateEmployee = useUpdateEmployee();
  const unassignAsset = useUnassignAssetAssignment();
  const unassignLicense = useUnassignLicenseAssignment();

  const handleDeleteReport = (reportId: string | number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This approved clearance report will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (!result.isConfirmed) return;

      deleteReport.mutate(String(reportId), {
        onSuccess: () => {
          Swal.fire({
            title: "Deleted!",
            text: "Approved clearance report has been deleted successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        },

        onError: () => {
          Swal.fire({
            title: "Failed!",
            text: "Failed to delete approved clearance report.",
            icon: "error",
          });
        },
      });
    });
  };





  
  if (!reports.length) {
    return (
      <div className="w-full rounded-xl border border-app-gray/20 bg-app-bg p-6 text-sm text-app-gray">
        No approved clearance records found.
      </div>
    );
  }

  // UPDATED: add print clearance handler
  const handlePrintClearance = async (report: any) => {
    // UPDATED: print current report before changing employee data
    printDocument("approved", report);

    try {
      const employeeId = report.employee?.id;

      if (!employeeId) {
        throw new Error("Employee ID not found.");
      }

      // UPDATED: employee status INACTIVE
      const updateData = new FormData();
      updateData.append("status", "INACTIVE");

      const assetAssignments =
        report.employee?.assetAssignments || report.assetAssignments || [];

      const licenseAssignments =
        report.employee?.licenseAssignments || report.licenseAssignments || [];

      // UPDATED: employee inactive + all assets/licenses unassign
      await Promise.all([
        updateEmployee.mutateAsync({
          id: String(employeeId),
          updateData,
        }),

        ...assetAssignments.map((assignment: any) =>
          unassignAsset.mutateAsync(String(assignment.id)),
        ),

        ...licenseAssignments.map((assignment: any) =>
          unassignLicense.mutateAsync(String(assignment.id)),
        ),
      ]);

      Swal.fire({
        title: "Clearance Processed!",
        text: "Employee is now inactive and all assets and licenses have been unassigned.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error("Print Clearance Update Error:", error);

      Swal.fire({
        title: "Update Failed!",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to update employee clearance data.",
        icon: "error",
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        {reports.map((report: any) => (
          <div
            key={report.id}
            className="w-full rounded-xl border border-app-gray/20 bg-app-bg p-6 text-app-text shadow-xs transition-colors duration-300"
          >
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold">
                    {report.employee?.fullName || "Unknown Employee"}
                  </h2>

                  <span className="rounded border border-green-500/20 bg-green-100 px-2 py-0.5 text-[11px] font-bold uppercase text-green-600">
                    {report.status}
                  </span>


                  <span
                    className={`rounded border px-2 py-0.5 text-[11px] font-bold uppercase ${
                      report.employee?.status === "INACTIVE"
                        ? "border-red-500/20 bg-red-100 text-red-600"
                        : "border-green-500/20 bg-green-100 text-green-600"
                    }`}
                  >
                    {report.employee?.status || "ACTIVE"}
                  </span>


                </div>

                <p className="text-xs font-medium text-app-gray opacity-90">
                  Iqama: <span>{report.employee?.iqamaNumber || "N/A"}</span>
                  {" | "}
                  Dept: {report.employee?.department || "No Department"}
                </p>

                <div className="space-y-1 text-sm font-medium">
                  <div className="flex gap-1.5">
                    <span className="font-bold">Report Type:</span>

                    <span className="text-app-gray">
                      {report.reportType || "N/A"}
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    <span className="font-bold">Condition:</span>

                    <span className="text-app-gray">
                      {report.deviceCondition || "N/A"}
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    <span className="font-bold">Assets:</span>

                    <span className="text-app-gray">
                      {report.assignedAssets?.length || 0}
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    <span className="font-bold">Licenses:</span>

                    <span className="text-app-gray">
                      {report.assignedLicenses?.length || 0}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] italic text-app-gray opacity-60">
                  Generated:{" "}
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row lg:w-48 lg:flex-col">
                {/* UPDATED: PrintContext ব্যবহার করা হয়েছে */}

                {/* UPDATED: replace Print Clearance button */}
                <button
                  type="button"
                  onClick={() => handlePrintClearance(report)}
                  disabled={
                    isPrinting ||
                    updateEmployee.isPending ||
                    unassignAsset.isPending ||
                    unassignLicense.isPending
                  }
                  className="flex items-center justify-center gap-2 rounded-lg bg-app-brand px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiPrinter size={15} />

                  {isPrinting ||
                  updateEmployee.isPending ||
                  unassignAsset.isPending ||
                  unassignLicense.isPending
                    ? "Processing..."
                    : "Print Clearance"}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReport(report)}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-app-brand px-4 py-2.5 text-sm font-bold text-white"
                >
                  <FiEdit size={14} />
                  Edit Approve
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteReport(report.id)}
                  disabled={deleteReport.isPending}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiTrash2 size={14} />

                  {deleteReport.isPending ? "Deleting..." : "Delete"}
                </button>


              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <Report_Edit
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </>
  );
}
