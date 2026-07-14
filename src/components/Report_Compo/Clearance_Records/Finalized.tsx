import { FiPrinter, FiCheck, FiTrash2, FiDownload } from "react-icons/fi";

import { usePrint } from "../../../context/PrintContext";
import { useUpdateEmployee } from "../../../context/useEmployee";
import { useUnassignAssetAssignment } from "../../../context/useAssetAssignment";
import { useUnassignLicenseAssignment } from "../../../context/useLicenseAssignment";
import Swal from "sweetalert2";
import { useDeleteReport } from "../../../context/useReport";

export default function Finalized({ reports = [] }: { reports?: any[] }) {
  const { printDocument, isPrinting } = usePrint();

  const updateEmployee = useUpdateEmployee();
  const unassignAsset = useUnassignAssetAssignment();
  const unassignLicense = useUnassignLicenseAssignment();
  const deleteReport = useDeleteReport();

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_LINK;

  if (!reports.length) {
    return (
      <div className="w-full rounded-xl border border-app-gray/20 bg-app-bg p-6 text-sm text-app-gray">
        No finalized clearance records found.
      </div>
    );
  }

  // ========================= UPDATED: add finalized print handler =========================
  const handlePrintFinalizedClearance = async (report: any) => {
    // UPDATED: print report before changing assignment data
    printDocument("finalized", report);

    try {
      const employeeId = report.employee?.id;

      if (!employeeId) {
        throw new Error("Employee ID not found.");
      }

      // UPDATED: get active assignment records
      const assetAssignments =
        report.employee?.assetAssignments || report.assetAssignments || [];

      const licenseAssignments =
        report.employee?.licenseAssignments || report.licenseAssignments || [];

      // UPDATED: employee status will become INACTIVE
      const updateData = new FormData();
      updateData.append("status", "INACTIVE");

      // UPDATED: employee inactive and all active assets/licenses unassigned
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
        title: "Finalized Clearance Processed!",
        text: "Employee is now inactive and all assets and licenses have been unassigned.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error("Finalized Clearance Error:", error);

      Swal.fire({
        title: "Update Failed!",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to process finalized clearance.",
        icon: "error",
      });
    }
  };

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

  return (
    <div className="space-y-4">
      {reports.map((report: any) => (
        <div
          key={report.id}
          className="w-full rounded-xl border border-app-gray/20 bg-app-bg p-6 text-app-text shadow-xs transition-colors duration-300"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            {/* Left Content */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold">
                  {report.employee?.fullName || "Unknown Employee"}
                </h2>

                <span className="flex items-center gap-1 rounded border border-blue-500/20 bg-blue-100 px-2 py-0.5 text-[11px] font-bold uppercase text-blue-600">
                  <FiCheck size={11} />

                  {report.status || "FINALIZED"}
                </span>
              </div>

              <p className="text-xs font-medium text-app-gray opacity-90">
                Iqama: <span>{report.employee?.iqamaNumber || "N/A"}</span>
                {" | "}
                Dept: {report.employee?.department || "No Department"}
              </p>

              <div className="space-y-1 text-sm font-medium">
                <div className="flex gap-1.5">
                  <span className="font-bold">Position:</span>

                  <span className="text-app-gray">
                    {report.employee?.position || "N/A"}
                  </span>
                </div>

                <div className="flex gap-1.5">
                  <span className="font-bold">Employee Status:</span>

                  <span className="text-app-gray">
                    {report.employee?.status || "N/A"}
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
                    {Array.isArray(report?.assignedAssets)
                      ? report.assignedAssets.length
                      : 0}
                  </span>
                </div>

                <div className="flex gap-1.5">
                  <span className="font-bold">Licenses:</span>

                  <span className="text-app-gray">
                    {Array.isArray(report?.assignedLicenses)
                      ? report.assignedLicenses.length
                      : 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                {/* ========================= UPDATED: finance document download icon ========================= */}

                <p className="text-xs font-medium text-emerald-700">
                  <strong>Finance Note:</strong> The finance clearance document
                  has been reviewed and approved. Please download and keep a
                  copy for your records.
                </p>

                {report.image && (
                  <a
                    href={`${API_BASE_URL}${report.image}`}
                    download={report.imageName || report.image.split("/").pop()}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download Finance Document"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-app-brand/20 bg-app-brand/10 text-app-brand transition hover:bg-app-brand/20"
                  >
                    <FiDownload size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex w-full flex-col items-center justify-start gap-2.5 self-stretch sm:w-auto lg:w-56">
              {/* UPDATED: Finalized print only */}

              {/* ========================= UPDATED: replace Print Finalized Clearance button ========================= */}
              <button
                type="button"
                onClick={() => handlePrintFinalizedClearance(report)}
                disabled={
                  isPrinting ||
                  updateEmployee.isPending ||
                  unassignAsset.isPending ||
                  unassignLicense.isPending
                }
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-app-brand px-4 py-2.5 text-sm font-bold text-white shadow-xs transition-all hover:opacity-90 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiPrinter size={15} />

                <span>
                  {isPrinting ||
                  updateEmployee.isPending ||
                  unassignAsset.isPending ||
                  unassignLicense.isPending
                    ? "Processing..."
                    : "Print Finalized"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteReport(report.id)}
                disabled={deleteReport.isPending}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiTrash2 size={14} />

                {deleteReport.isPending ? "Deleting..." : "Delete"}
              </button>

              <div className="mt-1 flex select-none items-center gap-1 text-[11px] font-bold tracking-wide text-emerald-500 opacity-95">
                <FiCheck size={13} />

                <span>All documents verified</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
