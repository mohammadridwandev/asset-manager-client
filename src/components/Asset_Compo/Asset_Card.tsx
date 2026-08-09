import {
  FaBoxOpen,
  FaCheckCircle,
  FaCog,
  FaFileInvoice,
  FaHashtag,
  FaLaptop,
  FaShieldAlt,
  FaUserMinus,
} from "react-icons/fa";

import { FaRightLeft } from "react-icons/fa6";

import { useState } from "react";
import Swal from "sweetalert2";

import Asset_view from "./Asset_view";
import Asset_to_Employee from "./Asset_to_Employee";

import { useUnassignAssetAssignment } from "../../context/useAssetAssignment";

import DataLoading from "../../DataLoading";

type AssetCardProps = {
  assets: any[];
  totalAssets?: number;
  isLoading: boolean;
  isError: boolean;
};

export default function Asset_Card({
  assets,
  totalAssets,
  isLoading,
  isError,
}: AssetCardProps) {
  const [selectedAsset, setSelectedAsset] =
    useState<any>(null);

  const [transferAsset, setTransferAsset] =
    useState<any>(null);

  const unassignMutation =
    useUnassignAssetAssignment();

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL_LINK ||
    "";

  const getImageUrl = (
    image?: string,
  ) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_BASE_URL.replace(
      /\/$/,
      "",
    )}/${image.replace(/^\//, "")}`;
  };

  const handleUnassignAsset =
    async (assignment: any) => {
      const result =
        await Swal.fire({
          title: "Unassign Asset?",

          text: `Remove from ${assignment.employee?.fullName}?`,

          icon: "warning",

          showCancelButton: true,

          confirmButtonColor:
            "#dc2626",

          cancelButtonColor:
            "#6b7280",

          confirmButtonText:
            "Yes, Unassign",

          cancelButtonText:
            "Cancel",
        });

      if (!result.isConfirmed) {
        return;
      }

      unassignMutation.mutate(
        String(assignment.id),
        {
          onSuccess: async () => {
            await Swal.fire({
              title: "Unassigned!",

              text: "Asset unassigned successfully.",

              icon: "success",

              timer: 1500,

              showConfirmButton:
                false,
            });
          },
        },
      );
    };

  const handleTransferAsset =
    async (
      asset: any,
      assignment: any,
    ) => {
      const result =
        await Swal.fire({
          title: "Transfer Asset?",

          text: `This asset will be unassigned from ${assignment.employee?.fullName} first.`,

          icon: "warning",

          showCancelButton: true,

          confirmButtonText:
            "Yes, Transfer",

          cancelButtonText:
            "Cancel",

          confirmButtonColor:
            "#2563eb",
        });

      if (!result.isConfirmed) {
        return;
      }

      unassignMutation.mutate(
        String(assignment.id),
        {
          onSuccess: () => {
            setTransferAsset({
              ...asset,
              assignments: [],
            });
          },
        },
      );
    };

  if (isLoading) {
    return (
      <DataLoading
        title="Loading assets..."
        message="Please wait while we load the assets."
      />
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-red-500">
        Failed to load assets!
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="py-10 text-center text-app-gray">
        No assets found!
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="font-bold">
          Total Assets:{" "}
          {totalAssets ??
            assets.length}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {assets.map(
          (asset: any) => {
            const employeeAssignments =
              asset.assignments || [];

            const departmentAssignments =
              asset.departmentAssignments ||
              [];

            const hasEmployee =
              employeeAssignments.length >
              0;

            const hasDepartments =
              departmentAssignments.length >
              0;

            // =========================
            // QUANTITY CALCULATION
            // =========================

            const totalQuantity =
              Number(
                asset.quantity || 0,
              );

            const employeeAssignedCount =
              employeeAssignments.length;

            const departmentAssignedCount =
              departmentAssignments.length;

            const assignedCount =
              employeeAssignedCount +
              departmentAssignedCount;

            const availableQuantity =
              Math.max(
                totalQuantity -
                  assignedCount,
                0,
              );

            return (
              <div
                key={asset.id}
                className="rounded-2xl border border-app-gray/10 bg-app-bg p-5 shadow-sm transition-all duration-300 hover:border-app-brand/30 hover:shadow-md"
              >
                {/* ================= HEADER ================= */}

                <div className="flex items-center justify-between gap-3 border-b border-app-gray/10 pb-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {/* Asset Image */}

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-app-gray/10 bg-app-brand/5">
                      {asset.image ? (
                        <img
                          src={getImageUrl(
                            asset.image,
                          )}
                          alt={
                            asset.assetName ||
                            "Asset"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaLaptop className="text-xl text-app-brand" />
                      )}
                    </div>

                    {/* Asset Name */}

                    <div className="min-w-0">
                      <h3
                        className="truncate text-base font-semibold text-app-text"
                        title={
                          asset.assetName ||
                          "Unnamed Asset"
                        }
                      >
                        {asset.assetName ||
                          "Unnamed Asset"}
                      </h3>

                      <p
                        className="mt-0.5 truncate text-xs text-app-gray"
                        title={
                          asset.assetType ||
                          "Asset"
                        }
                      >
                        {asset.assetType ||
                          "Asset"}
                      </p>
                    </div>
                  </div>

                  {/* ================= STATUS ================= */}

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {availableQuantity ===
                    0 ? (
                      <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase text-red-500">
                        Full
                      </span>
                    ) : hasDepartments ? (
                      <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-semibold uppercase text-blue-600">
                        Department
                      </span>
                    ) : hasEmployee ? (
                      <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-semibold uppercase text-green-600">
                        Assigned
                      </span>
                    ) : (
                      <span className="rounded-full border border-app-brand/20 bg-app-brand/5 px-3 py-1 text-[10px] font-semibold uppercase text-app-brand">
                        Available
                      </span>
                    )}
                  </div>
                </div>

                {/* ================= ASSET INFORMATION ================= */}

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Info
                    label="Serial Number"
                    value={
                      asset.serialNumber ||
                      "Not Available"
                    }
                    icon={
                      <FaHashtag />
                    }
                  />

                  <Info
                    label="Type"
                    value={
                      asset.assetType ||
                      "Not Available"
                    }
                    icon={
                      <FaLaptop />
                    }
                  />

                  <Info
                    label="Price (SAR)"
                    value={
                      asset.price
                        ? Number(
                            asset.price,
                          ).toLocaleString()
                        : "Not Available"
                    }
                  />

                  <Info
                    label="Quantity"
                    value={
                      totalQuantity
                    }
                  />
                </div>

                {/* ================= INVOICE / PURCHASE / CONDITION ================= */}

                <div className="mt-4 space-y-3 rounded-xl border border-app-gray/7 bg-app-secondary/5 p-4 text-sm">
                  <Row
                    icon={
                      <FaFileInvoice />
                    }
                    label="Invoice"
                    value={
                      asset.invoiceNumber ||
                      "Not Available"
                    }
                  />

                  <Row
                    icon={
                      <FaShieldAlt />
                    }
                    label="Purchase Date"
                    value={
                      asset.purchaseDate
                        ? new Date(
                            asset.purchaseDate,
                          ).toLocaleDateString()
                        : "Not Available"
                    }
                  />

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-app-gray">
                      Condition
                    </span>

                    <span className="rounded-full bg-app-brand/10 px-3 py-1 text-xs font-semibold capitalize text-app-brand">
                      {asset.condition ||
                        "Not Available"}
                    </span>
                  </div>
                </div>

                {/* ================= ASSIGNMENT ================= */}

                <div className="mt-4">
                  {/* Department Assignments */}

                  {hasDepartments && (
                    <div className="space-y-2">
                      {departmentAssignments.map(
                        (
                          assignment: any,
                        ) => (
                          <div
                            key={
                              assignment.id
                            }
                            className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3"
                          >
                            <div className="flex items-center gap-2">
                              <FaBoxOpen className="text-blue-600" />

                              <p className="text-xs font-medium text-app-gray">
                                Assigned
                                Department
                              </p>
                            </div>

                            <p className="mt-1 text-sm font-semibold text-blue-600">
                              {assignment
                                .department
                                ?.name ||
                                "Unknown Department"}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Employee Assignments */}

                  {hasEmployee && (
                    <div
                      className={`space-y-2 ${
                        hasDepartments
                          ? "mt-2"
                          : ""
                      }`}
                    >
                      {employeeAssignments.map(
                        (
                          assignment: any,
                        ) => (
                          <div
                            key={
                              assignment.id
                            }
                            className="flex items-center justify-between gap-3 rounded-lg border border-app-gray/10 p-3"
                          >
                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-semibold text-app-text">
                                {assignment
                                  .employee
                                  ?.fullName ||
                                  "Unknown Employee"}
                              </h4>

                              <p className="mt-0.5 truncate text-xs text-app-gray">
                                {assignment
                                  .employee
                                  ?.email ||
                                  "No email available"}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              <button
                                type="button"
                                title="Transfer Asset"
                                onClick={() =>
                                  handleTransferAsset(
                                    asset,
                                    assignment,
                                  )
                                }
                                disabled={
                                  unassignMutation.isPending
                                }
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-app-brand/20 bg-app-brand/5 text-app-brand transition hover:bg-app-brand/10 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FaRightLeft className="text-sm" />
                              </button>

                              <button
                                type="button"
                                title="Unassign Asset"
                                onClick={() =>
                                  handleUnassignAsset(
                                    assignment,
                                  )
                                }
                                disabled={
                                  unassignMutation.isPending
                                }
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FaUserMinus className="text-sm" />
                              </button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Nothing Assigned */}

                  {!hasEmployee &&
                    !hasDepartments && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-app-text">
                          <FaBoxOpen className="text-app-brand" />

                          <span>
                            Unassigned
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-app-gray">
                          This asset is
                          available for
                          assignment
                        </p>
                      </div>
                    )}
                </div>

                {/* ================= FOOTER ================= */}

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-app-gray/10 pt-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      availableQuantity >
                      0
                        ? "border-app-brand/20 bg-app-brand/5 text-app-brand"
                        : "border-red-500/20 bg-red-500/5 text-red-500"
                    }`}
                  >
                    <FaCheckCircle />

                    Available (
                    {
                      availableQuantity
                    }
                    )
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedAsset({
                        ...asset,

                        availableQuantity,

                        assignedCount,
                      })
                    }
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-app-gray/10 px-4 py-2 text-sm font-semibold text-app-text transition hover:border-app-brand/30 hover:text-app-brand"
                  >
                    <FaCog />
                    Manage
                  </button>
                </div>
              </div>
            );
          },
        )}
      </div>

      {selectedAsset && (
        <Asset_view
          assets={selectedAsset}
          onClose={() =>
            setSelectedAsset(
              null,
            )
          }
        />
      )}

      {transferAsset && (
        <Asset_to_Employee
          asset={transferAsset}
          onClose={() =>
            setTransferAsset(
              null,
            )
          }
        />
      )}
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
    <div className="rounded-lg border border-app-gray/7 p-3">
      <div className="mb-1 flex items-center gap-2 text-xs text-app-gray">
        {icon}

        <span>{label}</span>
      </div>

      <p
        className="truncate font-medium text-app-text"
        title={String(value)}
      >
        {value}
      </p>
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
    <div className="flex items-center justify-between gap-3">
      <span className="flex shrink-0 items-center gap-2 text-app-gray">
        {icon}
        {label}
      </span>

      <span
        className="min-w-0 truncate text-right font-medium text-app-text"
        title={String(value)}
      >
        {value}
      </span>
    </div>
  );
};