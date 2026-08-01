import { useEffect, useState } from "react";
import { FiFileText, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

import { useCreateReport } from "../../../context/useReport";
import Swal from "sweetalert2";

type ReportAsset = {
  id: number | string;
  assetName: string;
  assetType: string;
  serialNumber: string;
  price: number;
  condition: string;
  isCustom?: boolean;
  priceUpdated?: boolean;
};

export default function Add_Report({
  employee,
  onClose,
}: {
  employee: any;
  onClose: () => void;
}) {
  const createReport = useCreateReport();

  const [condition, setCondition] = useState("Good");
  const [customCondition, setCustomCondition] = useState("");

  const [assignedAssets, setAssignedAssets] = useState<ReportAsset[]>([]);

  // ========================= LOAD DATABASE ASSETS =========================
  useEffect(() => {
    const employeeAssets =
      employee?.assetAssignments
        ?.filter((item: any) => !item.returnedAt)
        .map((item: any) => ({
          id: item.asset?.id || item.id,
          assetName: item.asset?.assetName || "",
          assetType: item.asset?.assetType || "",
          serialNumber: item.asset?.serialNumber || "",
          price: Number(item.asset?.price || 0),
          condition: item.asset?.condition || "Good",
          isCustom: false,
          priceUpdated: false,
        })) || [];

    setAssignedAssets(employeeAssets);
  }, [employee]);

  const finalCondition =
    condition === "Custom" ? customCondition.trim() || "Custom" : condition;

  // ========================= REAL-TIME TOTAL =========================
  const totalAssetPrice = assignedAssets.reduce(
    (sum: number, asset: ReportAsset) => sum + Number(asset.price || 0),
    0,
  );

  // ========================= ADD CUSTOM ASSET =========================
  const handleAddAsset = () => {
    const newAsset: ReportAsset = {
      id: `custom-${Date.now()}`,
      assetName: "",
      assetType: "",
      serialNumber: "",
      price: 0,
      condition: "",
      isCustom: true,
      priceUpdated: false,
    };

    setAssignedAssets((previousAssets) => [...previousAssets, newAsset]);
  };

  // ========================= UPDATE ASSET =========================
  const handleAssetChange = (
    index: number,
    field: keyof ReportAsset,
    value: string,
  ) => {
    setAssignedAssets((previousAssets) =>
      previousAssets.map((asset, assetIndex) => {
        if (assetIndex !== index) {
          return asset;
        }

        // Original asset: only price can be updated
        if (!asset.isCustom) {
          if (field !== "price") {
            return asset;
          }

          return {
            ...asset,
            price: value === "" ? 0 : Number(value),
            priceUpdated: true,
          };
        }

        // Custom asset: every field can be updated
        return {
          ...asset,
          [field]:
            field === "price" ? (value === "" ? 0 : Number(value)) : value,
        };
      }),
    );
  };

  // ========================= REMOVE CUSTOM ASSET =========================
  const handleRemoveAsset = (index: number) => {
    setAssignedAssets((previousAssets) =>
      previousAssets.filter((asset, assetIndex) => {
        if (assetIndex === index && !asset.isCustom) {
          return true;
        }

        return assetIndex !== index;
      }),
    );
  };

  // ========================= VALIDATION =========================
  const validateReport = () => {
    if (condition === "Custom" && !customCondition.trim()) {
      toast.error("Please enter the custom device condition.");

      return false;
    }

    return true;
  };

  // ========================= CREATE REPORT DATA =========================
const createReportData = (
  status: "APPROVED" | "REJECTED",
  rejectionReason?: string,
) => {
  const readableStatus =
    status === "APPROVED"
      ? "Approved"
      : "Rejected";

  return {
    title: `Employee Clearance Report ${readableStatus}`,
    reportType: "CLEARANCE",
    employeeId: employee.id,
    status,

    deviceCondition: finalCondition,

    rejectionReason:
      status === "REJECTED"
        ? rejectionReason?.trim() || null
        : null,

    assignedAssets: assignedAssets.map(
      (asset) => ({
        id: asset.id,
        assetName:
          asset.assetName.trim() || "---",
        assetType:
          asset.assetType.trim() || "---",
        serialNumber:
          asset.serialNumber.trim() || "---",
        price: Number(asset.price || 0),
        condition:
          asset.condition.trim() || "---",
        isCustom: Boolean(asset.isCustom),
        priceUpdated: Boolean(
          asset.priceUpdated,
        ),
      }),
    ),

    totalAssetPrice,

    description: `
Employee clearance report has been ${readableStatus.toLowerCase()}.

Employee: ${employee.fullName}
Department: ${employee.department || "No Department"}
Position: ${employee.position || "N/A"}

Device Condition: ${finalCondition}

Assigned Assets: ${assignedAssets.length}
Total Asset Value: ${totalAssetPrice.toFixed(2)}

${
  status === "REJECTED"
    ? `Rejection Reason: ${
        rejectionReason?.trim() || "---"
      }`
    : ""
}

Final Decision: ${readableStatus}
    `.trim(),
  };
};

  // ========================= APPROVE =========================
  const handleApproveReport = () => {
    if (!validateReport()) {
      return;
    }

    createReport.mutate(createReportData("APPROVED"), {
      onSuccess: () => {
        toast.success(
          "Employee clearance report has been approved successfully.",
        );

        onClose();
      },

      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Failed to create approved report.",
        );
      },
    });
  };

  // ========================= REJECT =========================
 const handleRejectReport = async () => {
  if (!validateReport()) {
    return;
  }

  const result = await Swal.fire({
    title: "Reject Report",
    input: "textarea",
    inputLabel: "Reason for rejection",
    inputPlaceholder: "Write the rejection reason...",
    showCancelButton: true,
    confirmButtonText: "Reject",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626",

    inputValidator: (value) => {
      if (!value?.trim()) {
        return "Please enter the rejection reason.";
      }

      return undefined;
    },
  });

  if (
    !result.isConfirmed ||
    !result.value?.trim()
  ) {
    return;
  }

  const rejectionReason =
    result.value.trim();

  createReport.mutate(
    createReportData(
      "REJECTED",
      rejectionReason,
    ),
    {
      onSuccess: () => {
        toast.success(
          "Employee clearance report has been rejected successfully.",
        );

        onClose();
      },

      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Failed to create rejected report.",
        );
      },
    },
  );
};











  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-fadeIn">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-app-gray/20 bg-app-bg p-6 shadow-xl animate-scaleIn">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-app-gray/10 pb-3">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <FiFileText className="text-app-brand" />
            Employee Clearance Report
          </h3>

          <button
            type="button"
            onClick={onClose}
            disabled={createReport.isPending}
            className="cursor-pointer rounded-lg p-1 text-app-gray transition-all hover:bg-app-brand/10 hover:text-app-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Employee Information */}
        <div className="mb-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <p>
            Employee: <b>{employee.fullName}</b>
          </p>

          <p>
            Department: <b>{employee.department || "No Department"}</b>
          </p>

          <p>
            Position: <b>{employee.position || "N/A"}</b>
          </p>

          <p>
            Status: <b>{employee.status}</b>
          </p>
        </div>

        {/* Assigned Assets */}
        <div className="mb-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold">Assigned Assets</h4>

              <p className="mt-1 text-xs text-app-gray">
                Total Assets: {assignedAssets.length}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddAsset}
              disabled={createReport.isPending}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-app-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiPlus size={16} />
              Add
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-app-gray/20">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-app-brand/10">
                <tr>
                  <th className="p-2 text-left">Name</th>

                  <th className="p-2 text-left">Type</th>

                  <th className="p-2 text-left">Serial</th>

                  <th className="p-2 text-left">Condition</th>

                  <th className="bg-amber-50/70 p-2 text-right dark:bg-amber-500/10">
                    Price
                  </th>

                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {assignedAssets.length > 0 ? (
                  assignedAssets.map((asset: ReportAsset, index: number) => {
                    const isReadOnly = !asset.isCustom;

                    const inputClassName = `
                        w-full rounded-md border px-2 py-1.5 outline-none
                        ${
                          isReadOnly
                            ? "cursor-not-allowed border-app-gray/20 bg-app-gray/10 text-app-gray"
                            : "border-app-gray/30 bg-app-bg focus:border-app-brand"
                        }
                      `;

                    return (
                      <tr
                        key={asset.id}
                        className="border-t border-app-gray/10"
                      >
                        <td className="p-2">
                          <input
                            type="text"
                            value={asset.assetName}
                            readOnly={isReadOnly}
                            onChange={(event) =>
                              handleAssetChange(
                                index,
                                "assetName",
                                event.target.value,
                              )
                            }
                            placeholder="Asset name"
                            className={inputClassName}
                          />
                        </td>

                        <td className="p-2">
                          <input
                            type="text"
                            value={asset.assetType}
                            readOnly={isReadOnly}
                            onChange={(event) =>
                              handleAssetChange(
                                index,
                                "assetType",
                                event.target.value,
                              )
                            }
                            placeholder="Asset type"
                            className={inputClassName}
                          />
                        </td>

                        <td className="p-2">
                          <input
                            type="text"
                            value={asset.serialNumber}
                            readOnly={isReadOnly}
                            onChange={(event) =>
                              handleAssetChange(
                                index,
                                "serialNumber",
                                event.target.value,
                              )
                            }
                            placeholder="Serial number"
                            className={inputClassName}
                          />
                        </td>

                        <td className="p-2">
                          <input
                            type="text"
                            value={asset.condition}
                            readOnly={isReadOnly}
                            onChange={(event) =>
                              handleAssetChange(
                                index,
                                "condition",
                                event.target.value,
                              )
                            }
                            placeholder="Condition"
                            className={inputClassName}
                          />
                        </td>

                        <td className="bg-red-50/50 p-2 dark:bg-red-500/5">
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={asset.price === 0 ? "" : asset.price}
                              onChange={(event) =>
                                handleAssetChange(
                                  index,
                                  "price",
                                  event.target.value,
                                )
                              }
                              placeholder="0.00"
                              disabled={createReport.isPending}
                              className={`w-full rounded-md border px-3 py-1.5 pr-12 text-right font-semibold outline-none transition ${
                                asset.priceUpdated
                                  ? "border-red-400 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-200"
                                  : "border-app-brand/30 bg-app-bg text-app-text focus:border-app-brand focus:ring-2 focus:ring-app-brand/10"
                              } disabled:cursor-not-allowed disabled:opacity-50`}
                            />

                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-app-gray">
                              SAR
                            </span>
                          </div>
                        </td>

                        <td className="p-2 text-center">
                          {asset.isCustom ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveAsset(index)}
                              disabled={createReport.isPending}
                              title="Remove custom asset"
                              className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          ) : (
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-[10px] font-medium ${
                                asset.priceUpdated
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-app-gray/10 text-app-gray"
                              }`}
                            >
                              {asset.priceUpdated
                                ? "Updated Price"
                                : "Original"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-app-gray">
                      No assets added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex flex-wrap justify-between  text-sm font-semibold">
            <span>Total Assets: {assignedAssets.length}</span>

            <span>Total Value: {totalAssetPrice.toFixed(2)} SAR</span>
          </div>
        </div>

        {/* Device Condition */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold">
            Device Condition
          </label>

          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            className="w-full rounded-lg border border-app-gray/30 bg-app-bg px-3 py-2 text-sm outline-none focus:border-app-brand"
          >
            <option value="Good">Good</option>
            <option value="Damage">Damage</option>
            <option value="Broken">Broken</option>
            <option value="Custom">Custom</option>
          </select>

          {condition === "Custom" && (
            <input
              type="text"
              value={customCondition}
              onChange={(event) => setCustomCondition(event.target.value)}
              placeholder="Enter custom condition"
              className="mt-3 w-full rounded-lg border border-app-gray/30 bg-app-bg px-3 py-2 text-sm outline-none focus:border-app-brand"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={createReport.isPending}
            className="rounded-lg border border-app-gray/30 px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleRejectReport}
            disabled={createReport.isPending}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createReport.isPending ? "Saving..." : "Reject"}
          </button>

          <button
            type="button"
            onClick={handleApproveReport}
            disabled={createReport.isPending}
            className="rounded-lg bg-app-brand px-5 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createReport.isPending ? "Saving..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}
