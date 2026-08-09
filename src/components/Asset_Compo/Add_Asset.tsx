import { useState } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";

import { useCreateAsset } from "../../context/useAssets";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const Add_Asset = ({
  setAssetOpen,
}: {
  setAssetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [fileName, setFileName] = useState("No file chosen");

  const useAssetsData = useCreateAsset();

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  // ========================= NEW: OPTIONAL ASSET IMAGE =========================
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG or WebP images are allowed.");

      event.target.value = "";
      setImagePreview(null);
      setFileName("No file chosen");

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be 2 MB or smaller.");

      event.target.value = "";
      setImagePreview(null);
      setFileName("No file chosen");

      return;
    }

    setFileName(file.name);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handlerAssets = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!selectedDate) {
      toast.error("Please select a purchase date.");

      return;
    }

    const formData = new FormData(form);

    const assetName = String(formData.get("assetName") || "").trim();

    const assetType = String(formData.get("assetType") || "").trim();

    const serialNumber = String(formData.get("serialNumber") || "").trim();

    const invoiceNumber = String(formData.get("invoiceNumber") || "").trim();

    const condition = String(formData.get("condition") || "").trim();

    const notes = String(formData.get("notes") || "").trim();

    const quantity = Number(formData.get("quantity"));

    const price = Number(formData.get("price"));

    if (!assetName || !assetType) {
      toast.error("Asset name and type are required.");

      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      toast.error("Quantity must be at least 1.");

      return;
    }

    if (Number.isNaN(price) || price < 0) {
      toast.error("Please enter a valid price.");

      return;
    }

    // ========================= UPDATED: CLEAN FORM DATA =========================

    formData.set("assetName", assetName);

    formData.set("assetType", assetType);

    formData.set("serialNumber", serialNumber);

    formData.set("quantity", String(quantity));

    formData.set("invoiceNumber", invoiceNumber);

    formData.set("purchaseDate", selectedDate.toISOString().split("T")[0]);

    formData.set("price", String(price));

    formData.set("condition", condition);

    formData.set("notes", notes);

    // ========================= UPDATED: IMAGE OPTIONAL =========================
    const imageFile = formData.get("image");

    if (imageFile instanceof File && imageFile.size === 0) {
      formData.delete("image");
    }

    useAssetsData.mutate(formData, {
      onSuccess: () => {
        form.reset();

        setSelectedDate(new Date());

        setImagePreview(null);

        setFileName("No file chosen");

        setAssetOpen(false);
      },

      onError: () => {
        // Error message hook থেকে আসবে
      },
    });
  };

  return (
    <div className="min-h-screen bg-app-bg py-5 text-app-text transition-colors duration-300">
      <div className="rounded-xl border border-app-gray/10 bg-app-bg p-6 shadow-sm md:p-8">
        {/* Title */}
        <h2 className="mb-5 text-xl font-bold">Add New Asset</h2>

        <form onSubmit={handlerAssets} className="space-y-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            {/* Asset Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Asset Name *</label>

              <input
                type="text"
                name="assetName"
                required
                placeholder="Asset Name"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Asset Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type *</label>

              <input
                type="text"
                name="assetType"
                required
                placeholder="Asset Type"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Serial Number</label>

              <input
                type="text"
                name="serialNumber"
                placeholder="Serial Number"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity *</label>

              <input
                type="number"
                name="quantity"
                required
                min="1"
                placeholder="Quantity"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Invoice Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Invoice Number</label>

              <input
                type="text"
                name="invoiceNumber"
                placeholder="Type to search invoice number"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Purchase Date *</label>

              <DatePicker
                selected={selectedDate}
                onChange={handleChange}
                placeholderText="Purchase Date"
                closeOnScroll
                isClearable
                calendarClassName="animate-fadeIn"
                wrapperClassName="w-full"
                popperPlacement="bottom-start"
                name="purchaseDate"
                required
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 text-app-gray transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (SAR) *</label>

              <input
                type="number"
                name="price"
                placeholder="0"
                min="0"
                step="0.01"
                required
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Condition</label>

              <select
                name="condition"
                className="my-2 w-full cursor-pointer appearance-none rounded-lg border border-app-gray/30 bg-app-bg px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              >
                <option value="">Select Condition</option>

                <option value="good">Good</option>

                <option value="fair">Fair</option>

                <option value="damaged">Damaged</option>

                <option value="new">New</option>
              </select>
            </div>
          </div>

          {/* ========================= NEW: OPTIONAL IMAGE ========================= */}
          <div className="rounded-xl border border-dashed border-app-gray/30 p-5">
            <div className="mt-6 space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>

              <textarea
                rows={4}
                name="notes"
                placeholder="Add any additional details about the asset..."
                className="my-2 w-full resize-y rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            <label className="mb-3 block text-sm font-medium">
              Asset Image <span className="text-app-gray">(Optional)</span>
            </label>

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-app-gray/20 bg-app-gray/5 text-xs text-app-gray">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Asset Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>Preview</span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer rounded-md bg-app-brand/20 px-4 py-2 text-sm font-medium text-app-brand transition-colors hover:bg-app-brand/30">
                    Choose Image
                    <input
                      type="file"
                      name="image"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  <span
                    className="max-w-60 truncate text-sm text-app-gray"
                    title={fileName}
                  >
                    {fileName}
                  </span>
                </div>

                <p className="mt-2 text-xs text-app-gray">
                  JPG, JPEG, PNG, WebP • Max 2 MB
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}

          {/* Action Buttons */}
          <div className="mt-10 flex justify-end gap-4">
            <button
              onClick={() => setAssetOpen(false)}
              disabled={useAssetsData.isPending}
              type="button"
              className="rounded-lg border border-app-gray/30 px-8 py-2 font-medium transition-colors hover:bg-app-gray/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              disabled={useAssetsData.isPending}
              type="submit"
              className="rounded-lg bg-app-brand px-8 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {useAssetsData.isPending ? "Adding..." : "Add Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_Asset;
