import { useRef } from "react";
import { FiUpload } from "react-icons/fi";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { useCreateAsset, useGetAssets } from "../../context/useAssets";

export default function Asset_Import() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createAsset = useCreateAsset();

const { data } = useGetAssets(1, 1000);

const assets = data?.assets || [];




  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  // UPDATED: Excel date format support
  const formatPurchaseDate = (value: any) => {
    if (!value || value === "N/A" || value === "Not Available") return "";

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

        if (!String(row["Asset Name"] || "").trim()) {
          toast.error(`Row ${index + 2}: Asset Name is required.`);
          return;
        }

        if (!String(row["Asset Type"] || "").trim()) {
          toast.error(`Row ${index + 2}: Asset Type is required.`);
          return;
        }

        if (!String(row["Quantity"] || "").trim()) {
          toast.error(`Row ${index + 2}: Quantity is required.`);
          return;
        }

        if (!String(row["Price (SAR)"] || "").trim()) {
          toast.error(`Row ${index + 2}: Price is required.`);
          return;
        }

        if (!String(row["Purchase Date"] || "").trim()) {
          toast.error(`Row ${index + 2}: Purchase Date is required.`);
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

          if (!value || value === "n/a" || value === "not available") continue;

          if (seen.has(value)) {
            toast.error(`Row ${index + 2}: Duplicate ${label} found in Excel.`);
            return true;
          }

          seen.add(value);
        }

        return false;
      };

      if (checkExcelDuplicate("Serial Number", "Serial Number")) return;
      if (checkExcelDuplicate("Invoice Number", "Invoice Number")) return;

      let importedCount = 0;
      let skippedCount = 0;

      // UPDATED: existing asset skip হবে, only new row import হবে
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];

        const serialNumber = String(row["Serial Number"] || "")
          .trim()
          .toLowerCase();

        const invoiceNumber = String(row["Invoice Number"] || "")
          .trim()
          .toLowerCase();

        const alreadyExists = assets.some((asset: any) => {
          const existingSerial = String(asset.serialNumber || "")
            .trim()
            .toLowerCase();

          const existingInvoice = String(asset.invoiceNumber || "")
            .trim()
            .toLowerCase();

          return (
            (serialNumber && existingSerial === serialNumber) ||
            (invoiceNumber && existingInvoice === invoiceNumber)
          );
        });

        if (alreadyExists) {
          skippedCount++;
          continue;
        }

        const assetData = {
          assetName: String(row["Asset Name"] || "").trim(),
          assetType: String(row["Asset Type"] || "").trim(),

          // UPDATED: optional unique fields empty হলে "" না দিয়ে undefined
          serialNumber: row["Serial Number"]
            ? String(row["Serial Number"]).trim()
            : undefined,

          invoiceNumber: row["Invoice Number"]
            ? String(row["Invoice Number"]).trim()
            : undefined,

          quantity: Number(row["Quantity"] || 0),
          price: Number(row["Price (SAR)"] || 0),
          purchaseDate: formatPurchaseDate(row["Purchase Date"]),
          condition: row["Condition"] ? String(row["Condition"]).trim() : "",
          notes: row["Notes"] ? String(row["Notes"]).trim() : "",
        };

        await createAsset.mutateAsync(assetData);

        importedCount++;
      }

      toast.success(
        `Import completed. New: ${importedCount}, Skipped existing: ${skippedCount}`,
      );
    } catch (error: any) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Failed to import assets.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleChooseFile}
        disabled={createAsset.isPending}
        className="flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2.5 bg-app-bg border border-app-gray/15 rounded-md text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiUpload />
        <span>{createAsset.isPending ? "Importing..." : "Import"}</span>
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