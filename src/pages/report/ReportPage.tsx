import { Helmet } from "react-helmet-async";
import { LuClipboardList } from "react-icons/lu";

import Allocation_Report from "../../components/Report_Compo/Allocation_Report";
import Select_Employee from "../../components/Report_Compo/Clearance_Paper/Select_Employee";
import Clearance_Records from "../../components/Report_Compo/Clearance_Records/Clearance_Records";

export default function ReportPage() {
  return (
    <div className="w-full py-8">
      <Helmet>
        <title>Reports | Asset Manager</title>
      </Helmet>

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-app-brand/10 text-app-brand">
            <LuClipboardList size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-app-text">
              Reports & Clearance
            </h1>

            <p className="mt-1 text-sm text-app-gray">
              Manage employee clearance, clearance records
              and asset allocation reports.
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          REPORT CONTENT
      ========================= */}

      <div>
        {/* <Report_count /> */}
      </div>

      <div>
        <Select_Employee />
        {/* <Report_Information /> */}
      </div>

      <div>
        <Clearance_Records />
      </div>

      <div>
        <Allocation_Report />
      </div>
    </div>
  );
}