import { useMemo } from "react";
import { useGetEmployee } from "../../context/useEmployee";

export default function Allocation_Report() {
  const { data: employees = [], isLoading } = useGetEmployee();

  const reportData = useMemo(() => {
    const departments: Record<string, any> = {};

    employees.forEach((employee: any) => {
      const department = employee.department || "Unassigned";

      if (!departments[department]) {
        departments[department] = {
          department,
          employees: 0,
          assets: 0,
          licenses: 0,
          totalValue: 0,
        };
      }

      const assets =
        employee.assetAssignments?.filter(
          (item: any) => !item.returnedAt,
        ) || [];

      const licenses =
        employee.licenseAssignments?.filter(
          (item: any) => !item.returnedAt,
        ) || [];

      const assetValue = assets.reduce(
        (sum: number, item: any) =>
          sum + Number(item.asset?.price || 0),
        0,
      );

      const licenseValue = licenses.reduce(
        (sum: number, item: any) =>
          sum + Number(item.license?.costs || 0),
        0,
      );

      departments[department].employees += 1;
      departments[department].assets += assets.length;
      departments[department].licenses += licenses.length;
      departments[department].totalValue +=
        assetValue + licenseValue;
    });

    return Object.values(departments).sort((a: any, b: any) =>
      a.department.localeCompare(b.department),
    );
  }, [employees]);

  const totalEmployees = reportData.reduce(
    (sum: number, item: any) => sum + item.employees,
    0,
  );

  const totalAssets = reportData.reduce(
    (sum: number, item: any) => sum + item.assets,
    0,
  );

  const totalLicenses = reportData.reduce(
    (sum: number, item: any) => sum + item.licenses,
    0,
  );

  const totalValue = reportData.reduce(
    (sum: number, item: any) => sum + item.totalValue,
    0,
  );

  if (isLoading) {
    return (
      <div className="my-10 rounded-xl border border-app-gray/20 bg-app-bg p-6 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full my-10 rounded-xl border border-app-gray/20 bg-app-bg p-4 text-app-text shadow-xs transition-colors duration-300 md:p-6">
      <div className="mb-6">
        <h2 className="text-base font-bold tracking-tight">
          Asset Allocation Report
        </h2>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-app-gray/10">
        <table className="min-w-175 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-app-gray/10 bg-app-brand/10 font-bold text-app-text">
              <th className="w-[25%] p-4 pl-6 text-left">
                Department
              </th>
              <th className="w-[18%] p-4 text-center">
                Employees
              </th>
              <th className="w-[18%] p-4 text-center">
                Assets
              </th>
              <th className="w-[18%] p-4 text-center">
                Licenses
              </th>
              <th className="w-[21%] p-4 pr-6 text-right">
                Total Value
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-app-gray/10">
            {reportData.map((row: any) => (
              <tr
                key={row.department}
                className="transition-colors hover:bg-app-gray/5"
              >
                <td className="p-4 pl-6 font-medium">
                  {row.department}
                </td>

                <td className="p-4 text-center font-medium text-app-gray">
                  {row.employees}
                </td>

                <td className="p-4 text-center font-medium text-app-gray">
                  {row.assets}
                </td>

                <td className="p-4 text-center font-medium text-app-gray">
                  {row.licenses}
                </td>

                <td className="p-4 pr-6 text-right">
                  {row.totalValue.toFixed(2)}
                </td>
              </tr>
            ))}

            <tr className="border-t-2 border-app-gray/20 bg-app-gray/5 font-bold">
              <td className="p-4 pl-6 uppercase">
                TOTAL
              </td>

              <td className="p-4 text-center">
                {totalEmployees}
              </td>

              <td className="p-4 text-center">
                {totalAssets}
              </td>

              <td className="p-4 text-center">
                {totalLicenses}
              </td>

              <td className="p-4 pr-6 text-right">
                {totalValue.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}