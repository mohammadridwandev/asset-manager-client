import {
  FiCamera,
  FiCheckCircle,
  FiEdit2,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthProvider";
import { useUpdateProfile } from "../../context/useUserQuery";

export default function Profile() {
  // ========================= UPDATED: logout added =========================
  // কেন:
  // Password update সফল হলে old login token/session clear করতে হবে।
  const { user, updateAuthUser, logout } = useAuth();

  // ========================= UPDATED: navigate added =========================
  // কেন:
  // Password update সফল হলে login page-এ পাঠাবে।
  const navigate = useNavigate();

  const updateProfileMutation = useUpdateProfile();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_LINK || "";

  // ========================= UPDATED: safe image URL =========================
  // কেন:
  // Base URL বা image path-এ extra slash থাকলেও URL ঠিক থাকবে।
  const getImageUrl = (image?: string) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_BASE_URL.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only .jpg, .jpeg, .png or .webp files are allowed!");

      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB!");

      event.target.value = "";
      return;
    }

    // ========================= UPDATED: previous preview cleanup =========================
    // কেন:
    // বারবার image select করলে browser memory leak কমাবে।
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);

    setImagePreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.id) {
      toast.error("User information is unavailable. Please log in again.");

      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const currentPassword = String(formData.get("currentPassword") || "");

    const newPassword = String(formData.get("newPassword") || "");



    const confirmPassword = String(formData.get("confirmPassword") || "");

    // ========================= UPDATED: detect password update =========================
    // কেন:
    // Password field-এর যেকোনো একটিতে value থাকলে password validation চালু হবে।
    const isPasswordUpdate =
      Boolean(currentPassword) ||
      Boolean(newPassword) ||
      Boolean(confirmPassword);

    // Email readonly এবং backend-এ update হবে না
    formData.delete("email");

    // Selected image manually পাঠাবে
    formData.delete("image");

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    if (isPasswordUpdate) {
      // ========================= UPDATED: current password required =========================
      if (!currentPassword) {
        toast.error("Please enter your current password.");

        return;
      }

      // ========================= UPDATED: new password required =========================
      if (!newPassword) {
        toast.error("Please enter a new password.");

        return;
      }

      // ========================= UPDATED: confirm password required =========================
      if (!confirmPassword) {
        toast.error("Please confirm your new password.");

        return;
      }

      // ========================= UPDATED: current and new cannot be same =========================
      // কেন:
      // User একই password আবার new password হিসেবে দিতে পারবে না।
      if (currentPassword === newPassword) {
        toast.error(
          "New password must be different from your current password.",
        );

        return;
      }

      // ========================= UPDATED: minimum password length =========================
      // কেন:

    

      // ========================= UPDATED: new and confirm match =========================
      if (newPassword !== confirmPassword) {
        toast.error("New password and confirm password do not match.");

        return;
      }
    } else {
      // ========================= UPDATED: empty password fields removed =========================
      // কেন:
      // শুধু name/image update করলে password-related data backend-এ যাবে না।
      formData.delete("currentPassword");

      formData.delete("newPassword");

      formData.delete("confirmPassword");
    }

    updateProfileMutation.mutate(
      {
        id: String(user.id),
        updateData: formData,
      },
      {
        onSuccess: (response: any) => {
          // ========================= UPDATED: password success flow =========================
          // কেন:
          // Password change হলে old token/session আর ব্যবহার করা হবে না।
          // User-কে new password দিয়ে fresh login করতে হবে।
          if (isPasswordUpdate) {
            logout();

            toast.success(
              "Password updated successfully. Please log in with your new password.",
            );

            navigate("/login", {
              replace: true,
            });

            return;
          }

          // ========================= EXISTING: profile-only update =========================
          const updatedUser =
            response?.data?.data?.user || response?.data?.data;

          if (updatedUser) {
            updateAuthUser(updatedUser);
          }

          if (imagePreview?.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
          }

          setSelectedImage(null);
          setImagePreview(null);

          // Password input clear করবে
          form.reset();

          toast.success("Profile updated successfully.");
        },

        onError: () => {
          /*
           * Current password ভুল, same password,
           * mismatch বা backend validation message
           * useUpdateProfile hook থেকে দেখাবে।
           *
           * Error হলে form data clear হবে না।
           */
        },
      },
    );
  };

  // ========================= UPDATED: reset handler =========================
  // কেন:
  // Cancel click করলে selected preview এবং file state-ও reset হবে।
  const handleReset = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-10 bg-app-bg py-4 text-app-text transition-colors duration-300 md:py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Account Settings
          </h1>

          <p className="mt-1 text-sm text-app-gray opacity-80">
            Update your profile details and manage your security settings.
          </p>
        </div>

        <form
          onSubmit={handleProfileSubmit}
          onReset={handleReset}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          encType="multipart/form-data"
        >
          <input
            ref={imageInputRef}
            type="file"
            name="image"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="space-y-6 rounded-xl border border-app-gray/10 p-5 lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div
                onClick={() => imageInputRef.current?.click()}
                className="group relative mb-4 cursor-pointer"
              >
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-app-gray/30 bg-app-gray/10">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : user?.image ? (
                    <img
                      src={getImageUrl(user.image)}
                      alt={user?.name || "User Avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold uppercase text-app-brand">
                      {(user?.name || user?.email || "U").charAt(0)}
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <FiCamera size={20} className="text-white" />
                </div>
              </div>

              <h3 className="text-base font-bold">{user?.name}</h3>

              <button
                type="button"
                disabled={updateProfileMutation.isPending}
                onClick={() => imageInputRef.current?.click()}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-app-brand px-4 py-2.5 text-xs font-bold text-app-brand transition-all hover:bg-app-brand/5 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiEdit2 size={13} />

                <span>Edit Profile Picture</span>
              </button>

              <div className="my-5 w-full border-t border-app-gray/10" />

              <div className="w-full space-y-3 text-left text-xs">
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

                <div className="flex items-center justify-between">
                  <span className="text-app-gray">Status:</span>

                  <span className="flex items-center gap-1 rounded-full border border-app-brand/20 bg-app-brand/10 px-2.5 py-0.5 text-[10px] font-bold text-app-brand">
                    <FiCheckCircle size={10} />

                    {user?.isActive === false ? "Inactive" : "Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-xl border border-app-gray/10 p-5 lg:col-span-2">
            <div className="space-y-5">
              <h2 className="flex items-center gap-2 border-b border-app-gray/10 pb-3 text-sm font-bold">
                <FiUser className="text-app-brand" size={16} />

                <span>Personal Information</span>
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Full Name</label>

                  <input
                    type="text"
                    name="name"
                    defaultValue={user?.name || ""}
                    className="w-full rounded-lg border border-app-gray/30 bg-transparent px-3 py-2.5 text-sm capitalize transition-colors focus:border-app-brand focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Email Address</label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-app-gray opacity-50">
                      <FiMail size={15} />
                    </div>

                    <input
                      type="email"
                      name="email"
                      readOnly
                      defaultValue={user?.email || ""}
                      className="w-full cursor-not-allowed rounded-lg border border-app-gray/30 bg-transparent px-3 py-2.5 pl-10 text-sm text-app-gray transition-colors focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5 rounded-xl border border-app-gray/15 bg-app-bg p-6 shadow-xs">
              <div className="border-b border-app-gray/10 pb-3">
                <h2 className="flex items-center gap-2 text-sm font-bold">
                  <FiLock className="text-app-brand" size={16} />

                  <span>Security & Password</span>
                </h2>

                <p className="mt-2 text-xs text-app-gray">
                  Leave all password fields empty when you do not want to change
                  your password.
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="password"
                  name="currentPassword"
                  autoComplete="current-password"
                  placeholder="Current Password"
                  className="w-full rounded-lg border border-app-gray/30 bg-transparent px-3 py-2.5 text-sm transition-colors focus:border-app-brand focus:outline-none"
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <input
                    type="password"
                    name="newPassword"
                    autoComplete="new-password"
                    
                    placeholder="New Password"
                    className="w-full rounded-lg border border-app-gray/30 bg-transparent px-3 py-2.5 text-sm transition-colors focus:border-app-brand focus:outline-none"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    
                    placeholder="Confirm New Password"
                    className="w-full rounded-lg border border-app-gray/30 bg-transparent px-3 py-2.5 text-sm transition-colors focus:border-app-brand focus:outline-none"
                  />
                </div>

                <p className="text-[11px] text-app-gray">
                  New password must contain at least 8 characters and must be
                  different from your current password.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 text-sm font-semibold">
              <button
                type="reset"
                disabled={updateProfileMutation.isPending}
                className="cursor-pointer rounded-lg border border-app-gray/30 px-6 py-2.5 text-app-text transition-colors hover:bg-app-gray/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="cursor-pointer rounded-lg bg-app-brand px-6 py-2.5 text-white transition-opacity hover:opacity-90 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
