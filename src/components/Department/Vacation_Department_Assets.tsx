import { useState } from "react";

import {
  FiPackage,
  FiSearch,
  FiUser,
} from "react-icons/fi";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

import {
  useGetEmployee,
  useGetSingleEmployee,
} from "../../context/useEmployee";

import {
  useGetDepartments,
  useSendEmployeeToVacation,
} from "../../context/useDepartment";

import { useDebounce } from "../../context/useDebounce";

export default function Vacation_Department_Assets() {

  
  const [searchText, setSearchText] =
    useState("");

  const [
    selectedEmployeeId,
    setSelectedEmployeeId,
  ] = useState<number | null>(null);

  const [
    selectedEmployeeFromSearch,
    setSelectedEmployeeFromSearch,
  ] = useState<any>(null);

  const [
    selectedDepartmentId,
    setSelectedDepartmentId,
  ] = useState("");

  const debouncedSearchText =
    useDebounce(
      searchText.trim(),
      400,
    );

  // =========================
  // EMPLOYEE SEARCH
  // =========================

  const {
    data: employeeData,
    isLoading: employeeLoading,
    isFetching: employeeFetching,
  } = useGetEmployee(
    1,
    20,
    debouncedSearchText,
    "",
    "",
    "",
    debouncedSearchText.length > 0,
  );

  const employees =
    employeeData?.employees || [];

  // =========================
  // GET FULL SELECTED EMPLOYEE
  // =========================

  const {
    data: employeeDetails,
    isLoading: employeeDetailsLoading,
  } = useGetSingleEmployee(
    selectedEmployeeId
      ? String(selectedEmployeeId)
      : undefined,
  );

  const selectedEmployee =
    employeeDetails ||
    selectedEmployeeFromSearch;

  // =========================
  // DEPARTMENTS
  // =========================

  const {
    data: departments = [],
    isLoading: departmentsLoading,
  } = useGetDepartments();

  // =========================
  // VACATION MUTATION
  // =========================

  const sendToVacation =
    useSendEmployeeToVacation();

  const isProcessing =
    sendToVacation.isPending;

  // =========================
  // ACTIVE ASSETS
  // =========================

  const activeAssignments =
    selectedEmployee?.assetAssignments?.filter(
      (assignment: any) =>
        !assignment.returnedAt,
    ) || [];

  const activeAssets =
    activeAssignments.map(
      (assignment: any) =>
        assignment.asset ||
        assignment,
    );

  const hasAssets =
    activeAssignments.length > 0;

  // =========================
  // SELECT EMPLOYEE
  // =========================

  const handleSelectEmployee = (
    employee: any,
  ) => {
    setSelectedEmployeeId(
      Number(employee.id),
    );

    setSelectedEmployeeFromSearch(
      employee,
    );

    setSearchText(
      employee.fullName || "",
    );

    setSelectedDepartmentId("");
  };

  // =========================
  // SEND TO VACATION
  // =========================

  const handleSendToVacation =
    async () => {
      if (!selectedEmployee) {
        toast.error(
          "Please select an employee.",
        );

        return;
      }

      if (
        hasAssets &&
        !selectedDepartmentId
      ) {
        toast.error(
          "Please select a department.",
        );

        return;
      }

      const selectedDepartment =
        departments.find(
          (department: any) =>
            String(
              department.id,
            ) ===
            String(
              selectedDepartmentId,
            ),
        );

      const confirm =
        await Swal.fire({
          title:
            "Send Employee to Vacation?",

          text: hasAssets
            ? `${selectedEmployee.fullName}'s ${activeAssignments.length} asset(s) will be moved to ${selectedDepartment?.name}.`
            : `${selectedEmployee.fullName} will be marked as Vacation.`,

          icon: "question",

          showCancelButton:
            true,

          confirmButtonText:
            "Yes, Continue",

          cancelButtonText:
            "Cancel",

          confirmButtonColor:
            "#2563eb",
        });

      if (
        !confirm.isConfirmed
      ) {
        return;
      }

      try {
        // Asset থাকলে selected department যাবে
        // Backend transaction সব কাজ করবে
        await sendToVacation.mutateAsync({
          employeeId: Number(
            selectedEmployee.id,
          ),

          departmentId:
            hasAssets
              ? Number(
                  selectedDepartmentId,
                )
              : Number(
                  departments?.[0]?.id,
                ),
        });

        await Swal.fire({
          title: "Completed!",

          text: hasAssets
            ? "Employee assets moved to the department and employee status changed to Vacation."
            : "Employee status changed to Vacation.",

          icon: "success",

          timer: 1800,

          showConfirmButton:
            false,
        });

        // Reset
        setSearchText("");

        setSelectedEmployeeId(
          null,
        );

        setSelectedEmployeeFromSearch(
          null,
        );

        setSelectedDepartmentId("");
      } catch (error: any) {
        console.error(
          "Vacation Transfer Error:",
          error,
        );

        // Hook already toast দেখাবে
      }
    };

  const hasSearchText =
    searchText.trim().length >
    0;

  const isTyping =
    searchText.trim() !==
    debouncedSearchText;

  const isSearching =
    isTyping ||
    employeeLoading ||
    employeeFetching;

  return (
    <div className="rounded-xl mt-8 pb-16 border border-app-gray/10 bg-app-bg p-5">
      {/* =========================
          HEADER
      ========================= */}

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-app-brand/10 text-app-brand">
          <FiPackage
            size={20}
          />
        </div>

        <div>
          <h3 className="font-semibold text-app-text">
            Vacation Department Assets
          </h3>

          <p className="text-sm text-app-gray">
            Move employee assets
            to a department before
            vacation
          </p>
        </div>
      </div>

      {/* =========================
          EMPLOYEE SEARCH
      ========================= */}

      <div className="relative mt-5">
        <FiSearch
          size={17}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-app-gray"
        />

        <input
          type="text"
          value={searchText}
          disabled={isProcessing}
          onChange={(event) => {
            setSearchText(
              event.target.value,
            );

            setSelectedEmployeeId(
              null,
            );

            setSelectedEmployeeFromSearch(
              null,
            );

            setSelectedDepartmentId(
              "",
            );
          }}
          placeholder="Search employee by name, email or Iqama..."
          className="w-full rounded-lg border border-app-gray/20 bg-transparent py-3 pr-4 pl-10 text-sm outline-none focus:border-app-brand disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* =========================
          SEARCH RESULT
      ========================= */}

      {hasSearchText &&
        !selectedEmployeeId && (
          <div className="mt-2 max-h-52 overflow-y-auto rounded-lg border border-app-gray/10">
            {isSearching ? (
              <div className="flex items-center justify-center gap-2 p-5 text-sm text-app-brand">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-app-brand/20 border-t-app-brand" />

                Searching...
              </div>
            ) : employees.length >
              0 ? (
              employees.map(
                (
                  employee: any,
                ) => (
                  <button
                    key={
                      employee.id
                    }
                    type="button"
                    disabled={
                      isProcessing
                    }
                    onClick={() =>
                      handleSelectEmployee(
                        employee,
                      )
                    }
                    className="flex w-full cursor-pointer items-center gap-3 border-b border-app-gray/10 px-4 py-3 text-left transition last:border-b-0 hover:bg-app-brand/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-app-brand/10 text-app-brand">
                      <FiUser />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-app-text">
                        {
                          employee.fullName
                        }
                      </p>

                      <p className="truncate text-xs text-app-gray">
                        {employee.position ||
                          employee.email ||
                          employee.iqamaNumber ||
                          "Employee"}
                      </p>
                    </div>
                  </button>
                ),
              )
            ) : (
              <p className="p-4 text-center text-sm text-app-gray">
                No employee found.
              </p>
            )}
          </div>
        )}

      {/* =========================
          SELECTED EMPLOYEE
      ========================= */}

      {selectedEmployeeId && (
        <div className="mt-5 rounded-lg border border-app-gray/10 p-4">
          {employeeDetailsLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-app-brand">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-app-brand/20 border-t-app-brand" />

              Loading employee...
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-app-text">
                    {
                      selectedEmployee?.fullName
                    }
                  </p>

                  <p className="mt-1 text-xs text-app-gray">
                    Current Status:{" "}
                    {selectedEmployee?.status ||
                      "ACTIVE"}
                  </p>
                </div>

                <span className="rounded-full bg-app-brand/10 px-3 py-1 text-xs font-semibold text-app-brand">
                  {
                    activeAssignments.length
                  }{" "}
                  Assets
                </span>
              </div>

              {/* =========================
                  ASSET LIST
              ========================= */}

              <div className="mt-4 border-t border-app-gray/10 pt-4">
                <p className="mb-2 text-xs font-semibold text-app-gray">
                  Assigned Assets
                </p>

                {activeAssets.length >
                0 ? (
                  <div className="space-y-2">
                    {activeAssets.map(
                      (
                        asset: any,
                        index: number,
                      ) => (
                        <div
                          key={
                            asset.id ||
                            index
                          }
                          className="flex items-center justify-between rounded-md border border-app-gray/10 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-app-text">
                              {asset.assetName ||
                                "Unnamed Asset"}
                            </p>

                            <p className="truncate text-xs text-app-gray">
                              {asset.serialNumber ||
                                asset.assetType ||
                                "N/A"}
                            </p>
                          </div>

                          <FiPackage className="shrink-0 text-app-brand" />
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-app-gray">
                    This employee
                    has no assigned
                    assets.
                  </p>
                )}
              </div>

              {/* =========================
                  DEPARTMENT
              ========================= */}

              {hasAssets && (
                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-app-text">
                    Send Assets To
                    Department
                  </label>

                  <select
                    value={
                      selectedDepartmentId
                    }
                    disabled={
                      departmentsLoading ||
                      isProcessing
                    }
                    onChange={(
                      event,
                    ) =>
                      setSelectedDepartmentId(
                        event.target
                          .value,
                      )
                    }
                    className="w-full cursor-pointer rounded-lg border border-app-gray/20 bg-app-bg px-4 py-3 text-sm outline-none focus:border-app-brand disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {departmentsLoading
                        ? "Loading Departments..."
                        : "Select Department"}
                    </option>

                    {departments.map(
                      (
                        department: any,
                      ) => (
                        <option
                          key={
                            department.id
                          }
                          value={
                            department.id
                          }
                        >
                          {
                            department.name
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>
              )}

              {/* =========================
                  ACTION
              ========================= */}

              <div className="mt-5 flex justify-end border-t border-app-gray/10 pt-4">
                <button
                  type="button"
                  onClick={
                    handleSendToVacation
                  }
                  disabled={
                    isProcessing ||
                    employeeDetailsLoading ||
                    (hasAssets &&
                      !selectedDepartmentId)
                  }
                  className="cursor-pointer rounded-lg bg-app-brand px-5 py-2.5 text-sm font-semibold text-app-secondary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing
                    ? "Processing..."
                    : hasAssets
                      ? "Send to Vacation"
                      : "Set Vacation"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}