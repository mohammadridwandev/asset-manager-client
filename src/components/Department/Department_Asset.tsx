import {
  FiMinus,
  FiPlus,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

import DataLoading from "../../DataLoading";

import {
  useCreateDepartmentAsset,
  useGetDepartmentAssets,
} from "../../context/useDepartmentAsset";

import { useDebounce } from "../../context/useDebounce";

import Assign_to_Department from "./Assign_to_Department";
import Edit_Department_Asset from "./Edit_Department_Asset";

import Department_Asset_Card, {
  type DepartmentAssetType,
} from "./Department_Asset_Card";

type FormErrors = {
  assetName?: string;
  assetType?: string;
  serialNumber?: string;
  quantity?: string;
  purchaseDate?: string;
  price?: string;
};

const initialForm = {
  assetName: "",
  assetType: "",
  serialNumber: "",
  quantity: "1",
  invoiceNumber: "",
  purchaseDate: "",
  price: "",
  condition: "",
  notes: "",
};

export default function Department_Asset() {
  const [assetOpen, setAssetOpen] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  const debouncedSearchText = useDebounce(
    searchText.trim(),
    300,
  );

  const [
    assignmentFilter,
    setAssignmentFilter,
  ] = useState("all");

  const [formData, setFormData] =
    useState(initialForm);

  const [formErrors, setFormErrors] =
    useState<FormErrors>({});

  const [submitError, setSubmitError] =
    useState("");

  // Assign modal
  const [assignOpen, setAssignOpen] =
    useState(false);

  const [selectedAsset, setSelectedAsset] =
    useState<DepartmentAssetType | null>(
      null,
    );

  // Edit modal
  const [editOpen, setEditOpen] =
    useState(false);

  const [
    selectedEditAsset,
    setSelectedEditAsset,
  ] = useState<DepartmentAssetType | null>(
    null,
  );

  const {
    data: assets = [],
    isLoading,
    isError,
  } = useGetDepartmentAssets();

  const {
    mutateAsync: createDepartmentAsset,
    isPending: isCreating,
  } = useCreateDepartmentAsset();

  const filteredAssets = useMemo(() => {
    const keyword =
      debouncedSearchText.toLowerCase();

    let result: DepartmentAssetType[] =
      Array.isArray(assets) ? assets : [];

    // Search filter
    if (keyword) {
      result = result.filter(
        (asset: DepartmentAssetType) =>
          asset.assetName
            ?.toLowerCase()
            .includes(keyword) ||
          asset.assetType
            ?.toLowerCase()
            .includes(keyword) ||
          asset.serialNumber
            ?.toLowerCase()
            .includes(keyword) ||
          asset.invoiceNumber
            ?.toLowerCase()
            .includes(keyword),
      );
    }

    // Assigned filter
    if (assignmentFilter === "assigned") {
      result = result.filter(
        (asset: DepartmentAssetType) =>
          Array.isArray(
            asset.departmentAssignments,
          ) &&
          asset.departmentAssignments.length >
            0,
      );
    }

    // Unassigned filter
    if (
      assignmentFilter === "unassigned"
    ) {
      result = result.filter(
        (asset: DepartmentAssetType) =>
          !Array.isArray(
            asset.departmentAssignments,
          ) ||
          asset.departmentAssignments.length ===
            0,
      );
    }

    return result;
  }, [
    assets,
    debouncedSearchText,
    assignmentFilter,
  ]);

  const resetForm = () => {
    setFormData(initialForm);
    setFormErrors({});
    setSubmitError("");
  };

  const handleCloseForm = () => {
    resetForm();
    setAssetOpen(false);
  };

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));

    setSubmitError("");
  };

  const validateForm = () => {
    const errors: FormErrors = {};

    if (!formData.assetName.trim()) {
      errors.assetName =
        "Asset name is required.";
    }

    if (!formData.assetType.trim()) {
      errors.assetType =
        "Asset type is required.";
    }

    if (
      !formData.quantity ||
      Number.isNaN(
        Number(formData.quantity),
      ) ||
      Number(formData.quantity) < 1
    ) {
      errors.quantity =
        "Quantity must be at least 1.";
    }

    if (!formData.purchaseDate) {
      errors.purchaseDate =
        "Purchase date is required.";
    } else if (
      Number.isNaN(
        new Date(
          formData.purchaseDate,
        ).getTime(),
      )
    ) {
      errors.purchaseDate =
        "Please enter a valid purchase date.";
    }

    if (
      formData.price &&
      (Number.isNaN(
        Number(formData.price),
      ) ||
        Number(formData.price) < 0)
    ) {
      errors.price =
        "Price must be 0 or greater.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSubmitError("");

    if (!validateForm()) {
      setSubmitError(
        "Please correct the highlighted fields before saving.",
      );

      return;
    }

    const payload = {
      assetName:
        formData.assetName.trim(),

      assetType:
        formData.assetType.trim(),

      serialNumber:
        formData.serialNumber.trim() ||
        null,

      quantity: Number(
        formData.quantity,
      ),

      invoiceNumber:
        formData.invoiceNumber.trim() ||
        null,

      purchaseDate:
        formData.purchaseDate,

      price:
        formData.price !== ""
          ? Number(formData.price)
          : null,

      condition:
        formData.condition.trim() || null,

      notes:
        formData.notes.trim() || null,
    };

    try {
      await createDepartmentAsset(payload);

      resetForm();
      setAssetOpen(false);
    } catch (error: any) {
      console.error(
        "Department Asset Submit Error:",
        error,
      );

      const status =
        error?.response?.status;

      let message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Department asset could not be saved.";

      if (status === 409) {
        message =
          error?.response?.data?.message ||
          "This serial number already exists.";
      } else if (status === 400) {
        message =
          error?.response?.data?.message ||
          "Some information is invalid. Please check the form.";
      } else if (status === 401) {
        message =
          "Your session has expired. Please log in again.";
      } else if (status === 403) {
        message =
          "You do not have permission to add department assets.";
      } else if (status === 404) {
        message =
          "Department asset API was not found.";
      } else if (status >= 500) {
        message =
          error?.response?.data?.message ||
          "Server error occurred while saving the asset.";
      } else if (!error?.response) {
        message =
          "Cannot connect to the server. Please check your internet connection.";
      }

      setSubmitError(message);
    }
  };

  const handleEdit = (
    asset: DepartmentAssetType,
  ) => {
    setSelectedEditAsset(asset);
    setEditOpen(true);
  };

  const handleAssign = (
    asset: DepartmentAssetType,
  ) => {
    setSelectedAsset(asset);
    setAssignOpen(true);
  };

  if (isLoading) {
    return (
      <DataLoading
        title="Loading Department Assets"
        message="Fetching department asset data..."
      />
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-75 items-center justify-center text-lg font-medium text-red-500">
        Failed to load department assets!
      </div>
    );
  }

  return (
    <div className="pb-16">
      <Helmet>
        <title>
          Asset Manager | Department Assets
        </title>
      </Helmet>

      <div className="py-4 md:py-8">
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Department Asset Management
            </h1>

            <p className="mt-1 text-sm text-app-gray opacity-80">
              Add and manage department
              assets
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (assetOpen) {
                handleCloseForm();
              } else {
                resetForm();
                setAssetOpen(true);
              }
            }}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-app-brand px-5 py-2.5 text-sm font-bold text-app-secondary shadow-md transition-all hover:opacity-90 active:scale-95 md:w-auto"
          >
            {assetOpen ? (
              <>
                <FiMinus size={18} />
                <span>Close</span>
              </>
            ) : (
              <>
                <FiPlus size={18} />

                <span>
                  Add Department Asset
                </span>
              </>
            )}
          </button>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-app-gray opacity-60">
              <FiSearch size={18} />
            </div>

            <input
              type="text"
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target.value,
                )
              }
              placeholder="Search by asset name, type, serial number or invoice..."
              className="w-full rounded-md border border-app-gray/15 bg-app-bg py-3.5 pr-4 pl-12 text-sm text-app-text outline-none transition-colors placeholder:text-app-gray/50 focus:border-app-brand"
            />
          </div>

          <select
            value={assignmentFilter}
            onChange={(event) =>
              setAssignmentFilter(
                event.target.value,
              )
            }
            className="w-full rounded-md border border-app-gray/20 bg-app-bg px-4 py-3.5 text-sm text-app-text outline-none transition-colors focus:border-app-brand lg:w-52"
          >
            <option value="all">
              All Assets
            </option>

            <option value="assigned">
              Assigned
            </option>

            <option value="unassigned">
              Unassigned
            </option>
          </select>
        </div>

        {/* Add Asset Form */}
        {assetOpen && (
          <div className="mt-6 rounded-xl border border-app-gray/20 bg-app-bg p-5 shadow-xs md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">
                  Add Department Asset
                </h2>

                <p className="mt-1 text-sm text-app-gray">
                  Enter the asset information
                  below
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                className="rounded-md p-2 text-app-gray transition-colors hover:bg-app-gray/10 hover:text-app-text"
              >
                <FiX size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
            >
              {submitError && (
                <div className="rounded-md border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-500">
                  <p className="font-semibold">
                    Asset could not be saved
                  </p>

                  <p className="mt-1">
                    {submitError}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Asset Name"
                  name="assetName"
                  value={
                    formData.assetName
                  }
                  onChange={handleChange}
                  placeholder="Enter asset name"
                  error={
                    formErrors.assetName
                  }
                  required
                />

                <InputField
                  label="Asset Type"
                  name="assetType"
                  value={
                    formData.assetType
                  }
                  onChange={handleChange}
                  placeholder="Enter asset type"
                  error={
                    formErrors.assetType
                  }
                  required
                />

                <InputField
                  label="Serial Number"
                  name="serialNumber"
                  value={
                    formData.serialNumber
                  }
                  onChange={handleChange}
                  placeholder="Enter serial number"
                  error={
                    formErrors.serialNumber
                  }
                />

                <InputField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={
                    formData.quantity
                  }
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  error={
                    formErrors.quantity
                  }
                  required
                />

                <InputField
                  label="Invoice Number"
                  name="invoiceNumber"
                  value={
                    formData.invoiceNumber
                  }
                  onChange={handleChange}
                  placeholder="Enter invoice number"
                />

                <InputField
                  label="Purchase Date"
                  name="purchaseDate"
                  type="date"
                  value={
                    formData.purchaseDate
                  }
                  onChange={handleChange}
                  error={
                    formErrors.purchaseDate
                  }
                  required
                />

                <InputField
                  label="Price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter asset price"
                  error={formErrors.price}
                />

                <InputField
                  label="Condition"
                  name="condition"
                  value={
                    formData.condition
                  }
                  onChange={handleChange}
                  placeholder="Good, damaged, etc."
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-semibold"
                >
                  Notes
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter notes"
                  className="w-full resize-none rounded-md border border-app-gray/20 bg-transparent px-4 py-3 text-sm outline-none transition-all placeholder:text-app-gray/50 focus:border-app-brand"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="rounded-md border border-app-gray/30 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-app-gray/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center justify-center gap-2 rounded-md bg-app-brand px-5 py-2.5 text-sm font-bold text-app-secondary shadow-md transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCreating && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}

                  {isCreating
                    ? "Saving..."
                    : "Save Asset"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <Department_Asset_Card
        assets={filteredAssets}
        onEdit={handleEdit}
        onAssign={handleAssign}
      />

      <Edit_Department_Asset
        open={editOpen}
        asset={selectedEditAsset}
        onClose={() => {
          setEditOpen(false);
          setSelectedEditAsset(null);
        }}
      />

      <Assign_to_Department
        open={assignOpen}
        asset={selectedAsset}
        onClose={() => {
          setAssignOpen(false);
          setSelectedAsset(null);
        }}
      />
    </div>
  );
}

type InputFieldProps = {
  label: string;
  name: string;
  value: string;

  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  step?: string;
  error?: string;
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  min,
  step,
  error,
}: InputFieldProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        step={step}
        aria-invalid={!!error}
        className={`w-full rounded-md border bg-transparent px-4 py-3 text-sm outline-none transition-all placeholder:text-app-gray/50 ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-app-gray/20 focus:border-app-brand"
        }`}
      />

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}

      
    </div>
  );
};