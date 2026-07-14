import {
  FiX,
  FiEdit,
  FiTrash2,
  FiUserPlus,

  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiImage,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDeleteLicense } from "../../context/useLicenses";
import { useState } from "react";
import Licenses_to_Employee from "./Licenses_to_Employee";

interface LicenseProps {
  license: any;
  onClose: () => void;
}

export default function Licenses_view({ license, onClose }: LicenseProps) {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_LINK;

  const deleteLicenseMutation = useDeleteLicense();

  const [assignOpen, setAssignOpen] = useState(false);

  const navigate = useNavigate();

  const getImageUrl = (image?: string) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_BASE_URL}${image}`;
  };

  const handleDeleteLicense = async () => {
    const result = await Swal.fire({
      title: "Delete License?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    deleteLicenseMutation.mutate(String(license.id), {
      
      onSuccess: async () => {
        await Swal.fire({
          title: "Deleted!",
          text: "License deleted successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        onClose();
      },
    });

  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-fadeIn">
        <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-app-gray/10 bg-app-bg shadow-xl animate-scaleIn">
          <div className="flex items-center justify-between border-b border-app-gray/10 px-6 py-5">
            <h2 className="text-xl font-bold text-app-text">License Details</h2>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-app-gray hover:bg-app-brand/10 hover:text-app-brand transition-all"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-7">
            <div>
              <div className="flex items-center gap-4">
                <div className="h-18 w-18  shrink-0 overflow-hidden rounded-xl border border-app-gray/10 bg-app-brand/5 flex items-center justify-center">
                  {license.image ? (
                    <img
                      src={getImageUrl(license.image)}
                      alt={license.softwareName || "License"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiImage className="text-app-brand text-2xl" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-app-text truncate">
                    {license.softwareName || "Unnamed Software"}
                  </h3>

                  <p className="mt-1 text-xs text-app-brand">
                    {license.vendorPublisher || "No Vendor"}
                  </p>

                  <span className="mt-1 inline-flex rounded-full border border-app-brand/20 bg-app-brand/5 px-3 py-0.5 text-xs font-semibold text-app-brand">
                    {license.licenseType || "N/A"}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-app-text">
                <InfoLine label="License Key" value={license.licenseKey} />

                <InfoLine label="Vendor" value={license.vendorPublisher} />

                <InfoLine
                  label="Total Quantity"
                  value={license.totalQuantity}
                />
                <InfoLine
                  label="Cost"
                  value={
                    license.costs
                      ? `${Number(license.costs).toLocaleString()} SAR`
                      : "N/A"
                  }
                />
                <InfoLine
                  label="Purchase Date"
                  value={
                    license.purchaseDate
                      ? new Date(license.purchaseDate).toLocaleDateString()
                      : "N/A"
                  }
                />
              </div>

              <div className="mt-6 rounded-lg border border-app-gray/10 p-4">
                <h4 className="flex items-center gap-2 font-semibold text-app-text">
                  <FiFileText className="text-app-brand" />
                  Notes
                </h4>

                <p className="mt-2 text-sm text-app-gray">
                  {license.notes || "No notes added"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-app-text">Quick Actions</h4>

              <div className="space-y-2">
                <button
                  onClick={() =>
                    navigate(`/dashboard/licenses/update/${license.id}`)
                  }
                  className="w-full rounded-lg border border-app-gray/10 px-3 py-2.5 flex items-center gap-2 text-sm text-app-text hover:border-app-brand/20 hover:bg-app-brand/5 transition-all"
                >
                  <FiEdit size={16} />
                  Edit License
                </button>

                <button
                  onClick={handleDeleteLicense}
                  disabled={deleteLicenseMutation.isPending}
                  className="w-full rounded-lg border border-red-500/10 px-3 py-2.5 flex items-center gap-2 text-sm text-red-500 hover:bg-red-500/5 transition-all"
                >
                  <FiTrash2 size={16} />

                  {deleteLicenseMutation.isPending
                    ? "Deleting..."
                    : "Delete License"}
                </button>

                <button
                  onClick={() => setAssignOpen(true)}
                  className="w-full rounded-lg cursor-pointer border border-green-500/10 px-3 py-2.5 flex items-center gap-2 text-sm text-green-600 hover:bg-green-500/5 transition-all"
                >
                  <FiUserPlus size={16} />
                  Assign Employee
                </button>

              </div>

              <div className="mt-6 rounded-lg border border-app-gray/10 p-4">
                <h4 className="font-semibold text-app-text">Assigned To</h4>

                <p className="mt-2 text-sm italic text-app-gray">
                  {license.employee?.fullName || "This license is not assigned"}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <SmallBox
                  icon={<FiCalendar />}
                  label="Created"
                  value={
                    license.createdAt
                      ? new Date(license.createdAt).toLocaleDateString()
                      : "N/A"
                  }
                />

                <SmallBox
                  icon={<FiDollarSign />}
                  label="Cost"
                  value={
                    license.costs
                      ? `${Number(license.costs).toLocaleString()}`
                      : "N/A"
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-app-gray/10 px-6 py-5">
            <button
              onClick={onClose}
              className="rounded-lg border bg-gray-800  border-app-gray/10 px-5 py-2 text-sm font-medium text-app-secondary cursor-pointer hover:bg-gray-900 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>

     {assignOpen && (
  <Licenses_to_Employee
    license={license}
    onClose={() => setAssignOpen(false)}
  />
)}


    </>
  );
}

const InfoLine = ({ label, value }: { label: string; value: any }) => {
  return (
    <p>
      <span className="text-app-gray">{label}: </span>
      <b>{value || "N/A"}</b>
    </p>
  );
};

const SmallBox = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
}) => {
  return (
    <div className="rounded-lg border border-app-gray/10 p-3">
      <p className="flex items-center gap-2 text-xs text-app-gray">
        {icon}
        {label}
      </p>
      <p className="mt-1 font-semibold text-app-text">{value}</p>
    </div>
  );
};
