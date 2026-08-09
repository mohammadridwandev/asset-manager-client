import {
  FiX,
  FiEdit,
  FiTrash2,
  FiUserPlus,
  FiFileText,
  FiCalendar,
  FiDollarSign,
  FiBarChart,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";

import {
  useDeleteAsset,
  useGetSingleAsset,
} from "../../context/useAssets";

import Asset_to_Employee from "./Asset_to_Employee";
import Asset_to_Department from "./Asset_to_Department";

interface AssetProps {
  onClose: () => void;
  assets: any;
}

export default function Asset_view({
  assets,
  onClose,
}: AssetProps) {
  const navigate = useNavigate();

  const deleteAssetMutation =
    useDeleteAsset();

  const [assignOpen, setAssignOpen] =
    useState(false);

  const [
    assignDepartmentOpen,
    setAssignDepartmentOpen,
  ] = useState(false);

  // =========================
  // FRESH ASSET DATA
  // =========================

  const {
    data: freshAsset,
    isFetching: isAssetRefreshing,
  } = useGetSingleAsset(
    assets?.id
      ? String(assets.id)
      : undefined,
  );

  const currentAsset =
    freshAsset || assets;

  // =========================
  // ACTIVE EMPLOYEE ASSIGNMENTS
  // =========================

  const activeAssignments =
    currentAsset?.assignments?.filter(
      (assignment: any) =>
        assignment.returnedAt ===
        null,
    ) || [];

  const hasActiveAssignment =
    activeAssignments.length > 0 ||
    !!currentAsset?.employee;

  // =========================
  // DEPARTMENT ASSIGNMENTS
  // =========================

  const departmentAssignments =
    currentAsset
      ?.departmentAssignments ||
    [];

  const hasDepartment =
    departmentAssignments.length >
    0;

  // =========================
  // QUANTITY
  // =========================

  const totalQuantity = Number(
    currentAsset?.quantity || 0,
  );

  const employeeAssignedCount =
    activeAssignments.length;

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

  const isOutOfStock =
    availableQuantity <= 0;

  // =========================
  // DELETE ASSET
  // =========================

  const handleDeleteAsset =
    async () => {
      if (
        hasActiveAssignment ||
        hasDepartment
      ) {
        await Swal.fire({
          title:
            "Delete Not Allowed",

          text: hasDepartment
            ? "This asset is assigned to one or more departments. Please unassign it from all departments first."
            : "This asset is assigned to an employee. Please unassign it first.",

          icon: "warning",

          confirmButtonColor:
            "#dc2626",

          confirmButtonText:
            "Okay",
        });

        return;
      }

      const result =
        await Swal.fire({
          title: "Delete Asset?",

          text: "You won't be able to recover this asset!",

          icon: "warning",

          showCancelButton: true,

          confirmButtonColor:
            "#dc2626",

          cancelButtonColor:
            "#6b7280",

          confirmButtonText:
            "Yes, Delete",

          cancelButtonText:
            "Cancel",
        });

      if (!result.isConfirmed) {
        return;
      }

      deleteAssetMutation.mutate(
        String(currentAsset.id),
        {
          onSuccess: () => {
            onClose();

            Swal.fire({
              title: "Deleted!",

              text: "Asset deleted successfully.",

              icon: "success",

              timer: 1500,

              showConfirmButton:
                false,
            });
          },

          onError: (
            error: any,
          ) => {
            Swal.fire({
              title:
                "Delete Failed",

              text:
                error?.response
                  ?.data?.message ||
                error?.response
                  ?.data?.error ||
                "Unable to delete this asset.",

              icon: "error",

              confirmButtonColor:
                "#dc2626",
            });
          },
        },
      );
    };

  // =========================
  // ASSIGN EMPLOYEE
  // =========================

  const handleAssignEmployee =
    async () => {
      // Quantity 0 হলে block
      if (isOutOfStock) {
        await Swal.fire({
          title:
            "No Quantity Available",

          text: "All available quantities of this asset have already been assigned.",

          icon: "warning",

          confirmButtonText:
            "Okay",

          confirmButtonColor:
            "#16a34a",
        });

        return;
      }

      // Department assigned থাকলে employee block
      if (hasDepartment) {
        await Swal.fire({
          title:
            "Cannot Assign Employee",

          text: "This asset is currently assigned to one or more departments. Please unassign all departments first.",

          icon: "warning",

          confirmButtonText:
            "Okay",

          confirmButtonColor:
            "#16a34a",
        });

        return;
      }

      setAssignOpen(true);
    };

  // =========================
  // ASSIGN DEPARTMENT
  // =========================

  const handleAssignDepartment =
    async () => {
      // Quantity 0 হলে block
      if (isOutOfStock) {
        await Swal.fire({
          title:
            "No Quantity Available",

          text: "All available quantities of this asset have already been assigned.",

          icon: "warning",

          confirmButtonText:
            "Okay",

          confirmButtonColor:
            "#2563eb",
        });

        return;
      }

      // Employee assigned থাকলে department block
      if (hasActiveAssignment) {
        await Swal.fire({
          title:
            "Cannot Assign Department",

          text: "This asset is currently assigned to an employee. Please unassign the employee first.",

          icon: "warning",

          confirmButtonText:
            "Okay",

          confirmButtonColor:
            "#2563eb",
        });

        return;
      }

      setAssignDepartmentOpen(
        true,
      );
    };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-fadeIn">
        <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-app-gray/10 bg-app-bg shadow-xl animate-scaleIn">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-app-gray/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-app-text">
                Asset Details
              </h2>

              {isAssetRefreshing && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-app-brand/20 border-t-app-brand" />
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-2 text-app-gray transition hover:bg-app-brand/10 hover:text-app-brand"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Content */}

          <div className="grid grid-cols-1 gap-8 px-6 py-7 md:grid-cols-2">
            {/* Left */}

            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-app-text">
                    {currentAsset
                      ?.assetName ||
                      "Unnamed Asset"}
                  </h3>

                  <p className="mt-1 text-sm text-app-brand">
                    {currentAsset
                      ?.assetType ||
                      "No Type"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    isOutOfStock
                      ? "bg-red-500/10 text-red-500"
                      : "bg-app-brand/10 text-app-brand"
                  }`}
                >
                  Available (
                  {
                    availableQuantity
                  }
                  )
                </span>
              </div>

              <div className="mt-6 space-y-3 text-sm text-app-text">
                <InfoLine
                  label="Serial Number"
                  value={
                    currentAsset
                      ?.serialNumber
                  }
                />

                <InfoLine
                  label="Invoice Number"
                  value={
                    currentAsset
                      ?.invoiceNumber
                  }
                />

                <InfoLine
                  label="Quantity"
                  value={
                    totalQuantity
                  }
                />

                <InfoLine
                  label="Assigned"
                  value={
                    assignedCount
                  }
                />

                <InfoLine
                  label="Available"
                  value={
                    availableQuantity
                  }
                />

                <InfoLine
                  label="Condition"
                  value={
                    currentAsset
                      ?.condition
                  }
                />

                <InfoLine
                  label="Purchase Date"
                  value={
                    currentAsset
                      ?.purchaseDate
                      ? new Date(
                          currentAsset.purchaseDate,
                        ).toLocaleDateString()
                      : "N/A"
                  }
                />

                <InfoLine
                  label="Warranty Expiry"
                  value={
                    currentAsset
                      ?.WarrantyExpiry
                      ? new Date(
                          currentAsset.WarrantyExpiry,
                        ).toLocaleDateString()
                      : "N/A"
                  }
                />

                <InfoLine
                  label="Price"
                  value={
                    currentAsset?.price
                      ? `${Number(
                          currentAsset.price,
                        ).toLocaleString()} SAR`
                      : "N/A"
                  }
                />
              </div>

              {/* Notes */}

              <div className="mt-6 rounded-lg border border-app-gray/10 p-4">
                <h4 className="flex items-center gap-2 font-semibold text-app-text">
                  <FiFileText className="text-app-brand" />

                  Notes
                </h4>

                <p className="mt-2 text-sm text-app-gray">
                  {currentAsset
                    ?.notes ||
                    "No notes added"}
                </p>
              </div>
            </div>

            {/* Right */}

            <div>
              <h4 className="mb-4 font-bold text-app-text">
                Quick Actions
              </h4>

              <div className="space-y-2">
                {/* Edit */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/dashboard/assets/update/${currentAsset.id}`,
                    )
                  }
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-app-gray/10 px-3 py-2.5 text-sm text-app-text transition-all hover:border-app-brand/20 hover:bg-app-brand/5"
                >
                  <FiEdit
                    size={16}
                  />

                  Edit Asset
                </button>

                {/* Delete */}

                <button
                  type="button"
                  onClick={
                    handleDeleteAsset
                  }
                  disabled={
                    deleteAssetMutation.isPending ||
                    hasActiveAssignment ||
                    hasDepartment
                  }
                  title={
                    hasDepartment
                      ? "Unassign this asset from all departments before deleting"
                      : hasActiveAssignment
                        ? "Unassign this asset before deleting"
                        : "Delete Asset"
                  }
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-red-500/10 px-3 py-2.5 text-sm text-red-500 transition-all hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiTrash2
                    size={16}
                  />

                  {deleteAssetMutation.isPending
                    ? "Deleting..."
                    : hasActiveAssignment ||
                        hasDepartment
                      ? "Unassign Before Delete"
                      : "Delete Asset"}
                </button>

                {/* Assign Employee */}

                <button
                  type="button"
                  onClick={
                    handleAssignEmployee
                  }
                  disabled={
                    isAssetRefreshing
                  }
                  className={`flex w-full items-center gap-2 rounded-lg border border-green-500/10 px-3 py-2.5 text-sm text-green-600 transition-all ${
                    isOutOfStock ||
                    isAssetRefreshing
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-green-500/5"
                  }`}
                >
                  <FiUserPlus
                    size={16}
                  />

                  Assign Employee
                </button>

                {/* Assign Department */}

                <button
                  type="button"
                  onClick={
                    handleAssignDepartment
                  }
                  disabled={
                    isAssetRefreshing
                  }
                  className={`flex w-full items-center gap-2 rounded-lg border border-blue-500/10 px-3 py-2.5 text-sm text-blue-600 transition-all ${
                    isOutOfStock ||
                    isAssetRefreshing
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-blue-500/5"
                  }`}
                >
                  <FiBarChart
                    size={16}
                  />

                  Assign Department
                </button>
              </div>

              {/* Assigned To */}

              <div className="mt-2 rounded-md border border-app-gray/10 p-2">
                <h4 className="text-sm font-semibold text-app-text">
                  Assigned To
                </h4>

                {/* Employee */}

                {hasActiveAssignment &&
                  activeAssignments.map(
                    (
                      assignment: any,
                    ) => (
                      <p
                        key={
                          assignment.id
                        }
                        className="text-xs italic text-app-gray"
                      >
                        {assignment
                          .employee
                          ?.fullName ||
                          "Unknown Employee"}
                      </p>
                    ),
                  )}

                {/* Departments */}

                {!hasActiveAssignment &&
                  hasDepartment &&
                  departmentAssignments.map(
                    (
                      assignment: any,
                    ) => (
                      <p
                        key={
                          assignment.id
                        }
                        className="text-xs italic text-app-gray"
                      >
                        {assignment
                          .department
                          ?.name ||
                          "Unknown Department"}
                      </p>
                    ),
                  )}

                {/* Nothing Assigned */}

                {!hasActiveAssignment &&
                  !hasDepartment && (
                    <p className="text-xs italic text-app-gray">
                      This asset is
                      not assigned
                    </p>
                  )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <SmallBox
                  icon={
                    <FiCalendar />
                  }
                  label="Created"
                  value={
                    currentAsset
                      ?.createdAt
                      ? new Date(
                          currentAsset.createdAt,
                        ).toLocaleDateString()
                      : "N/A"
                  }
                />

                <SmallBox
                  icon={
                    <FiDollarSign />
                  }
                  label="Value"
                  value={
                    currentAsset?.price
                      ? `${Number(
                          currentAsset.price,
                        ).toLocaleString()}`
                      : "N/A"
                  }
                />
              </div>
            </div>
          </div>

          {/* Footer */}

          <div className="flex justify-end border-t border-app-gray/10 px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-app-gray/10 bg-gray-800 px-4 py-2 text-sm font-medium text-app-secondary transition-all hover:bg-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Assign Employee */}

      {assignOpen &&
        !isOutOfStock && (
          <Asset_to_Employee
            asset={{
              ...currentAsset,
              availableQuantity,
            }}
            onClose={() =>
              setAssignOpen(false)
            }
          />
        )}

      {/* Assign Department */}

      {assignDepartmentOpen &&
        !isOutOfStock && (
          <Asset_to_Department
            asset={{
              ...currentAsset,
              availableQuantity,
            }}
            onClose={() =>
              setAssignDepartmentOpen(
                false,
              )
            }
          />
        )}
    </>
  );
}

const InfoLine = ({
  label,
  value,
}: {
  label: string;
  value: any;
}) => {
  return (
    <p>
      <span className="text-app-gray">
        {label}:{" "}
      </span>

      <b>
        {value === null ||
        value === undefined ||
        value === ""
          ? "N/A"
          : value}
      </b>
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

      <p className="mt-1 font-semibold text-app-text">
        {value}
      </p>
    </div>
  );
};