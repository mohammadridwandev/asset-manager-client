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
import { useDashboard } from "../../context/useDashboard.";
import { Helmet } from "react-helmet-async";


// UPDATED: one-file dashboard with dashboard API
export default function Dashboard() {
  // ========================= UPDATED: Dashboard API Data =========================
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useDashboard();

  // ========================= UPDATED: Employee Data =========================
  const totalEmployees =
    dashboardData?.employees?.totalEmployees || 0;

  const activeEmployees =
    dashboardData?.employees?.activeEmployees || 0;

  // ========================= UPDATED: Asset Data =========================
  const totalAssets =
    dashboardData?.assets?.totalAssets || 0;

  const assignedAssets =
    dashboardData?.assets?.assignedAssets || 0;

  const availableAssets =
    dashboardData?.assets?.availableAssets || 0;

  // ========================= UPDATED: License Data =========================
  const totalLicenses =
    dashboardData?.licenses?.totalLicenses || 0;

  const assignedLicenses =
    dashboardData?.licenses?.assignedLicenses || 0;

  const availableLicenses =
    dashboardData?.licenses?.availableLicenses || 0;

  // ========================= UPDATED: Report Data =========================
  const totalReports =
    dashboardData?.reports?.totalReports || 0;

  const approvedReports =
    dashboardData?.reports?.approvedReports || 0;

  const rejectedReports =
    dashboardData?.reports?.rejectedReports || 0;

  const pendingReports =
    dashboardData?.reports?.pendingReports || 0;

  const finalizedReports =
    dashboardData?.reports?.finalizedReports || 0;

  // ========================= UPDATED: Recent Assignments =========================
  const recentAssignments =
    dashboardData?.recentAssignments || [];

  // ========================= UPDATED: Loading =========================
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-app-bg text-app-text">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-app-brand/20 border-t-app-brand" />

          <p className="mt-4 text-sm text-app-gray">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ========================= UPDATED: Error =========================
  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-app-bg">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-sm text-red-500">
          Failed to load dashboard data.
        </div>
      </div>
    );
  }

  // ========================= UPDATED: Stats Cards =========================
  const stats = [
    {
      title: "Employees",
      value: totalEmployees,
      sub: `${activeEmployees} active employees`,
      icon: <FiUsers />,
    },
    {
      title: "Assets",
      value: totalAssets,
      sub: `${assignedAssets} assigned, ${availableAssets} available`,
      icon: <FiBox />,
    },
    {
      title: "Licenses",
      value: totalLicenses,
      sub: `${assignedLicenses} used, ${availableLicenses} available`,
      icon: <FiKey />,
    },
    {
      title: "Reports",
      value: totalReports,
      sub: `${totalReports} total reports`,
      icon: <FiFileText />,
    },
  ];

  // ========================= UPDATED: Asset Chart =========================
  const assetChart = [
    {
      name: "Assigned",
      total: assignedAssets,
    },
    {
      name: "Available",
      total: availableAssets,
    },
  ];

  // ========================= UPDATED: Report Chart =========================
  const reportChart = [
    {
      name: "Approved",
      total: approvedReports,
    },
    {
      name: "Rejected",
      total: rejectedReports,
    },
    {
      name: "Pending",
      total: pendingReports,
    },
    {
      name: "Finalized",
      total: finalizedReports,
    },
  ];

  return (


    <div className="min-h-screen space-y-8 bg-app-bg py-6 text-app-text">
      {/* UPDATED: Header */}

 <Helmet>
        <title>Asset Manager | Dashboard</title>
      </Helmet>


      <div>
        <h1 className="text-2xl font-bold">
          Dashboard Overview
        </h1>

        <p className="mt-1 text-sm text-app-gray">
          Simple overview of employees, assets, licenses,
          and reports.
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

              <h2 className="text-3xl font-bold">
                {item.value}
              </h2>
            </div>

            <h3 className="mt-5 font-semibold">
              {item.title}
            </h3>

            <p className="mt-1 text-sm text-app-gray">
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      {/* UPDATED: Dashboard Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* UPDATED: Recent Asset Assignments */}
          <div className="rounded-2xl border border-app-gray/15 bg-app-bg p-6 shadow-sm">
            <h3 className="mb-5 font-bold">
              Recent Asset Assignments
            </h3>

            {recentAssignments.length > 0 ? (
              <div className="space-y-3">
                {recentAssignments.map(
                  (item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-app-gray/10 p-4"
                    >
                      <div>
                        <h4 className="text-sm font-semibold">
                          {item.assetName}
                        </h4>

                        <p className="text-xs text-app-gray">
                          {item.assetType}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {item.employeeName}
                        </p>

                        <p className="text-xs text-app-gray">
                          {item.assignedAt
                            ? new Date(
                                item.assignedAt,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center text-sm text-app-gray">
                No recent assignments found
              </div>
            )}
          </div>

          {/* UPDATED: Report Chart */}
          <div className="rounded-2xl border border-app-gray/15 bg-app-bg p-6 shadow-sm">
            <h3 className="mb-5 font-bold">
              Report Status Overview
            </h3>

            <div className="h-[280px] w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
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
          {/* UPDATED: Asset Chart */}
          <div className="rounded-2xl border border-app-gray/15 bg-app-bg p-6 shadow-sm">
            <h3 className="mb-5 font-bold">
              Asset Summary
            </h3>

            <div className="h-[260px] w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
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

          {/* UPDATED: System Status */}
          <div className="rounded-2xl border border-app-gray/15 bg-app-bg p-6 shadow-sm">
            <h3 className="mb-5 font-bold">
              System Status
            </h3>

            <div className="space-y-4 text-sm">
              <StatusRow
                label="Assigned Assets"
                value={`${assignedAssets}`}
              />

              <StatusRow
                label="Available Assets"
                value={`${availableAssets}`}
              />

              <StatusRow
                label="License Used"
                value={`${assignedLicenses}`}
              />

              <StatusRow
                label="Available Licenses"
                value={`${availableLicenses}`}
              />
            </div>
          </div>

          {/* UPDATED: Notice */}
          <div className="flex gap-3 rounded-2xl border border-app-brand/20 bg-app-brand/10 p-5 text-app-brand">
            <FiAlertCircle className="mt-0.5 shrink-0" />

            <div>
              <h4 className="text-sm font-bold">
                Review Data Accuracy
              </h4>

              <p className="mt-1 text-xs leading-5">
                Please verify employee details, asset
                assignments, and license usage regularly.
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
    <span className="text-app-gray">
      {label}
    </span>

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