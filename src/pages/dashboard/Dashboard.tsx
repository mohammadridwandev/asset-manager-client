import {
  FiUsers,
  FiBox,
  FiKey,
  FiFileText,
  FiAlertCircle,
} from "react-icons/fi";

import { useDashboard } from "../../context/useDashboard.";
import { Helmet } from "react-helmet-async";
import DataLoading from "../../DataLoading";

export default function Dashboard() {
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useDashboard();

  // Employee data
  const totalEmployees =
    dashboardData?.employees?.totalEmployees || 0;

  const activeEmployees =
    dashboardData?.employees?.activeEmployees || 0;

  // Asset data
  const totalAssets =
    dashboardData?.assets?.totalAssets || 0;

  const assignedAssets =
    dashboardData?.assets?.assignedAssets || 0;

  const availableAssets =
    dashboardData?.assets?.availableAssets || 0;

  // License data
  const totalLicenses =
    dashboardData?.licenses?.totalLicenses || 0;

  const assignedLicenses =
    dashboardData?.licenses?.assignedLicenses || 0;

  const availableLicenses =
    dashboardData?.licenses?.availableLicenses || 0;

  // Report data
  const totalReports =
    dashboardData?.reports?.totalReports || 0;

  // Recent assignments
  const recentAssignments =
    dashboardData?.recentAssignments || [];

  if (isLoading) {
    return (
      <DataLoading
      title="Loading Dashboard"
      message="Please wait while we fetch the dashboard data."
      
      ></DataLoading>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-100 items-center justify-center bg-app-bg">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-sm text-red-500">
          Failed to load dashboard data.
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen space-y-8 bg-app-bg py-6 text-app-text">
      <Helmet>
        <title>Asset Manager | Dashboard</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold">
          Dashboard Overview
        </h1>

        <p className="mt-1 text-sm text-app-gray">
          Simple overview of employees, assets, licenses, and reports.
        </p>
      </div>

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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
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
        </div>

        <div className="space-y-6">
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

          <div className="flex gap-3 rounded-2xl border border-app-brand/20 bg-app-brand/10 p-5 text-app-brand">
            <FiAlertCircle className="mt-0.5 shrink-0" />

            <div>
              <h4 className="text-sm font-bold">
                Review Data Accuracy
              </h4>

              <p className="mt-1 text-xs leading-5">
                Please verify employee details, asset assignments, and
                license usage regularly.
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
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-app-gray">
        {label}
      </span>

      <span className="rounded-full bg-app-brand/10 px-3 py-1 text-xs font-bold text-app-brand">
        {value}
      </span>
    </div>
  );
};