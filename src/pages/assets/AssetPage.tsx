import { FiMinus, FiPlus, FiSearch } from "react-icons/fi";
import Add_Asset from "../../components/Asset_Compo/Add_Asset";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import Asset_Card from "../../components/Asset_Compo/Asset_Card";
import { useGetAssets } from "../../context/useAssets";
import Asset_Import from "../../components/Asset_Compo/Asset_Import";
import Asset_Export from "../../components/Asset_Compo/Asset_Export";
import Asset_Pagination from "../../components/Asset_Compo/Asset_Pagination";
import { Helmet } from "react-helmet-async";
import DataLoading from "../../DataLoading";

export default function AssetPage() {
  const [assetOpen, setAssetOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [page, setPage] = useState(1);
  const assetListRef = useRef<HTMLDivElement>(null);

  const [assetTypeOpen, setAssetTypeOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All Types");

  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState("All Status");

  const assignmentTypes = ["Assigned", "Unassigned"];

  const { data, isLoading, isError } = useGetAssets(
    page,
    10,
    searchText,
    selectedType,
    selectedAssignment,
  );

  const assets = data?.assets || [];
  const pagination = data?.pagination;

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

  const handleAssignmentSelect = (assignmentType: string) => {
    setSelectedAssignment(assignmentType);
    setAssignmentOpen(false);
  };

  useEffect(() => {
    setPage(1);
  }, [searchText, selectedType, selectedAssignment]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    setTimeout(() => {
      assetListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  if (isLoading) {
    return (
      <DataLoading
        title="Loading Assets"
        message="Fetching asset inventory..."
      />
    );
  }

  


  return (
    <>
      <Helmet>
        <title>Asset Manager | Assets</title>
      </Helmet>

      <div className="mt-3 bg-app-bg pb-16 text-app-text transition-colors duration-300">
        <div className="py-4">
          <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Asset Management
              </h1>

              <p className="mt-1 text-sm text-app-gray opacity-80">
                Track and manage company assets
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Asset_Export />

              <Asset_Import />

              <button
                type="button"
                onClick={() => setAssetOpen(!assetOpen)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-app-brand px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95 md:w-auto"
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

          <div className="mb-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 -top-1 left-4 flex items-center text-app-gray opacity-60">
                <FiSearch size={18} />
              </div>

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by asset name, serial number, invoice number, type, employee name, email, or Iqama..."
                className="w-full rounded-md border border-app-gray/30 bg-transparent py-2.5 pl-12 text-sm outline-none transition-all placeholder:text-app-gray/50 focus:border-app-brand"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAssetTypeOpen(!assetTypeOpen)}
                className="flex w-full items-center justify-between rounded-md border border-app-gray/30 bg-transparent px-4 py-2.5 text-left text-sm font-medium shadow-xs hover:bg-app-gray/5 focus:outline-none sm:w-48"
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
                <ul className="absolute z-10 mt-1 w-full rounded-lg border border-app-gray/20 bg-app-bg py-1 text-sm shadow-md sm:w-48">
                  <li
                    className="cursor-pointer px-4 py-2 font-semibold transition-colors hover:bg-app-brand hover:text-white"
                    onClick={() => handleSelect("All Types")}
                  >
                    All Types
                  </li>

                  {assetTypes.map((assetType) => (
                    <li
                      key={assetType}
                      className="cursor-pointer px-4 py-2 transition-colors hover:bg-app-brand hover:text-white"
                      onClick={() => handleSelect(assetType)}
                    >
                      {assetType}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAssignmentOpen(!assignmentOpen)}
                className="flex w-full items-center justify-between rounded-md border border-app-gray/30 bg-transparent px-4 py-2.5 text-left text-sm font-medium shadow-xs hover:bg-app-gray/5 focus:outline-none sm:w-48"
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
                <ul className="absolute z-10 mt-1 w-full rounded-lg border border-app-gray/20 bg-app-bg py-1 text-sm shadow-md sm:w-48">
                  <li
                    className="cursor-pointer px-4 py-2 font-semibold transition-colors hover:bg-app-brand hover:text-white"
                    onClick={() => handleAssignmentSelect("All Status")}
                  >
                    All Status
                  </li>

                  {assignmentTypes.map((assignmentType) => (
                    <li
                      key={assignmentType}
                      className="cursor-pointer px-4 py-2 transition-colors hover:bg-app-brand hover:text-white"
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
          <div ref={assetListRef} className="scroll-mt-24">
            <Asset_Card
              assets={assets}
              totalAssets={pagination?.totalData}
              isLoading={isLoading}
              isError={isError}
            />
          </div>

          <Asset_Pagination
            currentPage={pagination?.currentPage || 1}
            totalPages={pagination?.totalPages || 1}
            hasNextPage={pagination?.hasNextPage || false}
            hasPreviousPage={pagination?.hasPreviousPage || false}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
