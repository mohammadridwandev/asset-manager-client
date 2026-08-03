import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleAsset, useUpdateAsset } from "../../context/useAssets";
import Swal from "sweetalert2";
import DataLoading from "../../DataLoading";

export default function Asset_Update() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: asset, isLoading } = useGetSingleAsset(id);
  const updateAssetMutation = useUpdateAsset();

  useEffect(() => {
    // কেন useEffect?
    // asset data API থেকে পরে আসে, তাই date এখানে set করছি।
    if (asset?.purchaseDate) {
      setSelectedDate(new Date(asset.purchaseDate));
    }
  }, [asset]);

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
  };

const handlerAssetsUpdate = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  if (!id) {
    return;
  }

  const form = event.currentTarget;

  const confirm = await Swal.fire({
    title: "Update Asset?",
    text: "Are you sure you want to save these changes?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Update",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) {
    return;
  }

  if (!selectedDate) {
    await Swal.fire({
      title: "Purchase Date Required",
      text: "Please select a purchase date.",
      icon: "warning",
    });

    return;
  }

  const formData = new FormData(form);

  const assetName = String(
    formData.get("assetName") || "",
  ).trim();

  const assetType = String(
    formData.get("assetType") || "",
  ).trim();

  const serialNumber = String(
    formData.get("serialNumber") || "",
  ).trim();

  const invoiceNumber = String(
    formData.get("invoiceNumber") || "",
  ).trim();

  const condition = String(
    formData.get("condition") || "",
  ).trim();

  const notes = String(
    formData.get("notes") || "",
  ).trim();

  const quantity = Number(
    formData.get("quantity"),
  );

  const price = Number(
    formData.get("price"),
  );

  if (!assetName || !assetType) {
    await Swal.fire({
      title: "Required Information",
      text: "Asset name and asset type are required.",
      icon: "warning",
    });

    return;
  }

  if (
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    await Swal.fire({
      title: "Invalid Quantity",
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
      title: "Invalid Price",
      text: "Price must be 0 or greater.",
      icon: "warning",
    });

    return;
  }

  const updateData = {
    assetName,
    assetType,
    serialNumber:
      serialNumber || null,
    quantity,
    invoiceNumber:
      invoiceNumber || null,
    purchaseDate: selectedDate
      .toISOString()
      .split("T")[0],
    price,
    condition:
      condition || null,
    notes: notes || null,
  };

  updateAssetMutation.mutate(
    {
      id: String(id),
      updateData,
    },
    {
      onSuccess: async () => {
        await Swal.fire({
          title: "Updated!",
          text: "Asset updated successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/dashboard/assets");
      },

      onError: () => {
        // Professional error toast useUpdateAsset hook থেকে আসবে
        // Duplicate serial হলেও form data থাকবে
      },
    },
  );
};







   if (isLoading) {
      return (
        <DataLoading
          title="Update asset"
          message="Loading asset data..."
        ></DataLoading>
      );
    }



  if (!asset) {
    return <p className="p-6 text-red-500">Asset not found!</p>;
  }

  
  return (
    <div>
      <div className="min-h-screen transition-all duration-300 py-4 bg-app-bg text-app-text">
        <div className="bg-app-bg border border-app-gray/10 rounded-xl shadow-sm p-6 md:p-8">

          <h2 className="text-xl font-bold mb-4">Update Asset</h2>

          <form onSubmit={handlerAssetsUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asset Name *</label>
                <input
                  type="text"
                  name="assetName"
                  required
                  defaultValue={asset.assetName || ""}
                  placeholder="Asset Name"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type *</label>
                <input
                  type="text"
                  placeholder="Asset Type"
                  required
                  defaultValue={asset.assetType || ""}
                  name="assetType"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Serial Number</label>
                <input
                  type="text"
                  name="serialNumber"
                  defaultValue={asset.serialNumber || ""}
                  placeholder="Serial Number"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  required
                  defaultValue={asset.quantity || 0}
                  placeholder="Quantity"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Invoice Number</label>
                <input
                  type="text"
                  name="invoiceNumber"
                  defaultValue={asset.invoiceNumber || ""}
                  placeholder="Type to search invoice number"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>

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
                  required
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors text-app-gray"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price (SAR)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="0"
                  required
                  defaultValue={asset.price || 0}
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Condition</label>
                <select
                  name="condition"
                  defaultValue={asset.condition || ""}
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

            <div className="space-y-2 mt-6">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <textarea
                rows={4}
                name="notes"
                defaultValue={asset.notes || ""}
                placeholder="Add any additional details about the asset..."
                className="w-full px-4 py-2.5 my-2 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors resize-y"
              />
            </div>

            <div className="flex justify-end gap-4 mt-10">
              <button
                onClick={() => navigate("/dashboard/assets")}
                type="button"
                className="px-8 py-2 cursor-pointer rounded-lg border border-app-gray/30 font-medium hover:bg-app-gray/5 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updateAssetMutation.isPending}
                className="px-8 py-2 rounded-lg bg-app-brand text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {updateAssetMutation.isPending ? "Updating..." : "Update Asset"}
              </button>
            </div>
          </form>


        </div>
      </div>
    </div>
  );
}