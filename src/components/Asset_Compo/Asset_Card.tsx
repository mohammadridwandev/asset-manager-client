import {
  FaBoxOpen,
  FaCheckCircle,
  FaCog,
  FaFileInvoice,
  FaHashtag,
  FaLaptop,
  FaShieldAlt,
} from "react-icons/fa";


import Asset_view from "./Asset_view";
import { useState } from "react";
import Swal from "sweetalert2";
import { useUnassignAssetAssignment } from "../../context/useAssetAssignment";

// UPDATED: props type
type AssetCardProps = {
  assets: any[];
  isLoading: boolean;
  isError: boolean;
};

export default function Asset_Card({
  assets,
  isLoading,
  isError,
}: AssetCardProps) {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const unassignMutation = useUnassignAssetAssignment();

  if (isLoading)
    return (
      <p className="text-center py-10 text-app-brand">Loading assets...</p>
    );

  if (isError)
    return (
      <p className="text-center py-10 text-red-500">Failed to load assets!</p>
    );

  const handleUnassignAsset = async (assignment: any) => {
    const result = await Swal.fire({
      title: "Unassign Asset?",
      text: `Remove from ${assignment.employee?.fullName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Unassign",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    unassignMutation.mutate(String(assignment.id), {
      onSuccess: async () => {
        await Swal.fire({
          title: "Unassigned!",
          text: "Asset unassigned successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      },
    });
  };

  // UPDATED: no result UI
  if (assets.length === 0) {
    return (
      <p className="text-center py-10 text-app-gray">
        No assets found!
      </p>
    );
  }

  return (
    <>

      <div className="pb-4">
        {/* UPDATED: filtered হলে filtered count, না হলে total count */}
        <h1 className="font-bold">Total Assets: {assets.length}</h1>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

      
        {assets.map((asset: any) => (
          <div
            key={asset.id}
            className="rounded-2xl border border-app-gray/10 bg-app-bg p-5 shadow-sm hover:shadow-lg hover:border-app-brand/40 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4 border-b border-app-gray/7 pb-4">
              <div>
                <h3 className="text-lg font-bold text-app-text leading-snug line-clamp-2">
                  {asset.assetName || "Unnamed Asset"}
                </h3>
              </div>

              <span className="shrink-0 rounded-full border border-app-brand/30 bg-app-brand/7 px-3 py-1 text-[11px] font-bold uppercase text-app-brand">
                {asset.assignments?.length > 0 ? "Assigned" : "Available"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Info
                label="Serial Number"
                value={asset.serialNumber || "Not Available"}
                icon={<FaHashtag />}
              />

              <Info
                label="Type"
                value={asset.assetType || "Not Available"}
                icon={<FaLaptop />}
              />

              <Info
                label="Price (SAR)"
                value={
                  asset.price
                    ? Number(asset.price).toLocaleString()
                    : "Not Available"
                }
              />

              <Info label="Quantity" value={asset.quantity || 0} />
            </div>

            <div className="mt-4 space-y-2 rounded-xl border border-app-gray/7 bg-app-secondary/5 p-4 text-sm">
              <Row
                icon={<FaFileInvoice />}
                label="Invoice"
                value={asset.invoiceNumber || "Not Available"}
              />

              <Row
                icon={<FaShieldAlt />}
                label="Purchase Date"
                value={
                  asset.purchaseDate
                    ? new Date(asset.purchaseDate).toLocaleDateString()
                    : "Not Available"
                }
              />

              <div className="flex items-center justify-between gap-3">
                <span className="text-app-gray">Condition</span>
                <span className="rounded-full bg-app-brand/10 px-3 py-1 text-xs font-bold text-app-brand">
                  {asset.condition || "Not Available"}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-md">
              {asset.assignments?.length > 0 ? (
                <div className="space-y-2">
                  {asset.assignments.map((assignment: any) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between gap-3 rounded-md border border-app-gray/10 bg-app-bg p-2"
                    >
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold text-app-text">
                          {assignment.employee?.fullName}
                        </h4>

                        <p className="truncate text-xs text-app-gray">
                          {assignment.employee?.email || "No email available"}
                        </p>
                      </div>

                      <button
                        onClick={() => handleUnassignAsset(assignment)}
                        disabled={unassignMutation.isPending}
                        className="shrink-0 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/15 disabled:opacity-50 cursor-pointer transition-all"
                      >
                        {unassignMutation.isPending
                          ? "Removing..."
                          : "Unassign"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-app-text">
                    <FaBoxOpen className="text-app-brand" />
                    Unassigned
                  </div>

                  <p className="text-xs italic text-app-gray">
                    This asset is available for assignment
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-app-brand/30 bg-app-brand/10 px-3 py-1.5 text-xs font-bold text-app-brand">
                <FaCheckCircle />
                In Stock ({asset.quantity || 0})
              </span>

              <button
                onClick={() => setSelectedAsset(asset)}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-app-gray/7 px-4 py-2 text-sm font-bold text-app-text hover:border-app-brand/50 hover:text-app-brand transition-all"
              >
                <FaCog />
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        {selectedAsset && (
          <Asset_view
            assets={selectedAsset}
            onClose={() => setSelectedAsset(null)}
          />
        )}
      </div>
    </>
  );
}

const Info = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: any;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="rounded-xl border border-app-gray/7 bg-app-secondary/5 p-3">
      <p className="flex items-center gap-2 text-xs text-app-gray">
        {icon}
        {label}
      </p>
      <p className="mt-1 truncate font-bold text-app-text">{value}</p>
    </div>
  );
};

const Row = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
}) => {
  return (
    <p className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-app-gray">
        {icon}
        {label}
      </span>
      <span className="font-semibold text-app-text">{value}</span>
    </p>
  );
};