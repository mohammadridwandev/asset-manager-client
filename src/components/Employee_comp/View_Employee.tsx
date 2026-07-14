import { FiX, FiEdit, FiTrash2, FiPrinter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDeleteEmployee } from "../../context/useEmployee";
import Swal from "sweetalert2";

import { useUnassignAssetAssignment } from "../../context/useAssetAssignment";
import { usePrint } from "../../context/PrintContext";

export default function View_Employee({
  employee,
  onClose,
}: {
  employee: any;
  onClose: () => void;
}) {





  const navigate = useNavigate();
  const deleteEmployeeMutation = useDeleteEmployee();

  // const updateAssetMutation = useUpdateAsset();
  const unassignMutation = useUnassignAssetAssignment();
  
  const { printDocument, isPrinting } = usePrint();


  const handleDeleteEmployee = async () => {
  const result = await Swal.fire({
    title: "Delete Employee?",
    text: "You won't be able to recover this employee!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    deleteEmployeeMutation.mutate(String(employee.id), {
      onSuccess: () => {
        onClose();

        Swal.fire({
          title: "Deleted!",
          text: "Employee deleted successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      },

      // ========================= UPDATED: Backend error message user-কে show করবে =========================
      onError: (error: any) => {
        Swal.fire({
          title: "Delete Not Allowed",
          text:
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "This employee cannot be deleted.",
          icon: "error",
          
          confirmButtonColor: "#dc2626",
          confirmButtonText: "Okay",
        });
      },
    });
  }
};





  const handleUnassignAsset = async (assignment: any) => {
    const result = await Swal.fire({
      title: "Unassign Asset?",
      text: `Remove from ${employee.fullName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Unassign",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    unassignMutation.mutate(String(assignment.id), {
      onSuccess: async () => {
        await Swal.fire({
          title: "Unassigned!",
          text: "Asset unassigned successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        onClose();
      },
    });
  };

  

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-fadeIn">
        <div className="w-full max-w-3xl rounded-xl border border-app-gray/10 bg-app-bg shadow-xl animate-scaleIn overflow-hidden">
          <div className="flex items-center justify-between border-b border-app-gray/10 px-6 py-5">
            <h2 className="text-xl font-bold text-app-text">
              Employee Details
            </h2>

            <div className="flex items-center gap-3"
            >
              {/* <button className="text-app-main transition-all cursor-pointer text-sm bg-app-brand/10 px-4 py-1 rounded-full  border border-app-brand/20 hover:text-app-brand">
                Employee History
              </button> */}

              <button
                onClick={onClose}
                className="rounded-lg p-2 text-app-gray hover:bg-app-brand/10 hover:text-app-brand transition-all"
              >
                <FiX size={22} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-7">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-app-text">
                    {employee.fullName}
                  </h3>
                  <p className="text-app-brand text-sm">
                    {employee.department || "No Department"}
                  </p>
                </div>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600">
                  {employee.status || "ACTIVE"}
                </span>
              </div>

              <div className="mt-6 space-y-2 text-sm text-app-text">
                <p>
                  Iqama: <b>{employee.iqamaNumber || "Not Available"}</b>
                </p>
                <p>
                  Phone: <b>{employee.phoneNumber || "Not Available"}</b>
                </p>
                <p>
                  Email: <b>{employee.email || "Not Available"}</b>
                </p>
                <p>
                  Position: <b>{employee.position || "Not Available"}</b>
                </p>

                <p>
                  Joining:{" "}
                  <b>
                    {employee.joinDate
                      ? new Date(employee.joinDate).toLocaleDateString()
                      : "Not Available"}
                  </b>
                </p>
              </div>

              <div className="mt-2  pt-2">
                <h4 className="font-semibold text-sm text-app-gray">
                  Assign License ({employee.licenseAssignments?.length || 0})
                </h4>

                <p className="mt-1 text-xs italic text-app-gray">
                  {employee.licenses?.length
                    ? "Licenses assigned"
                    : "No licenses assigned"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-app-text mb-2">
                Quick Actions
              </h4>

              <div className=" gap-4 lg:flex items-center justify-between">
                <button
                  onClick={() =>
                    navigate(`/dashboard/employees/update/${employee.id}`)
                  }
                  className="w-full cursor-pointer rounded-lg border border-app-gray/10 px-3 py-2.5 flex items-center gap-2 text-sm text-app-text hover:border-app-brand/20 hover:bg-app-brand/5 transition-all"
                >
                  <FiEdit size={16} />
                  Edit Employee
                </button>

                <button
                  onClick={handleDeleteEmployee}
                  disabled={deleteEmployeeMutation.isPending}
                  className="w-full cursor-pointer rounded-lg border border-red-500/10 px-3 py-2.5 flex items-center gap-2 text-sm text-red-500 hover:bg-red-500/5 transition-all"
                >
                  <FiTrash2 size={16} />
                  {deleteEmployeeMutation.isPending
                    ? "Deleting..."
                    : "Delete Employee"}
                </button>
              </div>

              <div className="mt-4">
                <div className="mt-3 space-y-2">
                  <h4 className="font-semibold text-sm text-app-gray">
                    Assigned Assets ({employee.assetAssignments?.length || 0})
                  </h4>

                  {employee.assetAssignments?.length > 0 ? (
                    employee.assetAssignments.map((assignment: any) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between rounded-lg border border-app-gray/10 p-2"
                      >
                        <div>
                          <h5 className="text-xs font-medium text-app-text">
                            {assignment.asset.assetName}
                          </h5>

                          <p className="text-xs text-app-gray">
                            {assignment.asset.assetType || "No Type"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              printDocument("employee-agreement", {
                                employee,
                                assignment,
                              })
                            }
                            disabled={isPrinting}
                            className="cursor-pointer rounded-md border border-app-gray/10 bg-app-brand/10 p-2 hover:bg-app-brand/15 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FiPrinter size={14} />
                          </button>

                          <button
                            // onClick={() => handleUnassignAsset(assignment.asset)}
                            onClick={() => handleUnassignAsset(assignment)}
                            disabled={unassignMutation.isPending}
                            className="px-3 py-1 text-xs rounded-md bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/5 cursor-pointer disabled:opacity-50"
                          >
                            {unassignMutation.isPending
                              ? "Removing..."
                              : "Unassign"}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-app-gray italic">
                      No assets assigned
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-app-gray/10 px-6 py-5">
            <button
              onClick={onClose}
              className="rounded-md bg-slate-900 px-4 py-1.5 cursor-pointer text-white font-medium text-sm hover:bg-gray-800 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
