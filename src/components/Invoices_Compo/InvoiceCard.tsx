import { FaFileInvoice, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDeleteInvoice } from "../../context/useInvoice";
import { useState } from "react";
import { LuPrinter } from "react-icons/lu";
import { useRole } from "../../context/useAdmin";

// UPDATED: props type
type InvoiceCardProps = {
  invoices: any[];
  isLoading: boolean;
  isError: boolean;
};

export default function InvoiceCard({
  invoices,
  isLoading,
  isError,
}: InvoiceCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const navigate = useNavigate();
  const deleteInvoice = useDeleteInvoice();

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_LINK;

  const { isAdmin } = useRole();

  if (isLoading) {
    return <p className="text-center py-10 text-app-brand">Loading...</p>;
  }

  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">Failed to load invoices</p>
    );
  }

  // UPDATED: no result UI
  if (invoices.length === 0) {
    return (
      <p className="text-center py-10 text-app-gray">No invoices found!</p>
    );
  }

  const handleDeleteInvoice = async (id: string) => {
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
    });
  };

  return (
    <>
      <div className="pb-4">
        {/* UPDATED: filtered হলে filtered count, না হলে total count */}
        <h1 className="font-bold">Total Invoices: {invoices.length}</h1>
      </div>

      <div className="gap-4">
        {invoices.map((invoice: any) => (
          <div
            key={invoice.id}
            className="border border-app-gray/10 rounded-xl p-4 bg-app-bg hover:border-app-brand/20 transition-all"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-12 w-12 rounded-lg bg-app-brand/10 flex items-center justify-center">
                  <FaFileInvoice className="text-app-brand" />
                </div>

                <div>
                  <h3 className="font-semibold text-app-text truncate">
                    {invoice.invoiceNumber}
                  </h3>

                  <p className="text-xs text-app-gray">Invoice Document</p>
                </div>
              </div>

              <div className="h-14 w-14 overflow-hidden rounded-lg border border-app-gray/10 bg-app-brand/5 flex items-center justify-center shrink-0">
                {invoice.invoiceImage ? (
                  <img
                    src={`${API_BASE_URL}${invoice.invoiceImage}`}
                    alt={invoice.invoiceNumber}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaImage className="text-app-brand text-sm" />
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                disabled={!invoice.invoiceImage}
                onClick={() =>
                  setSelectedImage(`${API_BASE_URL}${invoice.invoiceImage}`)
                }
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-app-gray/10 hover:border-app-brand/20 text-app-brand disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaImage size={12} />
                View
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() =>
                      navigate(`/dashboard/invoices/update/${invoice.id}`)
                    }
                    className="h-10 w-10 flex items-center cursor-pointer justify-center rounded-lg border border-app-gray/10 hover:border-app-brand/20 text-app-brand"
                  >
                    <FaEdit />
                  </button>

                  <button className="h-10 w-10 flex items-center justify-center rounded-lg border hover:bg-app-brand/10 cursor-pointer transition-all border-app-gray/10 hover:border-app-brand/20 text-app-brand disabled:opacity-50">
                    <LuPrinter />
                  </button>

                  <button
                    disabled={deleteInvoice.isPending}
                    onClick={() => handleDeleteInvoice(String(invoice.id))}
                    className="h-10 w-10 flex items-center justify-center cursor-pointer rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 disabled:opacity-50"
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center bg-black/70 p-4 animate-fadeIns"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full font-bold"
            >
              ×
            </button>

            <img
              src={selectedImage}
              alt="Invoice Preview"
              className="max-h-[85vh] max-w-full rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
