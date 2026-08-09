import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  useGetSingleEmployee,
  useUpdateEmployee,
} from "../../context/useEmployee";
import DataLoading from "../../DataLoading";

export default function Update_Employee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: employee, isLoading, isError } = useGetSingleEmployee(id);

  const updateMutation = useUpdateEmployee();

  const [startDate, setStartDate] = useState<Date | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [fileName, setFileName] = useState("No file chosen");

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_LINK || "";

  // ====================================================
  // BUILD SAFE IMAGE URL
  // ====================================================
  const getImageUrl = (image?: string | null) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_BASE_URL.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;
  };

  // ====================================================
  // LOAD EXISTING EMPLOYEE DATA
  // ====================================================
  useEffect(() => {
    if (!employee) {
      return;
    }

    // Existing join date load করবে
    if (employee.joinDate) {
      const parsedDate = new Date(employee.joinDate);

      setStartDate(Number.isNaN(parsedDate.getTime()) ? null : parsedDate);
    } else {
      setStartDate(null);
    }

    // Existing image preview load করবে
    if (employee.image) {
      setImagePreview(getImageUrl(employee.image));
    } else {
      setImagePreview(null);
    }

    setFileName("No file chosen");
  }, [employee]);

  const handleDateSelect = (date: Date | null) => {
    setStartDate(date);
  };

  // ====================================================
  // IMAGE VALIDATION
  // ====================================================
  const handlerImageUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (!file) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only .jpg, .jpeg, .png or .webp files are allowed!");

      event.target.value = "";

      // Invalid file হলে existing image preview রাখবে
      setImagePreview(employee?.image ? getImageUrl(employee.image) : null);

      setFileName("No file chosen");

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB!");

      event.target.value = "";

      // Large file হলে existing image preview রাখবে
      setImagePreview(employee?.image ? getImageUrl(employee.image) : null);

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

  // ====================================================
  // UPDATE EMPLOYEE
  // ====================================================
  const handlerEmployeeUpdate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!id) {
      toast.error("Invalid employee ID.");

      return;
    }

    const form = event.currentTarget;

    const confirm = await Swal.fire({
      title: "Update Employee?",
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

    const formData = new FormData(form);

    // Clean required text values
    formData.set("fullName", String(formData.get("fullName") || "").trim());

    formData.set(
      "iqamaNumber",
      String(formData.get("iqamaNumber") || "").trim(),
    );

    formData.set("department", String(formData.get("department") || "").trim());

    formData.set("position", String(formData.get("position") || "").trim());

    // Optional phone
    const phoneNumber = String(formData.get("phoneNumber") || "").trim();

    if (phoneNumber) {
      formData.set("phoneNumber", phoneNumber);
    } else {
      // Backend null করবে
      formData.set("phoneNumber", "");
    }

    // Optional email
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    if (email) {
      formData.set("email", email);
    } else {
      // Backend null করবে
      formData.set("email", "");
    }

    // Join date
    if (startDate) {
      formData.set("joinDate", startDate.toISOString().split("T")[0]);
    } else {
      // Date clear করলে backend null করবে
      formData.set("joinDate", "");
    }

    // Empty file পাঠাবে না
    const imageFile = formData.get("image") as File | null;

    if (!imageFile || imageFile.size === 0) {
      formData.delete("image");
    }

    updateMutation.mutate(
      {
        id: String(id),
        updateData: formData,
      },
      {
        onSuccess: async () => {
          await Swal.fire({
            title: "Updated!",
            text: "Employee updated successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          navigate("/dashboard/employees");
        },

        onError: () => {
          /*
           * Professional error toast
           * useUpdateEmployee hook থেকে আসবে।
           * Error হলে form data unchanged থাকবে।
           */
        },
      },
    );
  };

  if (isLoading) {
    return (
      <DataLoading
        title="Update employee"
        message="Loading employee data..."
      ></DataLoading>
    );
  }

  if (isError || !employee) {
    return (
      <div className="flex min-h-75 items-center justify-center text-red-500">
        Employee not found!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg py-5 text-app-text transition-colors duration-300">
      <div className="rounded-xl border border-app-gray/10 bg-app-bg p-6 shadow-sm md:p-8">
        <h2 className="mb-5 text-xl font-bold">Update Employee</h2>

        <form onSubmit={handlerEmployeeUpdate} className="space-y-3">
          <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-app-text">
                Full Name *
              </label>

              <input
                type="text"
                required
                name="fullName"
                defaultValue={employee.fullName || ""}
                placeholder="Enter full name"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Iqama / Passport */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-app-text">
                Iqama/Passport *
              </label>

              <input
                type="text"
                required
                name="iqamaNumber"
                defaultValue={employee.iqamaNumber || ""}
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
                defaultValue={employee.phoneNumber || ""}
                placeholder="+966 XXX XXX XXXX"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-app-text">Email</label>

              <input
                type="email"
                name="email"
                autoComplete="email"
                defaultValue={employee.email || ""}
                placeholder="employee@company.com"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-app-text">
                Department *
              </label>

              <input
                type="text"
                required
                name="department"
                defaultValue={employee.department || ""}
                placeholder="Enter department"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-app-text">
                Position *
              </label>

              <input
                type="text"
                required
                name="position"
                defaultValue={employee.position || ""}
                placeholder="e.g., Manager, Developer"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-app-text">
                Status
              </label>

              <select
                name="status"
                defaultValue={employee.status || "ACTIVE"}
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-app-bg px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              >

                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="VACATION">Vacation</option>

              </select>
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

          {/* Image Upload */}
          <div className="mt-8 flex items-center gap-4 rounded-xl border border-dashed border-app-gray/30 p-6">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-app-gray/20 text-[10px] text-app-gray">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Employee preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="opacity-60">Preview</span>
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
                    onChange={handlerImageUpdate}
                    className="hidden"
                  />
                </label>

                <span className="max-w-50 truncate text-sm text-app-gray">
                  {fileName}
                </span>
              </div>

              <p className="text-[11px] text-app-gray">
                jpg | jpeg | png | webp | Max 2MB
              </p>
              
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex justify-end gap-4">
            <button
              type="button"
              disabled={updateMutation.isPending}
              onClick={() => navigate("/dashboard/employees")}
              className="rounded-lg border border-app-gray/30 px-8 py-2 font-medium transition-colors hover:bg-app-gray/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-lg bg-app-brand px-8 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateMutation.isPending ? "Updating..." : "Update Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
