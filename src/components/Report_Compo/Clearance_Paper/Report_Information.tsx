import { FiCalendar, FiCheckCircle, FiInfo, FiLayers } from "react-icons/fi";

export default function Report_Information() {
  return (
    <div className="w-full bg-app-bg text-app-text p-6 border border-app-gray/20 rounded-xl transition-colors duration-300 space-y-6">
      {/* Main Header */}
      <div className="flex items-center gap-3">
        <FiCalendar size={22} className="text-amber-500" />
        <h2 className="text-xl font-bold">Report Information</h2>
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-app-gray/10 pb-3">
        {/* Total Reports */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-app-gray text-sm font-semibold">
            <FiCalendar size={16} className="text-blue-500" />
            <span>Total Reports</span>
          </div>
          <div className="text-4xl font-bold">4</div>
        </div>

        {/* Last 30 Days */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-app-gray text-sm font-semibold">
            <FiCheckCircle size={16} className="text-emerald-500" />
            <span>Last 30 Days</span>
          </div>
          <div className="text-4xl font-bold">4</div>
        </div>

        {/* Categories */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-app-gray text-sm font-semibold">
            <FiInfo size={16} className="text-purple-500" />
            <span>Categories</span>
          </div>
          <div className="text-4xl font-bold">1</div>
        </div>
      </div>

      {/* Detailed Info List */}
      <div className="space-y-6 pt-2">
        {/* What's Included */}
        <div className="flex items-start gap-4">
          <FiCheckCircle size={20} className="text-emerald-500 shrink-0 mt-1" />
          <div className="space-y-1">
            <h4 className="text-base font-bold">What's Included</h4>
            <p className="text-base text-app-gray opacity-80">
              This section displays comprehensive reports about your assets,
              licenses, and reports.
            </p>
          </div>
        </div>

        {/* Report Types */}
        <div className="flex items-start gap-4">
          <FiCalendar size={20} className="text-blue-500 shrink-0 mt-1" />

          <div className="space-y-2 flex items-center gap-4">
            <h4 className="text-base font-bold">Report Types</h4>
            <span className=" bg-app-brand/10 text-app-brand px-4 py-1.5 rounded-lg text-base font-semibold">
              Desktop
            </span>
          </div>
        </div>

        {/* Report Status */}
        <div className="flex items-start gap-4">
          <FiLayers size={20} className="text-amber-500 shrink-0 mt-1" />
          <div className="space-y-1">
            <h4 className="text-base font-bold">Report Status</h4>
            <p className="text-base text-app-gray opacity-80">
              You have 4 report(s) with 4 generated in the last 30 days.
            </p>
          </div>
        </div>
      </div>



    </div>
  );
}
