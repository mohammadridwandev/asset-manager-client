import {
  FaCalendarAlt,
  FaHashtag,
  FaKey,
  FaMoneyBillWave,
  FaStore,
  FaImage,
} from "react-icons/fa";
import { TbLicense } from "react-icons/tb";
import { useState } from "react";
import Licenses_view from "./Licenses_view";
import { useUnassignLicenseAssignment } from "../../context/useLicenseAssignment";
import { toast } from "react-hot-toast";

type LicensesCardProps = {
  licenses: any[];
  totalLicenses?: number;
  isLoading: boolean;
  isError: boolean;
};

export default function LicensesCard({
  licenses,
  totalLicenses,
  isLoading,
  isError,
}: LicensesCardProps) {
  const unassignLicenseMutation =
    useUnassignLicenseAssignment();

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL_LINK;

  const [selectedLicense, setSelectedLicense] =
    useState<any>(null);

  const getImageUrl = (image?: string) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_BASE_URL}${image}`;
  };

  if (isLoading) {
    return (
      <p className="py-10 text-center font-medium text-app-brand">
        Loading licenses...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="py-10 text-center font-medium text-red-500">
        Failed to load licenses!
      </p>
    );
  }

  if (licenses.length === 0) {
    return (
      <p className="py-10 text-center font-medium text-app-gray">
        No licenses found!
      </p>
    );
  }

  const handleUnassignLicense = (
    assignment: any,
  ) => {
    unassignLicenseMutation.mutate(
      String(assignment.id),
      {
        onSuccess: () => {
          toast.success(
            "License unassigned successfully!",
          );
        },

        onError: () => {
          toast.error(
            "Failed to unassign license.",
          );
        },
      },
    );
  };

  return (
    <>
      <div className="pb-4">
        <h1 className="font-bold">
          Total Licenses:{" "}
          {totalLicenses ?? licenses.length}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {licenses.map((license: any) => (
          <div
            key={license.id}
            className="rounded-2xl border border-app-gray/10 bg-app-bg p-5 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-start gap-4 border-b border-app-gray/10 pb-4">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-app-gray/10 bg-app-brand/5">
                {license.image ? (
                  <img
                    src={getImageUrl(
                      license.image,
                    )}
                    alt={
                      license.softwareName ||
                      "License"
                    }
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <FaImage className="text-2xl text-app-brand" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-semibold text-app-text md:text-lg">
                  {license.softwareName ||
                    "Unnamed Software"}
                </h3>

                <p className="mt-1 truncate text-xs text-app-gray">
                  {license.vendorPublisher ||
                    "No Vendor"}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <InfoBox
                icon={<FaHashtag />}
                label="Quantity"
                value={
                  license.totalQuantity || 0
                }
              />

              <InfoBox
                icon={<FaMoneyBillWave />}
                label="Cost"
                value={
                  license.costs
                    ? Number(
                        license.costs,
                      ).toLocaleString()
                    : "N/A"
                }
              />

              <InfoBox
                icon={<FaCalendarAlt />}
                label="Purchase Date"
                value={
                  license.purchaseDate
                    ? new Date(
                        license.purchaseDate,
                      ).toLocaleDateString()
                    : "N/A"
                }
              />

              <InfoBox
                icon={<TbLicense />}
                label="License Type"
                value={
                  license.licenseType || "N/A"
                }
              />
            </div>

            <div className="mt-4 space-y-2 rounded-lg border border-app-gray/10 px-3 py-3 text-sm">
              <Row
                icon={<FaKey />}
                label="License Key"
                value={
                  license.licenseKey || "N/A"
                }
              />

              <Row
                icon={<FaStore />}
                label="Vendor"
                value={
                  license.vendorPublisher ||
                  "N/A"
                }
              />
            </div>

            <div className="mt-4 rounded-lg border border-app-gray/10 px-3 py-3">
              <p className="text-xs font-medium text-app-gray">
                Notes
              </p>

              <p className="mt-1 line-clamp-2 text-sm text-app-text">
                {license.notes ||
                  "No notes added"}
              </p>
            </div>

            {license.assignments?.length >
            0 ? (
              <div className="mt-2 space-y-2">
                {license.assignments.map(
                  (assignment: any) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between gap-3 rounded-md border border-app-gray/10 bg-app-brand/5 p-2"
                    >
                      <div className="min-w-0">
                        <h5 className="truncate text-sm font-semibold text-app-text">
                          {
                            assignment.employee
                              ?.fullName
                          }
                        </h5>

                        <p className="truncate text-xs text-app-gray">
                          {assignment.employee
                            ?.email ||
                            "No email available"}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={
                          unassignLicenseMutation.isPending
                        }
                        onClick={() =>
                          handleUnassignLicense(
                            assignment,
                          )
                        }
                        className="shrink-0 cursor-pointer rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {unassignLicenseMutation.isPending
                          ? "Removing..."
                          : "Unassign"}
                      </button>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm italic text-app-gray">
                This license is not assigned
              </p>
            )}

            <button
              type="button"
              onClick={() =>
                setSelectedLicense(license)
              }
              className="mt-5 w-full cursor-pointer rounded-lg border border-app-brand/20 bg-app-brand/5 px-4 py-2.5 text-sm font-medium text-app-brand transition-all hover:bg-app-brand/10"
            >
              Manage License
            </button>
          </div>
        ))}
      </div>

      {selectedLicense && (
        <Licenses_view
          license={selectedLicense}
          onClose={() =>
            setSelectedLicense(null)
          }
        />
      )}
    </>
  );
}

const InfoBox = ({
  icon,
  label,
  value,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
  className?: string;
}) => {
  return (
    <div
      className={`rounded-lg border border-app-gray/10 px-3 py-2.5 ${className}`}
    >
      <p className="flex items-center gap-2 text-xs text-app-gray">
        {icon}
        {label}
      </p>

      <p
        className={`mt-1 truncate font-medium text-app-text ${className}`}
      >
        {value}
      </p>
    </div>
  );
};

const Row = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
}) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex shrink-0 items-center gap-2 text-app-gray">
        {icon}
        {label}
      </span>

      <span className="truncate text-right font-medium text-app-text">
        {value}
      </span>
    </div>
  );
};