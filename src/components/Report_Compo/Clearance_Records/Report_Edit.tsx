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

  const currentCondition =
    report?.deviceCondition || "Good";

  const isStandardCondition =
    standardConditions.includes(currentCondition);

  const [deviceCondition, setDeviceCondition] =
    useState(
      isStandardCondition
        ? currentCondition
        : "Custom",
    );

  const [customCondition, setCustomCondition] =
    useState(
      isStandardCondition ? "" : currentCondition,
    );

  const [status, setStatus] = useState(
    report?.status || "APPROVED",
  );


  useEffect(() => {
    const updatedCondition =
      report?.deviceCondition || "Good";

    const isStandard =
      standardConditions.includes(updatedCondition);

    setDeviceCondition(
      isStandard ? updatedCondition : "Custom",
    );

    setCustomCondition(
      isStandard ? "" : updatedCondition,
    );

    setStatus(report?.status || "APPROVED");
  }, [report]);


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

    const updateData = {
      deviceCondition: finalDeviceCondition,
      status,
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
              "Failed to update clearance report.",
            icon: "error",
          });
        },

      },
    );
  };


  


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-xl border border-app-gray/20 bg-app-bg p-6 text-app-text shadow-xl animate-scaleIn">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-app-gray/10 pb-3">

          <h3 className="flex items-center gap-2 text-base font-bold">
            <FiFileText className="text-app-brand" />
            Edit Clearance Report
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-app-gray transition-all hover:bg-app-brand/10 hover:text-app-brand"
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

          <div className="mt-3 space-y-2 text-sm">
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
          className="space-y-5"
        >
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
              <option value="Good">Good</option>

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
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-app-gray/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={updateReport.isPending}
              className="rounded-lg border border-app-gray/30 px-5 py-2.5 text-sm disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateReport.isPending}
              className="flex items-center justify-center gap-2 rounded-lg bg-app-brand px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
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