import {
  FiUsers,
  FiBox,
  FiKey,
  FiFileText,
  FiAlertCircle,
} from "react-icons/fi";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import { useGetEmployee } from "../../context/useEmployee";
import { useGetAssets } from "../../context/useAssets";
import { useLicenses } from "../../context/useLicenses";
import { useGetReports } from "../../context/useReport";

// UPDATED: one-file dashboard with your app theme colors
export default function Dashboard() {
  const { data: employees = [] } = useGetEmployee();
  const { data: assets = [] } = useGetAssets();
  const { data: licenses = [] } = useLicenses();
  const { data: reports = [] } = useGetReports();

  const assignedAssets = assets.filter(
    (asset: any) => asset.assignments?.length > 0 || asset.employeeId,
  ).length;

  const assignedLicenses = licenses.filter(
    (license: any) => license.assignments?.length > 0 || license.employeeId,
  ).length;

  const activeEmployees = employees.filter(
    (employee: any) => employee.status === "ACTIVE",
  ).length;

  const maintenanceAssets = assets.filter((asset: any) => {
    const condition = asset.condition?.toLowerCase();
    return condition === "damaged" || condition === "maintenance";
  }).length;

  const availableAssets = assets.length - assignedAssets;
  const availableLicenses = licenses.length - assignedLicenses;

  const stats = [
    {
      title: "Employees",
      value: employees.length,
      sub: `${activeEmployees} active employees`,
      icon: <FiUsers />,
    },
    {
      title: "Assets",
      value: assets.length,
      sub: `${assignedAssets} assigned, ${availableAssets} available`,
      icon: <FiBox />,
    },
    {
      title: "Licenses",
      value: licenses.length,
      sub: `${assignedLicenses} used, ${availableLicenses} available`,
      icon: <FiKey />,
    },
    {
      title: "Reports",
      value: reports.length,
      sub: `${reports.length} total reports`,
      icon: <FiFileText />,
    },
  ];

  const assetChart = [
    { name: "Assigned", total: assignedAssets },
    { name: "Available", total: availableAssets },
    { name: "Maintenance", total: maintenanceAssets },
  ];

  const reportChart = [
    {
      name: "Approved",
      total: reports.filter((r: any) => r.status === "APPROVED").length,
    },
    {
      name: "Rejected",
      total: reports.filter((r: any) => r.status === "REJECTED").length,
    },
    {
      name: "Pending",
      total: reports.filter(
        (r: any) => r.status === "PENDING" || r.status === "PENDING_FINANCE",
      ).length,
    },
    {
      name: "Finalized",
      total: reports.filter((r: any) => r.status === "FINALIZED").length,
    },
  ];

  const recentAssignments = assets
    .flatMap(
      (asset: any) =>
        asset.assignments?.map((assignment: any) => ({
          id: assignment.id,
          assetName: asset.assetName || asset.name || "Unknown Asset",
          assetType: asset.assetType || asset.type || "Unknown",
          employeeName:
            assignment.employee?.fullName || assignment.employeeName || "N/A",
          assignedAt: assignment.assignedAt || asset.assignedAt,
        })) || [],
    )
    .sort(
      (a: any, b: any) =>
        new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen space-y-8  bg-app-bg py-6 text-app-text ">

      {/* UPDATED: Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-app-gray">
          Simple overview of employees, assets, licenses, and reports.
        </p>
      </div>

      {/* UPDATED: Stats Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-app-gray/15 bg-app-bg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-app-brand/10 p-3 text-xl text-app-brand">
                {item.icon}
              </div>

              <h2 className="text-3xl font-bold">{item.value}</h2>
            </div>

            <h3 className="mt-5 font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-app-gray">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* UPDATED: Dashboard Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl border border-app-gray/15 bg-app-bg p-6 shadow-sm">
            <h3 className="mb-5 font-bold">Recent Asset Assignments</h3>

            {recentAssignments.length > 0 ? (
              <div className="space-y-3">
                {recentAssignments.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-app-gray/10 p-4"
                  >
                    <div>
                      <h4 className="text-sm font-semibold">
                        {item.assetName}
                      </h4>
                      <p className="text-xs text-app-gray">{item.assetType}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {item.employeeName}
                      </p>
                      <p className="text-xs text-app-gray">
                        {item.assignedAt
                          ? new Date(item.assignedAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center text-sm text-app-gray">
                No recent assignments found
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-app-gray/15 bg-app-bg p-6 shadow-sm">
            <h3 className="mb-5 font-bold">Report Status Overview</h3>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="var(--brand)"
                    fill="var(--brand)"
                    fillOpacity={0.18}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-app-gray/15 bg-app-bg p-6 shadow-sm">
            <h3 className="mb-5 font-bold">Asset Summary</h3>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    radius={[8, 8, 0, 0]}
                    fill="var(--brand)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-app-gray/15 bg-app-bg p-6 shadow-sm">
            <h3 className="mb-5 font-bold">System Status</h3>

            <div className="space-y-4 text-sm">
              <StatusRow
                label="Assets Health"
                value={maintenanceAssets > 0 ? "Review" : "Good"}
                danger={maintenanceAssets > 0}
              />
              <StatusRow label="License Used" value={`${assignedLicenses}`} />
              <StatusRow label="Available Assets" value={`${availableAssets}`} />
              <StatusRow
                label="Available Licenses"
                value={`${availableLicenses}`}
              />
            </div>
          </div>

          <div className="flex gap-3 rounded-2xl border border-app-brand/20 bg-app-brand/10 p-5 text-app-brand">
            <FiAlertCircle className="mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">Review Data Accuracy</h4>
              <p className="mt-1 text-xs leading-5">
                Please verify employee details, asset condition, and license
                usage regularly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatusRow = ({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-app-gray">{label}</span>

    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        danger
          ? "bg-orange-500/10 text-orange-500"
          : "bg-app-brand/10 text-app-brand"
      }`}
    >
      {value}
    </span>
  </div>
);