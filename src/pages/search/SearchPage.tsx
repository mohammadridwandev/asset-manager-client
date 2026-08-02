import { useState } from "react";
import toast from "react-hot-toast";
import { FiSearch, FiX } from "react-icons/fi";
import { Helmet } from "react-helmet-async";

import { useSearchEmployeeProfile } from "../../context/useSearchQuery";
import Search_Info from "../../components/SearchInfo/Search_Info";
import Search_Instructions from "../../components/SearchInfo/Search_Instructions";

export default function SearchPage() {
  const [searchText, setSearchText] = useState("");

  const searchMutation =
    useSearchEmployeeProfile();

  const cleanSearchText =
    searchText.trim();

  const handleSearch = (
    event?: React.FormEvent<HTMLFormElement>,
  ) => {
    event?.preventDefault();

    if (!cleanSearchText) {
      toast.error(
        "Please enter name, Iqama, phone number or email.",
      );

      return;
    }

    if (searchMutation.isPending) {
      return;
    }

    searchMutation.mutate(cleanSearchText);
  };

  const handleClear = () => {
    setSearchText("");
    searchMutation.reset();
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchText(event.target.value);
  };

  return (
    <div>
      <Helmet>
        <title>
          Asset Manager | Search
        </title>
      </Helmet>

      <div className="py-4 md:py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Employee Search
            </h1>

            <p className="mt-1 text-sm opacity-60">
              Search employee profile, assets,
              licenses and reports.
            </p>
          </div>
        </div>

        {/* Search Box */}
        <div className="w-full rounded-xl border border-app-gray/20 bg-app-bg p-5 shadow-xs">
          <label
            htmlFor="employee-search"
            className="mb-2 block text-xs font-semibold"
          >
            Search by Name, Iqama, Email or
            Phone Number
          </label>

          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <input
                id="employee-search"
                type="text"
                value={searchText}
                onChange={handleInputChange}
                placeholder="Enter Name, Iqama, Email or Phone..."
                autoComplete="off"
                className="w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-3 pr-11 text-sm outline-none transition-all focus:border-app-brand"
              />

              {searchText.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear search"
                  className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-app-gray transition hover:text-app-text"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={
                  searchMutation.isPending ||
                  !cleanSearchText
                }
                className="flex min-w-30 cursor-pointer items-center justify-center gap-2 rounded-md bg-app-brand px-5 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {searchMutation.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <FiSearch />

                    <span>Search</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={
                  !searchText &&
                  !searchMutation.data
                }
                className="cursor-pointer rounded-md border border-app-gray/30 px-5 py-2 transition hover:bg-app-gray/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </form>

          {searchMutation.isPending && (
            <p className="mt-3 text-xs text-app-brand">
              Searching employee records...
            </p>
          )}
        </div>

        {/* Search Result */}
        {searchMutation.data && (
          <div className="mt-6">
            <Search_Info
              data={searchMutation.data}
            />
          </div>
        )}
      </div>

      <Search_Instructions />
    </div>
  );
}