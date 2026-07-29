import { useRef } from "react";
import { FiUpload } from "react-icons/fi";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { useCreateEmployee, useGetEmployee } from "../../context/useEmployee";

export default function ImportData() {
  const fileInputRef = useRef<HTMLInputElement>(null);


  const createEmployee = useCreateEmployee();

  const { data } = useGetEmployee(1, 1000);

  const employees = data?.employees || [];


  

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  // UPDATED: Excel date format support
  const formatJoinDate = (value: any) => {
    if (!value || value === "Not Available") return "";

    if (typeof value === "number") {
      const date = XLSX.SSF.parse_date_code(value);

      if (!date) return "";

      return `${date.y}-${String(date.m).padStart(2, "0")}-${String(
        date.d,
      ).padStart(2, "0")}`;
    }

    const parsedDate = new Date(value);

    if (isNaN(parsedDate.getTime())) return "";

    return parsedDate.toISOString().split("T")[0];
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only Excel (.xlsx/.xls) files are allowed.");
      e.target.value = "";
      return;
    }

    try {
      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
        cellDates: true,
      });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

      if (rows.length === 0) {
        toast.error("Excel file is empty.");
        return;
      }

      // UPDATED: required validation
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];

        if (!String(row["Full Name"] || "").trim()) {
          toast.error(`Row ${index + 2}: Full Name is required.`);
          return;
        }

        if (!String(row["Iqama / Passport"] || "").trim()) {
          toast.error(`Row ${index + 2}: Iqama / Passport is required.`);
          return;
        }

        if (!String(row["Department"] || "").trim()) {
          toast.error(`Row ${index + 2}: Department is required.`);
          return;
        }

        if (!String(row["Position"] || "").trim()) {
          toast.error(`Row ${index + 2}: Position is required.`);
          return;
        }
      }

      // UPDATED: Excel file এর ভিতরে duplicate check
      const checkExcelDuplicate = (fieldName: string, label: string) => {
        const seen = new Set<string>();

        for (let index = 0; index < rows.length; index++) {
          const value = String(rows[index][fieldName] || "")
            .trim()
            .toLowerCase();

          if (!value) continue;

          if (seen.has(value)) {
            toast.error(`Row ${index + 2}: Duplicate ${label} found in Excel.`);
            return true;
          }

          seen.add(value);
        }

        return false;
      };

      if (checkExcelDuplicate("Iqama / Passport", "Iqama / Passport")) return;
      if (checkExcelDuplicate("Phone", "Phone Number")) return;
      if (checkExcelDuplicate("Email", "Email")) return;

      let importedCount = 0;
      let skippedCount = 0;

      // UPDATED: existing employee skip হবে, only new row import হবে
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];

        const iqama = String(row["Iqama / Passport"] || "")
          .trim()
          .toLowerCase();

        const phone = String(row["Phone"] || "")
          .trim()
          .toLowerCase();

        const email = String(row["Email"] || "")
          .trim()
          .toLowerCase();

        const alreadyExists = employees.some((employee: any) => {
          const existingIqama = String(employee.iqamaNumber || "")
            .trim()
            .toLowerCase();

          const existingPhone = String(employee.phoneNumber || "")
            .trim()
            .toLowerCase();

          const existingEmail = String(employee.email || "")
            .trim()
            .toLowerCase();

          return (
            existingIqama === iqama ||
            (phone && existingPhone === phone) ||
            (email && existingEmail === email)
          );
        });

        if (alreadyExists) {
          skippedCount++;
          continue;
        }

        const formData = new FormData();

        formData.append("fullName", String(row["Full Name"] || "").trim());
        formData.append(
          "iqamaNumber",
          String(row["Iqama / Passport"] || "").trim(),
        );
        formData.append(
          "phoneNumber",
          row["Phone"] ? String(row["Phone"]).trim() : "",
        );
        formData.append(
          "email",
          row["Email"] ? String(row["Email"]).trim() : "",
        );
        formData.append("department", String(row["Department"] || "").trim());
        formData.append("position", String(row["Position"] || "").trim());

        // UPDATED: Join Date support
        formData.append("joinDate", formatJoinDate(row["Join Date"]));

        await createEmployee.mutateAsync(formData);

        importedCount++;
      }

      toast.success(
        `Import completed. New: ${importedCount}, Skipped existing: ${skippedCount}`,
      );
    } catch (error: any) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Failed to import employees.",
      );
    } finally {
      e.target.value = "";
    }
  };

  return (
    <>
      <button
        onClick={handleChooseFile}
        disabled={createEmployee.isPending}
        className="flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2.5 bg-app-bg border border-app-gray/15 rounded-md text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiUpload />
        <span>{createEmployee.isPending ? "Importing..." : "Import"}</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleImport}
        className="hidden"
      />
      
    </>
  );
}