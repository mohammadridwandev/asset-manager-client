import { FiPrinter, FiEdit, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { useDeleteReport, useUpdateReport } from "../../../context/useReport";
import { useState } from "react";
import Report_Edit from "./Report_Edit";

// UPDATED: reports optional + default empty array
export default function Rejected({ reports = [] }: { reports?: any[] }) {
  // UPDATED: Empty state

  const deleteReport = useDeleteReport();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const updateReport = useUpdateReport();


  const handleFinanceApproval = (
    reportId: string | number,
  ) => {
    Swal.fire({
      title: "Send to Finance?",
      text: "This report will move to Pending Finance.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, send to finance",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1e293b",
    }).then((result) => {
      if (!result.isConfirmed) return;

      updateReport.mutate(
        {
          id: String(reportId),
          updateData: {
            status: "PENDING_FINANCE",
          },
        },
        {
          onSuccess: () => {
            Swal.fire({
              title: "Sent!",
              text: "Report moved to Pending Finance.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          },

          onError: (error: any) => {
            Swal.fire({
              title: "Failed!",
              text:
                error?.response?.data?.message ||
                "Failed to send report to finance.",
              icon: "error",
            });
          },
        },
      );
    });
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
      if (result.isConfirmed) {
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
      }
    });
  };


  if (!reports.length) {
    return (
      <div className="w-full bg-app-bg text-app-gray p-6 border border-app-gray/20 rounded-xl text-sm">
        No rejected clearance records found.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reports.map((report: any) => (
          <div
            key={report.id}
            className="w-full bg-app-bg text-app-text p-6 border border-app-gray/20 rounded-xl shadow-xs transition-colors duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* UPDATED: dynamic employee name */}
                  <h2 className="text-xl font-bold">
                    {report.employee?.fullName || "Unknown Employee"}
                  </h2>

                  {/* UPDATED: dynamic rejected status */}
                  <span className="bg-red-100 text-red-600 border border-red-500/20 px-2 py-0.5 rounded text-[11px] font-bold uppercase">
                    {report.status}
                  </span>
                </div>

                {/* UPDATED: dynamic employee info */}
                <p className="text-xs text-app-gray font-medium opacity-90">
                  Iqama: <span>{report.employee?.iqamaNumber || "N/A"}</span>
                  {" | "}Dept: {report.employee?.department || "No Department"}
                </p>

                <div className="space-y-1 text-sm font-medium">
                  {/* UPDATED: dynamic report type */}
                  <div className="flex gap-1.5">
                    <span className="font-bold">Report Type:</span>
                    <span className="text-app-gray">
                      {report.reportType || "N/A"}
                    </span>
                  </div>

                  {/* UPDATED: dynamic condition */}
                  <div className="flex gap-1.5">
                    <span className="font-bold">Condition:</span>
                    <span className="text-app-gray">
                      {report.deviceCondition || "N/A"}
                    </span>
                  </div>

                  {/* UPDATED: dynamic assets count */}
                  <div className="flex gap-1.5">
                    <span className="font-bold">Assets:</span>
                    <span className="text-app-gray">
                      {report.assignedAssets?.length || 0}
                    </span>
                  </div>

                  {/* UPDATED: dynamic licenses count */}
                  <div className="flex gap-1.5">
                    <span className="font-bold">Licenses:</span>
                    <span className="text-app-gray">
                      {report.assignedLicenses?.length || 0}
                    </span>
                  </div>
                </div>

                {/* UPDATED: dynamic generated time */}
                <p className="text-[10px] text-app-gray italic opacity-60">
                  Generated: {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto lg:w-48 self-stretch justify-between lg:justify-start">
                
                <button
                  type="button"
                  onClick={() => handleFinanceApproval(report.id)}
                  className="flex-1  lg:flex-none w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-[#1e293b] dark:bg-[#0f172a] text-white border border-slate-700 hover:opacity-90 transition-all active:scale-98 cursor-pointer"
                >
                  <FiPrinter size={15} />
                  <span>Finance Approval</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReport(report)}
                  className="flex-1  lg:flex-none w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-app-brand text-white hover:opacity-90 transition-all active:scale-98 cursor-pointer"
                >
                  <FiEdit size={14} />
                  <span>Edit Reject</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteReport(report.id)} // UPDATED: dynamic delete button
                  disabled={deleteReport.isPending} // UPDATED
                  className="flex items-center cursor-pointer justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-red-500 text-white disabled:opacity-50"
                >
                  <FiTrash2 size={14} />
                  Delete
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
