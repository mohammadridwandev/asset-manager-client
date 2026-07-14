import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

export default function ExportData({ employees }: { employees: any[] }) {


  const handleExport = () => {
    // UPDATED: employee data excel format
    const exportData = employees.map((employee: any) => ({


      // ID: employee.id,
      "Full Name": employee.fullName || "Not Available",
      "Iqama / Passport": employee.iqamaNumber || "Not Available",
      Email: employee.email || "Not Available",
      Phone: employee.phoneNumber || "Not Available",
      Department: employee.department || "Not Available",
      Position: employee.position || "Not Available",
      // Status: employee.status || "ACTIVE",

      "Join Date": employee.joinDate
        ? new Date(employee.joinDate).toLocaleDateString()
        : "Not Available",

      // UPDATED: employee related data count
      // Assets: employee.assetAssignments?.length || 0,
      // Licenses: employee.licenseAssignments?.length || 0,
      // Reports: employee.reports?.length || 0,


    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // UPDATED: excel column width
    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 25 },
      { wch: 22 },
      { wch: 30 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      file,
      `employees-${new Date().toISOString().split("T")[0]}.xlsx`,
    );

    toast.success("Successful your export")

  };


  return (
    <button
      onClick={handleExport}
      disabled={!employees || employees.length === 0}
      className="flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2.5 bg-app-bg border border-app-gray/15 rounded-md text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FiDownload />
      <span>Export</span>
    </button>
  );
}