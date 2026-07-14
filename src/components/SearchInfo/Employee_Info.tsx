import {
  FiActivity,
  FiCalendar,
  FiCpu,
  FiFileText,
  FiHash,
  FiMail,
  FiMonitor,
  FiPhone,
  FiShield,
} from "react-icons/fi";

export default function Employee_Info({ data }: { data: any }) {
  const employee = data.employee;
  const summary = data.summary;

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_LINK;

  const getImageUrl = (image?: string) => {
    if (!image) return "";
    return image.startsWith("http") ? image : `${API_BASE_URL}${image}`;
  };

  return (
    <section className="rounded-2xl border border-app-gray/15 bg-app-bg p-5 md:p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-app-gray/10 pb-4">
        <div>
          <h3 className="text-lg font-bold">Employee Information</h3>
          <p className="mt-1 text-xs text-app-gray">
            Basic profile, contact details and current assignment summary
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
        <div className="rounded-2xl border border-app-gray/10 bg-app-gray/5 p-5">
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border border-app-gray/20 bg-app-brand/10 flex items-center justify-center">
              {employee.image ? (
                <img
                  src={getImageUrl(employee.image)}
                  alt={employee.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-app-brand">
                  {employee.fullName?.charAt(0)}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <h2 className="text-xl font-bold">{employee.fullName}</h2>

              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold border ${
                  employee.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }`}
              >
                {employee.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-app-gray">
              {employee.position || "No Position"}
            </p>

            <p className="text-xs text-app-gray">
              {employee.department || "No Department"}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoCard icon={<FiMail />} label="Email" value={employee.email || "N/A"} />
            <InfoCard icon={<FiPhone />} label="Phone" value={employee.phoneNumber || "N/A"} />
            <InfoCard icon={<FiHash />} label="Iqama ID" value={employee.iqamaNumber || "N/A"} />
            <InfoCard
              icon={<FiCalendar />}
              label="Join Date"
              value={
                employee.joinDate
                  ? new Date(employee.joinDate).toLocaleDateString()
                  : "N/A"
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
            <SummaryCard icon={<FiMonitor />} title="Assets" value={summary.totalAssets} />
            <SummaryCard icon={<FiShield />} title="Licenses" value={summary.totalLicenses} />
            <SummaryCard icon={<FiFileText />} title="Reports" value={summary.totalReports} />
            <SummaryCard
              icon={<FiCpu />}
              title="Asset Value"
              value={`SAR ${Number(summary.totalAssetPrice || 0).toLocaleString()}`}
            />
            <SummaryCard
              icon={<FiActivity />}
              title="License Cost"
              value={`SAR ${Number(summary.totalLicenseCost || 0).toLocaleString()}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const InfoCard = ({ icon, label, value }: any) => (
  <div className="rounded-xl border border-app-gray/10 bg-app-bg p-4">
    <p className="flex items-center gap-2 text-xs font-medium text-app-gray">
      <span className="text-app-brand">{icon}</span>
      {label}
    </p>
    <p className="mt-1 truncate text-sm font-semibold text-app-text">{value}</p>
  </div>
);

const SummaryCard = ({ icon, title, value }: any) => (
  <div className="rounded-xl border border-app-gray/10 bg-app-gray/5 p-4">
    <div className="text-app-brand">{icon}</div>
    <p className="mt-2 text-xs text-app-gray">{title}</p>
    <h3 className="mt-1 truncate text-base font-bold">{value}</h3>
  </div>
);