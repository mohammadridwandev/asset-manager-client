import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FiCheck,
  FiChevronDown,
  FiSearch,
  FiX,
} from "react-icons/fi";

import {
  useGetEmployeeFilterOptions,
} from "../../context/useEmployee";

import {
  useAssignAssetToDepartment,
} from "../../context/useDepartment";


type Props = {
  asset: any;
  onClose: () => void;
};


export default function Asset_to_Department({
  asset,
  onClose,
}: Props) {
  const dropdownRef =
    useRef<HTMLDivElement | null>(null);

  const [
    isDropdownOpen,
    setIsDropdownOpen,
  ] = useState(false);

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    selectedDepartment,
    setSelectedDepartment,
  ] = useState("");


  // Get departments
  const {
    data: filterOptions,
    isLoading,
    isError,
  } =
    useGetEmployeeFilterOptions();


  const departments: string[] =
    filterOptions?.departments || [];


  // Assign asset
  const assignDepartment =
    useAssignAssetToDepartment();


  // Already assigned departments
  const assignedDepartmentNames =
    useMemo(() => {
      if (
        !Array.isArray(
          asset?.departmentAssignments,
        )
      ) {
        return new Set<string>();
      }

      return new Set<string>(
        asset.departmentAssignments
          .map(
            (assignment: any) =>
              assignment.department?.name
                ?.trim()
                .toLowerCase(),
          )
          .filter(Boolean),
      );
    }, [
      asset?.departmentAssignments,
    ]);


  // Remove already assigned departments
  const availableDepartments =
    useMemo(() => {
      return departments.filter(
        (department) =>
          !assignedDepartmentNames.has(
            department
              .trim()
              .toLowerCase(),
          ),
      );
    }, [
      departments,
      assignedDepartmentNames,
    ]);


  // Search departments
  const filteredDepartments =
    useMemo(() => {
      const keyword =
        searchText
          .trim()
          .toLowerCase();

      if (!keyword) {
        return availableDepartments;
      }

      return availableDepartments.filter(
        (department) =>
          department
            .toLowerCase()
            .includes(keyword),
      );
    }, [
      availableDepartments,
      searchText,
    ]);


  // Close dropdown outside
  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsDropdownOpen(false);
        setSearchText("");
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);


  // Select department
  const handleSelectDepartment = (
    department: string,
  ) => {
    setSelectedDepartment(
      department,
    );

    setIsDropdownOpen(false);

    setSearchText("");
  };


  // Assign department
  const handleAssign = async () => {
    if (!selectedDepartment) {
      return;
    }

    try {
      await assignDepartment.mutateAsync({
        assetId: Number(asset.id),

        departmentName:
          selectedDepartment,
      });

      onClose();
    } catch (error) {
      console.error(
        "Assign Department Error:",
        error,
      );
    }
  };


  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-xl border border-app-gray/20 bg-app-bg shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-app-gray/20 p-5">

          <div>
            <h2 className="text-lg font-bold text-app-text">
              Assign Department
            </h2>

            <p className="mt-1 text-sm text-app-gray">
              {asset?.assetName ||
                "Asset"}
            </p>
          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={
              assignDepartment.isPending
            }
            className="cursor-pointer rounded-md p-2 text-app-gray transition hover:bg-app-gray/10 hover:text-app-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX size={20} />
          </button>

        </div>


        {/* Body */}
        <div className="p-5">

          {/* Asset info */}
          <div className="mb-5 rounded-lg border border-app-gray/20 bg-app-gray/5 p-4">

            <p className="text-xs text-app-gray">
              Asset
            </p>

            <p className="mt-1 font-semibold text-app-text">
              {asset?.assetName ||
                "Unnamed Asset"}
            </p>

            {asset?.serialNumber && (
              <p className="mt-1 text-xs text-app-gray">
                Serial:{" "}
                {asset.serialNumber}
              </p>
            )}

          </div>


          {/* Department label */}
          <label className="mb-2 block text-sm font-medium text-app-text">
            Select Department
          </label>


          {/* Loading */}
          {isLoading && (
            <div className="rounded-md border border-app-gray/30 px-4 py-3 text-sm text-app-gray">
              Loading departments...
            </div>
          )}


          {/* Error */}
          {isError && (
            <div className="rounded-md border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
              Failed to load departments.
            </div>
          )}


          {/* Custom dropdown */}
          {!isLoading &&
            !isError && (
              <div
                ref={dropdownRef}
                className="relative"
              >

                {/* Dropdown button */}
                <button
                  type="button"
                  disabled={
                    assignDepartment.isPending
                  }
                  onClick={() =>
                    setIsDropdownOpen(
                      (previous) =>
                        !previous,
                    )
                  }
                  className="flex w-full cursor-pointer items-center justify-between rounded-md border border-app-gray/30 bg-app-bg px-4 py-3 text-left text-sm text-app-text outline-none transition hover:border-app-brand focus:border-app-brand disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span
                    className={
                      selectedDepartment
                        ? "text-app-text"
                        : "text-app-gray"
                    }
                  >
                    {selectedDepartment ||
                      "Select Department"}
                  </span>

                  <FiChevronDown
                    size={18}
                    className={`shrink-0 text-app-gray transition-transform ${
                      isDropdownOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>


                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 left-0 z-[80] mt-1 overflow-hidden rounded-md border border-app-gray/20 bg-app-bg shadow-lg">

                    {/* Search */}
                    <div className="border-b border-app-gray/20 p-2">

                      <div className="relative">

                        <FiSearch
                          size={16}
                          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-app-gray"
                        />

                        <input
                          type="text"
                          value={
                            searchText
                          }
                          autoFocus
                          onChange={(
                            event,
                          ) =>
                            setSearchText(
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="Search department..."
                          className="w-full rounded-md border border-app-gray/20 bg-transparent py-2 pr-3 pl-9 text-sm text-app-text outline-none placeholder:text-app-gray/60 focus:border-app-brand"
                        />

                      </div>

                    </div>


                    {/* Department options */}
                    <div className="max-h-52 overflow-y-auto p-1">

                      {filteredDepartments.length ===
                      0 ? (
                        <div className="px-3 py-6 text-center text-sm text-app-gray">
                          No departments
                          found.
                        </div>
                      ) : (
                        filteredDepartments.map(
                          (
                            department,
                          ) => {
                            const isSelected =
                              selectedDepartment ===
                              department;

                            return (
                              <button
                                key={
                                  department
                                }
                                type="button"
                                onClick={() =>
                                  handleSelectDepartment(
                                    department,
                                  )
                                }
                                className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition ${
                                  isSelected
                                    ? "bg-app-brand/10 font-medium text-app-brand"
                                    : "text-app-text hover:bg-app-gray/10"
                                }`}
                              >
                                <span className="truncate">
                                  {
                                    department
                                  }
                                </span>

                                {isSelected && (
                                  <FiCheck
                                    size={
                                      16
                                    }
                                    className="shrink-0 text-app-brand"
                                  />
                                )}
                              </button>
                            );
                          },
                        )
                      )}

                    </div>

                  </div>
                )}

              </div>
            )}


          {/* No departments */}
          {!isLoading &&
            !isError &&
            availableDepartments.length ===
              0 && (
              <p className="mt-2 text-xs text-app-gray">
                No available departments.
              </p>
            )}


          {/* Selected department */}
          {selectedDepartment && (
            <div className="mt-4 flex items-center gap-3 rounded-md border border-app-brand/20 bg-app-brand/5 px-4 py-3">

              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-app-brand text-white">
                <FiCheck size={13} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-app-gray">
                  Selected Department
                </p>

                <p className="truncate text-sm font-semibold text-app-text">
                  {selectedDepartment}
                </p>
              </div>

            </div>
          )}

        </div>


        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-app-gray/20 p-5">

          <button
            type="button"
            onClick={onClose}
            disabled={
              assignDepartment.isPending
            }
            className="cursor-pointer rounded-md border border-app-gray/30 px-4 py-2 text-sm font-medium text-app-text transition hover:bg-app-gray/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>


          <button
            type="button"
            onClick={
              handleAssign
            }
            disabled={
              !selectedDepartment ||
              assignDepartment.isPending
            }
            className="cursor-pointer rounded-md bg-app-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {assignDepartment.isPending
              ? "Assigning..."
              : "Assign Department"}
          </button>

        </div>

      </div>

    </div>
  );
}