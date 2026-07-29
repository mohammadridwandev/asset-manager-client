import { FiMinus, FiPlus, FiSearch } from "react-icons/fi";
import Add_License from "../../components/Licenses_Compo/Add_License";
import { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import LicensesCard from "../../components/Licenses_Compo/LicensesCard";
import { useLicenses } from "../../context/useLicenses";
import License_Pagination from "../../components/Licenses_Compo/Licenses_Pagination";
import { Helmet } from "react-helmet-async";

export default function LicensePage() {
  const [openLicense, setOpenLicense] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const [licenseTypeOpen, setLicenseTypeOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All Types");

  const licenseTypes = [
    {
      label: "Subscription",
      value: "subscription",
    },
    {
      label: "One-time",
      value: "one-time",
    },
  ];

  const { data, isLoading, isError } = useLicenses(
    page,
    10,
    searchText,
    selectedType,
  );

  const licenses = data?.licenses || [];
  const pagination = data?.pagination;

  const handleSelect = (licenseType: string) => {
    setSelectedType(licenseType);
    setLicenseTypeOpen(false);
  };

  useEffect(() => {
    setPage(1);
  }, [searchText, selectedType]);

  return (
    <div className="pb-16">


  <Helmet>
    <title>Asset Manager | Licenses</title>
  </Helmet>


      <div className="py-4 md:py-8">
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Licenses Management
            </h1>

            <p className="mt-1 text-sm text-light_Gray opacity-60 dark_Gray">
              Track software subscriptions and user seats
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => setOpenLicense(!openLicense)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-app-brand px-5 py-2.5 text-sm font-bold text-app-secondary shadow-md transition-all hover:opacity-90 active:scale-95 md:w-auto"
            >
              {openLicense ? (
                <>
                  <FiMinus size={18} />
                  <span>Close</span>
                </>
              ) : (
                <>
                  <FiPlus size={18} />
                  <span>Add Licenses</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-3 lg:flex lg:items-center lg:gap-2 lg:space-y-0">
          <div className="relative w-full lg:mx-0">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
              <FiSearch
                className="text-light_Gray opacity-40 dark_Gray"
                size={18}
              />
            </div>

            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by software name, vendor or license key..."
              className="w-full rounded-md border border-app-gray/15 py-3.5 pr-4 pl-12 text-sm text-light_Gray outline-none transition-all placeholder:text-light_Gray/40 focus:border-app-brand dark_Gray"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setLicenseTypeOpen(!licenseTypeOpen)}
              className="flex w-full items-center justify-between rounded-md border border-app-gray/30 bg-transparent px-4 py-3.5 text-left text-sm font-medium shadow-xs hover:bg-app-gray/5 focus:outline-none sm:w-48"
            >
              <span>
                {selectedType === "All Types"
                  ? "All Types"
                  : licenseTypes.find(
                      (item) => item.value === selectedType,
                    )?.label}
              </span>

              <MdKeyboardArrowRight
                className={`transform transition-transform duration-200 ${
                  licenseTypeOpen ? "rotate-90" : ""
                }`}
                size={18}
              />
            </button>

            {licenseTypeOpen && (
              <ul className="absolute z-10 mt-1 w-full rounded-lg border border-app-gray/20 bg-app-bg py-1 text-sm shadow-md sm:w-48">
                <li
                  className="cursor-pointer px-4 py-2 font-semibold transition-colors hover:bg-app-brand hover:text-white"
                  onClick={() => handleSelect("All Types")}
                >
                  All Types
                </li>

                {licenseTypes.map((licenseType) => (
                  <li
                    key={licenseType.value}
                    className="cursor-pointer px-4 py-2 transition-colors hover:bg-app-brand hover:text-white"
                    onClick={() => handleSelect(licenseType.value)}
                  >
                    {licenseType.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          {openLicense && (
            <Add_License setOpenLicense={setOpenLicense} />
          )}
        </div>
      </div>

      <div>
        <LicensesCard
          licenses={licenses}
          totalLicenses={pagination?.totalData}
          isLoading={isLoading}
          isError={isError}
        />

        <License_Pagination
          currentPage={pagination?.currentPage || 1}
          totalPages={pagination?.totalPages || 1}
          hasNextPage={pagination?.hasNextPage || false}
          hasPreviousPage={pagination?.hasPreviousPage || false}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}