import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiMonitor,
  FiXCircle,
} from "react-icons/fi";

export default function Report_Info({ reports }: { reports: any[] }) {
  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "APPROVED":
        return {
          label: "Approved",
          icon: <FiCheckCircle />,
          className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
        };

      case "REJECTED":
        return {
          label: "Rejected",
          icon: <FiXCircle />,
          className: "border-red-500/20 bg-red-500/10 text-red-500",
        };

      case "PENDING_FINANCE":
        return {
          label: "Pending Finance",
          icon: <FiClock />,
          className: "border-amber-500/20 bg-amber-500/10 text-amber-500",
        };

      case "FINALIZED":
        return {
          label: "Finalized",
          icon: <FiCheckCircle />,
          className: "border-blue-500/20 bg-blue-500/10 text-blue-500",
        };

      default:
        return {
          label: status || "Unknown",
          icon: <FiAlertCircle />,
          className: "border-app-gray/20 bg-app-gray/10 text-app-gray",
        };
    }
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="rounded-2xl border border-app-gray/15 bg-app-bg p-5 shadow-sm md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 border-b border-app-gray/10 pb-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-app-text">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-app-brand/10 text-app-brand">
              <FiFileText size={18} />
            </span>
            Reports & Device Condition
          </h3>

          <p className="mt-2 text-xs text-app-gray">
            Clearance report status, device condition and approval details
          </p>
        </div>

        <div className="rounded-full border border-app-gray/15 bg-app-gray/5 px-3 py-1.5 text-xs font-semibold text-app-gray">
          Total Reports: {reports?.length || 0}
        </div>
      </div>

      {reports?.length ? (
        <div className="space-y-4">
          {reports.map((report: any, index: number) => {
            const statusStyle = getStatusStyle(report.status);

            return (
              <article
                key={report.id}
                className="overflow-hidden rounded-xl border border-app-gray/15 bg-app-bg transition hover:border-app-brand/20 hover:shadow-sm"
              >
                {/* Report top section */}
                <div className="flex flex-col justify-between gap-4 border-b border-app-gray/10 bg-app-gray/5 p-4 md:flex-row md:items-start">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-app-gray/15 bg-app-bg px-2 py-1 text-[11px] font-semibold text-app-gray">
                        Report #{index + 1}
                      </span>

                      {report.reportType && (
                        <span className="rounded-md border border-app-brand/15 bg-app-brand/5 px-2 py-1 text-[11px] font-semibold text-app-brand">
                          {report.reportType}
                        </span>
                      )}
                    </div>

                    <h4 className="truncate text-base font-bold text-app-text">
                      {report.title || "Employee Clearance Report"}
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-app-gray">
                      {report.description ||
                        "No additional report description was provided."}
                    </p>
                  </div>

                  <span
                    className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyle.className}`}
                  >
                    {statusStyle.icon}
                    {statusStyle.label}
                  </span>
                </div>

                {/* Report details */}
                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
                  <ReportDetail
                    icon={<FiMonitor />}
                    label="Device Condition"
                    value={report.deviceCondition || "Not specified"}
                  />

                  <ReportDetail
                    icon={<FiCalendar />}
                    label="Created Date"
                    value={formatDate(report.createdAt)}
                  />

                  <ReportDetail
                    icon={<FiCalendar />}
                    label="Last Updated"
                    value={formatDate(report.updatedAt)}
                  />

                  <ReportDetail
                    icon={<FiFileText />}
                    label="Total Asset Value"
                    value={`SAR ${Number(
                      report.totalAssetPrice || 0,
                    ).toLocaleString()}`}
                  />
                </div>

                {/* Rejection reason */}
                {report.status === "REJECTED" && report.rejectionReason && (
                  <div className="mx-4 mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-red-500">
                      <FiAlertCircle />
                      Rejection Reason
                    </p>

                    <p className="mt-2 text-sm leading-6 text-app-text">
                      {report.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Assigned assets snapshot */}
                {Array.isArray(report.assignedAssets) &&
                  report.assignedAssets.length > 0 && (
                    <div className="border-t border-app-gray/10 px-4 py-4">
                      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-app-gray">
                        Assets Included in Report
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {report.assignedAssets.map(
                          (asset: any, assetIndex: number) => (
                            <span
                              key={asset.id || assetIndex}
                              className="rounded-lg border border-app-gray/15 bg-app-gray/5 px-3 py-2 text-xs font-medium text-app-text"
                            >
                              {asset.assetName ||
                                asset.name ||
                                `Asset ${assetIndex + 1}`}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-app-gray/20 bg-app-gray/5 px-6 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-app-brand/10 text-app-brand">
            <FiFileText size={22} />
          </div>

          <h4 className="mt-3 text-sm font-bold text-app-text">
            No reports available
          </h4>

          <p className="mt-1 text-xs text-app-gray">
            No clearance or device condition report has been created for this
            employee.
          </p>
        </div>
      )}
    </section>
  );
}

const ReportDetail = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="rounded-lg border border-app-gray/10 bg-app-gray/5 p-3">
      <p className="flex items-center gap-2 text-[11px] font-medium text-app-gray">
        <span className="text-app-brand">{icon}</span>

        {label}
      </p>

      <p className="mt-2 truncate text-sm font-semibold text-app-text">
        {value}
      </p>
    </div>
  );
};
