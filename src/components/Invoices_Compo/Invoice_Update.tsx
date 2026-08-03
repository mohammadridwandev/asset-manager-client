import { useEffect, useRef, useState } from "react";
import { FiFileText, FiImage, FiUploadCloud, FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  useGetSingleInvoice,
  useUpdateInvoice,
} from "../../context/useInvoice";
import DataLoading from "../../DataLoading";

export default function Invoice_Update() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: invoice, isLoading } = useGetSingleInvoice(id);

  const updateInvoice = useUpdateInvoice();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        title: "Invalid File",
        text: "Only JPG, PNG, WEBP and PDF files are allowed.",
        icon: "error",
      });

      event.target.value = "";
      return;
    }

    const maximumFileSize = 10 * 1024 * 1024;

    if (file.size > maximumFileSize) {
      Swal.fire({
        title: "File Too Large",
        text: "File size must be less than 10 MB.",
        icon: "error",
      });

      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlerUploadUpdate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!id) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const invoiceNumber = String(formData.get("invoiceNumber") || "").trim();

    if (!invoiceNumber) {
      await Swal.fire({
        title: "Invoice Number Required",
        text: "Please enter an invoice number.",
        icon: "warning",
      });

      return;
    }

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

    if (!confirm.isConfirmed) {
      return;
    }

    formData.set("invoiceNumber", invoiceNumber);

    if (selectedFile) {
      formData.set("invoiceImage", selectedFile);
    } else {
      // New file না দিলে existing file থাকবে
      formData.delete("invoiceImage");
    }

    updateInvoice.mutate(
      {
        id: String(id),
        updateData: formData,
      },
      {
        onSuccess: async () => {
          removeSelectedFile();

          await Swal.fire({
            title: "Updated!",
            text: "Invoice updated successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          navigate("/dashboard/invoices");
        },

        onError: () => {
          /*
           * Duplicate invoice number বা অন্য professional error
           * useUpdateInvoice hook থেকে দেখাবে।
           *
           * Error হলে form data এবং selected file থাকবে।
           */
        },
      },
    );
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const isImage = selectedFile?.type.startsWith("image/");

  const isPdf = selectedFile?.type === "application/pdf";


  
   if (isLoading) {
      return (
        <DataLoading
          title="Update invoice"
          message="Loading invoice data..."
        ></DataLoading>
      );
    }




  if (!invoice) {
    return <p className="p-6 text-red-500">Invoice not found!</p>;
  }

  return (
    <div className="py-6">
      <div className="rounded-xl border border-app-gray/20 bg-app-bg p-5 text-app-text">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Update Invoice</h2>

          <button
            type="button"
            onClick={() => navigate("/dashboard/invoices")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-app-gray/20 transition hover:bg-app-gray/10"
          >
            <FiX size={18} />
          </button>
        </div>

        <hr className="mb-5 border-app-gray/10" />

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
              className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-3 py-2 text-sm focus:border-app-brand focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="my-2">
              <label className="text-[15px] font-medium">
                Replace Invoice File
                <span className="ml-1 text-xs text-app-gray">(optional)</span>
              </label>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-app-brand/30 bg-app-brand/10 p-5 transition-all hover:border-app-brand hover:bg-app-brand/5">
              <input
                ref={fileInputRef}
                name="invoiceImage"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <FiUploadCloud size={32} className="my-2 mb-1 text-app-brand" />

              <span className="text-[15px] font-medium opacity-80">
                Click to upload new invoice file
              </span>

              <span className="mt-0.5 text-[10px] text-app-gray">
                JPG, PNG, WEBP or PDF (max 10 MB)
              </span>

              <span className="mt-1 text-[10px] text-app-gray">
                Leave empty to keep the existing file
              </span>
            </label>
          </div>

          {selectedFile && previewUrl && (
            <div className="rounded-lg border border-app-gray/20 bg-app-gray/5 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-app-gray/20 bg-app-bg">
                  {isImage && (
                    <img
                      src={previewUrl}
                      alt="Invoice preview"
                      className="h-full w-full object-cover"
                    />
                  )}

                  {isPdf && <FiFileText size={32} className="text-red-500" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {isImage ? (
                      <FiImage className="shrink-0 text-app-brand" />
                    ) : (
                      <FiFileText className="shrink-0 text-red-500" />
                    )}

                    <p className="truncate text-sm font-semibold">
                      {selectedFile.name}
                    </p>
                  </div>

                  <p className="mt-1 text-xs text-app-gray">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  {isPdf && (
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs font-medium text-app-brand hover:underline"
                    >
                      Open PDF
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={removeSelectedFile}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-500/20 text-red-500 transition hover:bg-red-500/10"
                >
                  <FiX size={17} />
                </button>
              </div>
            </div>
          )}

          {!selectedFile && (
            <div className="rounded-lg border border-app-gray/20 bg-app-gray/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-app-gray/20 bg-app-bg">
                  <FiFileText size={21} className="text-app-brand" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-app-gray">Current invoice file</p>

                  <p className="truncate text-sm font-semibold">
                    {invoice.fileName ||
                      invoice.invoiceNumber ||
                      "Existing invoice file"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2 text-sm font-semibold">
            <button
              type="submit"
              disabled={updateInvoice.isPending}
              className="rounded-lg bg-app-brand px-6 py-2 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateInvoice.isPending ? "Updating..." : "Update Invoice"}
            </button>

            <button
              onClick={() => navigate("/dashboard/invoices")}
              type="button"
              className="rounded-lg border border-app-gray/30 px-6 py-2 transition hover:bg-app-gray/5"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
