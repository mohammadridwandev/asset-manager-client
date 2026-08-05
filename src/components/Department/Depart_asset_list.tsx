import { useMemo } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiFileText,
  FiHash,
  FiPackage,
  FiSearch,
  FiTag,
} from "react-icons/fi";
import { Helmet } from "react-helmet-async";

import DataLoading from "../../DataLoading";
import { useGetDepartments } from "../../context/useDepartment";
import { useGetDepartmentAssets } from "../../context/useDepartmentAsset";

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

type DepartmentAssetType = {
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

export default function Depart_asset_list() {
  const navigate = useNavigate();

  const { departmentId } = useParams<{
    departmentId: string;
  }>();

  const selectedDepartmentId =
    Number(departmentId);

  const {
    data: departments = [],
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useGetDepartments();

  const {
    data: departmentAssets = [],
    isLoading: isAssetsLoading,
    isError: isAssetsError,
    isFetching,
  } = useGetDepartmentAssets();

  const department = departments.find(
    (item: DepartmentType) =>
      Number(item.id) ===
      selectedDepartmentId,
  );

  // এই department-এর সাথে assign করা assets
  const assets = useMemo(() => {
    if (
      Number.isNaN(
        selectedDepartmentId,
      ) ||
      !Array.isArray(departmentAssets)
    ) {
      return [];
    }

    return departmentAssets.filter(
      (asset: DepartmentAssetType) =>
        Array.isArray(
          asset.departmentAssignments,
        ) &&
        asset.departmentAssignments.some(
          (assignment) =>
            Number(
              assignment.departmentId,
            ) === selectedDepartmentId,
        ),
    );
  }, [
    departmentAssets,
    selectedDepartmentId,
  ]);

  // এই department-এর নির্দিষ্ট assignment record
  const getDepartmentAssignment = (
    asset: DepartmentAssetType,
  ) => {
    return asset.departmentAssignments?.find(
      (assignment) =>
        Number(assignment.departmentId) ===
        selectedDepartmentId,
    );
  };

  const totalAssetQuantity = assets.reduce(
    (
      total: number,
      asset: DepartmentAssetType,
    ) =>
      total +
      Number(asset.quantity || 0),
    0,
  );

  const totalAssetValue = assets.reduce(
    (
      total: number,
      asset: DepartmentAssetType,
    ) =>
      total +
      Number(asset.price || 0) *
        Number(asset.quantity || 0),
    0,
  );

  const formatMoney = (
    value?: number | null,
  ) => {
    return Number(
      value || 0,
    ).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (
    value?: string | null,
  ) => {
    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (
      Number.isNaN(date.getTime())
    ) {
      return "N/A";
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  };

  if (
    isDepartmentsLoading ||
    isAssetsLoading
  ) {
    return (
      <DataLoading
        title="Loading Department Assets"
        message="Fetching assigned asset information..."
      />
    );
  }

  if (
    isDepartmentsError ||
    isAssetsError
  ) {
    return (
      <div className="flex min-h-75 items-center justify-center text-lg font-medium text-red-500">
        Failed to load department
        assets.
      </div>
    );
  }

  if (
    Number.isNaN(
      selectedDepartmentId,
    ) ||
    !department
  ) {
    return (
      <div className="py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm font-semibold text-app-brand"
        >
          <FiArrowLeft size={17} />
          Back
        </button>

        <div className="rounded-md border border-red-500/20 bg-red-500/5 p-6 text-center text-sm font-medium text-red-500">
          Department not found.
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <Helmet>
        <title>
          Asset Manager |{" "}
          {department.name} Assets
        </title>
      </Helmet>

      <div className="py-4 md:py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm font-semibold text-app-gray transition-colors hover:text-app-brand"
        >
          <FiArrowLeft size={17} />
          Back to Departments
        </button>

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {department.name}
            </h1>

            <p className="mt-1 text-sm text-app-gray">
              Department assigned asset
              details
            </p>
          </div>

          {isFetching && (
            <span className="text-xs font-medium text-app-brand">
              Updating...
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Asset Records"
          value={assets.length}
          icon={
            <FiFileText size={18} />
          }
        />

        <SummaryCard
          label="Total Quantity"
          value={totalAssetQuantity}
          icon={
            <FiPackage size={18} />
          }
        />

        <SummaryCard
          label="Total Value"
          value={`${formatMoney(
            totalAssetValue,
          )} SAR`}
          icon={<FiTag size={18} />}
        />
      </div>

      {/* Asset List */}
      <div className="rounded-xl border border-app-gray/20 bg-app-bg shadow-xs">
        <div className="flex flex-col gap-2 border-b border-app-gray/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">
              Assigned Assets
            </h2>

            <p className="mt-1 text-sm text-app-gray">
              {assets.length} asset
              records,{" "}
              {totalAssetQuantity} total
              quantity
            </p>
          </div>

          <span className="w-fit rounded-md bg-app-brand/10 px-3 py-1.5 text-xs font-semibold text-app-brand">
            {department.name}
          </span>
        </div>

        {assets.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-app-gray/10 text-app-gray">
              <FiSearch size={22} />
            </div>

            <h3 className="mt-3 font-semibold">
              No assets assigned
            </h3>

            <p className="mt-1 text-sm text-app-gray">
              No assets are currently
              assigned to this department.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {assets.map(
              (
                asset: DepartmentAssetType,
              ) => {
                const assignment =
                  getDepartmentAssignment(
                    asset,
                  );

                return (
                  <div
                    key={asset.id}
                    className="rounded-lg border border-app-gray/20 bg-app-bg p-4 transition-all hover:border-app-brand hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-bold">
                          {asset.assetName}
                        </h3>

                        <p className="mt-1 text-sm text-app-gray">
                          {asset.assetType}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-md bg-app-brand/10 px-2.5 py-1 text-xs font-semibold text-app-brand">
                        Qty:{" "}
                        {asset.quantity}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3 border-t border-app-gray/15 pt-4">
                      <AssetInfo
                        icon={
                          <FiHash size={15} />
                        }
                        label="Serial Number"
                        value={
                          asset.serialNumber ||
                          "N/A"
                        }
                      />

                      <AssetInfo
                        icon={
                          <FiFileText
                            size={15}
                          />
                        }
                        label="Invoice Number"
                        value={
                          asset.invoiceNumber ||
                          "N/A"
                        }
                      />

                      <AssetInfo
                        icon={
                          <FiTag size={15} />
                        }
                        label="Condition"
                        value={
                          asset.condition ||
                          "N/A"
                        }
                      />

                      <AssetInfo
                        icon={
                          <FiCalendar
                            size={15}
                          />
                        }
                        label="Purchase Date"
                        value={formatDate(
                          asset.purchaseDate,
                        )}
                      />

                      <AssetInfo
                        icon={
                          <FiCalendar
                            size={15}
                          />
                        }
                        label="Assigned Date"
                        value={formatDate(
                          assignment?.assignedAt,
                        )}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-app-gray/15 pt-4">
                      <span className="text-sm text-app-gray">
                        Unit Price
                      </span>

                      <span className="font-semibold">
                        {formatMoney(
                          asset.price,
                        )}{" "}
                        SAR
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-app-gray">
                        Total
                      </span>

                      <span className="font-bold text-app-brand">
                        {formatMoney(
                          Number(
                            asset.price ||
                              0,
                          ) *
                            Number(
                              asset.quantity ||
                                0,
                            ),
                        )}{" "}
                        SAR
                      </span>
                    </div>

                    {asset.notes && (
                      <div className="mt-4 rounded-md bg-app-gray/5 p-3">
                        <p className="text-xs font-medium text-app-gray">
                          Notes
                        </p>

                        <p className="mt-1 text-sm">
                          {asset.notes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
}

type SummaryCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
};

const SummaryCard = ({
  label,
  value,
  icon,
}: SummaryCardProps) => {
  return (
    <div className="rounded-md border border-app-gray/20 bg-app-bg p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-app-brand/10 text-app-brand">
          {icon}
        </div>

        <div>
          <p className="text-xs text-app-gray">
            {label}
          </p>

          <p className="mt-1 font-bold">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

type AssetInfoProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

const AssetInfo = ({
  icon,
  label,
  value,
}: AssetInfoProps) => {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <div className="flex min-w-0 items-center gap-2 text-app-gray">
        {icon}

        <span>{label}</span>
      </div>

      <span className="max-w-45 truncate text-right font-medium">
        {value}
      </span>
    </div>
  );
};