import { FiMinus, FiPlus, FiSearch } from "react-icons/fi";
import Add_Asset from "../../components/Asset_Compo/Add_Asset";
import { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import Asset_Card from "../../components/Asset_Compo/Asset_Card";
import { useGetAssets } from "../../context/useAssets";
import Asset_Import from "../../components/Asset_Compo/Asset_Import";
import Asset_Export from "../../components/Asset_Compo/Asset_Export";

export default function AssetPage() {
  const [assetOpen, setAssetOpen] = useState(false);

  const [searchText, setSearchText] = useState("");

  const { data: assets = [], isLoading, isError } = useGetAssets();

  const [assetTypeOpen, setAssetTypeOpen] = useState(false);

  // UPDATED: default label changed for all type filter
  const [selectedType, setSelectedType] = useState("All Types");

  const assetTypes: string[] = assets
    .map((asset: any) => String(asset.assetType || "").trim())
    .filter((type: string) => type.length > 0)
    .filter((type: string, index: number, array: string[]) => {
      return array.indexOf(type) === index;
    })
    .sort();

  const handleSelect = (assetType: string) => {
    setSelectedType(assetType);
    setAssetTypeOpen(false);
  };

  const [assignmentOpen, setAssignmentOpen] = useState(false);

  // UPDATED: default label changed for all assignment filter
  const [selectedAssignment, setSelectedAssignment] = useState("All Status");

  // UPDATED: Available changed to Unassigned
  const assignmentTypes = ["Assigned", "Unassigned"];

  const handleAssignmentSelect = (assignmentType: string) => {
    setSelectedAssignment(assignmentType);
    setAssignmentOpen(false);
  };

  const filteredAssets = assets.filter((asset: any) => {
    const search = searchText.toLowerCase();

    const matchSearch =
      asset.assetName?.toLowerCase().includes(search) ||
      asset.serialNumber?.toLowerCase().includes(search) ||
      asset.invoiceNumber?.toLowerCase().includes(search) ||
      asset.assetType?.toLowerCase().includes(search);

    // UPDATED: dynamic All Types filter support
    const matchType =
      selectedType === "All Types" || asset.assetType === selectedType;

    const isAssigned = asset.assignments?.length > 0;

    // UPDATED: Assigned / Unassigned filter fixed
    const matchAssignment =
      selectedAssignment === "All Status" ||
      (selectedAssignment === "Assigned" && isAssigned) ||
      (selectedAssignment === "Unassigned" && !isAssigned);

    return matchSearch && matchType && matchAssignment;
  });

  return (
    <>
      <div className="bg-app-bg mt-3 text-app-text transition-colors duration-300">
        <div className="py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Asset Management
              </h1>
              <p className="text-app-gray opacity-80 text-sm mt-1">
                Track and manage company assets
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Asset_Export assets={filteredAssets} />
              <Asset_Import />

              <button
                onClick={() => setAssetOpen(!assetOpen)}
                className="flex w-full md:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-app-brand text-white hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {assetOpen ? (
                  <>
                    <FiMinus size={18} />
                    <span>Close</span>
                  </>
                ) : (
                  <>
                    <FiPlus size={18} />
                    <span>Add Asset</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
            <div className="relative flex-1">
              <div className="absolute -top-1 inset-y-0 left-4 flex items-center pointer-events-none text-app-gray opacity-60">
                <FiSearch size={18} />
              </div>

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by asset name, serial number, invoice number or type..."
                className="w-full border border-app-gray/30 rounded-md py-2.5 pl-12 outline-none focus:border-app-brand bg-transparent transition-all
                text-sm placeholder:text-app-gray/50"
              />
            </div>

            {/* UPDATED: Dynamic Asset Type Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAssetTypeOpen(!assetTypeOpen)}
                className="w-full sm:w-48 text-left px-4 py-2.5 flex items-center justify-between border rounded-md bg-transparent border-app-gray/30 shadow-xs 
                hover:bg-app-gray/5 focus:outline-none text-sm font-medium"
              >
                <span>{selectedType}</span>
                <MdKeyboardArrowRight
                  className={`transform transition-transform duration-200 ${
                    assetTypeOpen ? "rotate-90" : ""
                  }`}
                  size={18}
                />
              </button>

              {assetTypeOpen && (
                <ul className="absolute z-10 w-full sm:w-48 bg-app-bg border border-app-gray/20 rounded-lg shadow-md mt-1 py-1 text-sm ">
                  {/* UPDATED: all types reset option */}
                  <li
                    className="px-4 py-2 hover:bg-app-brand hover:text-white cursor-pointer transition-colors font-semibold"
                    onClick={() => handleSelect("All Types")}
                  >
                    All Types
                  </li>

                  {assetTypes.map((assetType) => (
                    <li
                      key={assetType}
                      className="px-4 py-2 hover:bg-app-brand hover:text-white cursor-pointer transition-colors"
                      onClick={() => handleSelect(assetType)}
                    >
                      {assetType}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* UPDATED: Assigned / Unassigned Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAssignmentOpen(!assignmentOpen)}
                className="w-full sm:w-48 text-left px-4 py-2.5 flex items-center justify-between border rounded-md bg-transparent border-app-gray/30 shadow-xs hover:bg-app-gray/5 focus:outline-none text-sm font-medium"
              >
                <span>{selectedAssignment}</span>
                <MdKeyboardArrowRight
                  className={`transform transition-transform duration-200 ${
                    assignmentOpen ? "rotate-90" : ""
                  }`}
                  size={18}
                />
              </button>

              {assignmentOpen && (
                <ul className="absolute z-10 w-full sm:w-48 bg-app-bg border border-app-gray/20 rounded-lg shadow-md mt-1 py-1 text-sm">
                  {/* UPDATED: all status reset option */}
                  <li
                    className="px-4 py-2 hover:bg-app-brand hover:text-white cursor-pointer transition-colors font-semibold"
                    onClick={() => handleAssignmentSelect("All Status")}
                  >
                    All Status
                  </li>

                  {assignmentTypes.map((assignmentType) => (
                    <li
                      key={assignmentType}
                      className="px-4 py-2 hover:bg-app-brand hover:text-white cursor-pointer transition-colors"
                      onClick={() => handleAssignmentSelect(assignmentType)}
                    >
                      {assignmentType}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="transition-all duration-300">
            {assetOpen && <Add_Asset setAssetOpen={setAssetOpen} />}
          </div>
        </div>

        <div>
          <Asset_Card
            assets={filteredAssets}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>
    </>
  );
}
