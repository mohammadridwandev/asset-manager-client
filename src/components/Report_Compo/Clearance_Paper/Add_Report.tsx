import { FiX, FiFileText } from "react-icons/fi";
import { useCreateReport } from "../../../context/useReport";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Add_Report({
  employee,
  onClose,
}: {
  employee: any;
  onClose: () => void;
}) {
  const createReport = useCreateReport();

  const [condition, setCondition] = useState("Good");
  const [customCondition, setCustomCondition] = useState("");

  const activeAssets =
    employee?.assetAssignments?.filter((item: any) => !item.returnedAt) || [];

  const activeLicenses =
    employee?.licenseAssignments?.filter((item: any) => !item.returnedAt) || [];

  const totalAssetPrice = activeAssets.reduce(
    (sum: number, item: any) => sum + Number(item.asset?.price || 0),
    0,
  );

  const totalLicenseCost = activeLicenses.reduce(
    (sum: number, item: any) => sum + Number(item.license?.costs || 0),
    0,
  );

  const finalCondition =
    condition === "Custom" ? customCondition || "Custom" : condition;


  const reportSnapshotData = {
  deviceCondition: finalCondition,

  assignedAssets: activeAssets.map((item: any) => ({
    id: item.asset?.id,
    assetName: item.asset?.assetName,
    assetType: item.asset?.assetType,
    serialNumber: item.asset?.serialNumber,
    price: Number(item.asset?.price || 0),
    condition: finalCondition,
  })),

  assignedLicenses: activeLicenses.map((item: any) => ({
    id: item.license?.id,
    softwareName: item.license?.softwareName,
    licenseKey: item.license?.licenseKey,
    licenseType: item.license?.licenseType,
    costs: Number(item.license?.costs || 0),
  })),

  totalAssetPrice,
  totalLicenseCost,
};






  const handleApproveReport = () => {
    const reportData = {
      title: "Employee Clearance Report Approved",
      reportType: "CLEARANCE",
      employeeId: employee.id,
      status: "APPROVED",

      ...reportSnapshotData,

      description: `
      Employee clearance report has been approved.

      Employee: ${employee.fullName}
      Department: ${employee.department || "No Department"}
      Position: ${employee.position || "N/A"}

      Device Condition: ${finalCondition}

      Assigned Assets: ${activeAssets.length}
      Total Asset Value: ${totalAssetPrice.toFixed(2)}

      Assigned Licenses: ${activeLicenses.length}
      Total License Cost: ${totalLicenseCost.toFixed(2)}

      Final Decision: Approved
    `,
    };

    createReport.mutate(reportData, {
      onSuccess: () => {
        toast.success(
          "Employee clearance report has been approved successfully.",
        );

        onClose();
      },
    });
  };

  const handleRejectReport = () => {
    const reportData = {
      title: "Employee Clearance Report Rejected",
      reportType: "CLEARANCE",
      employeeId: employee.id,
      status: "REJECTED",

      ...reportSnapshotData,

      description: `
      Employee clearance report has been rejected.

      Employee: ${employee.fullName}
      Department: ${employee.department || "No Department"}
      Position: ${employee.position || "N/A"}

      Device Condition: ${finalCondition}

      Assigned Assets: ${activeAssets.length}
      Total Asset Value: ${totalAssetPrice.toFixed(2)}

      Assigned Licenses: ${activeLicenses.length}
      Total License Cost: ${totalLicenseCost.toFixed(2)}

      Final Decision: Rejected
    `,
    };

    createReport.mutate(reportData, {
      onSuccess: () => {
        toast.success(
          "Employee clearance report has been rejected successfully.",
        );
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl bg-app-bg border border-app-gray/20 rounded-xl p-6 shadow-xl animate-scaleIn overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-app-gray/10 pb-3 mb-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <FiFileText className="text-app-brand" />
            Employee Clearance Report
          </h3>

          <button
            onClick={onClose}
            className="text-app-gray hover:bg-app-brand/10 cursor-pointer hover:text-app-brand transition-all rounded-lg p-1"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-5">
          <p>
            Employee: <b>{employee.fullName}</b>
          </p>
          <p>
            Department: <b>{employee.department || "No Department"}</b>
          </p>
          <p>
            Position: <b>{employee.position || "N/A"}</b>
          </p>
          <p>
            Status: <b>{employee.status}</b>
          </p>
        </div>

        <div className="mb-5">
          <h4 className="font-semibold mb-2">Assigned Assets</h4>

          <div className="border border-app-gray/20 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-app-brand/10">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Serial</th>
                  <th className="p-2 text-right">Price</th>
                </tr>
              </thead>

              <tbody>
                {activeAssets.length > 0 ? (
                  activeAssets.map((item: any) => (
                    <tr key={item.id} className="border-t border-app-gray/10">
                      <td className="p-2">{item.asset?.assetName}</td>
                      <td className="p-2">{item.asset?.assetType}</td>
                      <td className="p-2">
                        {item.asset?.serialNumber || "N/A"}
                      </td>
                      <td className="p-2 text-right">
                        {Number(item.asset?.price || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 text-center text-app-gray" colSpan={4}>
                      No active assets assigned
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-2 text-sm font-semibold">
            <span>Total Assets: {activeAssets.length}</span>
            <span>Total Value: {totalAssetPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-5">
          <label className="text-sm font-semibold block mb-2">
            Device Condition
          </label>

          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full border border-app-gray/30 rounded-lg px-3 py-2 bg-transparent text-sm"
          >
            <option value="Good">Good</option>
            <option value="Damage">Damage</option>
            <option value="Broken">Broken</option>
            <option value="Custom">Custom</option>
          </select>

          {condition === "Custom" && (
            <input
              value={customCondition}
              onChange={(e) => setCustomCondition(e.target.value)}
              placeholder="Enter custom condition"
              className="w-full border border-app-gray/30 rounded-lg px-3 py-2 bg-transparent text-sm mt-3"
            />
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 rounded-lg border border-app-gray/30 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleRejectReport}
            disabled={createReport.isPending}
            className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-50"
          >
            Reject
          </button>

          <button
            onClick={handleApproveReport}
            disabled={createReport.isPending}
            className="px-5 py-2 rounded-lg bg-app-brand text-white text-sm disabled:opacity-50"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
