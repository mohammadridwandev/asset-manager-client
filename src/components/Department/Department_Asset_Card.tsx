import {
  FiChevronDown,
  FiEdit2,
  FiSearch,
  FiSend,
  FiTrash2,
} from "react-icons/fi";

import Swal from "sweetalert2";

import {
  useDeleteDepartmentAsset,
} from "../../context/useDepartmentAsset";

import {
  useDeleteAsset,
} from "../../context/useAssets";

type DepartmentType = {
  id: number;
  name: string;
};

type DepartmentAssignmentType = {
  id: number;
  departmentAssetId: number;
  departmentId: number;
  assignedAt: string;

  department: DepartmentType;
};

export type DepartmentAssetType = {
  id: number;
  assetName: string;
  assetType: string;
  serialNumber?: string | null;
  quantity: number;
  invoiceNumber?: string | null;
  purchaseDate: string;
  price?: number | null;
  condition?: string | null;
  notes?: string | null;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;

  departmentAssignments?: DepartmentAssignmentType[];
};

type RegularAssetType = {
  id: number;
  assetName: string;
  assetType: string;
  serialNumber?: string | null;
  quantity: number;
  invoiceNumber?: string | null;
  purchaseDate: string;
  price?: number | null;
  condition?: string | null;
  notes?: string | null;

  departmentId?: number | null;

  department?: {
    id: number;
    name: string;
  } | null;
};

type Props = {
  // Department থেকে manually add করা asset
  assets: DepartmentAssetType[];

  // Main Asset / Employee Asset থেকে Department-এ assign করা asset
  regularAssets?: RegularAssetType[];

  onEdit: (
    asset: DepartmentAssetType,
  ) => void;

  onAssign: (
    asset: DepartmentAssetType,
  ) => void;
};

