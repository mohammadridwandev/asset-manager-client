import { useEffect, useState } from "react";
import {
  FiFileText,
  FiPlus,
  FiSave,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import Swal from "sweetalert2";

import { useUpdateReport } from "../../../context/useReport";

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

export default function Report_Edit({
  report,
  onClose,
}: {
  report: any;
  onClose: () => void;
}) {
  const updateReport = useUpdateReport();

  const standardConditions = [
    "Good",
    "Damage",
    "Broken",
  ];

  const [deviceCondition, setDeviceCondition] =
    useState("Good");

  const [customCondition, setCustomCondition] =
    useState("");

  const [status, setStatus] =
    useState("APPROVED");

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [assignedAssets, setAssignedAssets] =
    useState<ReportAsset[]>([]);

  // ========================= LOAD REPORT DATA =========================
  useEffect(() => {
    const currentCondition =
      report?.deviceCondition || "Good";

    const isStandardCondition =
      standardConditions.includes(
        currentCondition,
      );

    setDeviceCondition(
      isStandardCondition
        ? currentCondition
        : "Custom",
    );

    setCustomCondition(
      isStandardCondition
        ? ""
        : currentCondition,
    );

    setStatus(
      report?.status || "APPROVED",
    );

    setRejectionReason(
      report?.rejectionReason || "",
    );

    setAssignedAssets(
      Array.isArray(report?.assignedAssets)
        ? report.assignedAssets.map(
            (
              asset: any,
              index: number,
            ) => ({
              id:
                asset?.id ??
                `custom-${Date.now()}-${index}`,

              assetName:
                asset?.assetName || "",

              assetType:
                asset?.assetType || "",

              serialNumber:
                asset?.serialNumber || "",

              price: Number(
                asset?.price || 0,
              ),

              condition:
                asset?.condition || "",

              isCustom: Boolean(
                asset?.isCustom,
              ),

              priceUpdated: Boolean(
                asset?.priceUpdated,
              ),
            }),
          )
        : [],
    );
  }, [report]);

  // ========================= REAL-TIME TOTAL =========================
  const totalAssetPrice =
    assignedAssets.reduce(
      (
        total: number,
        asset: ReportAsset,
      ) =>
        total +
        Number(asset?.price || 0),
      0,
    );

  // ========================= UPDATE ASSET =========================
  const handleAssetChange = (
    index: number,
    field: keyof ReportAsset,
    value: string,
  ) => {
    setAssignedAssets(
      (previousAssets) =>
        previousAssets.map(
          (asset, assetIndex) => {
            if (assetIndex !== index) {
              return asset;
            }

            // Original asset:
            // only price can be updated
            if (!asset.isCustom) {
              if (field !== "price") {
                return asset;
              }

              return {
                ...asset,

                price:
                  value === ""
                    ? 0
                    : Number(value),

                priceUpdated: true,
              };
            }

            // Custom asset:
            // every field can be updated
            return {
              ...asset,

              [field]:
                field === "price"
                  ? value === ""
                    ? 0
                    : Number(value)
                  : value,
            };
          },
        ),
    );
  };

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

    setAssignedAssets(
      (previousAssets) => [
        ...previousAssets,
        newAsset,
      ],
    );
  };

  // ========================= REMOVE CUSTOM ASSET =========================
  const handleRemoveAsset = (
    index: number,
  ) => {
    setAssignedAssets(
      (previousAssets) =>
        previousAssets.filter(
          (asset, assetIndex) => {
            // Original asset cannot be removed
            if (
              assetIndex === index &&
              !asset.isCustom
            ) {
              return true;
            }

            return assetIndex !== index;
          },
        ),
    );
  };

  // ========================= UPDATE REPORT =========================
  const handleUpdateReport = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      deviceCondition === "Custom" &&
      !customCondition.trim()
    ) {
      await Swal.fire({
        title: "Condition Required",
        text: "Please enter the custom device condition.",
        icon: "warning",
      });

      return;
    }

    let finalRejectionReason = "";

    // Ask reason only when selected status is rejected
    if (status === "REJECTED") {
      const result = await Swal.fire({
        title: "Reject Report",
        input: "textarea",
        inputLabel: "Reason for rejection",
        inputPlaceholder:
          "Write the rejection reason...",
        inputValue: rejectionReason,
        inputAttributes: {
          maxlength: "500",
        },
        showCancelButton: true,
        confirmButtonText:
          "Save Rejection",
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

      finalRejectionReason =
        result.value.trim();

      setRejectionReason(
        finalRejectionReason,
      );
    }

    const finalDeviceCondition =
      deviceCondition === "Custom"
        ? customCondition.trim()
        : deviceCondition;

    const employeeName =
      report?.employee?.fullName ||
      "Unknown Employee";

    const employeeDepartment =
      report?.employee?.department ||
      "No Department";

    const employeePosition =
      report?.employee?.position ||
      "N/A";

    const readableStatus =
      status.replaceAll("_", " ");

    const finalAssets =
      assignedAssets.map((asset) => ({
        id: asset.id,

        assetName:
          asset.assetName.trim() || "---",

        assetType:
          asset.assetType.trim() || "---",

        serialNumber:
          asset.serialNumber.trim() ||
          "---",

        price: Number(
          asset.price || 0,
        ),

        condition:
          asset.condition.trim() || "---",

        isCustom: Boolean(
          asset.isCustom,
        ),

        priceUpdated: Boolean(
          asset.priceUpdated,
        ),
      }));

    const description = `
Employee clearance report has been updated.

Employee: ${employeeName}
Department: ${employeeDepartment}
Position: ${employeePosition}

Device Condition: ${finalDeviceCondition}

Assigned Assets: ${finalAssets.length}
Total Asset Value: ${totalAssetPrice.toFixed(2)}

${
  status === "REJECTED"
    ? `Rejection Reason: ${finalRejectionReason}`
    : ""
}

Final Decision: ${readableStatus}
    `.trim();

    const updateData = {
      deviceCondition:
        finalDeviceCondition,

      status,

      rejectionReason:
        status === "REJECTED"
          ? finalRejectionReason
          : null,

      assignedAssets:
        finalAssets,

      totalAssetPrice,

      description,

      title: `Employee Clearance Report ${readableStatus}`,
    };

    updateReport.mutate(
      {
        id: String(report.id),
        updateData,
      },
      {
        onSuccess: () => {
          Swal.fire({
            title: "Updated!",
            text: "Clearance report updated successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          onClose();
        },

        onError: (error: any) => {
          Swal.fire({
            title: "Failed!",

            text:
              error?.response?.data
                ?.message ||
              error?.response?.data
                ?.error ||
              "Failed to update clearance report.",

            icon: "error",
          });
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-fadeIn">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-app-gray/20 bg-app-bg p-6 text-app-text shadow-xl animate-scaleIn">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-app-gray/10 pb-3">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <FiFileText className="text-app-brand" />

            Edit Clearance Report
          </h3>

          <button
            type="button"
            onClick={onClose}
            disabled={
              updateReport.isPending
            }
            className="cursor-pointer rounded-lg p-1 text-app-gray transition-all hover:bg-app-brand/10 hover:text-app-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Employee Information */}
        <div className="mb-6 rounded-lg border border-app-gray/20 bg-app-gray/5 p-4">
          <h2 className="text-lg font-bold">
            {report?.employee?.fullName ||
              "Unknown Employee"}
          </h2>

          <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <p>
              <span className="font-semibold">
                Iqama:
              </span>{" "}

              <span className="text-app-gray">
                {report?.employee
                  ?.iqamaNumber || "N/A"}
              </span>
            </p>

            <p>
              <span className="font-semibold">
                Department:
              </span>{" "}

              <span className="text-app-gray">
                {report?.employee
                  ?.department ||
                  "No Department"}
              </span>
            </p>

            <p>
              <span className="font-semibold">
                Position:
              </span>{" "}

              <span className="text-app-gray">
                {report?.employee
                  ?.position || "N/A"}
              </span>
            </p>

            <p>
              <span className="font-semibold">
                Employee Status:
              </span>{" "}

              <span className="text-app-gray">
                {report?.employee
                  ?.status || "N/A"}
              </span>
            </p>
          </div>
        </div>

        <form
          onSubmit={handleUpdateReport}
          className="space-y-6"
        >
          {/* Assigned Assets */}
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold">
                  Assigned Assets
                </h4>

                <p className="mt-1 text-xs text-app-gray">
                  Total:{" "}
                  {assignedAssets.length}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddAsset}
                disabled={
                  updateReport.isPending
                }
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
                    <th className="p-2 text-left">
                      Name
                    </th>

                    <th className="p-2 text-left">
                      Type
                    </th>

                    <th className="p-2 text-left">
                      Serial
                    </th>

                    <th className="p-2 text-left">
                      Condition
                    </th>

                    <th className="bg-amber-50/70 p-2 text-right dark:bg-amber-500/10">
                      Price
                    </th>

                    <th className="p-2 text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {assignedAssets.length >
                  0 ? (
                    assignedAssets.map(
                      (
                        asset: ReportAsset,
                        index: number,
                      ) => {
                        const isReadOnly =
                          !asset.isCustom;

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
                            {/* Asset Name */}
                            <td className="p-2">
                              <input
                                type="text"
                                value={
                                  asset.assetName
                                }
                                readOnly={
                                  isReadOnly
                                }
                                onChange={(
                                  event,
                                ) =>
                                  handleAssetChange(
                                    index,
                                    "assetName",
                                    event.target
                                      .value,
                                  )
                                }
                                placeholder="Asset name"
                                className={
                                  inputClassName
                                }
                              />
                            </td>

                            {/* Asset Type */}
                            <td className="p-2">
                              <input
                                type="text"
                                value={
                                  asset.assetType
                                }
                                readOnly={
                                  isReadOnly
                                }
                                onChange={(
                                  event,
                                ) =>
                                  handleAssetChange(
                                    index,
                                    "assetType",
                                    event.target
                                      .value,
                                  )
                                }
                                placeholder="Asset type"
                                className={
                                  inputClassName
                                }
                              />
                            </td>

                            {/* Serial Number */}
                            <td className="p-2">
                              <input
                                type="text"
                                value={
                                  asset.serialNumber
                                }
                                readOnly={
                                  isReadOnly
                                }
                                onChange={(
                                  event,
                                ) =>
                                  handleAssetChange(
                                    index,
                                    "serialNumber",
                                    event.target
                                      .value,
                                  )
                                }
                                placeholder="Serial number"
                                className={
                                  inputClassName
                                }
                              />
                            </td>

                            {/* Condition */}
                            <td className="p-2">
                              <input
                                type="text"
                                value={
                                  asset.condition
                                }
                                readOnly={
                                  isReadOnly
                                }
                                onChange={(
                                  event,
                                ) =>
                                  handleAssetChange(
                                    index,
                                    "condition",
                                    event.target
                                      .value,
                                  )
                                }
                                placeholder="Condition"
                                className={
                                  inputClassName
                                }
                              />
                            </td>

                            {/* Price */}
                            <td className="bg-red-50/50 p-2 dark:bg-red-500/5">
                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={
                                    asset.price ===
                                    0
                                      ? ""
                                      : asset.price
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    handleAssetChange(
                                      index,
                                      "price",
                                      event.target
                                        .value,
                                    )
                                  }
                                  placeholder="0.00"
                                  disabled={
                                    updateReport.isPending
                                  }
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

                            {/* Action */}
                            <td className="p-2 text-center">
                              {asset.isCustom ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveAsset(
                                      index,
                                    )
                                  }
                                  disabled={
                                    updateReport.isPending
                                  }
                                  title="Remove custom asset"
                                  className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <FiTrash2
                                    size={16}
                                  />
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
                      },
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-center text-app-gray"
                      >
                        No assigned assets
                        found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm font-semibold">
              <span>
                Total Assets:{" "}
                {assignedAssets.length}
              </span>

              <span>
                Total Asset Value:{" "}
                {totalAssetPrice.toFixed(
                  2,
                )}{" "}
                SAR
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Device Condition */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Device Condition
              </label>

              <select
                value={deviceCondition}
                onChange={(event) =>
                  setDeviceCondition(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-app-gray/30 bg-app-bg px-3 py-2.5 text-sm outline-none focus:border-app-brand"
              >
                <option value="Good">
                  Good
                </option>

                <option value="Damage">
                  Damage
                </option>

                <option value="Broken">
                  Broken
                </option>

                <option value="Custom">
                  Custom
                </option>
              </select>

              {deviceCondition ===
                "Custom" && (
                <input
                  type="text"
                  value={customCondition}
                  onChange={(event) =>
                    setCustomCondition(
                      event.target.value,
                    )
                  }
                  placeholder="Enter custom device condition"
                  className="mt-3 w-full rounded-lg border border-app-gray/30 bg-app-bg px-3 py-2.5 text-sm outline-none focus:border-app-brand"
                />
              )}
            </div>

            {/* Report Status */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Report Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-app-gray/30 bg-app-bg px-3 py-2.5 text-sm outline-none focus:border-app-brand"
              >
                <option value="APPROVED">
                  Approved
                </option>

                <option value="REJECTED">
                  Rejected
                </option>

                <option value="PENDING_FINANCE">
                  Pending Finance
                </option>

                <option value="FINALIZED">
                  Finalized
                </option>
              </select>

              <p className="mt-2 text-xs text-app-gray">
                Saving will move the
                report to the selected
                status tab.
              </p>

              {status === "REJECTED" &&
                rejectionReason && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-500/20 dark:bg-red-500/10">
                    <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                      Current Rejection
                      Reason
                    </p>

                    <p className="mt-1 whitespace-pre-wrap text-sm text-red-600 dark:text-red-200">
                      {rejectionReason}
                    </p>
                  </div>
                )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-app-gray/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={
                updateReport.isPending
              }
              className="cursor-pointer rounded-lg border border-app-gray/30 px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                updateReport.isPending
              }
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-app-brand px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiSave size={15} />

              {updateReport.isPending
                ? "Updating..."
                : "Save Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}