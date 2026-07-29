import {
  FaEdit,
  FaFileInvoice,
  FaFilePdf,
  FaImage,
  FaTrash,
} from "react-icons/fa";
import { LuPrinter } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

import { useDeleteInvoice } from "../../context/useInvoice";
import { useRole } from "../../context/useAdmin";

type InvoiceCardProps = {
  invoices: any[];
  totalInvoices?: number;
  isLoading: boolean;
  isError: boolean;
};

type SelectedFile = {
  url: string;
  isPdf: boolean;
} | null;

export default function InvoiceCard({
  invoices,
  totalInvoices,
  isLoading,
  isError,
}: InvoiceCardProps) {
  const [selectedFile, setSelectedFile] =
    useState<SelectedFile>(null);

  const navigate = useNavigate();
  const deleteInvoice = useDeleteInvoice();

  const { isAdmin } = useRole();

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL_LINK || "";

  const getFileUrl = (filePath?: string) => {
    if (!filePath) return "";

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    return `${API_BASE_URL.replace(/\/$/, "")}/${filePath.replace(
      /^\//,
      "",
    )}`;
  };

  const isPdfFile = (filePath?: string) => {
    if (!filePath) return false;

    const cleanFilePath = filePath
      .split("?")[0]
      .split("#")[0]
      .toLowerCase();

    return cleanFilePath.endsWith(".pdf");
  };

  const handleViewFile = (
    fileUrl: string,
    filePath: string,
  ) => {
    if (!fileUrl) return;

    setSelectedFile({
      url: fileUrl,
      isPdf: isPdfFile(filePath),
    });
  };

  const handlePrintInvoice = (
    fileUrl: string,
  ) => {
    if (!fileUrl) return;

    const printWindow = window.open(
      fileUrl,
      "_blank",
    );

    if (!printWindow) {
      Swal.fire({
        icon: "warning",
        title: "Popup Blocked",
        text: "Please allow popups to print the invoice.",
      });

      return;
    }

    printWindow.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
  };

  const handleDeleteInvoice = async (
    id: string,
  ) => {
    const result = await Swal.fire({
      title: "Delete Invoice?",
      text: "You won't be able to recover this invoice.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    deleteInvoice.mutate(id, {
      onSuccess: async () => {
        await Swal.fire({
          title: "Deleted!",
          text: "Invoice deleted successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      },

      onError: async () => {
        await Swal.fire({
          title: "Delete Failed",
          text: "Failed to delete the invoice.",
          icon: "error",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <p className="py-10 text-center text-app-brand">
        Loading invoices...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="py-10 text-center text-red-500">
        Failed to load invoices
      </p>
    );
  }

  if (
    !Array.isArray(invoices) ||
    invoices.length === 0
  ) {
    return (
      <p className="py-10 text-center text-app-gray">
        No invoices found!
      </p>
    );
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="font-bold text-app-text">
          Total Invoices:{" "}
          {totalInvoices ?? invoices.length}
        </h1>
      </div>

      <div className="space-y-3">
        {invoices.map((invoice: any) => {
          const filePath =
            invoice.invoiceImage || "";

          const invoiceFile =
            getFileUrl(filePath);

          const isPdf =
            isPdfFile(filePath);

          return (
            <div
              key={invoice.id}
              className="flex flex-col gap-4 rounded-lg border border-app-gray/15 bg-app-bg p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-app-brand/10 text-app-brand">
                  {isPdf ? (
                    <FaFilePdf size={18} />
                  ) : (
                    <FaFileInvoice size={18} />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-app-text">
                    {invoice.invoiceNumber ||
                      "No Invoice Number"}
                  </h3>

                  <p className="text-xs text-app-gray">
                    {isPdf
                      ? "PDF Invoice Document"
                      : "Invoice Image"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                
                <button
                  type="button"
                  disabled={!invoiceFile}
                  onClick={() =>
                    handleViewFile(
                      invoiceFile,
                      filePath,
                    )
                  }
                  className="flex h-9 items-center justify-center gap-2 rounded-md border border-app-gray/15 px-3 text-sm text-app-brand transition hover:border-app-brand/30 hover:bg-app-brand/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isPdf ? (
                    <FaFilePdf size={13} />
                  ) : (
                    <FaImage size={13} />
                  )}

                  View
                </button>

                {isAdmin && (
                  <>
                  
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/dashboard/invoices/update/${invoice.id}`,
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-app-gray/15 text-app-brand transition hover:border-app-brand/30 hover:bg-app-brand/5"
                      title="Edit invoice"
                    >
                      <FaEdit size={14} />
                    </button>

                    <button
                      type="button"
                      disabled={!invoiceFile}
                      onClick={() =>
                        handlePrintInvoice(
                          invoiceFile,
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-app-gray/15 text-app-brand transition hover:border-app-brand/30 hover:bg-app-brand/5 disabled:cursor-not-allowed disabled:opacity-40"
                      title="Print invoice"
                    >
                      <LuPrinter size={15} />
                    </button>

                    <button
                      type="button"
                      disabled={
                        deleteInvoice.isPending
                      }
                      onClick={() =>
                        handleDeleteInvoice(
                          String(invoice.id),
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-red-500/20 text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                      title="Delete invoice"
                    >
                      <FaTrash size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedFile(null)
          }
        >
          <div
            className={
              selectedFile.isPdf
                ? "relative h-[90vh] w-full max-w-5xl overflow-hidden rounded-xl"
                : "relative flex max-h-[90vh] max-w-[95vw] items-center justify-center"
            }
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={() =>
                setSelectedFile(null)
              }
              className="absolute -top-10 -right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 font-bold text-white shadow-md transition hover:bg-red-600"
              title="Close preview"
            >
              ×
            </button>

            {selectedFile.isPdf ? (
              <iframe
                src={selectedFile.url}
                title="Invoice PDF Preview"
                className="h-full w-full rounded-xl border-0 bg-white"
              />
            ) : (
              <img
                src={selectedFile.url}
                alt="Invoice Preview"
                className="max-h-[90vh] max-w-[95vw] object-contain drop-shadow-2xl"
              />
            )}
          </div>
        </div>
      )}

      
    </>
  );
}