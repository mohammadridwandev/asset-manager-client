import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

import { useExportEmployees } from "../../context/useEmployee";

export default function ExportData() {
  const exportEmployees =
    useExportEmployees();

  const formatDate = (
    value?: string | Date | null,
  ) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date
      .toISOString()
      .split("T")[0];
  };

  const handleExport = async () => {
    try {
      const employees =
        await exportEmployees.mutateAsync();

      if (
        !Array.isArray(employees) ||
        employees.length === 0
      ) {
        toast.error(
          "No employee data found.",
        );

        return;
      }

      const exportRows = employees.map(
  (employee: any, index: number) => {
    const assignedAssets = Array.isArray(
      employee.assetAssignments,
    )
      ? employee.assetAssignments
      : [];

    const assetNames = assignedAssets
      .map(
        (assignment: any) =>
          assignment?.asset?.assetName,
      )
      .filter(Boolean)
      .join(", ");

    const assetTypes = assignedAssets
      .map(
        (assignment: any) =>
          assignment?.asset?.assetType,
      )
      .filter(Boolean)
      .join(", ");

    const assetSerialNumbers = assignedAssets
      .map(
        (assignment: any) =>
          assignment?.asset?.serialNumber,
      )
      .filter(Boolean)
      .join(", ");

    return {
      "SL No.": index + 1,

      "Full Name":
        employee.fullName || "",

      "Iqama / Passport":
        employee.iqamaNumber || "",

      Phone:
        employee.phoneNumber || "",

      Email:
        employee.email || "",

      Department:
        employee.department || "",

      Position:
        employee.position || "",

      "Join Date":
        formatDate(employee.joinDate),

      Status:
        employee.status
          ? employee.status.replaceAll(
              "_",
              " ",
            )
          : "",

      "Asset Name":
        assetNames || "No Active Asset",

      "Asset Type":
        assetTypes || "N/A",

      "Serial Number":
        assetSerialNumbers || "N/A",

      "Created Date":
        formatDate(employee.createdAt),
    };
  },
);




      const worksheet =
        XLSX.utils.json_to_sheet(
          exportRows,
        );

      worksheet["!cols"] = [
  { wch: 8 },
  { wch: 28 },
  { wch: 20 },
  { wch: 18 },
  { wch: 30 },
  { wch: 22 },
  { wch: 22 },
  { wch: 14 },
  { wch: 15 },
  { wch: 35 },
  { wch: 25 },
  { wch: 30 },
  { wch: 14 },
];



      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Employees",
      );

      const currentDate =
        new Date()
          .toISOString()
          .split("T")[0];

      XLSX.writeFile(
        workbook,
        `employees-${currentDate}.xlsx`,
      );

      toast.success(
        `${employees.length} employees exported successfully.`,
      );
    } catch (error) {
      console.error(
        "Employee Export Error:",
        error,
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={
        exportEmployees.isPending
      }
      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-app-gray/15 bg-app-bg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:flex-none"
    >
      <FiDownload />

      <span>
        {exportEmployees.isPending
          ? "Exporting..."
          : "Export"}
      </span>
    </button>
  );
}