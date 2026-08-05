import { useMemo } from "react";
import DataLoading from "../../DataLoading";
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
  price?: number | null;
  departmentAssignments?: DepartmentAssignmentType[];
};

type ReportRowType = {
  departmentId: number | string;
  department: string;
  assetRecords: number;
  assetValue: number;
};

export default function Department_Asset_Allocation_Report() {
  const {
    data: departmentAssets = [],
    isLoading,
    isError,
    isFetching,
  } = useGetDepartmentAssets();

  const reportData = useMemo<ReportRowType[]>(() => {
    if (!Array.isArray(departmentAssets)) {
      return [];
    }

    const departmentMap = new Map<number | string, ReportRowType>();

    departmentAssets.forEach((asset: DepartmentAssetType) => {
      const assignments = Array.isArray(asset.departmentAssignments)
        ? asset.departmentAssignments
        : [];

      const totalValue = Number(asset.price || 0) * Number(asset.quantity || 0);

      // Unassigned asset
      if (assignments.length === 0) {
        const existingRow = departmentMap.get("unassigned");

        if (existingRow) {
          existingRow.assetRecords += 1;
          existingRow.assetValue += totalValue;
        } else {
          departmentMap.set("unassigned", {
            departmentId: "unassigned",
            department: "Unassigned",
            assetRecords: 1,
            assetValue: totalValue,
          });
        }

        return;
      }

      // Same asset can appear under multiple departments
      assignments.forEach((assignment: DepartmentAssignmentType) => {
        const department = assignment.department;

        if (!department) {
          return;
        }

        const existingRow = departmentMap.get(department.id);

        if (existingRow) {
          existingRow.assetRecords += 1;
          existingRow.assetValue += totalValue;
        } else {
          departmentMap.set(department.id, {
            departmentId: department.id,
            department: department.name,
            assetRecords: 1,
            assetValue: totalValue,
          });
        }
      });
    });

    return Array.from(departmentMap.values()).sort((first, second) => {
      if (first.departmentId === "unassigned") {
        return 1;
      }

      if (second.departmentId === "unassigned") {
        return -1;
      }

      return first.department.localeCompare(second.department);
    });
  }, [departmentAssets]);

  const summary = useMemo(() => {
    const assets = Array.isArray(departmentAssets) ? departmentAssets : [];

    const uniqueAssetRecords = assets.length;

    const totalAssetValue = assets.reduce(
      (total: number, asset: DepartmentAssetType) =>
        total + Number(asset.price || 0) * Number(asset.quantity || 0),
      0,
    );

    const assignedAssets = assets.filter(
      (asset: DepartmentAssetType) =>
        Array.isArray(asset.departmentAssignments) &&
        asset.departmentAssignments.length > 0,
    ).length;

    const unassignedAssets = uniqueAssetRecords - assignedAssets;

    const assignedDepartments = reportData.filter(
      (row) => row.departmentId !== "unassigned",
    ).length;

    const assignmentRecords = assets.reduce(
      (total: number, asset: DepartmentAssetType) =>
        total +
        (Array.isArray(asset.departmentAssignments)
          ? asset.departmentAssignments.length
          : 0),
      0,
    );

    return {
      uniqueAssetRecords,
      assignedAssets,
      unassignedAssets,
      assignedDepartments,
      assignmentRecords,
      totalAssetValue,
    };
  }, [departmentAssets, reportData]);

  const formatMoney = (value: number) => {
    return Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (isLoading) {
    return (
      <DataLoading
        title="Loading Department Asset Report"
        message="Preparing department asset allocation data..."
      />
    );
  }

  if (isError) {
    return (
      <div className="my-10 flex min-h-60 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-sm font-medium text-red-500">
        Failed to load department asset allocation report.
      </div>
    );
  }

  return (
    <div className="my-10 w-full rounded-xl border border-app-gray/20 bg-app-bg p-4 text-app-text shadow-xs md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-base font-bold tracking-tight">
            Department Asset Allocation Report
          </h2>

          <p className="mt-1 text-xs text-app-gray">
            Department-wise overview of assigned assets and total asset value.
          </p>

          <p className="mt-2 text-sm font-semibold text-app-brand">
            Total Departments: {summary.assignedDepartments}
          </p>
        </div>

        {isFetching && (
          <span className="text-xs font-medium text-app-brand">
            Updating...
          </span>
        )}
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <SummaryCard label="Asset Records" value={summary.uniqueAssetRecords} />

        <SummaryCard label="Assigned Assets" value={summary.assignedAssets} />

        <SummaryCard
          label="Unassigned Assets"
          value={summary.unassignedAssets}
        />

        <SummaryCard
          label="Assigned Departments"
          value={summary.assignedDepartments}
        />

        <SummaryCard
          label="Total Value"
          value={`${formatMoney(summary.totalAssetValue)} SAR`}
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border border-app-gray/10">
        <table className="w-full min-w-160 border-collapse text-sm">
          <thead>
            <tr className="border-b border-app-gray/10 bg-app-brand/10 font-bold text-app-text">
              <th className="p-4 pl-6 text-left">Department</th>

              <th className="p-4 text-center">Asset Records</th>

              <th className="p-4 pr-6 text-right">Total Asset Value</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-app-gray/10">
            {reportData.length > 0 ? (
              reportData.map((row) => (
                <tr
                  key={row.departmentId}
                  className="transition-colors hover:bg-app-gray/5"
                >
                  <td className="p-4 pl-6">
                    <span
                      className={
                        row.departmentId === "unassigned"
                          ? "font-semibold text-app-gray"
                          : "font-semibold"
                      }
                    >
                      {row.department}
                    </span>
                  </td>

                  <td className="p-4 text-center font-medium text-app-gray">
                    {row.assetRecords}
                  </td>

                  <td className="p-4 pr-6 text-right font-semibold">
                    {formatMoney(row.assetValue)} SAR
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-8 text-center text-app-gray">
                  No department asset allocation data found.
                </td>
              </tr>
            )}

            <tr className="border-t-2 border-app-gray/20 bg-app-gray/5 font-bold">
              <td className="p-4 pl-6 uppercase">Unique Asset Total</td>

              <td className="p-4 text-center">{summary.uniqueAssetRecords}</td>

              <td className="p-4 pr-6 text-right">
                {formatMoney(summary.totalAssetValue)} SAR
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-app-gray">
        An asset assigned to multiple departments appears in each related
        department row. The final total uses unique asset records to prevent
        duplicate counting.
      </p>
    </div>
  );
}

type SummaryCardProps = {
  label: string;
  value: string | number;
};

const SummaryCard = ({ label, value }: SummaryCardProps) => {
  return (
    <div className="rounded-md border border-app-gray/15 bg-app-gray/5 p-3">
      <p className="text-xs text-app-gray">{label}</p>

      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
};
