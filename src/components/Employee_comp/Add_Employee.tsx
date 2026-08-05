import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

import {
  useCreateEmployee,
  useGetEmployeeFilterOptions,
} from "../../context/useEmployee";

const Add_Employee = ({
  setOpenEmployee,
}: {
  setOpenEmployee: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}) => {
  const [startDate, setStartDate] =
    useState<Date | null>(new Date());

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [fileName, setFileName] =
    useState("No file chosen");

  const useEmployeeData =
    useCreateEmployee();

  const {
    data: employeeFilterOptions,
    isLoading: isFilterOptionsLoading,
    isError: isFilterOptionsError,
  } = useGetEmployeeFilterOptions();

  const departments: string[] =
    employeeFilterOptions?.departments || [];

  const positions: string[] =
    employeeFilterOptions?.positions || [];

  const handleDateSelect = (
    date: Date | null,
  ) => {
    setStartDate(date);
  };

  const handlerImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!file) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only .jpg, .jpeg, .png or .webp files are allowed!",
      );

      event.target.value = "";
      setImagePreview(null);
      setFileName("No file chosen");

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        "File size should be less than 2MB!",
      );

      event.target.value = "";
      setImagePreview(null);
      setFileName("No file chosen");

      return;
    }

    setFileName(file.name);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(
        reader.result as string,
      );
    };

    reader.readAsDataURL(file);
  };

  const handlerEmployee = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (startDate) {
      formData.set(
        "joinDate",
        startDate
          .toISOString()
          .split("T")[0],
      );
    } else {
      formData.delete("joinDate");
    }

    const imageFile = formData.get(
      "image",
    ) as File | null;

    if (
      !imageFile ||
      imageFile.size === 0
    ) {
      formData.delete("image");
    }

    useEmployeeData.mutate(formData, {
      onSuccess: () => {
        form.reset();

        setStartDate(new Date());
        setImagePreview(null);
        setFileName("No file chosen");
        setOpenEmployee(false);
      },

      onError: () => {
        // Error message hook থেকে আসবে
      },
    });
  };

  return (
    <div className="min-h-screen bg-app-bg py-5 text-app-text transition-colors duration-300">
      <div className="rounded-xl border border-app-gray/10 bg-app-bg p-6 shadow-sm md:p-8">
        <h2 className="mb-5 text-xl font-bold">
          Add New Employee
        </h2>

        <form
          onSubmit={handlerEmployee}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-app-text">
                Full Name *
              </label>

              <input
                type="text"
                required
                name="fullName"
                placeholder="Enter full name"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Iqama/Passport */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-app-text">
                Iqama/Passport *
              </label>

              <input
                type="text"
                name="iqamaNumber"
                required
                placeholder="Enter Iqama ID or Passport"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-app-text">
                Phone Number
              </label>

              <input
                type="tel"
                name="phoneNumber"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+966 XXX XXX XXXX"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-app-text">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="employee@company.com"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label
                htmlFor="employeeDepartment"
                className="text-sm font-medium text-app-text"
              >
                Department *
              </label>

              <input
                id="employeeDepartment"
                type="text"
                name="department"
                list="employee-department-options"
                required
                autoComplete="off"
                placeholder={
                  isFilterOptionsLoading
                    ? "Loading departments..."
                    : "Enter or select department"
                }
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />

              <datalist id="employee-department-options">
                {departments.map(
                  (department) => (
                    <option
                      key={department}
                      value={department}
                    />
                  ),
                )}
              </datalist>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label
                htmlFor="employeePosition"
                className="text-sm font-medium text-app-text"
              >
                Position *
              </label>

              <input
                id="employeePosition"
                type="text"
                name="position"
                list="employee-position-options"
                required
                autoComplete="off"
                placeholder={
                  isFilterOptionsLoading
                    ? "Loading positions..."
                    : "Enter or select position"
                }
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />

              <datalist id="employee-position-options">
                {positions.map(
                  (position) => (
                    <option
                      key={position}
                      value={position}
                    />
                  ),
                )}
              </datalist>
            </div>

            {/* Join Date */}
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-medium text-app-text">
                Join Date
              </label>

              <DatePicker
                selected={startDate}
                onChange={handleDateSelect}
                dateFormat="yyyy-MM-dd"
                name="joinDate"
                closeOnScroll
                isClearable
                wrapperClassName="w-full"
                placeholderText="Select Join Date"
                popperPlacement="bottom-start"
                calendarClassName="animate-fadeIn"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>
          </div>

          {isFilterOptionsError && (
            <div className="rounded-md border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-medium text-red-500">
              Failed to load department and
              position suggestions. You can
              still enter them manually.
            </div>
          )}

          {/* Image Upload */}
          <div className="mt-8 flex items-center gap-4 rounded-xl border border-dashed border-app-gray/30 p-6">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-app-gray/20 text-[10px] text-app-gray">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="opacity-60">
                  Preview
                </span>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center gap-3">
                <label className="cursor-pointer rounded-md bg-app-brand/20 px-4 py-1.5 text-sm font-medium text-app-brand transition-colors hover:bg-app-brand/30">
                  Choose File

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    name="image"
                    onChange={
                      handlerImageChange
                    }
                    className="hidden"
                  />
                </label>

                <span className="max-w-50 truncate text-sm text-app-gray">
                  {fileName}
                </span>
              </div>

              <p className="text-[11px] text-app-gray">
                jpg | jpeg | png | webp |
                Max 2MB
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex justify-end gap-4">
            <button
              onClick={() =>
                setOpenEmployee(false)
              }
              type="button"
              disabled={
                useEmployeeData.isPending
              }
              className="rounded-lg border border-app-gray/30 px-8 py-2 font-medium transition-colors hover:bg-app-gray/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                useEmployeeData.isPending
              }
              className="rounded-lg bg-app-brand px-8 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {useEmployeeData.isPending
                ? "Adding..."
                : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_Employee;