import { useState } from "react";
import {
  FiPrinter,
  FiCheckCircle,
  FiEdit2,
  FiTrash2,
  FiUploadCloud,
  FiDownload,
} from "react-icons/fi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import {
  useDeleteReport,
  useUpdateReport,
} from "../../../context/useReport";
import { usePrint } from "../../../context/PrintContext";
import Report_Edit from "./Report_Edit";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL_LINK;

export default function Pending_Finance({
  reports = [],
}: {
  reports?: any[];
}) {
  const updateReport = useUpdateReport();
  const deleteReport = useDeleteReport();

  const { printDocument, isPrinting } =
    usePrint();

  const [selectedFiles, setSelectedFiles] =
    useState<Record<string, File>>({});

  const [selectedReport, setSelectedReport] =
    useState<any>(null);

  // ========================= FINALIZE REPORT =========================
  const handleFinalizeReport = (
    report: any,
  ) => {
    // Finance document must be uploaded
    if (!report?.image) {
      Swal.fire({
        title: "Finance Document Required",
        text: "Please upload the signed Finance document before finalizing.",
        icon: "warning",
        confirmButtonText: "OK",
      });

      return;
    }

    const activeAssetAssignments =
      Array.isArray(
        report?.employee
          ?.assetAssignments,
      )
        ? report.employee.assetAssignments
        : [];

    // All assets must be returned
    if (activeAssetAssignments.length > 0) {
      Swal.fire({
        title: "Active Assets Found",
        text: "Please unassign all assets before finalizing this clearance.",
        icon: "warning",
        confirmButtonText: "OK",
      });

      return;
    }

    Swal.fire({
      title: "Finalize Clearance?",
      html: `
        <div style="text-align:left; line-height:1.7;">
          <p>Finance document uploaded.</p>
          <p>All assets have been returned.</p>
          <p style="margin-top:8px; font-weight:600;">
            Finalize this clearance?
          </p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Finalize",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      updateReport.mutate(
        {
          id: String(report.id),

          updateData: {
            status: "FINALIZED",
            rejectionReason: null,
          },
        },
        {
          onSuccess: () => {
            Swal.fire({
              title: "Finalized!",
              text: "Clearance report finalized successfully.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          },

          onError: (error: any) => {
            Swal.fire({
              title: "Failed!",

              text:
                error?.response?.data
                  ?.message ||
                error?.response?.data
                  ?.error ||
                "Failed to finalize clearance report.",

              icon: "error",
            });
          },
        },
      );
    });
  };

  // ========================= DELETE REPORT =========================
  const handleDeleteReport = (
    reportId: string | number,
  ) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This pending finance report will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      deleteReport.mutate(
        String(reportId),
        {
          onSuccess: () => {
            Swal.fire({
              title: "Deleted!",
              text: "Pending finance report deleted successfully.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          },

          onError: (error: any) => {
            Swal.fire({
              title: "Failed!",

              text:
                error?.response?.data
                  ?.message ||
                error?.response?.data
                  ?.error ||
                "Failed to delete pending finance report.",

              icon: "error",
            });
          },
        },
      );
    });
  };

  // ========================= UPLOAD FINANCE DOCUMENT =========================
  const handleUploadFinanceDocument = (
    reportId: string | number,
    file?: File,
  ) => {
    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, PNG, WEBP or PDF files are allowed.",
      );

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "File size must be less than 5 MB.",
      );

      return;
    }

    const formData = new FormData();

    formData.append("image", file);

    updateReport.mutate(
      {
        id: String(reportId),
        updateData: formData,
      },
      {
        onSuccess: () => {
          setSelectedFiles(
            (previous) => {
              const updatedFiles = {
                ...previous,
              };

              delete updatedFiles[
                String(reportId)
              ];

              return updatedFiles;
            },
          );

          toast.success(
            "Finance document uploaded successfully.",
          );
        },

        onError: (error: any) => {
          console.error(
            "Finance Document Upload Error:",
            error,
          );

          const message =
            error?.response?.data
              ?.message ||
            error?.response?.data
              ?.error ||
            "Failed to upload finance document.";

          toast.error(message);
        },
      },
    );
  };

  // ========================= EMPTY STATE =========================
  if (!reports.length) {
    return (
      <div className="w-full rounded-xl border border-app-gray/20 bg-app-bg p-6 text-sm text-app-gray">
        No pending finance records
        found.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reports.map(
          (report: any) => {
            const assetsCount =
              Array.isArray(
                report?.assignedAssets,
              )
                ? report.assignedAssets
                    .length
                : 0;

            const totalAssetPrice =
              Number(
                report?.totalAssetPrice ||
                  0,
              );

            return (
              <div
                key={report.id}
                className="w-full rounded-xl border border-app-gray/20 bg-app-bg p-6 text-app-text shadow-xs transition-colors duration-300"
              >
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                  {/* Report information */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold">
                        {report.employee
                          ?.fullName ||
                          "Unknown Employee"}
                      </h2>

                      <span className="rounded border border-amber-500/20 bg-amber-100 px-2 py-0.5 text-[11px] font-bold uppercase text-amber-700">
                        {report.status ||
                          "PENDING_FINANCE"}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-app-gray opacity-90">
                      Iqama:{" "}
                      {report.employee
                        ?.iqamaNumber ||
                        "N/A"}
                      {" | "}
                      Dept:{" "}
                      {report.employee
                        ?.department ||
                        "No Department"}
                    </p>

                    {/* Rejection Reason */}
                    {report.rejectionReason && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-red-700 dark:text-red-300">
                          Rejection Reason
                        </p>

                        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-red-600 dark:text-red-200">
                          {
                            report.rejectionReason
                          }
                        </p>
                      </div>
                    )}

                    <div className="space-y-2 text-sm font-medium">
                      <div className="flex gap-1.5">
                        <span className="font-bold">
                          Report Type:
                        </span>

                        <span className="text-app-gray">
                          {report.reportType ||
                            "CLEARANCE"}
                        </span>
                      </div>

                      <div className="flex gap-1.5">
                        <span className="font-bold">
                          Position:
                        </span>

                        <span className="text-app-gray">
                          {report.employee
                            ?.position ||
                            "N/A"}
                        </span>
                      </div>

                      <div className="flex gap-1.5">
                        <span className="font-bold">
                          Condition:
                        </span>

                        <span className="text-app-gray">
                          {report.deviceCondition ||
                            "N/A"}
                        </span>
                      </div>

                      <div className="flex gap-1.5">
                        <span className="font-bold">
                          Assets:
                        </span>

                        <span className="text-app-gray">
                          {assetsCount}
                        </span>
                      </div>

                      <div className="flex gap-1.5">
                        <span className="font-bold">
                          Total Asset Value:
                        </span>

                        <span className="text-app-gray">
                          {totalAssetPrice.toFixed(
                            2,
                          )}{" "}
                          SAR
                        </span>
                      </div>
                    </div>

                    {/* Upload Finance Document */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <input
                        id={`finance-${report.id}`}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        className="hidden"
                        disabled={
                          updateReport.isPending
                        }
                        onChange={(
                          event,
                        ) => {
                          const file =
                            event.target
                              .files?.[0];

                          if (!file) {
                            return;
                          }

                          setSelectedFiles(
                            (previous) => ({
                              ...previous,

                              [String(
                                report.id,
                              )]: file,
                            }),
                          );

                          handleUploadFinanceDocument(
                            report.id,
                            file,
                          );

                          event.currentTarget.value =
                            "";
                        }}
                      />

                      <label
                        htmlFor={`finance-${report.id}`}
                        className={`flex items-center gap-2 rounded-lg border border-app-brand/40 bg-app-brand/2 px-4 py-2.5 text-xs font-bold text-app-brand transition hover:bg-app-brand/10 ${
                          updateReport.isPending
                            ? "pointer-events-none cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }`}
                      >
                        <FiUploadCloud
                          size={14}
                        />

                        {updateReport.isPending
                          ? "Uploading..."
                          : selectedFiles[
                                String(
                                  report.id,
                                )
                              ]?.name ||
                            (report.image
                              ? "Replace Finance Document"
                              : "Select Finance Document")}
                      </label>

                      {report.image && (
                        <a
                          href={`${API_BASE_URL}${report.image}`}
                          download={
                            report.imageName ||
                            report.image
                              .split("/")
                              .pop()
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Download Finance Document"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-app-brand/20 bg-app-brand/10 text-app-brand transition hover:bg-app-brand/20"
                        >
                          <FiDownload
                            size={16}
                          />
                        </a>
                      )}

                      <p className="text-[10px] italic text-app-gray opacity-60">
                        Generated:{" "}
                        {report.createdAt
                          ? new Date(
                              report.createdAt,
                            ).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex w-full flex-col gap-2.5 sm:w-auto lg:w-56">
                    <button
                      type="button"
                      onClick={() =>
                        printDocument(
                          "finance",
                          report,
                        )
                      }
                      disabled={
                        isPrinting
                      }
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-app-brand px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiPrinter
                        size={15}
                      />

                      {isPrinting
                        ? "Preparing..."
                        : "Print Finance Form"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleFinalizeReport(
                          report,
                        )
                      }
                      disabled={
                        updateReport.isPending
                      }
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiCheckCircle
                        size={15}
                      />

                      {updateReport.isPending
                        ? "Finalizing..."
                        : "Finalize Clearance"}
                    </button>

                    <div className="flex w-full gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedReport(
                            report,
                          )
                        }
                        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-app-gray/30 px-4 py-2 text-sm font-bold transition hover:bg-app-gray/5"
                      >
                        <FiEdit2
                          size={13}
                          className="text-amber-500"
                        />

                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteReport(
                            report.id,
                          )
                        }
                        disabled={
                          deleteReport.isPending
                        }
                        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FiTrash2
                          size={13}
                        />

                        {deleteReport.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>

      {selectedReport && (
        <Report_Edit
          report={selectedReport}
          onClose={() =>
            setSelectedReport(null)
          }
        />
      )}
    </>
  );
}