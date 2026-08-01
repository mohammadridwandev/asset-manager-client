import {
  FiX,
  FiEdit,
  FiTrash2,
  FiUserPlus,
  FiFileText,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDeleteAsset } from "../../context/useAssets";
import { useState } from "react";
import Asset_to_Employee from "./Asset_to_Employee";

interface AssetProps {
  onClose: () => void;
  assets: any;
}

export default function Asset_view({ assets, onClose }: AssetProps) {
  const navigate = useNavigate();
  const deleteAssetMutation = useDeleteAsset();

  const hasActiveAssignment =
    assets.assetAssignments?.some(
      (assignment: any) => assignment.returnedAt === null,
    ) || !!assets.employee;

  const [assignOpen, setAssignOpen] = useState(false);

  const handleDeleteAsset = async () => {
    // ========================= UPDATED: assigned asset delete block =========================
    if (hasActiveAssignment) {
      await Swal.fire({
        title: "Delete Not Allowed",
        text: "Please unassign it before deleting.",
        icon: "warning",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Okay",
      });

      return;
    }

    const result = await Swal.fire({
      title: "Delete Asset?",
      text: "You won't be able to recover this asset!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      deleteAssetMutation.mutate(String(assets.id), {
        onSuccess: () => {
          onClose();

          Swal.fire({
            title: "Deleted!",
            text: "Asset deleted successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        },

        // ========================= UPDATED: backend error message show =========================
        onError: (error: any) => {
          Swal.fire({
            title: "Delete Failed",
            text:
              error?.response?.data?.message ||
              error?.response?.data?.error ||
              "Unable to delete this asset.",
            icon: "error",
            confirmButtonColor: "#dc2626",
          });
        },
      });
    }
  };


  


  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-fadeIn">
        <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-app-gray/10 bg-app-bg shadow-xl animate-scaleIn">
          <div className="flex items-center justify-between border-b border-app-gray/10 px-6 py-5">
            <h2 className="text-xl font-bold text-app-text">Asset Details</h2>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-app-gray hover:bg-app-brand/10 hover:text-app-brand transition-all"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-7">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-app-text">
                    {assets.assetName || "Unnamed Asset"}
                  </h3>

                  <p className="mt-1 text-sm text-app-brand">
                    {assets.assetType || "No Type"}
                  </p>
                </div>

                <span className="rounded-full bg-app-brand/10 px-3 py-1 text-xs font-bold text-app-brand">
                  Available
                </span>
              </div>

              <div className="mt-6 space-y-3 text-sm text-app-text">
                <InfoLine label="Serial Number" value={assets.serialNumber} />
                <InfoLine label="Invoice Number" value={assets.invoiceNumber} />
                <InfoLine label="Quantity" value={assets.quantity} />
                <InfoLine label="Condition" value={assets.condition} />
                <InfoLine
                  label="Purchase Date"
                  value={
                    assets.purchaseDate
                      ? new Date(assets.purchaseDate).toLocaleDateString()
                      : "N/A"
                  }
                />
                <InfoLine
                  label="Warranty Expiry"
                  value={
                    assets.WarrantyExpiry
                      ? new Date(assets.WarrantyExpiry).toLocaleDateString()
                      : "N/A"
                  }
                />
                <InfoLine
                  label="Price"
                  value={
                    assets.price
                      ? `${Number(assets.price).toLocaleString()} SAR`
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
                  {assets.notes || "No notes added"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-app-text">Quick Actions</h4>

              <div className="space-y-2">
                <button
                  onClick={() =>
                    navigate(`/dashboard/assets/update/${assets.id}`)
                  }
                  className="w-full cursor-pointer rounded-lg border border-app-gray/10 px-3 py-2.5 flex items-center gap-2 text-sm text-app-text hover:border-app-brand/20 hover:bg-app-brand/5 transition-all"
                >
                  <FiEdit size={16} />
                  Edit Asset
                </button>

                <button
                  onClick={handleDeleteAsset}
                  disabled={
                    deleteAssetMutation.isPending || hasActiveAssignment
                  }
                  title={
                    hasActiveAssignment
                      ? "Unassign this asset before deleting"
                      : "Delete Asset"
                  }
                  className="w-full cursor-pointer rounded-lg border border-red-500/10 px-3 py-2.5 flex items-center gap-2 text-sm text-red-500 hover:bg-red-500/5 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiTrash2 size={16} />

                  {deleteAssetMutation.isPending
                    ? "Deleting..."
                    : hasActiveAssignment
                      ? "Unassign Before Delete"
                      : "Delete Asset"}
                </button>

                <button
                  onClick={() => setAssignOpen(true)}
                  className="w-full cursor-pointer rounded-lg border border-green-500/10 px-3 py-2.5 flex items-center gap-2 text-sm text-green-600 hover:bg-green-500/5 transition-all"
                >
                  <FiUserPlus size={16} />
                  Assign Employee
                </button>
              </div>

              <div className="mt-2 rounded-md border border-app-gray/10 p-2">
                <h4 className="font-semibold text-sm text-app-text">
                  Assigned To
                </h4>

                <p className=" text-xs italic text-app-gray">
                  {assets.employee?.fullName || "This asset is not assigned"}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <SmallBox
                  icon={<FiCalendar />}
                  label="Created"
                  value={
                    assets.createdAt
                      ? new Date(assets.createdAt).toLocaleDateString()
                      : "N/A"
                  }
                />

                <SmallBox
                  icon={<FiDollarSign />}
                  label="Value"
                  value={
                    assets.price
                      ? `${Number(assets.price).toLocaleString()}`
                      : "N/A"
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-app-gray/10 px-6 py-5">
            <button
              onClick={onClose}
              className="rounded-lg border font-medium border-app-gray/10 px-4 bg-gray-800 hover:bg-gray-900 text-app-secondary py-2 text-sm cursor-pointer transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {assignOpen && (
        <Asset_to_Employee
          asset={assets}
          onClose={() => setAssignOpen(false)}
        ></Asset_to_Employee>
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
