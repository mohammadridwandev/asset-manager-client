import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSingleEmployee,
  useUpdateEmployee,
} from "../../context/useEmployee";
import Swal from "sweetalert2";

export default function Update_Employee() {
  
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: employee, isLoading } = useGetSingleEmployee(id);


  const updateMutation = useUpdateEmployee();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("No file chosen");

  useEffect(() => {
  
    if (employee?.joinDate) {
      setStartDate(new Date(employee.joinDate));
    }

    if (employee?.image) {
      setImagePreview(`${import.meta.env.VITE_BACKEND_URL_LINK}${employee.image}`);
    }
  }, [employee]);

  const handleDateSelect = (date: Date | null) => {
    setStartDate(date);
  };


  const handlerImageUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only .jpg, .jpeg, .png or .webp files are allowed!");
      e.target.value = "";
      setImagePreview(null);
      setFileName("No file chosen");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB!");
      e.target.value = "";
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };



 const handlerEmployeeUpdate = async (
  e: React.FormEvent<HTMLFormElement>,
) => {
  e.preventDefault();

  const form = e.currentTarget;

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

  if (!confirm.isConfirmed) return;

  const formData = new FormData(form);

  if (startDate) {
    formData.set("joinDate", startDate.toISOString());
  }

  const imageFile = formData.get("image") as File;

  if (!imageFile || imageFile.size === 0) {
    formData.delete("image");
  }

  updateMutation.mutate(
    {
      id: String(id),
      updateData: formData,
    },
    {
      onSuccess: () => {
        Swal.fire({
          title: "Updated!",
          text: "Employee updated successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/dashboard/employees");
      },
    },
  );
};


  

  if (isLoading) {
    return <p className="p-6">Loading employee...</p>;
  }

  if (!employee) {
    return <p className="p-6 text-red-500">Employee not found!</p>;
  }



  return (
    <div className="min-h-screen py-5 bg-app-bg text-app-text transition-colors duration-300">
      <div className="bg-app-bg border border-app-gray/10 rounded-xl shadow-sm p-6 md:p-8">
        <h2 className="text-xl font-bold mb-5">Update Employee</h2>

        <form onSubmit={handlerEmployeeUpdate} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
            <div className="space-y-2">
              <label className="text-sm text-app-text font-medium">
                Full Name *
              </label>
              <input
                type="text"
                required
                defaultValue={employee.fullName || ""}
                name="fullName"
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 my-2 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-app-text font-medium">
                Iqama/Passport *
              </label>
              <input
                type="text"
                name="iqamaNumber"
                required
                defaultValue={employee.iqamaNumber || ""}
                placeholder="Enter Iqama ID or Passport"
                className="w-full px-4 py-2.5 my-2 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-app-text font-medium">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                defaultValue={employee.phoneNumber || ""}
                placeholder="+966 XXX XXX XXXX"
                className="w-full px-4 py-2.5 my-2 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-app-text font-medium">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={employee.email || ""}
                placeholder="employee@company.com"
                className="w-full px-4 py-2.5 my-2 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-app-text font-medium">
                Department *
              </label>
              <input
                type="text"
                required
                name="department"
                defaultValue={employee.department || ""}
                placeholder="Enter department"
                className="w-full px-4 py-2.5 my-2 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-app-text font-medium">
                Position *
              </label>
              <input
                type="text"
                required
                name="position"
                defaultValue={employee.position || ""}
                placeholder="e.g., Manager, Developer"
                className="w-full px-4 py-2.5 my-2 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-app-text font-medium">
                Status
              </label>
              <select
                name="status"
                defaultValue={employee.status || "ACTIVE"}
                className="w-full px-4 py-2.5 my-2 rounded-lg border border-app-gray/30 bg-app-bg focus:outline-none focus:border-app-brand transition-colors"
              >
                <option value="ACTIVE">Active</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="VACATION">Vacation</option>
                <option value="INACTIVE">Inactive</option>
                <option value="RESIGNED">Resigned</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-1">
              <label className="text-sm text-app-text font-medium">
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
                className="w-full px-4 py-2.5 my-2 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand transition-colors"
              />
            </div>
          </div>

          <div className="mt-8 p-6 border border-dashed border-app-gray/30 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-app-gray/20 flex items-center justify-center text-[10px] text-app-gray overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="opacity-60">Preview</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-app-brand/20 text-app-brand px-4 py-1.5 rounded-md text-sm font-medium hover:bg-app-brand/30 transition-colors">
                  Choose File
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    name="image"
                    onChange={handlerImageUpdate}
                    className="hidden"
                  />
                </label>

                <span className="text-sm text-app-gray truncate max-w-50">
                  {fileName}
                </span>
              </div>

              <p className="text-[11px] text-app-gray">
                | jpg | jpeg | png | webp | Max 2MB
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-10">
            <button
              type="button"
              onClick={() => navigate("/dashboard/employees")}
              className="px-8 py-2 rounded-lg border border-app-gray/30 font-medium hover:bg-app-gray/5 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-8 py-2 rounded-lg bg-app-brand text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {updateMutation.isPending ? "Updating..." : "Update Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}