import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type AssetExportProps = {
  assets: any[];
};

export default function Asset_Export({ assets }: AssetExportProps) {
  // UPDATED: asset card data excel export
  const handleExportAssets = () => {
    if (!assets || assets.length === 0) {
      alert("No assets available to export!");
      return;
    }

    const exportData = assets.map((asset: any, ) => {

      return {
        "Asset Name": asset.assetName || "N/A",
        "Serial Number": asset.serialNumber || "N/A",
        "Asset Type": asset.assetType || "N/A",
        "Invoice Number": asset.invoiceNumber || "N/A",
        Quantity: asset.quantity || 0,
        "Price (SAR)": asset.price || 0,
        "Purchase Date": asset.purchaseDate
          ? new Date(asset.purchaseDate).toLocaleDateString()
          : "N/A",
        Condition: asset.condition || "N/A",
        Notes: asset.notes || "N/A",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    

    saveAs(file, `assets-export-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleExportAssets}
        disabled={!assets || assets.length === 0}
        className="flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2.5 bg-app-bg border border-app-gray/15 rounded-md text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiDownload />
        <span>Export</span>
      </button>
    </div>
  );
}