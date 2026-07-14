import { useState } from "react";
import Approved from "./Approved";
import Rejected from "./Rejected";
import Pending_Finance from "./Pending_Finance";
import Finalized from "./Finalized";
import { useGetReports } from "../../../context/useReport";

type TabType =
  | "approved"
  | "rejected"
  | "pending"
  | "finalized";

export default function Clearance_Records() {
  const [activeTab, setActiveTab] =
    useState<TabType>("approved");

  const { data, isLoading } = useGetReports();

  const reports = Array.isArray(data) ? data : [];

  const approvedReports = reports.filter(
    (item: any) => item.status === "APPROVED",
  );

  const rejectedReports = reports.filter(
    (item: any) => item.status === "REJECTED",
  );

  const pendingReports = reports.filter(
    (item: any) =>
      item.status === "PENDING_FINANCE",
  );

  const finalizedReports = reports.filter(
    (item: any) => item.status === "FINALIZED",
  );

  if (isLoading) {
    return (
      <div className="my-16 w-full rounded-xl border border-app-gray/20 bg-app-bg p-6 text-app-gray">
        Loading clearance records...
      </div>
    );
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "approved":
        return (
          <Approved reports={approvedReports} />
        );

      case "rejected":
        return (
          <Rejected reports={rejectedReports} />
        );

      case "pending":
        return (
          <Pending_Finance
            reports={pendingReports}
          />
        );

      case "finalized":
        return (
          <Finalized reports={finalizedReports} />
        );

      default:
        return null;
    }
  };

  return (
    <div className="my-16 w-full rounded-xl border border-app-gray/20 bg-app-bg p-4 text-app-text shadow-xs transition-colors duration-300 md:p-6">
      <h2 className="mb-5 text-base font-bold">
        Clearance Records
      </h2>

      <div className="scrollbar-none mb-6 flex overflow-x-auto whitespace-nowrap border-b border-app-gray/10">
        <div className="flex gap-6 text-sm font-medium">
          <button
            type="button"
            onClick={() =>
              setActiveTab("approved")
            }
            className={`cursor-pointer border-b-2 pb-3 transition-all ${
              activeTab === "approved"
                ? "border-app-brand font-semibold text-app-brand"
                : "border-transparent text-app-gray"
            }`}
          >
            Approved ({approvedReports.length})
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("rejected")
            }
            className={`cursor-pointer border-b-2 pb-3 transition-all ${
              activeTab === "rejected"
                ? "border-app-brand font-semibold text-app-brand"
                : "border-transparent text-app-gray"
            }`}
          >
            Rejected ({rejectedReports.length})
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("pending")
            }
            className={`cursor-pointer border-b-2 pb-3 transition-all ${
              activeTab === "pending"
                ? "border-app-brand font-semibold text-app-brand"
                : "border-transparent text-app-gray"
            }`}
          >
            Pending Finance (
            {pendingReports.length})
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("finalized")
            }
            className={`cursor-pointer border-b-2 pb-3 transition-all ${
              activeTab === "finalized"
                ? "border-app-brand font-semibold text-app-brand"
                : "border-transparent text-app-gray"
            }`}
          >
            Finalized ({finalizedReports.length})
          </button>
        </div>
      </div>

      <div className="w-full transition-all duration-200">
        {renderActiveComponent()}
      </div>
    </div>
  );
}