export default function Department_Asset_Card({
  assets,
  regularAssets = [],
  onEdit,
  onAssign,
}: Props) {
  const {
    mutateAsync: deleteDepartmentAsset,
    isPending: isDeletingDepartmentAsset,
  } = useDeleteDepartmentAsset();

  const {
    mutateAsync: deleteRegularAsset,
    isPending: isDeletingRegularAsset,
  } = useDeleteAsset();

  // =========================
  // DEPARTMENT ASSET DELETE
  // =========================
  const handleDeleteDepartmentAsset =
    async (
      asset: DepartmentAssetType,
    ) => {
      const confirmation =
        await Swal.fire({
          title:
            "Delete department asset?",

          text: `"${asset.assetName}" will be removed.`,

          icon: "warning",

          showCancelButton: true,

          confirmButtonText:
            "Yes, delete",

          cancelButtonText:
            "Cancel",
        });

      if (
        !confirmation.isConfirmed
      ) {
        return;
      }

      try {
        await deleteDepartmentAsset(
          String(asset.id),
        );
      } catch (error) {
        console.error(
          "Delete Department Asset Error:",
          error,
        );
      }
    };

  // =========================
  // REGULAR ASSET DELETE
  // =========================
  const handleDeleteRegularAsset =
    async (
      asset: RegularAssetType,
    ) => {
      const confirmation =
        await Swal.fire({
          title: "Delete asset?",

          text: `"${asset.assetName}" will be removed.`,

          icon: "warning",

          showCancelButton: true,

          confirmButtonText:
            "Yes, delete",

          cancelButtonText:
            "Cancel",
        });

      if (
        !confirmation.isConfirmed
      ) {
        return;
      }

      try {
        await deleteRegularAsset(
          String(asset.id),
        );
      } catch (error) {
        console.error(
          "Delete Asset Error:",
          error,
        );
      }
    };

  // =========================
  // DEPARTMENT ASSIGNMENTS
  // =========================
  const getAssignedDepartments = (
    asset: DepartmentAssetType,
  ) => {
    if (
      !Array.isArray(
        asset.departmentAssignments,
      )
    ) {
      return [];
    }

    return asset.departmentAssignments
      .map(
        (assignment) =>
          assignment.department,
      )
      .filter(Boolean);
  };

  const totalAssets =
    assets.length +
    regularAssets.length;

  return (
    <div className="overflow-hidden rounded-xl border border-app-gray/20 bg-app-bg shadow-xs">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-app-gray/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">
            Department Asset List
          </h2>

          <p className="mt-1 text-sm text-app-gray">
            Department assets and
            assigned company assets
          </p>
        </div>

        <span className="w-fit rounded-md bg-app-brand/10 px-3 py-1.5 text-xs font-semibold text-app-brand">
          Total {totalAssets} Assets
        </span>
      </div>

      {totalAssets === 0 ? (
        <div className="flex min-h-55 flex-col items-center justify-center px-4 text-center">
          <FiSearch
            size={28}
            className="mb-4 text-app-gray"
          />

          <h3 className="font-bold">
            No department assets found
          </h3>

          <p className="mt-1 text-sm text-app-gray">
            Add or assign an asset to a
            department.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-300 text-left">
            <thead className="border-b border-app-gray/20 bg-app-gray/5 text-sm">
              <tr>
                <th className="px-5 py-4 font-semibold">
                  Asset
                </th>

                <th className="px-5 py-4 font-semibold">
                  Type
                </th>

                <th className="px-5 py-4 font-semibold">
                  Serial
                </th>

                <th className="px-5 py-4 font-semibold">
                  Quantity
                </th>

                <th className="px-5 py-4 font-semibold">
                  Price
                </th>

                <th className="px-5 py-4 font-semibold">
                  Condition
                </th>

                <th className="px-5 py-4 font-semibold">
                  Department
                </th>

                <th className="px-5 py-4 font-semibold">
                  Source
                </th>

                <th className="px-5 py-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-app-gray/15">
              {/* ========================================
                  DEPARTMENT ASSETS
              ======================================== */}

              {assets.map(
                (
                  asset: DepartmentAssetType,
                ) => {
                  const assignedDepartments =
                    getAssignedDepartments(
                      asset,
                    );

                  const isAssigned =
                    assignedDepartments.length >
                    0;

                  return (
                    <tr
                      key={`department-${asset.id}`}
                      className="transition-colors hover:bg-app-gray/5"
                    >
                      {/* Asset */}
                      <td className="px-5 py-4">
                        <p className="max-w-50 truncate font-bold">
                          {
                            asset.assetName
                          }
                        </p>

                        <p className="mt-1 max-w-50 truncate text-xs text-app-gray">
                          {asset.invoiceNumber ||
                            "No invoice"}
                        </p>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4 text-sm">
                        <span className="block max-w-40 truncate">
                          {
                            asset.assetType
                          }
                        </span>
                      </td>

                      {/* Serial */}
                      <td className="px-5 py-4 text-sm">
                        <span className="block max-w-42 truncate">
                          {asset.serialNumber ||
                            "N/A"}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="px-5 py-4 text-sm font-semibold">
                        {asset.quantity}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 text-sm whitespace-nowrap">
                        {asset.price !==
                          null &&
                        asset.price !==
                          undefined
                          ? `${Number(
                              asset.price,
                            ).toFixed(
                              2,
                            )} SAR`
                          : "0.00 SAR"}
                      </td>

                      {/* Condition */}
                      <td className="px-5 py-4">
                        <span className="inline-flex max-w-32 truncate rounded-md bg-app-gray/10 px-2.5 py-1 text-xs font-medium">
                          {asset.condition ||
                            "N/A"}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="px-5 py-4">
                        {isAssigned ? (
                          <div className="relative w-45">
                            <select
                              defaultValue=""
                              aria-label="Assigned departments"
                              className="w-full cursor-pointer appearance-none rounded-md border border-app-brand/20 bg-app-brand/5 py-2 pr-9 pl-3 text-xs font-semibold text-app-brand outline-none"
                            >
                              <option
                                value=""
                                disabled
                              >
                                {assignedDepartments.length ===
                                1
                                  ? assignedDepartments[0]
                                      .name
                                  : `${assignedDepartments.length} Departments`}
                              </option>

                              {assignedDepartments.map(
                                (
                                  department,
                                ) => (
                                  <option
                                    key={
                                      department.id
                                    }
                                    value={
                                      department.id
                                    }
                                  >
                                    {
                                      department.name
                                    }
                                  </option>
                                ),
                              )}
                            </select>

                            <FiChevronDown
                              size={15}
                              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-app-brand"
                            />
                          </div>
                        ) : (
                          <span className="inline-flex rounded-md border border-app-gray/20 bg-app-gray/5 px-3 py-1.5 text-xs font-semibold text-app-gray">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600">
                          Department Asset
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onEdit(
                                asset,
                              )
                            }
                            title="Edit Asset"
                            className="rounded-md border border-app-gray/20 p-2 text-app-gray transition-colors hover:border-app-brand hover:bg-app-brand/5 hover:text-app-brand"
                          >
                            <FiEdit2
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onAssign(
                                asset,
                              )
                            }
                            title={
                              isAssigned
                                ? "Manage Departments"
                                : "Assign Department"
                            }
                            className={`rounded-md border p-2 transition-colors ${
                              isAssigned
                                ? "border-app-brand/30 bg-app-brand/5 text-app-brand hover:bg-app-brand/10"
                                : "border-app-gray/20 text-app-gray hover:border-app-brand hover:text-app-brand"
                            }`}
                          >
                            <FiSend
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            disabled={
                              isDeletingDepartmentAsset
                            }
                            onClick={() =>
                              handleDeleteDepartmentAsset(
                                asset,
                              )
                            }
                            title="Delete Asset"
                            className="rounded-md border border-red-500/20 p-2 text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FiTrash2
                              size={16}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                },
              )}

              {/* ========================================
                  REGULAR / EMPLOYEE ASSETS
              ======================================== */}

              {regularAssets.map(
                (
                  asset: RegularAssetType,
                ) => (
                  <tr
                    key={`regular-${asset.id}`}
                    className="transition-colors hover:bg-app-gray/5"
                  >
                    {/* Asset */}
                    <td className="px-5 py-4">
                      <p className="max-w-50 truncate font-bold">
                        {
                          asset.assetName
                        }
                      </p>

                      <p className="mt-1 max-w-50 truncate text-xs text-app-gray">
                        {asset.invoiceNumber ||
                          "No invoice"}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4 text-sm">
                      <span className="block max-w-40 truncate">
                        {
                          asset.assetType
                        }
                      </span>
                    </td>

                    {/* Serial */}
                    <td className="px-5 py-4 text-sm">
                      <span className="block max-w-42 truncate">
                        {asset.serialNumber ||
                          "N/A"}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="px-5 py-4 text-sm font-semibold">
                      {asset.quantity}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 text-sm whitespace-nowrap">
                      {asset.price !==
                        null &&
                      asset.price !==
                        undefined
                        ? `${Number(
                            asset.price,
                          ).toFixed(
                            2,
                          )} SAR`
                        : "0.00 SAR"}
                    </td>

                    {/* Condition */}
                    <td className="px-5 py-4">
                      <span className="inline-flex max-w-32 truncate rounded-md bg-app-gray/10 px-2.5 py-1 text-xs font-medium">
                        {asset.condition ||
                          "N/A"}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="px-5 py-4">
                      {asset.department ? (
                        <span className="inline-flex rounded-md border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-600">
                          {
                            asset.department
                              .name
                          }
                        </span>
                      ) : (
                        <span className="inline-flex rounded-md border border-app-gray/20 bg-app-gray/5 px-3 py-1.5 text-xs font-semibold text-app-gray">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Source */}
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-md bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-600">
                        Main Asset
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={
                            isDeletingRegularAsset
                          }
                          onClick={() =>
                            handleDeleteRegularAsset(
                              asset,
                            )
                          }
                          title="Delete Asset"
                          className="rounded-md border border-red-500/20 p-2 text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FiTrash2
                            size={16}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}