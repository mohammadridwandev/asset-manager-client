import { FiMinus, FiPlus, FiSearch } from "react-icons/fi";
import Add_License from "../../components/Licenses_Compo/Add_License";
import { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import LicensesCard from "../../components/Licenses_Compo/LicensesCard";
import { useLicenses } from "../../context/useLicenses";

export default function LicensePage() {
  const [openLicense, setOpenLicense] = useState(false);

  const [searchText, setSearchText] = useState("");

  const { data: licenses = [], isLoading, isError } = useLicenses();

  const [licenseTypeOpen, setLicenseTypeOpen] = useState(false);

  // UPDATED: default filter changed
  const [selectedType, setSelectedType] = useState("All Types");

  // UPDATED: label UI এর জন্য, value database filter এর জন্য
  const licenseTypes = [
    { label: "Subscription", value: "subscription" },
    { label: "One-time", value: "one-time" },
  ];

  const handleSelect = (licenseType: string) => {
    setSelectedType(licenseType);
    setLicenseTypeOpen(false);
  };

  const filteredLicenses = licenses.filter((license: any) => {
    const search = searchText.toLowerCase();

    const matchSearch =
      license.softwareName?.toLowerCase().includes(search) ||
      license.vendorPublisher?.toLowerCase().includes(search) ||
      license.licenseKey?.toLowerCase().includes(search);

    // UPDATED: subscription / one-time filter fixed
    const matchType =
      selectedType === "All Types" || license.licenseType === selectedType;

    return matchSearch && matchType;
  });

  return (
    <div>
      <div className="py-4 md:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Licenses Management
            </h1>
            <p className="text-light_Gray dark_Gray opacity-60 text-sm mt-1">
              Track software subscriptions and user seats
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <button
              onClick={() => setOpenLicense(!openLicense)}
              className="flex w-full md:w-auto items-center justify-center gap-2 px-5 py-2.5 bg-app-brand rounded-md text-sm font-bold text-app-secondary hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer"
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

        <div className="lg:flex items-center gap-2 lg:space-y-0 space-y-3">
          <div className="relative w-full lg:mx-0">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <FiSearch
                className="text-light_Gray dark_Gray opacity-40"
                size={18}
              />
            </div>

            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by software name, vendor or license key..."
              className="w-full border border-app-gray/15 app-gray/15 rounded-md py-3.5 pl-12 pr-4 outline-none focus:border-app-brand dark_Brand transition-all text-sm text-light_Gray dark_Gray placeholder:text-light_Gray dark_Gray/40"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setLicenseTypeOpen(!licenseTypeOpen)}
              className="w-full sm:w-48 text-left px-4 py-3.5 flex items-center justify-between border rounded-md bg-transparent border-app-gray/30 shadow-xs hover:bg-app-gray/5 focus:outline-none text-sm font-medium"
            >
              {/* UPDATED: selected type label */}
              <span>
                {selectedType === "All Types"
                  ? "All Types"
                  : licenseTypes.find((item) => item.value === selectedType)
                      ?.label}
              </span>

              <MdKeyboardArrowRight
                className={`transform transition-transform duration-200 ${
                  licenseTypeOpen ? "rotate-90" : ""
                }`}
                size={18}
              />
            </button>

            {licenseTypeOpen && (
              <ul className="absolute z-10 w-full sm:w-48 bg-app-bg border border-app-gray/20 rounded-lg shadow-md mt-1 py-1 text-sm">
                {/* UPDATED: all type reset option */}
                <li
                  className="px-4 py-2 hover:bg-app-brand hover:text-white cursor-pointer transition-colors font-semibold"
                  onClick={() => handleSelect("All Types")}
                >
                  All Types
                </li>

                {/* UPDATED: label/value dropdown */}
                {licenseTypes.map((licenseType) => (
                  <li
                    key={licenseType.value}
                    className="px-4 py-2 hover:bg-app-brand hover:text-white cursor-pointer transition-colors"
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
          {openLicense && <Add_License setOpenLicense={setOpenLicense} />}
        </div>
      </div>

      <div>
        <LicensesCard
          licenses={filteredLicenses}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
}