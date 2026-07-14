import { useState } from "react";
import DatePicker from "react-datepicker";
import { useCreateLicense } from "../../context/useLicenses";


const Add_License = ({
  setOpenLicense,
}: {
  setOpenLicense: (open: boolean) => void;
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleChange = (date: any) => {
    setSelectedDate(date);
  };

  const createLicense = useCreateLicense();

  const handlerLicense = (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const form = e.target as HTMLFormElement;

    if (selectedDate) {
      formData.set("purchaseDate", selectedDate.toISOString());
    }

    createLicense.mutate(formData, {
      onSuccess: () => {
        form.reset();
        setOpenLicense(false);
      },
    });

    console.log("Form Data:", Object.fromEntries(formData.entries()));
  };

  return (
    <>
      <div className=" py-5 bg-app-bg text-app-text transition-colors duration-300">

        <div className=" bg-app-bg border border-app-gray/10 rounded-md shadow-sm p-6 md:p-8">
          {/* Title */}
          <h2 className="text-xl font-bold mb-4">Add New License</h2>

          <form onSubmit={handlerLicense} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
              {/* Software Name */}
              <div className="space-y-2">
                <label className="text-sm  font-medium">Software Name</label>
                <input
                  type="text"
                  name="softwareName"
                  required
                  placeholder="Software Name"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>

              {/* Vendor/Publisher */}
              <div className="space-y-2">
                <label className="text-sm  font-medium">Vendor/Publisher</label>
                <input
                  type="text"
                  name="vendorPublisher"
                  placeholder="Vendor or Publisher"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>

              {/* License Key */}
              <div className="space-y-2">
                <label className="text-sm  font-medium">License Key</label>
                <input
                  type="text"
                  name="licenseKey"
                  placeholder="License Key"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>

              {/* License Type Dropdown */}
              <div className="space-y-2">
                <label className="text-sm  font-medium">License Type</label>
                <select
                  required
                  name="licenseType"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-app-bg focus:outline-none focus:border-app-brand transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select Type</option>
                  <option value="subscription">Subscription</option>
                  <option value="one-time">One-time</option>
                </select>
              </div>

              {/* Total Quantity */}
              <div className="space-y-2">
                <label className="text-sm  font-medium">Total Quantity</label>
                <input
                  type="number"
                  name="totalQuantity"
                  required
                  placeholder="0"
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>

              {/* Purchase Date */}
              <div className="space-y-2">
                <label className="text-sm  font-medium">Purchase Date</label>

                <DatePicker
                  selected={selectedDate}
                  onChange={handleChange}
                  wrapperClassName="w-full"
                  placeholderText="Purchase Date"
                  calendarClassName="animate-fadeIn"
                  isClearable
                  popperPlacement="bottom-start"
                  dateFormat="yyyy-MM-dd"
                  name="purchaseDate"
                  required
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors text-app-gray"
                />
              </div>

              {/* Costs */}
              <div className="space-y-2">
                <label className="text-sm  font-medium">Costs</label>
                <input
                  type="number"
                  placeholder="0"
                  name="costs"
                  required
                  className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
                />
              </div>
            </div>

            {/* Notes - Full Width */}
            <div className="space-y-2 mt-6">
              <label className="text-sm font-medium">Notes</label>
              <textarea
                rows={4}
                name="notes"
                className="w-full px-4 my-2 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors resize-y"
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-2 mt-6">
              <label className="text-xs text-app-text font-medium">
                License Certificate / Image{" "}
                <span className="opacity-70">
                  (Optional - JPEG, PNG, GIF, WebP up to 5MB)
                </span>
              </label>

              <div className="p-5 border border-dashed border-app-gray/30 rounded-xl bg-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <label className="cursor-pointer bg-app-brand/20 text-app-brand px-4 py-1.5 rounded-md text-sm font-medium hover:bg-app-brand/50 transition-colors">
                    Choose File
                    <input name="image" type="file" className="hidden" />
                  </label>
                  <span className="text-sm text-app-text">No file chosen</span>
                </div>

                <p className="text-[11px] text-app-text opacity-80">
                  Formats: JPG, PNG, GIF, WebP (max 5mb). This helps you keep
                  all license details in one place for easy reference.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-10">
              <button
                disabled={createLicense.isPending}
                onClick={() => setOpenLicense(false)}
                type="button"
                className="px-8 py-2 rounded-lg border border-app-gray/30 font-medium hover:bg-app-gray/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2 rounded-lg bg-app-brand text-white font-medium hover:opacity-90 transition-opacity"
              >
                {createLicense.isPending ? "Saving..." : "Add License"}
              </button>
            </div>
          </form>
        </div>
       
      </div>

      
    </>
  );
};

export default Add_License;
