import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useGetSingleLicense, useUpdateLicense } from "../../context/useLicenses";


export default function Licenses_Update() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [fileName, setFileName] = useState("No file chosen");

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: license, isLoading } = useGetSingleLicense(id);

  const updateLicenseMutation = useUpdateLicense();


  useEffect(() => {
    if (license?.purchaseDate) {
      setSelectedDate(new Date(license.purchaseDate));
    }
  }, [license]);

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "No file chosen");
  };

  const handlerLicenseUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const form = e.currentTarget;

    const confirm = await Swal.fire({
      title: "Update License?",
      text: "Are you sure you want to save these changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const formData = new FormData(form);

    if (selectedDate) {
      formData.set("purchaseDate", selectedDate.toISOString());
    }

    const imageFile = formData.get("image") as File;

    if (!imageFile || imageFile.size === 0) {
      formData.delete("image");
    }

    updateLicenseMutation.mutate(
      {
        id: String(id),
        updateData: formData,
      },

      {
        onSuccess: () => {
          Swal.fire({
            title: "Updated!",
            text: "License updated successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          navigate("/dashboard/licenses");
        },
      },

    );
  };

  if (isLoading) {
    return <p className="p-6">Loading license...</p>;
  }

  if (!license) {
    return <p className="p-6 text-red-500">License not found!</p>;
  }


  
  return (
    <div>
      <div className="py-5 bg-app-bg text-app-text transition-colors duration-300">
        <div className="bg-app-bg border border-app-gray/10 rounded-md shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4">Update License</h2>

          <form onSubmit={handlerLicenseUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Software Name</label>
                <input
                  type="text"
                  name="softwareName"
                  required
                  defaultValue={license.softwareName || ""}
                  placeholder="Software Name"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Vendor/Publisher</label>
                <input
                  type="text"
                  name="vendorPublisher"
                  defaultValue={license.vendorPublisher || ""}
                  placeholder="Vendor or Publisher"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">License Key</label>
                <input
                  type="text"
                  name="licenseKey"
                  defaultValue={license.licenseKey || ""}
                  placeholder="License Key"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">License Type</label>
                <select
                  required
                  name="licenseType"
                  defaultValue={license.licenseType || ""}
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-app-bg focus:outline-none focus:border-app-brand transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select Type</option>
                  <option value="subscription">Subscription</option>
                  <option value="one-time">One-time</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Total Quantity</label>
                <input
                  type="number"
                  name="totalQuantity"
                  required
                  defaultValue={license.totalQuantity || 0}
                  placeholder="0"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Purchase Date</label>

                <DatePicker
                  selected={selectedDate}
                  onChange={handleChange}
                  wrapperClassName="w-full"
                  placeholderText="Purchase Date"
                  calendarClassName="animate-fadeIn"
                  isClearable
                  popperPlacement="bottom-start"
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors text-app-gray"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Costs</label>
                <input
                  type="number"
                  placeholder="0"
                  name="costs"
                  required
                  defaultValue={license.costs || 0}
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <label className="text-sm font-medium">Notes</label>
              <textarea
                rows={4}
                name="notes"
                defaultValue={license.notes || ""}
                className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors resize-y"
              />
            </div>

            <div className="space-y-2 mt-6">
              <label className="text-xs text-app-text font-medium">
                License Certificate / Image{" "}
                <span className="opacity-70">
                  (Optional - JPEG, PNG, WebP up to 5MB)
                </span>
              </label>

              <div className="p-5 border border-dashed border-app-gray/30 rounded-xl bg-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <label className="cursor-pointer bg-app-brand/20 text-app-brand px-4 py-1.5 rounded-md text-sm font-medium hover:bg-app-brand/50 transition-colors">
                    Choose File
                    <input
                      name="image"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm text-app-text">{fileName}</span>
                </div>

                <p className="text-[11px] text-app-text opacity-80">
                  Formats: JPG, PNG, WebP (max 5mb).
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-10">
              <button
                onClick={() => navigate("/dashboard/licenses")}
                type="button"
                className="px-8 py-2 rounded-lg border border-app-gray/30 font-medium hover:bg-app-gray/5 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updateLicenseMutation.isPending}
                className="px-8 py-2 rounded-lg bg-app-brand text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {updateLicenseMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}