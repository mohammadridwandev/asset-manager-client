import { useEffect, useState } from "react";
import { FiX, FiSave, FiFileText } from "react-icons/fi";
import Swal from "sweetalert2";
import { useUpdateReport } from "../../../context/useReport";

export default function Report_Edit({
  report,
  onClose,
}: {
  report: any;
  onClose: () => void;
}) {
  const updateReport = useUpdateReport();

  const standardConditions = ["Good", "Damage", "Broken"];

  const [deviceCondition, setDeviceCondition] = useState("Good");
  const [customCondition, setCustomCondition] = useState("");
  const [status, setStatus] = useState("APPROVED");

  const [assignedAssets, setAssignedAssets] = useState<any[]>([]);
  const [assignedLicenses, setAssignedLicenses] = useState<any[]>([]);

  useEffect(() => {
    const currentCondition = report?.deviceCondition || "Good";

    const isStandardCondition =
      standardConditions.includes(currentCondition);

    setDeviceCondition(
      isStandardCondition ? currentCondition : "Custom",
    );

    setCustomCondition(
      isStandardCondition ? "" : currentCondition,
    );

    setStatus(report?.status || "APPROVED");

    setAssignedAssets(
      Array.isArray(report?.assignedAssets)
        ? report.assignedAssets
        : [],
    );

    setAssignedLicenses(
      Array.isArray(report?.assignedLicenses)
        ? report.assignedLicenses
        : [],
    );
  }, [report]);

  const totalAssetPrice = assignedAssets.reduce(
    (total: number, asset: any) =>
      total + Number(asset?.price || 0),
    0,
  );

  const totalLicenseCost = assignedLicenses.reduce(
    (total: number, license: any) =>
      total + Number(license?.costs || 0),
    0,
  );

  const handleAssetChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    setAssignedAssets((previousAssets) =>
      previousAssets.map((asset, assetIndex) =>
        assetIndex === index
          ? {
              ...asset,
              [field]:
                field === "price"
                  ? Number(value)
                  : value,
            }
          : asset,
      ),
    );
  };

  const handleLicenseChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    setAssignedLicenses((previousLicenses) =>
      previousLicenses.map(
        (license, licenseIndex) =>
          licenseIndex === index
            ? {
                ...license,
                [field]:
                  field === "costs"
                    ? Number(value)
                    : value,
              }
            : license,
      ),
    );
  };

  const handleUpdateReport = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      deviceCondition === "Custom" &&
      !customCondition.trim()
    ) {
      Swal.fire({
        title: "Condition Required",
        text: "Please enter the custom device condition.",
        icon: "warning",
      });

      return;
    }

    const finalDeviceCondition =
      deviceCondition === "Custom"
        ? customCondition.trim()
        : deviceCondition;

    const employeeName =
      report?.employee?.fullName ||
      "Unknown Employee";

    const employeeDepartment =
      report?.employee?.department ||
      "No Department";

    const employeePosition =
      report?.employee?.position || "N/A";

    const readableStatus = status.replaceAll("_", " ");

    const description = `
Employee clearance report has been updated.

Employee: ${employeeName}
Department: ${employeeDepartment}
Position: ${employeePosition}

Device Condition: ${finalDeviceCondition}

Assigned Assets: ${assignedAssets.length}
Total Asset Value: ${totalAssetPrice.toFixed(2)}

Assigned Licenses: ${assignedLicenses.length}
Total License Cost: ${totalLicenseCost.toFixed(2)}

Final Decision: ${readableStatus}
    `.trim();

    const updateData = {
      deviceCondition: finalDeviceCondition,
      status,
      assignedAssets,
      assignedLicenses,
      totalAssetPrice,
      totalLicenseCost,
      description,
      title: `Employee Clearance Report ${readableStatus}`,
    };

    updateReport.mutate(
      {
        id: String(report.id),
        updateData,
      },
      {
        onSuccess: () => {
          Swal.fire({
            title: "Updated!",
            text: "Clearance report updated successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          onClose();
        },

        onError: (error: any) => {
          Swal.fire({
            title: "Failed!",
            text:
              error?.response?.data?.message ||
              error?.response?.data?.error ||
              "Failed to update clearance report.",
            icon: "error",
          });
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-fadeIn">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-app-gray/20 bg-app-bg p-6 text-app-text shadow-xl animate-scaleIn">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-app-gray/10 pb-3">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <FiFileText className="text-app-brand" />
            Edit Clearance Report
          </h3>

          <button
            type="button"
            onClick={onClose}
            disabled={updateReport.isPending}
            className="cursor-pointer rounded-lg p-1 text-app-gray transition-all hover:bg-app-brand/10 hover:text-app-brand disabled:opacity-50"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Employee Information */}
        <div className="mb-6 rounded-lg border border-app-gray/20 bg-app-gray/5 p-4">
          <h2 className="text-lg font-bold">
            {report?.employee?.fullName ||
              "Unknown Employee"}
          </h2>

          <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <p>
              <span className="font-semibold">
                Iqama:
              </span>{" "}
              <span className="text-app-gray">
                {report?.employee?.iqamaNumber ||
                  "N/A"}
              </span>
            </p>

            <p>
              <span className="font-semibold">
                Department:
              </span>{" "}
              <span className="text-app-gray">
                {report?.employee?.department ||
                  "No Department"}
              </span>
            </p>

            <p>
              <span className="font-semibold">
                Position:
              </span>{" "}
              <span className="text-app-gray">
                {report?.employee?.position ||
                  "N/A"}
              </span>
            </p>

            <p>
              <span className="font-semibold">
                Employee Status:
              </span>{" "}
              <span className="text-app-gray">
                {report?.employee?.status ||
                  "N/A"}
              </span>
            </p>
          </div>
        </div>

        <form
          onSubmit={handleUpdateReport}
          className="space-y-6"
        >
          {/* Assigned Assets */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold">
                Assigned Assets
              </h4>

              <span className="text-xs text-app-gray">
                Total: {assignedAssets.length}
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-app-gray/20">
              <table className="min-w-[850px] w-full text-sm">
                <thead className="bg-app-brand/10">
                  <tr>
                    <th className="p-2 text-left">
                      Name
                    </th>

                    <th className="p-2 text-left">
                      Type
                    </th>

                    <th className="p-2 text-left">
                      Serial
                    </th>

                    <th className="p-2 text-left">
                      Condition
                    </th>

                    <th className="p-2 text-right">
                      Price
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {assignedAssets.length > 0 ? (
                    assignedAssets.map(
                      (asset: any, index: number) => (
                        <tr
                          key={asset.id || index}
                          className="border-t border-app-gray/10"
                        >
                          <td className="p-2">
                            <input
                              type="text"
                              value={
                                asset.assetName || ""
                              }
                              onChange={(event) =>
                                handleAssetChange(
                                  index,
                                  "assetName",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-md border border-app-gray/30 bg-app-bg px-2 py-1.5 outline-none focus:border-app-brand"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="text"
                              value={
                                asset.assetType || ""
                              }
                              onChange={(event) =>
                                handleAssetChange(
                                  index,
                                  "assetType",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-md border border-app-gray/30 bg-app-bg px-2 py-1.5 outline-none focus:border-app-brand"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="text"
                              value={
                                asset.serialNumber || ""
                              }
                              onChange={(event) =>
                                handleAssetChange(
                                  index,
                                  "serialNumber",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-md border border-app-gray/30 bg-app-bg px-2 py-1.5 outline-none focus:border-app-brand"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="text"
                              value={
                                asset.condition || ""
                              }
                              onChange={(event) =>
                                handleAssetChange(
                                  index,
                                  "condition",
                                  event.target.value,
                                )
                              }
                              placeholder="Condition"
                              className="w-full rounded-md border border-app-gray/30 bg-app-bg px-2 py-1.5 outline-none focus:border-app-brand"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={
                                asset.price ?? 0
                              }
                              onChange={(event) =>
                                handleAssetChange(
                                  index,
                                  "price",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-md border border-app-gray/30 bg-app-bg px-2 py-1.5 text-right outline-none focus:border-app-brand"
                            />
                          </td>
                        </tr>
                      ),
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-4 text-center text-app-gray"
                      >
                        No assigned assets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-2 flex justify-end text-sm font-semibold">
              Total Asset Value:{" "}
              {totalAssetPrice.toFixed(2)}
            </div>
          </div>


          {/* Assigned Licenses */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold">
                Assigned Licenses
              </h4>

              <span className="text-xs text-app-gray">
                Total: {assignedLicenses.length}
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-app-gray/20">
              <table className="min-w-[750px] w-full text-sm">
                <thead className="bg-app-brand/10">
                  <tr>
                    <th className="p-2 text-left">
                      Software
                    </th>

                    <th className="p-2 text-left">
                      License Type
                    </th>

                    <th className="p-2 text-left">
                      License Key
                    </th>

                    <th className="p-2 text-right">
                      Cost
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {assignedLicenses.length > 0 ? (
                    assignedLicenses.map(
                      (
                        license: any,
                        index: number,
                      ) => (
                        <tr
                          key={license.id || index}
                          className="border-t border-app-gray/10"
                        >
                          <td className="p-2">
                            <input
                              type="text"
                              value={
                                license.softwareName ||
                                ""
                              }
                              onChange={(event) =>
                                handleLicenseChange(
                                  index,
                                  "softwareName",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-md border border-app-gray/30 bg-app-bg px-2 py-1.5 outline-none focus:border-app-brand"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="text"
                              value={
                                license.licenseType ||
                                ""
                              }
                              onChange={(event) =>
                                handleLicenseChange(
                                  index,
                                  "licenseType",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-md border border-app-gray/30 bg-app-bg px-2 py-1.5 outline-none focus:border-app-brand"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="text"
                              value={
                                license.licenseKey ||
                                ""
                              }
                              onChange={(event) =>
                                handleLicenseChange(
                                  index,
                                  "licenseKey",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-md border border-app-gray/30 bg-app-bg px-2 py-1.5 outline-none focus:border-app-brand"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={
                                license.costs ?? 0
                              }
                              onChange={(event) =>
                                handleLicenseChange(
                                  index,
                                  "costs",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-md border border-app-gray/30 bg-app-bg px-2 py-1.5 text-right outline-none focus:border-app-brand"
                            />
                          </td>
                        </tr>
                      ),
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-center text-app-gray"
                      >
                        No assigned licenses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-2 flex justify-end text-sm font-semibold">
              Total License Cost:{" "}
              {totalLicenseCost.toFixed(2)}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Device Condition */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Device Condition
              </label>

              <select
                value={deviceCondition}
                onChange={(event) =>
                  setDeviceCondition(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-app-gray/30 bg-app-bg px-3 py-2.5 text-sm outline-none focus:border-app-brand"
              >
                <option value="Good">
                  Good
                </option>

                <option value="Damage">
                  Damage
                </option>

                <option value="Broken">
                  Broken
                </option>

                <option value="Custom">
                  Custom
                </option>
              </select>

              {deviceCondition === "Custom" && (
                <input
                  type="text"
                  value={customCondition}
                  onChange={(event) =>
                    setCustomCondition(
                      event.target.value,
                    )
                  }
                  placeholder="Enter custom device condition"
                  className="mt-3 w-full rounded-lg border border-app-gray/30 bg-app-bg px-3 py-2.5 text-sm outline-none focus:border-app-brand"
                />
              )}
            </div>

            {/* Report Status */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Report Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="w-full rounded-lg border border-app-gray/30 bg-app-bg px-3 py-2.5 text-sm outline-none focus:border-app-brand"
              >
                <option value="APPROVED">
                  Approved
                </option>

                <option value="REJECTED">
                  Rejected
                </option>

                <option value="PENDING_FINANCE">
                  Pending Finance
                </option>

                <option value="FINALIZED">
                  Finalized
                </option>
              </select>

              <p className="mt-2 text-xs text-app-gray">
                Saving will move the report to
                the selected status tab.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-app-gray/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={updateReport.isPending}
              className="cursor-pointer rounded-lg border border-app-gray/30 px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateReport.isPending}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-app-brand px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiSave size={15} />

              {updateReport.isPending
                ? "Updating..."
                : "Save Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}