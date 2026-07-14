import { FiUploadCloud } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useGetSingleInvoice,
  useUpdateInvoice,
} from "../../context/useInvoice";

export default function Invoice_Update() {
  const navigate = useNavigate();

  const { id } = useParams();
  const { data: invoice, isLoading } = useGetSingleInvoice(id);
  const updateInvoice = useUpdateInvoice();

  const handlerUploadUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const form = e.currentTarget;

    const confirm = await Swal.fire({
      title: "Update Invoice?",
      text: "Are you sure you want to save these changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const formData = new FormData(form);

    const imageFile = formData.get("invoiceImage") as File;

    if (!imageFile || imageFile.size === 0) {
      formData.delete("invoiceImage");
    }

    updateInvoice.mutate(
      {
        id: String(id),
        updateData: formData,
      },
      {
        onSuccess: async () => {
          await Swal.fire({
            title: "Updated!",
            text: "Invoice updated successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          navigate("/dashboard/invoices");
        },
      },
    );
  };

  if (isLoading) {
    return <p className="p-6">Loading invoice...</p>;
  }

  if (!invoice) {
    return <p className="p-6 text-red-500">Invoice not found!</p>;
  }

  return (
    <div>
      <div className="py-6">
        <div className="p-5 bg-app-bg text-app-text border border-app-gray/20 rounded-xl">
          <h2 className="text-lg font-bold mb-4">Update Invoice</h2>
          <hr className="border-app-gray/10 mb-5" />

          <form onSubmit={handlerUploadUpdate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[15px] font-medium">
                Invoice Number <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                required
                name="invoiceNumber"
                defaultValue={invoice.invoiceNumber || ""}
                placeholder="e.g., INV-001, INV-2026-001"
                className="w-full my-2 px-3 py-2 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand text-sm"
              />
            </div>

            <div className="space-y-1">
              <div className="my-2">
                <label className="text-[15px] font-medium">
                  Invoice File
                  <span className="text-app-gray text-xs ml-1">
                    (optional)
                  </span>
                </label>
              </div>

              <label className="cursor-pointer bg-app-brand/10 border-2 border-dashed border-app-brand/30 hover:border-app-brand rounded-lg p-5 flex flex-col items-center justify-center hover:bg-app-brand/3 transition-all">
                <input
                  name="invoiceImage"
                  type="file"
                  className="hidden"
                />

                <FiUploadCloud
                  size={32}
                  className="text-app-brand mb-1 my-2"
                />

                <span className="text-[15px] font-medium opacity-80">
                  Click to upload new invoice file
                </span>

                <span className="text-[10px] text-app-gray mt-0.5">
                  Leave empty to keep old file
                </span>
              </label>
            </div>

            <div className="flex gap-3 pt-2 text-sm font-semibold">
              <button
                type="submit"
                disabled={updateInvoice.isPending}
                className="px-6 py-2 rounded-lg bg-app-brand text-white hover:opacity-90 disabled:opacity-50"
              >
                {updateInvoice.isPending
                  ? "Updating..."
                  : "Update Invoice"}
              </button>

              <button
                onClick={() => navigate("/dashboard/invoices")}
                type="button"
                className="px-6 py-2 rounded-lg border border-app-gray/30 hover:bg-app-gray/5"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}