import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

import {
  useExportEmployees,
} from "../../context/useEmployee";

import {
  useExportAssets,
} from "../../context/useAssets";


export default function ExportData() {
  const exportEmployees =
    useExportEmployees();

  const exportAssets =
    useExportAssets();


  // =========================
  // DATE FORMAT
  // =========================
  const formatDate = (
    value?: string | Date | null,
  ) => {
    if (!value) {
      return "";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return "";
    }

    return date
      .toISOString()
      .split("T")[0];
  };


  // =========================
  // CLEAN TEXT
  // =========================
  const cleanText = (
    value: any,
    fallback = "",
  ) => {
    const text =
      String(value ?? "").trim();

    return text || fallback;
  };


  // =========================
  // EXPORT
  // =========================
  const handleExport =
    async () => {
      try {
        // Get all employees + assets
        const [
          employees,
          assets,
        ] =
          await Promise.all([
            exportEmployees.mutateAsync(),
            exportAssets.mutateAsync(),
          ]);


        if (
          (!Array.isArray(
            employees,
          ) ||
            employees.length ===
              0) &&
          (!Array.isArray(
            assets,
          ) ||
            assets.length === 0)
        ) {
          toast.error(
            "No export data found.",
          );

          return;
        }


        const employeeList =
          Array.isArray(employees)
            ? employees
            : [];

        const assetList =
          Array.isArray(assets)
            ? assets
            : [];


        const workbook =
          XLSX.utils.book_new();


        // ==================================================
        // SHEET 1
        // EMPLOYEE SUMMARY
        // ==================================================

        const employeeSummaryRows =
          employeeList.map(
            (
              employee: any,
              index: number,
            ) => {
              const assignments =
                Array.isArray(
                  employee.assetAssignments,
                )
                  ? employee.assetAssignments
                  : [];


              const assetNames =
                assignments
                  .map(
                    (
                      assignment:
                        any,
                    ) =>
                      assignment?.asset
                        ?.assetName,
                  )
                  .filter(Boolean)
                  .join(", ");


              const serialNumbers =
                assignments
                  .map(
                    (
                      assignment:
                        any,
                    ) =>
                      assignment?.asset
                        ?.serialNumber,
                  )
                  .filter(Boolean)
                  .join(", ");


              const assetTypes =
                assignments
                  .map(
                    (
                      assignment:
                        any,
                    ) =>
                      assignment?.asset
                        ?.assetType,
                  )
                  .filter(Boolean)
                  .join(", ");


              return {
                "SL No.":
                  index + 1,

                "Employee ID":
                  employee.id ?? "",

                "Employee Name":
                  employee.fullName ||
                  "",

                "Iqama / Passport":
                  employee.iqamaNumber ||
                  "",

                Phone:
                  employee.phoneNumber ||
                  "",

                Email:
                  employee.email ||
                  "",

                Department:
                  employee.department ||
                  "",

                Position:
                  employee.position ||
                  "",

                Status:
                  employee.status
                    ? employee.status.replaceAll(
                        "_",
                        " ",
                      )
                    : "",

                "Total Assets":
                  assignments.length,

                "Asset Names":
                  assetNames ||
                  "No Active Asset",

                "Asset Types":
                  assetTypes ||
                  "N/A",

                "Serial Numbers":
                  serialNumbers ||
                  "N/A",

                "Join Date":
                  formatDate(
                    employee.joinDate,
                  ),
              };
            },
          );


        if (
          employeeSummaryRows.length ===
          0
        ) {
          employeeSummaryRows.push(
            {
              "SL No.": 1,
              "Employee ID": "",
              "Employee Name":
                "No employees found",
              "Iqama / Passport":
                "",
              Phone: "",
              Email: "",
              Department: "",
              Position: "",
              Status: "",
              "Total Assets": 0,
              "Asset Names": "",
              "Asset Types": "",
              "Serial Numbers": "",
              "Join Date": "",
            },
          );
        }


        const employeeSummarySheet =
          XLSX.utils.json_to_sheet(
            employeeSummaryRows,
          );


        employeeSummarySheet[
          "!cols"
        ] = [
          { wch: 8 },
          { wch: 12 },
          { wch: 28 },
          { wch: 20 },
          { wch: 18 },
          { wch: 30 },
          { wch: 24 },
          { wch: 22 },
          { wch: 16 },
          { wch: 14 },
          { wch: 45 },
          { wch: 35 },
          { wch: 45 },
          { wch: 16 },
        ];


        employeeSummarySheet[
          "!autofilter"
        ] = {
          ref:
            employeeSummarySheet[
              "!ref"
            ] || "A1",
        };


        XLSX.utils.book_append_sheet(
          workbook,
          employeeSummarySheet,
          "Employee Summary",
        );


        // ==================================================
        // SHEET 2
        // EMPLOYEE ASSETS
        // ==================================================

        const employeeAssetRows:
          any[] = [];


        employeeList.forEach(
          (employee: any) => {
            const assignments =
              Array.isArray(
                employee.assetAssignments,
              )
                ? employee.assetAssignments
                : [];


            assignments.forEach(
              (
                assignment: any,
                assetIndex:
                  number,
              ) => {
                const asset =
                  assignment?.asset;

                if (!asset) {
                  return;
                }


                employeeAssetRows.push(
                  {
                    Department:
                      employee.department ||
                      "",

                    "Employee Name":
                      employee.fullName ||
                      "",

                    "Employee ID":
                      employee.id ??
                      "",

                    "Iqama / Passport":
                      employee.iqamaNumber ||
                      "",

                    Position:
                      employee.position ||
                      "",

                    Status:
                      employee.status
                        ? employee.status.replaceAll(
                            "_",
                            " ",
                          )
                        : "",

                    "Asset No.":
                      assetIndex +
                      1,

                    "Asset ID":
                      asset.id ??
                      "",

                    "Asset Name":
                      asset.assetName ||
                      "",

                    "Asset Type":
                      asset.assetType ||
                      "",

                    "Serial Number":
                      asset.serialNumber ||
                      "N/A",

                    "Invoice Number":
                      asset.invoiceNumber ||
                      "N/A",

                    Quantity:
                      Number(
                        asset.quantity ||
                          0,
                      ),

                    "Price (SAR)":
                      Number(
                        asset.price ||
                          0,
                      ),

                    Condition:
                      asset.condition ||
                      "N/A",

                    "Purchase Date":
                      formatDate(
                        asset.purchaseDate,
                      ),

                    "Warranty Expiry":
                      formatDate(
                        asset.WarrantyExpiry,
                      ),

                    "Assigned Date":
                      formatDate(
                        assignment.assignedAt,
                      ),

                    Notes:
                      asset.notes ||
                      "",
                  },
                );
              },
            );
          },
        );


        if (
          employeeAssetRows.length ===
          0
        ) {
          employeeAssetRows.push(
            {
              Department: "",
              "Employee Name":
                "No employee assets found",
              "Employee ID": "",
              "Iqama / Passport":
                "",
              Position: "",
              Status: "",
              "Asset No.": "",
              "Asset ID": "",
              "Asset Name": "",
              "Asset Type": "",
              "Serial Number":
                "",
              "Invoice Number":
                "",
              Quantity: "",
              "Price (SAR)": "",
              Condition: "",
              "Purchase Date":
                "",
              "Warranty Expiry":
                "",
              "Assigned Date":
                "",
              Notes: "",
            },
          );
        }


        const employeeAssetSheet =
          XLSX.utils.json_to_sheet(
            employeeAssetRows,
          );


        employeeAssetSheet[
          "!cols"
        ] = [
          { wch: 24 },
          { wch: 28 },
          { wch: 12 },
          { wch: 20 },
          { wch: 22 },
          { wch: 16 },
          { wch: 10 },
          { wch: 10 },
          { wch: 30 },
          { wch: 20 },
          { wch: 25 },
          { wch: 22 },
          { wch: 12 },
          { wch: 16 },
          { wch: 18 },
          { wch: 16 },
          { wch: 18 },
          { wch: 16 },
          { wch: 40 },
        ];


        employeeAssetSheet[
          "!autofilter"
        ] = {
          ref:
            employeeAssetSheet[
              "!ref"
            ] || "A1",
        };


        XLSX.utils.book_append_sheet(
          workbook,
          employeeAssetSheet,
          "Employee Assets",
        );


        // ==================================================
        // MASTER DEPARTMENT MAP
        // Employee Assets + Assigned Department Assets
        // ==================================================

        type DepartmentData = {
          departmentName: string;

          employees:
            Map<number, any>;

          employeeAssets:
            any[];

          directAssets:
            any[];
        };


        const departmentMap =
          new Map<
            string,
            DepartmentData
          >();


        // Get or create department
        const getDepartment =
          (
            departmentName:
              string,
          ) => {
            const name =
              cleanText(
                departmentName,
              );

            if (!name) {
              return null;
            }

            if (
              !departmentMap.has(
                name,
              )
            ) {
              departmentMap.set(
                name,
                {
                  departmentName:
                    name,

                  employees:
                    new Map(),

                  employeeAssets:
                    [],

                  directAssets:
                    [],
                },
              );
            }

            return (
              departmentMap.get(
                name,
              ) || null
            );
          };


        // ==================================================
        // EMPLOYEES + EMPLOYEE ASSETS BY DEPARTMENT
        // ==================================================

        employeeList.forEach(
          (employee: any) => {
            const departmentName =
              cleanText(
                employee.department,
              );

            if (!departmentName) {
              return;
            }

            const department =
              getDepartment(
                departmentName,
              );

            if (!department) {
              return;
            }


            // Employee count
            if (
              employee.id !==
              undefined &&
              employee.id !==
                null
            ) {
              department.employees.set(
                Number(
                  employee.id,
                ),
                employee,
              );
            }


            const assignments =
              Array.isArray(
                employee.assetAssignments,
              )
                ? employee.assetAssignments
                : [];


            assignments.forEach(
              (
                assignment: any,
              ) => {
                const asset =
                  assignment?.asset;

                if (!asset) {
                  return;
                }


                department.employeeAssets.push(
                  {
                    asset,

                    assignment,

                    employee,
                  },
                );
              },
            );
          },
        );


        // ==================================================
        // Assigned Department AssetS
        // ==================================================

        assetList.forEach(
          (asset: any) => {
            const assignments =
              Array.isArray(
                asset.departmentAssignments,
              )
                ? asset.departmentAssignments
                : [];


            assignments.forEach(
              (
                assignment:
                  any,
              ) => {
                const departmentName =
                  cleanText(
                    assignment
                      ?.department
                      ?.name,
                  );

                if (
                  !departmentName
                ) {
                  return;
                }


                const department =
                  getDepartment(
                    departmentName,
                  );

                if (
                  !department
                ) {
                  return;
                }


                department.directAssets.push(
                  {
                    asset,
                    assignment,
                  },
                );
              },
            );
          },
        );


        // Sort departments
        const departments =
          Array.from(
            departmentMap.values(),
          ).sort((a, b) =>
            a.departmentName.localeCompare(
              b.departmentName,
            ),
          );


        // ==================================================
        // SHEET 3
        // DEPARTMENT SUMMARY
        // ==================================================

        const departmentSummaryRows =
          departments.map(
            (
              department,
              index,
            ) => {
              const employeeAssetNames =
                department.employeeAssets
                  .map(
                    (item) =>
                      item.asset
                        ?.assetName,
                  )
                  .filter(Boolean)
                  .join(", ");


              const directAssetNames =
                department.directAssets
                  .map(
                    (item) =>
                      item.asset
                        ?.assetName,
                  )
                  .filter(Boolean)
                  .join(", ");


              const employeeSerials =
                department.employeeAssets
                  .map(
                    (item) =>
                      item.asset
                        ?.serialNumber,
                  )
                  .filter(Boolean)
                  .join(", ");


              const directSerials =
                department.directAssets
                  .map(
                    (item) =>
                      item.asset
                        ?.serialNumber,
                  )
                  .filter(Boolean)
                  .join(", ");


              const totalAssets =
                department
                  .employeeAssets
                  .length +
                department
                  .directAssets
                  .length;


              const employeeAssetValue =
                department.employeeAssets.reduce(
                  (
                    total,
                    item,
                  ) =>
                    total +
                    Number(
                      item.asset
                        ?.price ||
                        0,
                    ),
                  0,
                );


              const directAssetValue =
                department.directAssets.reduce(
                  (
                    total,
                    item,
                  ) =>
                    total +
                    Number(
                      item.asset
                        ?.price ||
                        0,
                    ),
                  0,
                );


              return {
                "SL No.":
                  index + 1,

                Department:
                  department.departmentName,

                Employees:
                  department.employees
                    .size,

                "Employee Assets":
                  department
                    .employeeAssets
                    .length,

                "Assigned Department Assets":
                  department
                    .directAssets
                    .length,

                "Total Assets":
                  totalAssets,

                "Employee Asset Value (SAR)":
                  employeeAssetValue,

                "Direct Asset Value (SAR)":
                  directAssetValue,

                "Total Asset Value (SAR)":
                  employeeAssetValue +
                  directAssetValue,

                "Employee Asset Names":
                  employeeAssetNames ||
                  "N/A",

                "Employee Asset Serials":
                  employeeSerials ||
                  "N/A",

                "Direct Asset Names":
                  directAssetNames ||
                  "N/A",

                "Direct Asset Serials":
                  directSerials ||
                  "N/A",
              };
            },
          );


        if (
          departmentSummaryRows.length ===
          0
        ) {
          departmentSummaryRows.push(
            {
              "SL No.": 1,

              Department:
                "No departments found",

              Employees: 0,

              "Employee Assets":
                0,

              "Assigned Department Assets":
                0,

              "Total Assets": 0,

              "Employee Asset Value (SAR)":
                0,

              "Direct Asset Value (SAR)":
                0,

              "Total Asset Value (SAR)":
                0,

              "Employee Asset Names":
                "",

              "Employee Asset Serials":
                "",

              "Direct Asset Names":
                "",

              "Direct Asset Serials":
                "",
            },
          );
        }


        const departmentSummarySheet =
          XLSX.utils.json_to_sheet(
            departmentSummaryRows,
          );


        departmentSummarySheet[
          "!cols"
        ] = [
          { wch: 8 },
          { wch: 28 },
          { wch: 12 },
          { wch: 16 },
          { wch: 24 },
          { wch: 14 },
          { wch: 24 },
          { wch: 22 },
          { wch: 22 },
          { wch: 55 },
          { wch: 50 },
          { wch: 55 },
          { wch: 50 },
        ];


        departmentSummarySheet[
          "!autofilter"
        ] = {
          ref:
            departmentSummarySheet[
              "!ref"
            ] || "A1",
        };


        XLSX.utils.book_append_sheet(
          workbook,
          departmentSummarySheet,
          "Department Summary",
        );


        // ==================================================
        // SHEET 4
        // DEPARTMENT ASSETS
        //
        // Shows BOTH:
        // 1. Employee Assets
        // 2. Assigned Department Assets
        // ==================================================

        const departmentAssetRows:
          any[] = [];


        departments.forEach(
          (department) => {
            let departmentRowIndex =
              0;


            // =========================
            // EMPLOYEE ASSETS
            // =========================

            department.employeeAssets.forEach(
              (
                item,
                index,
              ) => {
                const asset =
                  item.asset;

                const employee =
                  item.employee;

                const assignment =
                  item.assignment;


                departmentAssetRows.push(
                  {
                    // Department name only first row
                    Department:
                      departmentRowIndex ===
                      0
                        ? department.departmentName
                        : "",

                    "Assignment Type":
                      "Employee Asset",

                    "Asset No.":
                      index + 1,

                    "Asset ID":
                      asset?.id ??
                      "",

                    "Asset Name":
                      asset?.assetName ||
                      "",

                    "Asset Type":
                      asset?.assetType ||
                      "",

                    "Serial Number":
                      asset?.serialNumber ||
                      "N/A",

                    "Invoice Number":
                      asset?.invoiceNumber ||
                      "N/A",

                    Quantity:
                      Number(
                        asset?.quantity ||
                          0,
                      ),

                    "Price (SAR)":
                      Number(
                        asset?.price ||
                          0,
                      ),

                    "Total Value (SAR)":
                      Number(
                        asset?.quantity ||
                          0,
                      ) *
                      Number(
                        asset?.price ||
                          0,
                      ),

                    Condition:
                      asset?.condition ||
                      "N/A",

                    "Employee Name":
                      employee?.fullName ||
                      "",

                    "Employee ID":
                      employee?.id ??
                      "",

                    "Iqama / Passport":
                      employee?.iqamaNumber ||
                      "",

                    Position:
                      employee?.position ||
                      "",

                    "Employee Status":
                      employee?.status
                        ? employee.status.replaceAll(
                            "_",
                            " ",
                          )
                        : "",

                    "Purchase Date":
                      formatDate(
                        asset?.purchaseDate,
                      ),

                    "Warranty Expiry":
                      formatDate(
                        asset?.WarrantyExpiry,
                      ),

                    "Assigned Date":
                      formatDate(
                        assignment?.assignedAt,
                      ),

                    Notes:
                      asset?.notes ||
                      "",
                  },
                );


                departmentRowIndex++;
              },
            );


            // =========================
            // Assigned Department AssetS
            // =========================

            department.directAssets.forEach(
              (
                item,
                index,
              ) => {
                const asset =
                  item.asset;

                const assignment =
                  item.assignment;


                departmentAssetRows.push(
                  {
                    // Department name only first row
                    Department:
                      departmentRowIndex ===
                      0
                        ? department.departmentName
                        : "",

                    "Assignment Type":
                      "Assigned Department Asset",

                    "Asset No.":
                      index + 1,

                    "Asset ID":
                      asset?.id ??
                      "",

                    "Asset Name":
                      asset?.assetName ||
                      "",

                    "Asset Type":
                      asset?.assetType ||
                      "",

                    "Serial Number":
                      asset?.serialNumber ||
                      "N/A",

                    "Invoice Number":
                      asset?.invoiceNumber ||
                      "N/A",

                    Quantity:
                      Number(
                        asset?.quantity ||
                          0,
                      ),

                    "Price (SAR)":
                      Number(
                        asset?.price ||
                          0,
                      ),

                    "Total Value (SAR)":
                      Number(
                        asset?.quantity ||
                          0,
                      ) *
                      Number(
                        asset?.price ||
                          0,
                      ),

                    Condition:
                      asset?.condition ||
                      "N/A",

                    // No employee for Assigned Department Asset
                    "Employee Name":
                      "",

                    "Employee ID":
                      "",

                    "Iqama / Passport":
                      "",

                    Position:
                      "",

                    "Employee Status":
                      "",

                    "Purchase Date":
                      formatDate(
                        asset?.purchaseDate,
                      ),

                    "Warranty Expiry":
                      formatDate(
                        asset?.WarrantyExpiry,
                      ),

                    "Assigned Date":
                      formatDate(
                        assignment?.assignedAt,
                      ),

                    Notes:
                      asset?.notes ||
                      "",
                  },
                );


                departmentRowIndex++;
              },
            );


            // Department exists but no assets
            if (
              department
                .employeeAssets
                .length === 0 &&
              department
                .directAssets
                .length === 0
            ) {
              departmentAssetRows.push(
                {
                  Department:
                    department.departmentName,

                  "Assignment Type":
                    "No Assets",

                  "Asset No.":
                    "",

                  "Asset ID":
                    "",

                  "Asset Name":
                    "",

                  "Asset Type":
                    "",

                  "Serial Number":
                    "",

                  "Invoice Number":
                    "",

                  Quantity: 0,

                  "Price (SAR)":
                    0,

                  "Total Value (SAR)":
                    0,

                  Condition:
                    "",

                  "Employee Name":
                    "",

                  "Employee ID":
                    "",

                  "Iqama / Passport":
                    "",

                  Position:
                    "",

                  "Employee Status":
                    "",

                  "Purchase Date":
                    "",

                  "Warranty Expiry":
                    "",

                  "Assigned Date":
                    "",

                  Notes:
                    "",
                },
              );
            }
          },
        );


        if (
          departmentAssetRows.length ===
          0
        ) {
          departmentAssetRows.push(
            {
              Department:
                "No department assets found",

              "Assignment Type":
                "",

              "Asset No.": "",

              "Asset ID": "",

              "Asset Name": "",

              "Asset Type": "",

              "Serial Number":
                "",

              "Invoice Number":
                "",

              Quantity: "",

              "Price (SAR)":
                "",

              "Total Value (SAR)":
                "",

              Condition: "",

              "Employee Name":
                "",

              "Employee ID":
                "",

              "Iqama / Passport":
                "",

              Position: "",

              "Employee Status":
                "",

              "Purchase Date":
                "",

              "Warranty Expiry":
                "",

              "Assigned Date":
                "",

              Notes: "",
            },
          );
        }


        const departmentAssetSheet =
          XLSX.utils.json_to_sheet(
            departmentAssetRows,
          );


        departmentAssetSheet[
          "!cols"
        ] = [
          { wch: 28 }, // Department
          { wch: 24 }, // Assignment Type
          { wch: 10 }, // Asset No.
          { wch: 10 }, // Asset ID
          { wch: 30 }, // Asset Name
          { wch: 20 }, // Asset Type
          { wch: 25 }, // Serial
          { wch: 22 }, // Invoice
          { wch: 12 }, // Quantity
          { wch: 16 }, // Price
          { wch: 20 }, // Total Value
          { wch: 18 }, // Condition
          { wch: 28 }, // Employee Name
          { wch: 12 }, // Employee ID
          { wch: 20 }, // Iqama
          { wch: 22 }, // Position
          { wch: 18 }, // Employee Status
          { wch: 16 }, // Purchase Date
          { wch: 18 }, // Warranty
          { wch: 16 }, // Assigned
          { wch: 40 }, // Notes
        ];


        departmentAssetSheet[
          "!autofilter"
        ] = {
          ref:
            departmentAssetSheet[
              "!ref"
            ] || "A1",
        };


        XLSX.utils.book_append_sheet(
          workbook,
          departmentAssetSheet,
          "Department Assets",
        );


        // ==================================================
        // DOWNLOAD FILE
        // ==================================================

        const currentDate =
          new Date()
            .toISOString()
            .split("T")[0];


        XLSX.writeFile(
          workbook,
          `Asset Allocation Report-${currentDate}.xlsx`,
        );


        toast.success(
          "Complete employee and department asset report exported successfully.",
        );
      } catch (error) {
        console.error(
          "Export Error:",
          error,
        );

        toast.error(
          "Failed to export report.",
        );
      }
    };


  const isExporting =
    exportEmployees.isPending ||
    exportAssets.isPending;


  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-app-gray/15 bg-app-bg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:flex-none"
    >
      <FiDownload />

      <span>
        {isExporting
          ? "Exporting..."
          : "Export"}
      </span>
    </button>
  );
}