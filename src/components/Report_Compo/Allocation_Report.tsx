import DataLoading from "../../DataLoading";
import { useGetAllocationReport } from "../../context/useReport";

export default function Allocation_Report() {
  const { data, isLoading, isError, isFetching } = useGetAllocationReport();

  const reportData = data?.reportData || [];

  const summary = data?.summary || {
    employees: 0,
    assets: 0,
    assetValue: 0,
  };

  const formatMoney = (value: number) => {
    return Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (isLoading) {
    return (
      <DataLoading
        title="Loading Allocation Report"
        message="Please wait while we prepare the allocation report."
      />
    );
  }

  if (isError) {
    return (
      <div className="my-10 flex min-h-60 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-sm font-medium text-red-500">
        Failed to load allocation report.
      </div>
    );
  }

  return (
    <div className="my-10 w-full rounded-xl border border-app-gray/20 bg-app-bg p-4 text-app-text shadow-xs transition-colors duration-300 md:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>

       
<h2 className="text-base font-bold tracking-tight">
  Employee and Asset Allocation Report
</h2>

<p className="mt-1 text-xs text-app-gray">
  Department-wise overview of employee count, assigned assets, and total asset value.
</p>




          {/* ========================= UPDATED: TOTAL DEPARTMENTS ========================= */}
          <p className="mt-2 text-sm font-semibold text-app-brand">
            Total Departments: {reportData.length}
          </p>
        </div>

        {isFetching && (
          <span className="text-xs font-medium text-app-brand">
            Updating...
          </span>
        )}
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-app-gray/10">
        <table className="w-full min-w-180 border-collapse text-sm">
          <thead>
            <tr className="border-b border-app-gray/10 bg-app-brand/10 font-bold text-app-text">
              <th className="p-4 pl-6 text-left">Department</th>

              <th className="p-4 text-center">Employees</th>

              <th className="p-4 text-center">Assets</th>

              <th className="p-4 pr-6 text-right">Total Asset Value</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-app-gray/10">
            {reportData.length > 0 ? (
              reportData.map((row: any) => (
                <tr
                  key={row.department}
                  className="transition-colors hover:bg-app-gray/5"
                >
                  <td className="p-4 pl-6 font-medium">{row.department}</td>

                  <td className="p-4 text-center font-medium text-app-gray">
                    {row.employees}
                  </td>

                  <td className="p-4 text-center font-medium text-app-gray">
                    {row.assets}
                  </td>

                  <td className="p-4 pr-6 text-right font-semibold">
                    {formatMoney(row.assetValue)} SAR
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-app-gray">
                  No allocation data found.
                </td>
              </tr>
            )}

            <tr className="border-t-2 border-app-gray/20 bg-app-gray/5 font-bold">
              <td className="p-4 pl-6 uppercase">Total</td>

              <td className="p-4 text-center">{summary.employees}</td>

              <td className="p-4 text-center">{summary.assets}</td>

              <td className="p-4 pr-6 text-right">
                {formatMoney(summary.assetValue)} SAR
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
