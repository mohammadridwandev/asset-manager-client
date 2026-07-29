import { useState } from "react";
import DatePicker from "react-datepicker";
import { useCreateLicense } from "../../context/useLicenses";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const Add_License = ({
  setOpenLicense,
}: {
  setOpenLicense: (open: boolean) => void;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(),
  );

  const [selectedFileName, setSelectedFileName] =
    useState("No file chosen");

  const [fileError, setFileError] = useState("");

  const createLicense = useCreateLicense();

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    setFileError("");

    if (!file) {
      setSelectedFileName("No file chosen");
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError(
        "Only JPG, JPEG, PNG, GIF, and WebP files are allowed.",
      );

      setSelectedFileName("No file chosen");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size must not exceed 2 MB.");
      setSelectedFileName("No file chosen");
      e.target.value = "";
      return;
    }

    setSelectedFileName(file.name);
  };

  const handlerLicense = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (fileError) {
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (selectedDate) {
      formData.set(
        "purchaseDate",
        selectedDate.toISOString(),
      );
    }

    createLicense.mutate(formData, {
      onSuccess: () => {
        form.reset();
        setSelectedDate(new Date());
        setSelectedFileName("No file chosen");
        setFileError("");
        setOpenLicense(false);
      },
    });

    console.log(
      "Form Data:",
      Object.fromEntries(formData.entries()),
    );
  };

  return (
    <div className="bg-app-bg py-5 text-app-text transition-colors duration-300">
      <div className="rounded-md border border-app-gray/10 bg-app-bg p-6 shadow-sm md:p-8">
        <h2 className="mb-4 text-xl font-bold">
          Add New License
        </h2>

        <form
          onSubmit={handlerLicense}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Software Name *
              </label>

              <input
                type="text"
                name="softwareName"
                required
                placeholder="Software Name"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Vendor/Publisher
              </label>

              <input
                type="text"
                name="vendorPublisher"
                placeholder="Vendor or Publisher"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                License Key
              </label>

              <input
                type="text"
                name="licenseKey"
                placeholder="License Key"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                License Type *
              </label>

              <select
                required
                name="licenseType"
                className="my-2 w-full cursor-pointer appearance-none rounded-lg border border-app-gray/30 bg-app-bg px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              >
                <option value="">Select Type</option>
                <option value="subscription">
                  Subscription
                </option>
                <option value="one-time">
                  One-time
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Total Quantity *
              </label>

              <input
                type="number"
                name="totalQuantity"
                required
                min="1"
                placeholder="0"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Purchase Date
              </label>

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
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 text-app-gray transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Costs *
              </label>

              <input
                type="number"
                placeholder="0"
                name="costs"
                required
                min="0"
                step="0.01"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium">
              Notes
            </label>

            <textarea
              rows={4}
              name="notes"
              placeholder="Write license notes..."
              className="my-2 w-full resize-y rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
            />
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-xs font-medium text-app-text">
              License Certificate / Image{" "}
              <span className="opacity-70">
                (Optional - JPEG, PNG, GIF, WebP up to 2
                MB)
              </span>
            </label>

            <div
              className={`rounded-xl border border-dashed bg-transparent p-5 ${
                fileError
                  ? "border-red-500"
                  : "border-app-gray/30"
              }`}
            >
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <label className="cursor-pointer rounded-md bg-app-brand/20 px-4 py-1.5 text-sm font-medium text-app-brand transition-colors hover:bg-app-brand/50">
                  Choose File

                  <input
                    name="image"
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.gif,.webp"
                    onChange={handleFileChange}
                  />
                </label>

                <span className="max-w-full truncate text-sm text-app-text">
                  {selectedFileName}
                </span>
              </div>

              <p className="text-[11px] text-app-text opacity-80">
                Formats: JPG, JPEG, PNG, GIF, WebP. Maximum
                file size is 2 MB.
              </p>

              {fileError && (
                <p className="mt-2 text-sm font-medium text-red-500">
                  {fileError}
                </p>
              )}
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-4">
            <button
              disabled={createLicense.isPending}
              onClick={() => setOpenLicense(false)}
              type="button"
              className="rounded-lg border border-app-gray/30 px-8 py-2 font-medium transition-colors hover:bg-app-gray/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                createLicense.isPending || Boolean(fileError)
              }
              className="rounded-lg bg-app-brand px-8 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createLicense.isPending
                ? "Saving..."
                : "Add License"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_License;