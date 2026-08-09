import {
  useEffect,
  useState,
} from "react";

import { FiX } from "react-icons/fi";

import { useUpdateDepartmentAsset } from "../../context/useDepartmentAsset";

export type DepartmentAssetType = {
  id: number;
  assetName: string;
  assetType: string;
  serialNumber?: string | null;
  quantity: number;
  invoiceNumber?: string | null;
  purchaseDate: string;
  price?: number | null;
  condition?: string | null;
  notes?: string | null;
};

type FormErrors = {
  assetName?: string;
  assetType?: string;
  quantity?: string;
  purchaseDate?: string;
  price?: string;
};

type Props = {
  open: boolean;
  asset: DepartmentAssetType | null;
  onClose: () => void;
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

export default function Edit_Department_Asset({
  open,
  asset,
  onClose,
}: Props) {
  const [
    formData,
    setFormData,
  ] = useState(initialForm);

  const [
    formErrors,
    setFormErrors,
  ] = useState<FormErrors>({});

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  const {
    mutateAsync:
      updateDepartmentAsset,
    isPending: isUpdating,
  } = useUpdateDepartmentAsset();

  useEffect(() => {
    if (!open || !asset) {
      return;
    }

    setFormData({
      assetName:
        asset.assetName || "",

      assetType:
        asset.assetType || "",

      serialNumber:
        asset.serialNumber || "",

      quantity: String(
        asset.quantity || 1,
      ),

      invoiceNumber:
        asset.invoiceNumber || "",

      purchaseDate:
        asset.purchaseDate
          ? new Date(
              asset.purchaseDate,
            )
              .toISOString()
              .split("T")[0]
          : "",

      price:
        asset.price !== null &&
        asset.price !==
          undefined
          ? String(asset.price)
          : "",

      condition:
        asset.condition || "",

      notes:
        asset.notes || "",
    });

    setFormErrors({});

    setSubmitError("");
  }, [open, asset]);

  if (!open || !asset) {
    return null;
  }

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,

        [name]: value,
      }),
    );

    setFormErrors(
      (previous) => ({
        ...previous,

        [name]: undefined,
      }),
    );

    setSubmitError("");
  };

  const validateForm = () => {
    const errors: FormErrors =
      {};

    if (
      !formData.assetName.trim()
    ) {
      errors.assetName =
        "Asset name is required.";
    }

    if (
      !formData.assetType.trim()
    ) {
      errors.assetType =
        "Asset type is required.";
    }

    if (
      !formData.quantity ||
      Number.isNaN(
        Number(
          formData.quantity,
        ),
      ) ||
      Number(
        formData.quantity,
      ) < 1
    ) {
      errors.quantity =
        "Quantity must be at least 1.";
    }

    if (
      !formData.purchaseDate
    ) {
      errors.purchaseDate =
        "Purchase date is required.";
    }

    if (
      formData.price &&
      (Number.isNaN(
        Number(
          formData.price,
        ),
      ) ||
        Number(
          formData.price,
        ) < 0)
    ) {
      errors.price =
        "Price must be 0 or greater.";
    }

    setFormErrors(errors);

    return (
      Object.keys(errors)
        .length === 0
    );
  };

  const handleClose = () => {
    if (isUpdating) {
      return;
    }

    setFormData(
      initialForm,
    );

    setFormErrors({});

    setSubmitError("");

    onClose();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSubmitError("");

    if (!validateForm()) {
      setSubmitError(
        "Please correct the highlighted fields before updating.",
      );

      return;
    }

    const updateData = {
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
          ? Number(
              formData.price,
            )
          : null,

      condition:
        formData.condition.trim() ||
        null,

      notes:
        formData.notes.trim() ||
        null,
    };

    try {
      await updateDepartmentAsset({
        id: String(
          asset.id,
        ),

        updateData,
      });

      handleClose();
    } catch (error: any) {
      console.error(
        "Update Department Asset Error:",
        error,
      );

      const message =
        error?.response?.data
          ?.message ||
        error?.response?.data
          ?.error ||
        "Department asset could not be updated.";

      setSubmitError(
        message,
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={
        handleClose
      }
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-app-gray/20 bg-app-bg shadow-xl"
        onClick={(
          event,
        ) =>
          event.stopPropagation()
        }
      >
        {/* Header */}

        <div className="flex items-start justify-between gap-4 border-b border-app-gray/20 px-5 py-4 md:px-6">
          <div>
            <h2 className="text-lg font-bold">
              Update Department
              Asset
            </h2>

            <p className="mt-1 text-sm text-app-gray">
              Update the asset
              information below
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              isUpdating
            }
            className="cursor-pointer rounded-md p-2 text-app-gray transition-colors hover:bg-app-gray/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX
              size={19}
            />
          </button>
        </div>

        {/* Form */}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5 p-5 md:p-6"
          noValidate
        >
          {/* Error */}

          {submitError && (
            <div className="rounded-md border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-500">
              <p className="font-semibold">
                Asset could not
                be updated
              </p>

              <p className="mt-1">
                {
                  submitError
                }
              </p>
            </div>
          )}

          {/* Fields */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              label="Asset Name"
              name="assetName"
              placeholder="Enter asset name"
              value={
                formData.assetName
              }
              onChange={
                handleChange
              }
              error={
                formErrors.assetName
              }
              required
            />

            <InputField
              label="Asset Type"
              name="assetType"
              placeholder="Enter asset type"
              value={
                formData.assetType
              }
              onChange={
                handleChange
              }
              error={
                formErrors.assetType
              }
              required
            />

            <InputField
              label="Serial Number"
              name="serialNumber"
              placeholder="Enter serial number"
              value={
                formData.serialNumber
              }
              onChange={
                handleChange
              }
            />

            <InputField
              label="Quantity"
              name="quantity"
              type="number"
              min="1"
              placeholder="Enter quantity"
              value={
                formData.quantity
              }
              onChange={
                handleChange
              }
              error={
                formErrors.quantity
              }
              required
            />

            <InputField
              label="Invoice Number"
              name="invoiceNumber"
              placeholder="Enter invoice number"
              value={
                formData.invoiceNumber
              }
              onChange={
                handleChange
              }
            />

            <InputField
              label="Purchase Date"
              name="purchaseDate"
              type="date"
              value={
                formData.purchaseDate
              }
              onChange={
                handleChange
              }
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
              placeholder="Enter price"
              value={
                formData.price
              }
              onChange={
                handleChange
              }
              error={
                formErrors.price
              }
            />

            <InputField
              label="Condition"
              name="condition"
              placeholder="Enter asset condition"
              value={
                formData.condition
              }
              onChange={
                handleChange
              }
            />
          </div>

          {/* Notes */}

          <div>
            <label
              htmlFor="edit-notes"
              className="mb-2 block text-sm font-semibold"
            >
              Notes
            </label>

            <textarea
              id="edit-notes"
              name="notes"
              rows={4}
              value={
                formData.notes
              }
              onChange={
                handleChange
              }
              placeholder="Enter additional notes about this asset..."
              className="w-full resize-none rounded-md border border-app-gray/20 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-app-gray/50 focus:border-app-brand"
            />
          </div>

          {/* Buttons */}

          <div className="flex flex-col-reverse gap-3 border-t border-app-gray/20 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                isUpdating
              }
              className="cursor-pointer rounded-md border border-app-gray/20 px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isUpdating
              }
              className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-app-brand px-5 py-2.5 text-sm font-semibold text-app-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}

              {isUpdating
                ? "Updating..."
                : "Update Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =========================
// INPUT FIELD
// =========================

type InputFieldProps = {
  label: string;
  name: string;
  value: string;

  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  type?: string;

  required?: boolean;

  min?: string;

  step?: string;

  error?: string;

  placeholder?: string;
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  min,
  step,
  error,
  placeholder,
}: InputFieldProps) => {
  return (
    <div>
      <label
        htmlFor={`edit-${name}`}
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
        id={`edit-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={
          onChange
        }
        min={min}
        step={step}
        placeholder={
          placeholder
        }
        className={`w-full rounded-md border bg-transparent px-4 py-3 text-sm outline-none placeholder:text-app-gray/50 ${
          error
            ? "border-red-500"
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