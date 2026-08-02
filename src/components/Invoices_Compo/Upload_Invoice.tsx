import { useEffect, useRef, useState } from "react";
import { FiFileText, FiImage, FiUploadCloud, FiX } from "react-icons/fi";

import { useCreateInvoice } from "../../context/useInvoice";
import toast from "react-hot-toast";

type UploadInvoiceProps = {
  setShowUpload: React.Dispatch<React.SetStateAction<boolean>>;
};

const Upload_Invoice = ({ setShowUpload }: UploadInvoiceProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const createInvoice = useCreateInvoice();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

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
      toast.error("Only JPG, PNG, WebP and PDF files are allowed.");

      event.target.value = "";
      setSelectedFile(null);
      setPreviewUrl("");

      return;
    }

    const maximumFileSize = 2 * 1024 * 1024;

    if (file.size > maximumFileSize) {
      toast.error("File size must be less than 2 MB.");

      event.target.value = "";
      setSelectedFile(null);
      setPreviewUrl("");

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

  const handlerUpload = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const invoiceNumber = String(formData.get("invoiceNumber") || "").trim();

    if (!invoiceNumber) {
      toast.error("Please enter an invoice number.");

      return;
    }

    if (!selectedFile) {
      toast.error("Please select an invoice file.");

      return;
    }

    formData.set("invoiceNumber", invoiceNumber);

    formData.set("invoiceImage", selectedFile);

    createInvoice.mutate(formData, {
      onSuccess: () => {
        // শুধু successful create হলে reset হবে
        form.reset();
        removeSelectedFile();
        setShowUpload(false);
      },

      onError: () => {
        /*
         * Duplicate invoice number বা অন্য professional error
         * useCreateInvoice hook থেকে দেখাবে।
         *
         * Error হলে form data এবং selected file থাকবে।
         */
      },
    });
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

  return (
    <div className="py-6">
      <div className="rounded-xl border border-app-gray/20 bg-app-bg p-5 text-app-text">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Upload Invoice</h2>

          <button
            type="button"
            onClick={() => setShowUpload(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-app-gray/20 transition hover:bg-app-gray/10"
          >
            <FiX size={18} />
          </button>
        </div>

        <hr className="mb-5 border-app-gray/10" />

        <form onSubmit={handlerUpload} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[15px] font-medium">
              Invoice Number <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              required
              name="invoiceNumber"
              placeholder="e.g., INV-001, INV-2026-001"
              className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-3 py-2 text-sm focus:border-app-brand focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="my-2">
              <label className="text-[15px] font-medium">
                Invoice File <span className="text-red-500">*</span>
              </label>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-app-brand/30 bg-app-brand/10 p-5 transition-all hover:border-app-brand hover:bg-app-brand/5">
              <input
                ref={fileInputRef}
                name="invoiceImage"
                type="file"
                required
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <FiUploadCloud size={32} className="my-2 mb-1 text-app-brand" />

              <span className="text-[15px] font-medium opacity-80">
                Click to upload
              </span>

              <span className="mt-0.5 text-[10px] text-app-gray">
                JPG, PNG, WEBP or PDF (max 2 MB)
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
                      <FiImage className="text-app-brand" />
                    ) : (
                      <FiFileText className="text-red-500" />
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

          <div className="flex gap-3 pt-2 text-sm font-semibold">
            <button
              type="submit"
              disabled={createInvoice.isPending || !selectedFile}
              className="rounded-lg bg-app-brand px-6 py-2 text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createInvoice.isPending ? "Uploading..." : "Upload Invoice"}
            </button>

            <button
              onClick={() => setShowUpload(false)}
              type="button"
              className="rounded-lg border border-app-gray/30 px-6 py-2 hover:bg-app-gray/5"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload_Invoice;
