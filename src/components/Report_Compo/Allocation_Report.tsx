import DataLoading from "../../DataLoading";

import {
  useGetAllocationReport,
} from "../../context/useReport";


export default function Allocation_Report() {
  const {
    data,
    isLoading,
    isError,
    isFetching,
  } =
    useGetAllocationReport();


  const reportData =
    data?.reportData || [];


  const summary =
    data?.summary || {
      employees: 0,
      employeeAssets: 0,
      departmentAssets: 0,
      assets: 0,
      employeeAssetValue: 0,
      departmentAssetValue: 0,
      assetValue: 0,
    };


  // Money format
  const formatMoney = (
    value: number,
  ) => {
    return Number(
      value || 0,
    ).toLocaleString(
      "en-US",
      {
        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2,
      },
    );
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
        Failed to load allocation
        report.
      </div>
    );
  }


  return (
    <div className="my-10 w-full rounded-xl border border-app-gray/20 bg-app-bg p-4 text-app-text shadow-xs transition-colors duration-300 md:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h2 className="text-base font-bold tracking-tight">
            Department Asset
            Allocation Report
          </h2>

          <p className="mt-1 text-xs text-app-gray">
            Department-wise overview
            of employees, employee
            assets, direct department
            assets, and total asset
            value.
          </p>

          <p className="mt-2 text-sm font-semibold text-app-brand">
            Total Departments:{" "}
            {
              reportData.length
            }
          </p>
        </div>


        {isFetching && (
          <span className="text-xs font-medium text-app-brand">
            Updating...
          </span>
        )}

      </div>


      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">

        {/* Employees */}
        <div className="rounded-lg border border-app-gray/10 bg-app-gray/3 p-4">
          <p className="text-xs font-medium text-app-gray">
            Employees
          </p>

          <p className="mt-1 text-xl font-bold text-app-text">
            {
              summary.employees ??
              0
            }
          </p>
        </div>


        {/* Employee Assets */}
        <div className="rounded-lg border border-app-gray/10 bg-app-gray/3 p-4">
          <p className="text-xs font-medium text-app-gray">
            Employee Assets
          </p>

          <p className="mt-1 text-xl font-bold text-app-text">
            {
              summary.employeeAssets ??
              0
            }
          </p>
        </div>


        {/* Department Assets */}
        <div className="rounded-lg border border-app-gray/10 bg-app-gray/3 p-4">
          <p className="text-xs font-medium text-app-gray">
            Assigned Department Assets
          </p>

          <p className="mt-1 text-xl font-bold text-app-text">
            {
              summary.departmentAssets ??
              0
            }
          </p>
        </div>


        {/* Total Assets */}
        <div className="rounded-lg border border-app-brand/20 bg-app-brand/5 p-4">
          <p className="text-xs font-medium text-app-gray">
            Total Assets
          </p>

          <p className="mt-1 text-xl font-bold text-app-brand">
            {
              summary.assets ??
              0
            }
          </p>
        </div>

      </div>


      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border border-app-gray/10">

        <table className="w-full min-w-300 border-collapse text-sm">

          {/* Table Header */}
          <thead>
            <tr className="border-b border-app-gray/10 bg-app-brand/10 font-bold text-app-text">

              <th className="p-4 pl-6 text-left">
                Department
              </th>

              <th className="p-4 text-center">
                Employees
              </th>

              <th className="p-4 text-center">
                Employee Assets
              </th>

              <th className="p-4 text-center">
                Assigned Department Assets
              </th>

              <th className="p-4 text-center">
                Total Assets
              </th>

              <th className="p-4 text-right">
                Employee Asset Value
              </th>

              <th className="p-4 text-right">
                Department Asset Value
              </th>

              <th className="p-4 pr-6 text-right">
                Total Asset Value
              </th>

            </tr>
          </thead>


          {/* Table Body */}
          <tbody className="divide-y divide-app-gray/10">

            {reportData.length >
            0 ? (
              reportData.map(
                (
                  row: any,
                ) => {
                  // Employee assets
                  const employeeAssets =
                    Number(
                      row.employeeAssets ||
                        0,
                    );


                  // Assigned Department Assets
                  const departmentAssets =
                    Number(
                      row.departmentAssets ||
                        0,
                    );


                  // Total assets
                  const totalAssets =
                    row.assets !==
                      undefined &&
                    row.assets !==
                      null
                      ? Number(
                          row.assets,
                        )
                      : employeeAssets +
                        departmentAssets;


                  // Employee asset value
                  const employeeAssetValue =
                    Number(
                      row.employeeAssetValue ||
                        0,
                    );


                  // Department asset value
                  const departmentAssetValue =
                    Number(
                      row.departmentAssetValue ||
                        0,
                    );


                  // Total value
                  const totalAssetValue =
                    row.assetValue !==
                      undefined &&
                    row.assetValue !==
                      null
                      ? Number(
                          row.assetValue,
                        )
                      : employeeAssetValue +
                        departmentAssetValue;


                  return (
                    <tr
                      key={
                        row.department
                      }
                      className="transition-colors hover:bg-app-gray/5"
                    >

                      {/* Department */}
                      <td className="p-4 pl-6">
                        <div className="font-semibold text-app-text">
                          {
                            row.department ||
                            "Unknown Department"
                          }
                        </div>
                      </td>


                      {/* Employees */}
                      <td className="p-4 text-center">
                        <span className="inline-flex min-w-9 items-center justify-center rounded-md bg-app-gray/10 px-2 py-1 text-xs font-semibold text-app-text">
                          {
                            row.employees ??
                            0
                          }
                        </span>
                      </td>


                      {/* Employee Assets */}
                      <td className="p-4 text-center">
                        <span className="inline-flex min-w-9 items-center justify-center rounded-md border border-green-500/20 bg-green-500/5 px-2 py-1 text-xs font-semibold text-green-600">
                          {
                            employeeAssets
                          }
                        </span>
                      </td>


                      {/* Assigned Department Assets */}
                      <td className="p-4 text-center">
                        <span className="inline-flex min-w-9 items-center justify-center rounded-md border border-blue-500/20 bg-blue-500/5 px-2 py-1 text-xs font-semibold text-blue-600">
                          {
                            departmentAssets
                          }
                        </span>
                      </td>


                      {/* Total Assets */}
                      <td className="p-4 text-center">
                        <span className="inline-flex min-w-9 items-center justify-center rounded-md bg-app-brand/10 px-2 py-1 text-xs font-bold text-app-brand">
                          {
                            totalAssets
                          }
                        </span>
                      </td>


                      {/* Employee Asset Value */}
                      <td className="p-4 text-right font-medium text-app-gray">
                        {formatMoney(
                          employeeAssetValue,
                        )}{" "}
                        SAR
                      </td>


                      {/* Department Asset Value */}
                      <td className="p-4 text-right font-medium text-app-gray">
                        {formatMoney(
                          departmentAssetValue,
                        )}{" "}
                        SAR
                      </td>


                      {/* Total Asset Value */}
                      <td className="p-4 pr-6 text-right font-semibold text-app-text">
                        {formatMoney(
                          totalAssetValue,
                        )}{" "}
                        SAR
                      </td>

                    </tr>
                  );
                },
              )
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="p-10 text-center"
                >
                  <p className="text-sm font-medium text-app-text">
                    No allocation data
                    found
                  </p>

                  <p className="mt-1 text-xs text-app-gray">
                    Department allocation
                    information is not
                    available.
                  </p>
                </td>
              </tr>
            )}


            {/* Total */}
            <tr className="border-t-2 border-app-gray/20 bg-app-gray/5 font-bold">

              <td className="p-4 pl-6 uppercase text-app-text">
                Total
              </td>


              {/* Employees */}
              <td className="p-4 text-center">
                {
                  summary.employees ??
                  0
                }
              </td>


              {/* Employee Assets */}
              <td className="p-4 text-center">
                {
                  summary.employeeAssets ??
                  0
                }
              </td>


              {/* Department Assets */}
              <td className="p-4 text-center">
                {
                  summary.departmentAssets ??
                  0
                }
              </td>


              {/* Total Assets */}
              <td className="p-4 text-center text-app-brand">
                {
                  summary.assets ??
                  Number(
                    summary.employeeAssets ||
                      0,
                  ) +
                    Number(
                      summary.departmentAssets ||
                        0,
                    )
                }
              </td>


              {/* Employee Value */}
              <td className="p-4 text-right">
                {formatMoney(
                  summary.employeeAssetValue,
                )}{" "}
                SAR
              </td>


              {/* Department Value */}
              <td className="p-4 text-right">
                {formatMoney(
                  summary.departmentAssetValue,
                )}{" "}
                SAR
              </td>


              {/* Total Value */}
              <td className="p-4 pr-6 text-right text-app-brand">
                {formatMoney(
                  summary.assetValue ??
                    Number(
                      summary.employeeAssetValue ||
                        0,
                    ) +
                      Number(
                        summary.departmentAssetValue ||
                          0,
                      ),
                )}{" "}
                SAR
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}