import { useState } from "react";
import DatePicker from "react-datepicker";
import { useCreateAsset } from "../../context/useAssets";

const Add_Asset = ({
  setAssetOpen,
}: {
  setAssetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const useAssetsData = useCreateAsset();

  const handleChange = (date: any) => {
    setSelectedDate(date);
  };

  const handlerAssets = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!selectedDate) {
      // DatePicker clear করা থাকলে submit বন্ধ করবে
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
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return;
    }

    if (Number.isNaN(price) || price < 0) {
      return;
    }

    const assetData = {
      assetName,
      assetType,

      // Empty serial backend-এ null হবে
      serialNumber: serialNumber || null,

      quantity,

      invoiceNumber: invoiceNumber || null,

      purchaseDate: selectedDate.toISOString().split("T")[0],

      price,

      condition: condition || null,

      notes: notes || null,
    };

    useAssetsData.mutate(assetData, {
      onSuccess: () => {
        // শুধু successful create হলে reset হবে
        form.reset();
        setSelectedDate(new Date());
        setAssetOpen(false);
      },

      onError: () => {
        // Professional message useCreateAsset hook দেখাবে
        // Duplicate serial হলে form data থাকবে
      },
    });
  };

  return (
    <div className="min-h-screen transition-all duration-300 py-4 bg-app-bg text-app-text">
      <div className=" bg-app-bg border border-app-gray/10 rounded-xl shadow-sm p-6 md:p-8">
        {/* Title */}
        <h2 className="text-xl font-bold mb-4">Add New Asset</h2>

        <form onSubmit={handlerAssets} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Asset Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Asset Name *</label>
              <input
                type="text"
                name="assetName"
                required
                placeholder="Asset Name"
                className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type *</label>
              <input
                type="text"
                placeholder="Asset Type"
                required
                name="assetType"
                className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
              />
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Serial Number</label>
              <input
                type="text"
                name="serialNumber"
                placeholder="Serial Number"
                className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity *</label>
              <input
                type="number"
                name="quantity"
                required
                placeholder="Quantity"
                className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
              />
            </div>

            {/* Invoice Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Invoice Number</label>
              <input
                type="text"
                name="invoiceNumber"
                placeholder="Type to search invoice number"
                className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
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
                className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors text-app-gray"
              />
            </div>

            {/* Price (SAR) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (SAR) *</label>
              <input
                type="number"
                name="price"
                placeholder="0"
                min="0"
                step="0.01"
                required
                className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
              />
            </div>

            {/* Condition Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Condition</label>
              <select
                name="condition"
                className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-app-bg focus:outline-none focus:border-app-brand transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select Condition</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="damaged">Damaged</option>
                <option value="new">New</option>
              </select>
            </div>
          </div>

          {/* Notes (Optional) - Full Width */}
          <div className="space-y-2 mt-6">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <textarea
              rows={4}
              name="notes"
              placeholder="Add any additional details about the asset..."
              className="w-full px-4 py-2.5 my-2 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors resize-y"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-10">
            <button
              onClick={() => setAssetOpen(false)}
              type="button"
              className="px-8 py-2 rounded-lg border border-app-gray/30 font-medium hover:bg-app-gray/5 transition-colors"
            >
              Cancel
            </button>

            <button
              disabled={useAssetsData.isPending}
              type="submit"
              className="px-8 py-2 rounded-lg bg-app-brand text-white font-medium hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
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
