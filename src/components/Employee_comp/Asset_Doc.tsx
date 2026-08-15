import { useEffect, useRef, useState } from "react";
import {
  FaCloudUploadAlt,
  FaFileImage,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

type AssetDocument = {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType?: string | null;
  fileSize?: number | null;
  createdAt?: string;
};

type AssetDocProps = {
  employeeId: number;
  initialDocuments?: AssetDocument[];
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_FILES = 5;

export default function Asset_Doc({
  employeeId,
  initialDocuments = [],
}: AssetDocProps) {
  // Modal open / close
  const [isOpen, setIsOpen] = useState(false);

  // Uploaded documents
  const [documents, setDocuments] = useState<AssetDocument[]>(initialDocuments);

  // Selected images before upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL_LINK || "";

  const API_FILE_URL = import.meta.env.VITE_BACKEND_URL_LINK || "";

  console.log("API_FILE_URL =", API_FILE_URL);

  // Parent employee data change হলে document update হবে
  useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);


  // Complete image URL
  const getFileUrl = (fileUrl?: string | null) => {
    if (!fileUrl) return "";

    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      return fileUrl;
    }

    return `${API_FILE_URL.replace(/\/$/, "")}/${fileUrl.replace(/^\//, "")}`;
  };


  // File size format
  const formatFileSize = (size?: number | null) => {
    if (!size) return "";

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };


  // Select multiple images
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    const remainingSlots = MAX_FILES - selectedFiles.length;

    if (remainingSlots <= 0) {
      toast.error(`You can select maximum ${MAX_FILES} images.`);

      event.target.value = "";
      return;
    }

    const validFiles: File[] = [];

    files.forEach((file) => {
      if (validFiles.length >= remainingSlots) {
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          `${file.name}: Only JPG, PNG, WebP and PDF files are allowed.`,
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: File must be 2 MB or smaller.`);
        return;
      }

      const alreadySelected = selectedFiles.some(
        (selectedFile) =>
          selectedFile.name === file.name && selectedFile.size === file.size,
      );

      const alreadyAdded = validFiles.some(
        (selectedFile) =>
          selectedFile.name === file.name && selectedFile.size === file.size,
      );

      if (!alreadySelected && !alreadyAdded) {
        validFiles.push(file);
      }
    });

    if (files.length > remainingSlots) {
      toast.error(`Maximum ${MAX_FILES} images can be selected at a time.`);
    }

    setSelectedFiles((previousFiles) => [...previousFiles, ...validFiles]);

    // একই image আবার select করার সুবিধার জন্য input clear
    event.target.value = "";
  };


  // Remove selected image before upload
  const removeSelectedFile = (fileIndex: number) => {
    setSelectedFiles((previousFiles) =>
      previousFiles.filter((_, index) => index !== fileIndex),
    );
  };

  // Upload selected images
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append("assetDocuments", file);
      });

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/employees/${employeeId}/asset-documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const uploadedDocuments: AssetDocument[] = response.data?.data || [];

      setDocuments((previousDocuments) => [
        ...uploadedDocuments,
        ...previousDocuments,
      ]);

      setSelectedFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success(
        `${uploadedDocuments.length} image(s) uploaded successfully.`,
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Asset document upload failed.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Delete uploaded image
  const handleDelete = async (documentId: number) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Image?",
      text: "This asset document image will be permanently deleted.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(documentId);

      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/employees/asset-documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocuments((previousDocuments) =>
        previousDocuments.filter((document) => document.id !== documentId),
      );

      toast.success("Asset document deleted successfully.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Asset document delete failed.",
      );
    } finally {
      setDeletingId(null);
    }
  };



  




  return (
    <>

      {/* Asset document button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title={
          documents.length > 0
            ? `${documents.length} asset document(s) uploaded`
            : "No asset document uploaded"
        }
        className={`flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium transition ${
          documents.length > 0
            ? "border-green-500/20 bg-green-500/10 text-green-600"
            : "border-app-gray/20 bg-app-gray/5 text-app-gray"
        }`}
      >
        <FaFileImage className="text-xs" />

        <span>Asset Doc</span>

        <span
          className={`flex min-w-4 items-center justify-center rounded-full px-1 ${
            documents.length > 0 ? "bg-green-500/15" : "bg-app-gray/10"
          }`}
        >
          {documents.length}
        </span>
      </button>

      {/* Asset document modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm md:p-5"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-app-gray/10 bg-app-bg shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-app-gray/10 p-4 md:p-5">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-app-text">
                  Asset Documents
                </h2>

                <p className="mt-1 text-xs text-app-gray">
                  Upload and preview employee signed asset document images.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
              

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-app-gray transition hover:bg-app-gray/10 hover:text-app-text"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-5">
              {/* Upload area */}
              <div className="rounded-xl border border-dashed border-app-gray/20 bg-app-gray/2 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-app-text">
                      Upload signed papers
                    </h3>

                    <p className="mt-1 text-xs text-app-gray">
                      Select up to 5 JPG, PNG, WebP or PDF files. Maximum 2 MB
                      per file.
                    </p>
                  </div>

                  <label className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-app-brand px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
                    <FaCloudUploadAlt />
                    Select Images
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.webp, application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Selected images */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4 border-t border-app-gray/10 pt-4">
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${file.size}-${index}`}
                          className="flex items-center gap-3 rounded-lg border border-app-gray/10 bg-app-bg px-3 py-2.5"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-app-brand/5 text-app-brand">
                            <FaFileImage />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className="truncate text-sm font-medium text-app-text"
                              title={file.name}
                            >
                              {file.name}
                            </p>

                            <p className="text-xs text-app-gray">
                              {formatFileSize(file.size)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeSelectedFile(index)}
                            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-app-gray transition hover:bg-red-500/10 hover:text-red-500"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-app-brand px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaCloudUploadAlt />

                      {isUploading
                        ? "Uploading..."
                        : `Upload ${selectedFiles.length} Image(s)`}
                    </button>
                  </div>
                )}
              </div>

              {/* Document previews */}
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-app-text">
                    Document Preview
                  </h3>

                  <span className="rounded-full bg-app-brand/5 px-2.5 py-1 text-xs font-medium text-app-brand">
                    Total: {documents.length}
                  </span>
                </div>

                {documents.length === 0 ? (
                  <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-app-gray/10 text-center">
                    <FaFileImage className="text-4xl text-app-gray/30" />

                    <p className="mt-3 text-sm font-medium text-app-text">
                      No asset document uploaded
                    </p>

                    <p className="mt-1 text-xs text-app-gray">
                      Upload employee signed asset document images.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {documents.map((document, index) => {
                      const fileUrl = getFileUrl(document.fileUrl);

                      return (
                        <div
                          key={document.id}
                          className="overflow-hidden rounded-xl border border-app-gray/10 bg-app-bg"
                        >
                          {/* Document information */}
                          <div className="flex items-center gap-3 border-b border-app-gray/10 px-4 py-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                              <FaFileImage />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p
                                className="truncate text-sm font-medium text-app-text"
                                title={document.fileName}
                              >
                                {document.fileName}
                              </p>

                              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-app-gray">
                                <span>Document {index + 1}</span>

                                {document.fileSize ? (
                                  <>
                                    <span>•</span>

                                    <span>
                                      {formatFileSize(document.fileSize)}
                                    </span>
                                  </>
                                ) : null}

                                {document.createdAt ? (
                                  <>
                                    <span>•</span>

                                    <span>
                                      {new Date(
                                        document.createdAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  </>
                                ) : null}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDelete(document.id)}
                              disabled={deletingId === document.id}
                              title="Delete document"
                              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <FaTrash />
                            </button>
                          </div>

                          {/* Image preview */}

                          <div className="border-t border-app-gray/10 p-3">
                            {document.fileType === "application/pdf" ||
                            document.fileUrl.toLowerCase().endsWith(".pdf") ? (
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center rounded-lg border border-dashed border-app-gray/20 bg-app-gray/5 px-4 py-5 text-sm font-medium text-app-brand transition hover:bg-app-brand/5"
                              >
                                Open PDF Document
                              </a>
                            ) : (
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="block overflow-hidden rounded-lg border border-app-gray/10 bg-white"
                              >
                                <img
                                  src={fileUrl}
                                  alt={document.fileName}
                                  className="h-44 w-full object-contain"
                                />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      
    </>
  );
}
