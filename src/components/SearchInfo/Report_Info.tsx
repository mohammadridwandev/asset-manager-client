import { FiFileText } from "react-icons/fi";

export default function Report_Info({ reports }: { reports: any[] }) {
  return (
    <section className="rounded-2xl border border-app-gray/15 bg-app-bg p-6 shadow-sm">
      <h3 className="mb-5 flex items-center gap-2 text-lg font-bold">
        <span className="text-app-brand">
          <FiFileText />
        </span>
        Reports & Device Condition
      </h3>

      {reports?.length ? (
        <div className="space-y-3">
          {reports.map((report: any) => (
            <div
              key={report.id}
              className="rounded-xl border border-app-gray/10 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div>
                <h4 className="font-bold">{report.title}</h4>

                <p className="text-sm text-app-gray">
                  {report.description || "No description"}
                </p>

                <p className="mt-1 text-xs text-app-gray">
                  Device Condition: {report.deviceCondition || "N/A"}
                </p>

                <p className="mt-1 text-xs text-app-gray">
                  Created:{" "}
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <span className="rounded-full border border-app-brand/20 bg-app-brand/10 px-3 py-1 text-xs font-bold text-app-brand">
                {report.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-app-gray/20 p-6 text-center text-sm text-app-gray">
          No reports found.
        </div>
      )}
    </section>
  );
}