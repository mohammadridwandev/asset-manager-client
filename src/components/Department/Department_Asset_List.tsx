import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiTrash2,
} from "react-icons/fi";

import {
  Helmet,
} from "react-helmet-async";

import Swal from "sweetalert2";

import {
  useGetAssets,
} from "../../context/useAssets";

import {
  useUnassignAssetFromDepartment,
} from "../../context/useDepartment";

import DataLoading from "../../DataLoading";


export default function Department_Asset_List() {
  const navigate = useNavigate();

  const {
    departmentName,
  } = useParams();

  const department =
    decodeURIComponent(
      departmentName || "",
    );


  // Get assets
  const {
    data,
    isLoading,
    isError,
  } = useGetAssets(
    1,
    100,
    "",
    "",
    "",
  );


  const assets =
    data?.assets || [];


  // Unassign asset
  const {
    mutateAsync:
      unassignAssetFromDepartment,
    isPending: isUnassigning,
  } =
    useUnassignAssetFromDepartment();


  // Only assets assigned to this department
  const departmentAssets =
    assets.filter(
      (asset: any) =>
        Array.isArray(
          asset.departmentAssignments,
        ) &&
        asset.departmentAssignments.some(
          (assignment: any) =>
            assignment.department?.name
              ?.trim()
              .toLowerCase() ===
            department
              .trim()
              .toLowerCase(),
        ),
    );


  // Unassign asset from this department
  const handleUnassign = async (
    asset: any,
  ) => {
    // Find current department assignment
    const assignment =
      asset.departmentAssignments?.find(
        (item: any) =>
          item.department?.name
            ?.trim()
            .toLowerCase() ===
          department
            .trim()
            .toLowerCase(),
      );


    if (!assignment) {
      return;
    }


    const confirmation =
      await Swal.fire({
        title: "Unassign asset?",

        text: `"${asset.assetName}" will be removed from ${department}.`,

        icon: "warning",

        showCancelButton: true,

        confirmButtonText:
          "Yes, Unassign",

        cancelButtonText:
          "Cancel",

        confirmButtonColor:
          "#dc2626",
      });


    if (!confirmation.isConfirmed) {
      return;
    }


    try {
      await unassignAssetFromDepartment({
        assetId:
          Number(asset.id),

        departmentId:
          Number(
            assignment.departmentId ??
              assignment.department?.id,
          ),
      });


      await Swal.fire({
        title: "Unassigned",

        text: `"${asset.assetName}" has been removed from ${department}.`,

        icon: "success",

        timer: 1500,

        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        "Unassign Asset Error:",
        error,
      );
    }
  };


  if (isLoading) {
    return (
      <DataLoading
        title="Loading Assets"
        message="Fetching department assets..."
      />
    );
  }


  if (isError) {
    return (
      <div className="flex min-h-75 items-center justify-center text-lg font-medium text-red-500">
        Failed to load department assets.
      </div>
    );
  }


  return (
    <>
      <Helmet>
        <title>
          {department} | Assets
        </title>
      </Helmet>


      <div className="pb-16">

        {/* Header */}
        <div className="py-4 md:py-8">
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="mb-5 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-app-brand"
          >
            <FiArrowLeft />

            Back to Departments
          </button>


          <h1 className="text-2xl font-bold tracking-tight">
            {department}
          </h1>


          <p className="mt-1 text-sm text-app-gray">
            Assigned Department Assets
          </p>


          <div className="mt-4">
            <span className="rounded-lg bg-app-brand/10 px-3 py-1.5 text-sm font-semibold text-app-brand">
              Total Assets:{" "}
              {
                departmentAssets.length
              }
            </span>
          </div>
        </div>


        {/* Assigned Asset List */}
        {departmentAssets.length ===
        0 ? (
          <div className="rounded-xl border border-dashed border-app-gray/30 bg-app-bg px-6 py-14 text-center">
            <p className="text-sm font-medium text-app-text">
              No assigned assets
            </p>

            <p className="mt-1 text-xs text-app-gray">
              No assets are currently
              assigned to this department.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {departmentAssets.map(
              (asset: any) => (
                <div
                  key={asset.id}
                  className="group rounded-xl border border-app-gray/20 bg-app-bg p-5 shadow-sm transition-all duration-200 hover:border-app-brand/40 hover:shadow-md"
                >

                  {/* Top */}
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-app-gray">
                        Assigned Asset
                      </p>

                      <h3
                        className="mt-1 truncate text-base font-bold text-app-text transition-colors group-hover:text-app-brand"
                        title={
                          asset.assetName
                        }
                      >
                        {
                          asset.assetName
                        }
                      </h3>
                    </div>


                    <span className="shrink-0 rounded-full bg-app-brand/10 px-2.5 py-1 text-[11px] font-semibold text-app-brand">
                      {asset.assetType ||
                        "Asset"}
                    </span>
                  </div>


                  {/* Details */}
                  <div className="divide-y divide-app-gray/10 rounded-lg border border-app-gray/10">

                    <div className="flex items-center justify-between gap-4 px-3 py-2.5">
                      <span className="text-xs text-app-gray">
                        Serial Number
                      </span>

                      <span
                        className="max-w-[60%] truncate text-right text-sm font-medium text-app-text"
                        title={
                          asset.serialNumber ||
                          ""
                        }
                      >
                        {asset.serialNumber ||
                          "—"}
                      </span>
                    </div>


                    <div className="flex items-center justify-between gap-4 px-3 py-2.5">
                      <span className="text-xs text-app-gray">
                        Quantity
                      </span>

                      <span className="text-sm font-semibold text-app-text">
                        {asset.quantity ??
                          "—"}
                      </span>
                    </div>


                    <div className="flex items-center justify-between gap-4 px-3 py-2.5">
                      <span className="text-xs text-app-gray">
                        Condition
                      </span>

                      <span className="rounded-md bg-app-gray/10 px-2 py-1 text-xs font-medium text-app-text">
                        {asset.condition ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>


                  {/* Department */}
                  <div className="mt-4 flex items-center justify-between border-t border-app-gray/10 pt-3">
                    <span className="text-xs text-app-gray">
                      Assigned Department
                    </span>

                    <span className="text-xs font-semibold text-app-brand">
                      {department}
                    </span>
                  </div>


                  {/* Unassign */}
                  <button
                    type="button"
                    disabled={
                      isUnassigning
                    }
                    onClick={() =>
                      handleUnassign(
                        asset,
                      )
                    }
                    className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiTrash2
                      size={15}
                    />

                    {isUnassigning
                      ? "Unassigning..."
                      : "Unassign"}
                  </button>

                </div>
              ),
            )}
          </div>
        )}
      </div>
    </>
  );
}