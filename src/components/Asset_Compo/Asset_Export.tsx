import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

import { useExportAssets } from "../../context/useAssets";

export default function Asset_Export() {
  const exportAssets = useExportAssets();

  const formatDate = (
    value?: string | Date | null,
  ) => {
    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toISOString().split("T")[0];
  };

  const handleExportAssets = async () => {
    try {
      const assets =
        await exportAssets.mutateAsync();

      if (
        !Array.isArray(assets) ||
        assets.length === 0
      ) {
        toast.error(
          "No assets available to export.",
        );

        return;
      }

      const exportData = assets.map(
        (asset: any, index: number) => {
          const activeAssignment =
            Array.isArray(
              asset.assignments,
            ) &&
            asset.assignments.length > 0
              ? asset.assignments[0]
              : null;

          const employee =
            activeAssignment?.employee ||
            null;

          return {
            "SL No.": index + 1,

            "Asset Name":
              asset.assetName || "N/A",

            "Serial Number":
              asset.serialNumber || "N/A",

            "Asset Type":
              asset.assetType || "N/A",

            "Invoice Number":
              asset.invoiceNumber || "N/A",

            Quantity: Number(
              asset.quantity || 0,
            ),

            "Price (SAR)": Number(
              asset.price || 0,
            ),

            "Purchase Date":
              formatDate(
                asset.purchaseDate,
              ),

            "Warranty Expiry":
              formatDate(
                asset.WarrantyExpiry,
              ),

            Condition:
              asset.condition || "N/A",

            "Assigned Employee":
              employee?.fullName ||
              "Unassigned",

            "Employee Email":
              employee?.email || "N/A",

            "Iqama / Passport":
              employee?.iqamaNumber ||
              "N/A",

            Department:
              employee?.department ||
              "N/A",

            Notes:
              asset.notes || "N/A",

            "Created Date":
              formatDate(
                asset.createdAt,
              ),
          };
        },
      );

      const worksheet =
        XLSX.utils.json_to_sheet(
          exportData,
        );

      worksheet["!cols"] = [
        { wch: 8 },
        { wch: 28 },
        { wch: 22 },
        { wch: 20 },
        { wch: 20 },
        { wch: 12 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
        { wch: 28 },
        { wch: 30 },
        { wch: 20 },
        { wch: 22 },
        { wch: 35 },
        { wch: 16 },
      ];

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Assets",
      );

      const currentDate =
        new Date()
          .toISOString()
          .split("T")[0];

      XLSX.writeFile(
        workbook,
        `assets-export-${currentDate}.xlsx`,
      );

      toast.success(
        `${assets.length} assets exported successfully.`,
      );
    } catch (error) {
      console.error(
        "Asset Export Error:",
        error,
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleExportAssets}
      disabled={exportAssets.isPending}
      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-app-gray/15 bg-app-bg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:flex-none"
    >
      <FiDownload />

      <span>
        {exportAssets.isPending
          ? "Exporting..."
          : "Export"}
      </span>
    </button>
  );
}