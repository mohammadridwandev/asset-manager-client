import {
  FiCamera,
  FiCheckCircle,
  FiEdit2,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthProvider";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useUpdateProfile } from "../../context/useUserQuery";

export default function Profile() {
  const { user, updateAuthUser } = useAuth();
  const updateProfileMutation = useUpdateProfile();

 
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);


  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_LINK;

  const getImageUrl = (image?: string) => {
    if (!image) return "";
    return image.startsWith("http") ? image : `${API_BASE_URL}${image}`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only .jpg, .jpeg, .png or .webp files are allowed!");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB!");
      e.target.value = "";
      return;
    }

    // UPDATED: real image file save
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const currentPassword = String(formData.get("currentPassword") || "");
    const newPassword = String(formData.get("newPassword") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    // UPDATED: email update হবে না
    formData.delete("email");

    // UPDATED: image manually append করা হলো
    formData.delete("image");
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    // UPDATED: password empty হলে backend এ পাঠাবে না
    if (!currentPassword && !newPassword && !confirmPassword) {
      formData.delete("currentPassword");
      formData.delete("newPassword");
      formData.delete("confirmPassword");
    }

    // UPDATED: password validation
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        toast.error("Current password is required");
        return;
      }

      if (!newPassword) {
        toast.error("New password is required");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("New password and confirm password do not match");
        return;
      }
    }

    updateProfileMutation.mutate(
      {
        id: String(user?.id),
        updateData: formData,
      },
      {
        onSuccess: (response: any) => {
          const updatedUser = response?.data?.data?.user || response?.data?.data;

          // UPDATED: logged-in user localStorage + state update
          if (updatedUser) {
            updateAuthUser(updatedUser);
            setSelectedImage(null);
            setImagePreview(null);
          }
        },
      },
    );
  };

  return (
    <div className="bg-app-bg text-app-text py-4 md:py-8 space-y-10 transition-colors duration-300">

      <div className="space-y-8">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-app-gray opacity-80 text-sm mt-1">
            Update your profile details and manage your security settings.
          </p>
        </div>

        <form
          onSubmit={handleProfileSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          encType="multipart/form-data"
        >
          <input
            ref={imageInputRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="lg:col-span-1 p-5 border border-app-gray/10 rounded-xl  space-y-6">

            <div className=" flex flex-col items-center text-center ">
              <div
                onClick={() => imageInputRef.current?.click()}
                className="relative group cursor-pointer mb-4"
              >
                <div className="w-24 h-24 rounded-full border border-app-gray/30 bg-app-gray/10 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.image ? (
                    <img
                      src={getImageUrl(user.image)}
                      alt={user?.name || "User Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-app-brand uppercase">
                      {(user?.name || user?.email || "U").charAt(0)}
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <FiCamera size={20} className="text-white" />
                </div>

              </div>

              <h3 className="font-bold text-base">{user?.name}</h3>

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-app-brand text-app-brand hover:bg-app-brand/5 text-xs font-bold transition-all active:scale-98 cursor-pointer"
              >
                <FiEdit2 size={13} />
                <span>Edit Profile Picture</span>
              </button>

              <div className="w-full border-t border-app-gray/10 my-5"></div>

              <div className="w-full text-left space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-app-gray">Department:</span>
                  <span className="font-semibold">
                    {user?.department || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-app-gray">Iqama/Passport:</span>
                  <span className="font-mono font-semibold">
                    {user?.iqama || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-app-gray">Status:</span>
                  <span className="bg-app-brand/10 text-app-brand px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 border border-app-brand/20">
                    <FiCheckCircle size={10} />
                    {user?.isActive === false ? "Inactive" : "Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>


          <div className="lg:col-span-2 p-5 border border-app-gray/10 rounded-xl  space-y-6">
            <div className="   space-y-5">
              <h2 className="text-sm font-bold flex items-center gap-2 border-b border-app-gray/10 pb-3">
                <FiUser className="text-app-brand" size={16} />
                <span>Personal Information</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={user?.name || ""}
                    className="w-full px-3 capitalize py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand text-sm transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-app-gray opacity-50">
                      <FiMail size={15} />
                    </div>

                    <input
                      type="email"
                      name="email"
                      readOnly
                      defaultValue={user?.email || ""}
                      className="w-full text-app-gray cursor-not-allowed px-3 py-2.5 pl-10 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-app-bg border border-app-gray/15 rounded-xl p-6 shadow-xs space-y-5">
              <h2 className="text-sm font-bold flex items-center gap-2 border-b border-app-gray/10 pb-3">
                <FiLock className="text-app-brand" size={16} />
                <span>Security & Password</span>
              </h2>

              <div className="space-y-4">
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  className="w-full px-3 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand text-sm transition-colors"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    className="w-full px-3 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand text-sm transition-colors"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    className="w-full px-3 py-2.5 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand text-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 text-sm font-semibold">
              <button
                type="reset"
                className="px-6 py-2.5 rounded-lg border border-app-gray/30 hover:bg-app-gray/5 text-app-text transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="px-6 py-2.5 rounded-lg bg-app-brand text-white hover:opacity-90 transition-opacity active:scale-98 cursor-pointer disabled:opacity-60"
              >
                {updateProfileMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>


        </form>


      </div>
    </div>
  );
}