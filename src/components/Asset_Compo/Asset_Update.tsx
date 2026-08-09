import {
  useEffect,
  useState,
} from "react";

import DatePicker from "react-datepicker";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useGetSingleAsset,
  useUpdateAsset,
} from "../../context/useAssets";

import Swal from "sweetalert2";
import DataLoading from "../../DataLoading";
import toast from "react-hot-toast";

const MAX_FILE_SIZE =
  2 * 1024 * 1024;

export default function Asset_Update() {
  const [
    selectedDate,
    setSelectedDate,
  ] = useState<Date | null>(
    null,
  );

  const [
    selectedImage,
    setSelectedImage,
  ] = useState<File | null>(
    null,
  );

  const [
    imagePreview,
    setImagePreview,
  ] = useState("");

  const [
    fileName,
    setFileName,
  ] = useState(
    "No file chosen",
  );

  const { id } = useParams();

  const navigate =
    useNavigate();

  const {
    data: asset,
    isLoading,
  } = useGetSingleAsset(id);

  const updateAssetMutation =
    useUpdateAsset();

  const API_BASE_URL =
    import.meta.env
      .VITE_BACKEND_URL_LINK ||
    "";

  const getImageUrl = (
    image?: string,
  ) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith(
        "http://",
      ) ||
      image.startsWith(
        "https://",
      )
    ) {
      return image;
    }

    return `${API_BASE_URL.replace(
      /\/$/,
      "",
    )}/${image.replace(
      /^\//,
      "",
    )}`;
  };

  // =========================
  // LOAD EXISTING DATA
  // =========================

  useEffect(() => {
    if (
      asset?.purchaseDate
    ) {
      setSelectedDate(
        new Date(
          asset.purchaseDate,
        ),
      );
    }

    if (asset?.image) {
      setImagePreview(
        getImageUrl(
          asset.image,
        ),
      );

      setFileName(
        "Current image",
      );
    }
  }, [asset]);

  const handleChange = (
    date: Date | null,
  ) => {
    setSelectedDate(date);
  };

  // =========================
  // IMAGE CHANGE
  // =========================

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type,
      )
    ) {
      toast.error(
        "Only JPG, JPEG, PNG or WebP images are allowed.",
      );

      event.target.value =
        "";

      setSelectedImage(
        null,
      );

      setFileName(
        "No file chosen",
      );

      if (asset?.image) {
        setImagePreview(
          getImageUrl(
            asset.image,
          ),
        );
      } else {
        setImagePreview("");
      }

      return;
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      toast.error(
        "Image must be 2 MB or smaller.",
      );

      event.target.value =
        "";

      setSelectedImage(
        null,
      );

      setFileName(
        "No file chosen",
      );

      if (asset?.image) {
        setImagePreview(
          getImageUrl(
            asset.image,
          ),
        );
      } else {
        setImagePreview("");
      }

      return;
    }

    setSelectedImage(file);

    setFileName(
      file.name,
    );

    const reader =
      new FileReader();

    reader.onloadend =
      () => {
        setImagePreview(
          reader.result as string,
        );
      };

    reader.readAsDataURL(
      file,
    );
  };

  // =========================
  // UPDATE ASSET
  // =========================

  const handlerAssetsUpdate =
    async (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (!id) {
        return;
      }

      if (!selectedDate) {
        await Swal.fire({
          title:
            "Purchase Date Required",

          text: "Please select a purchase date.",

          icon: "warning",
        });

        return;
      }

      const form =
        event.currentTarget;

      const formData =
        new FormData(form);

      const assetName =
        String(
          formData.get(
            "assetName",
          ) || "",
        ).trim();

      const assetType =
        String(
          formData.get(
            "assetType",
          ) || "",
        ).trim();

      const serialNumber =
        String(
          formData.get(
            "serialNumber",
          ) || "",
        ).trim();

      const invoiceNumber =
        String(
          formData.get(
            "invoiceNumber",
          ) || "",
        ).trim();

      const condition =
        String(
          formData.get(
            "condition",
          ) || "",
        ).trim();

      const notes =
        String(
          formData.get(
            "notes",
          ) || "",
        ).trim();

      const quantity =
        Number(
          formData.get(
            "quantity",
          ),
        );

      const price =
        Number(
          formData.get(
            "price",
          ),
        );

      if (
        !assetName ||
        !assetType
      ) {
        await Swal.fire({
          title:
            "Required Information",

          text: "Asset name and asset type are required.",

          icon: "warning",
        });

        return;
      }

      if (
        !Number.isInteger(
          quantity,
        ) ||
        quantity < 1
      ) {
        await Swal.fire({
          title:
            "Invalid Quantity",

          text: "Quantity must be at least 1.",

          icon: "warning",
        });

        return;
      }

      if (
        Number.isNaN(price) ||
        price < 0
      ) {
        await Swal.fire({
          title:
            "Invalid Price",

          text: "Price must be 0 or greater.",

          icon: "warning",
        });

        return;
      }

      const confirm =
        await Swal.fire({
          title:
            "Update Asset?",

          text: "Are you sure you want to save these changes?",

          icon: "question",

          showCancelButton:
            true,

          confirmButtonColor:
            "#2563eb",

          cancelButtonColor:
            "#6b7280",

          confirmButtonText:
            "Yes, Update",

          cancelButtonText:
            "Cancel",
        });

      if (
        !confirm.isConfirmed
      ) {
        return;
      }

      // =========================
      // CLEAN FORM DATA
      // =========================

      const updateData =
        new FormData();

      updateData.append(
        "assetName",
        assetName,
      );

      updateData.append(
        "assetType",
        assetType,
      );

      updateData.append(
        "serialNumber",
        serialNumber,
      );

      updateData.append(
        "quantity",
        String(quantity),
      );

      updateData.append(
        "invoiceNumber",
        invoiceNumber,
      );

      updateData.append(
        "purchaseDate",
        selectedDate
          .toISOString()
          .split("T")[0],
      );

      updateData.append(
        "price",
        String(price),
      );

      updateData.append(
        "condition",
        condition,
      );

      updateData.append(
        "notes",
        notes,
      );

      // নতুন image select করলে শুধু তখন image পাঠাবে
      if (selectedImage) {
        updateData.append(
          "image",
          selectedImage,
        );
      }

      updateAssetMutation.mutate(
        {
          id: String(id),
          updateData,
        },
        {
          onSuccess:
            async () => {
              await Swal.fire({
                title:
                  "Updated!",

                text: "Asset updated successfully.",

                icon: "success",

                timer: 1500,

                showConfirmButton:
                  false,
              });

              navigate(
                "/dashboard/assets",
              );
            },

          onError: () => {
            // Error hook থেকে আসবে
          },
        },
      );
    };

  if (isLoading) {
    return (
      <DataLoading
        title="Update asset"
        message="Loading asset data..."
      />
    );
  }

  if (!asset) {
    return (
      <p className="p-6 text-red-500">
        Asset not found!
      </p>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-app-bg py-4 text-app-text transition-all duration-300">
        <div className="rounded-xl border border-app-gray/10 bg-app-bg p-6 shadow-sm md:p-8">
          <h2 className="mb-4 text-xl font-bold">
            Update Asset
          </h2>

          <form
            onSubmit={
              handlerAssetsUpdate
            }
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              {/* Asset Name */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Asset Name *
                </label>

                <input
                  type="text"
                  name="assetName"
                  required
                  defaultValue={
                    asset.assetName ||
                    ""
                  }
                  placeholder="Asset Name"
                  className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
                />
              </div>

              {/* Type */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Type *
                </label>

                <input
                  type="text"
                  placeholder="Asset Type"
                  required
                  defaultValue={
                    asset.assetType ||
                    ""
                  }
                  name="assetType"
                  className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
                />
              </div>

              {/* Serial Number */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Serial Number
                </label>

                <input
                  type="text"
                  name="serialNumber"
                  defaultValue={
                    asset.serialNumber ||
                    ""
                  }
                  placeholder="Serial Number"
                  className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
                />
              </div>

              {/* Quantity */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  required
                  min="1"
                  defaultValue={
                    asset.quantity ||
                    1
                  }
                  placeholder="Quantity"
                  className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
                />
              </div>

              {/* Invoice Number */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Invoice Number
                </label>

                <input
                  type="text"
                  name="invoiceNumber"
                  defaultValue={
                    asset.invoiceNumber ||
                    ""
                  }
                  placeholder="Type to search invoice number"
                  className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
                />
              </div>

              {/* Purchase Date */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Purchase Date *
                </label>

                <DatePicker
                  selected={
                    selectedDate
                  }
                  onChange={
                    handleChange
                  }
                  placeholderText="Purchase Date"
                  closeOnScroll
                  isClearable
                  calendarClassName="animate-fadeIn"
                  wrapperClassName="w-full"
                  popperPlacement="bottom-start"
                  required
                  className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 text-app-gray transition-colors focus:border-app-brand focus:outline-none"
                />
              </div>

              {/* Price */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Price (SAR)
                </label>

                <input
                  type="number"
                  name="price"
                  placeholder="0"
                  required
                  min="0"
                  step="0.01"
                  defaultValue={
                    asset.price ??
                    0
                  }
                  className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
                />
              </div>

              {/* Condition */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Condition
                </label>

                <select
                  name="condition"
                  defaultValue={
                    asset.condition ||
                    ""
                  }
                  className="my-2 w-full cursor-pointer appearance-none rounded-lg border border-app-gray/30 bg-app-bg px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
                >
                  <option value="">
                    Select
                    Condition
                  </option>

                  <option value="good">
                    Good
                  </option>

                  <option value="fair">
                    Fair
                  </option>

                  <option value="damaged">
                    Damaged
                  </option>

                  <option value="new">
                    New
                  </option>
                </select>
              </div>
            </div>

            {/* Notes */}

            <div className="mt-6 space-y-2">
              <label className="text-sm font-medium">
                Notes (Optional)
              </label>

              <textarea
                rows={4}
                name="notes"
                defaultValue={
                  asset.notes || ""
                }
                placeholder="Add any additional details about the asset..."
                className="my-2 w-full resize-y rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* ========================= */}
            {/* ASSET IMAGE */}
            {/* ========================= */}

            <div className="rounded-xl border border-dashed border-app-gray/30 p-5">
              <label className="mb-3 block text-sm font-medium">
                Asset Image{" "}
                <span className="text-app-gray">
                  (Optional)
                </span>
              </label>

              <div className="flex items-center gap-4">
                {/* Preview */}

                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-app-gray/20 bg-app-gray/5 text-xs text-app-gray">
                  {imagePreview ? (
                    <img
                      src={
                        imagePreview
                      }
                      alt="Asset Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>
                      No Image
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer rounded-md bg-app-brand/20 px-4 py-2 text-sm font-medium text-app-brand transition-colors hover:bg-app-brand/30">
                      Change Image

                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={
                          handleImageChange
                        }
                        className="hidden"
                      />
                    </label>

                    <span
                      className="max-w-60 truncate text-sm text-app-gray"
                      title={
                        fileName
                      }
                    >
                      {fileName}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-app-gray">
                    JPG, JPEG,
                    PNG, WebP •
                    Max 2 MB
                  </p>

                  {!selectedImage &&
                    asset.image && (
                      <p className="mt-1 text-xs text-app-gray">
                        Current
                        image will
                        stay unless
                        you select a
                        new one.
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}

            <div className="mt-10 flex justify-end gap-4">
              <button
                onClick={() =>
                  navigate(
                    "/dashboard/assets",
                  )
                }
                disabled={
                  updateAssetMutation.isPending
                }
                type="button"
                className="cursor-pointer rounded-lg border border-app-gray/30 px-8 py-2 font-medium transition-colors hover:bg-app-gray/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  updateAssetMutation.isPending
                }
                className="rounded-lg bg-app-brand px-8 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateAssetMutation.isPending
                  ? "Updating..."
                  : "Update Asset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}