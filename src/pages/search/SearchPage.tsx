import { useState } from "react";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

import { useSearchEmployeeProfile } from "../../context/useSearchQuery";
import Search_Info from "../../components/SearchInfo/Search_Info";
import Search_Instructions from "../../components/SearchInfo/Search_Instructions";



export default function SearchPage() {
  // UPDATED: Search State
  const [searchText, setSearchText] = useState("");

  // UPDATED: Search Hook
  const searchMutation = useSearchEmployeeProfile();

  // UPDATED: Search Handler
  const handleSearch = () => {
    if (!searchText.trim()) {
      toast.error("Please enter name, iqama, phone number or email.");
      return;
    }
    searchMutation.mutate(searchText);
  };

  // UPDATED: Clear Handler
  const handleClear = () => {
    setSearchText("");
    searchMutation.reset();
  };


  return (
    <div>

      <div className="py-4 md:py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Employee Search
            </h1>

            <p className="opacity-60 text-sm mt-1">
              Search employee profile, assets, licenses and reports.
            </p>
          </div>
        </div>

        {/* Search Box */}
        <div className="w-full p-5 bg-app-bg border border-app-gray/20 rounded-xl shadow-xs">

          <label className="block text-xs font-semibold mb-2">
            Search by Name, Iqama, Email or Phone Number
          </label>

          <div className="flex flex-col sm:flex-row gap-3">

            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              type="text"
              placeholder="Enter Name, Iqama, Email or Phone..."
              className="flex-1 px-4 py-3 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand text-sm"
            />

            <div className="flex gap-2">

              <button
                onClick={handleSearch}
                disabled={searchMutation.isPending}
                className="flex items-center gap-2 px-5 py-2 rounded-md bg-app-brand text-white font-semibold disabled:opacity-60"
              >
                <FiSearch />

                {searchMutation.isPending ? "Searching..." : "Search"}
              </button>

              <button
                onClick={handleClear}
                className="px-5 py-2 rounded-md border border-app-gray/30"
              >
                Clear
              </button>

            </div>
          </div>
        </div>

        {/* Search Result */}

        {searchMutation.data && (
          <Search_Info data={searchMutation.data} />
        )}
      </div>

        <Search_Instructions></Search_Instructions>

    </div>
  );
}