import { useState } from "react";
import {
  FiX,
  FiUser,
  FiMail,
  FiShield,
  FiCheckCircle,
  FiCamera,
} from "react-icons/fi";
import { useUpdateUser } from "../../context/useUserQuery";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthProvider";

const USER_ROLES = ["ADMIN", "MANAGER", "FINANCE", "IT", "GUEST"] as const;

const USER_STATUSES = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

type UserRole = (typeof USER_ROLES)[number];

interface UserType {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  image?: string;
}

interface UserUpdateProps {
  user: UserType;
  onClose: () => void;
}

export default function User_Update({ user, onClose }: UserUpdateProps) {
  const updateMutation = useUpdateUser();

  const getImageUrl = (image?: string) => {
    if (!image) return undefined;

    if (image.startsWith("http:") || image.startsWith("https:")) {
      return image;
    }

    return `${import.meta.env.VITE_BACKEND_URL_LINK}${image}`;
  };

  const initialImage = getImageUrl(user.image);

  const [imagePreview, setImagePreview] = useState<string | undefined>(
    initialImage,
  );

  const { user: authUser, updateAuthUser } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];

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

      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("image") as File;

    if (!imageFile || imageFile.size === 0) {
      formData.delete("image");
    }

    updateMutation.mutate(
      { id: user.id, updateData: formData },
      {
        onSuccess: (response: any) => {
          const updatedUser = response?.data?.data?.user;

          if (updatedUser && String(user.id) === String(authUser?.id)) {
            updateAuthUser(updatedUser);
          }
          

          onClose();
        },

        onError: (error: any) => {
          console.error("Update failed:", error);
          toast.error(
            error.response?.data?.message ||
              error.response?.data?.error ||
              "Update failed!",
          );
        },
      },
    );
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-app-bg border border-app-gray/20 rounded-xl p-6 shadow-xl space-y-4 animate-scaleIn">
        <div className="flex justify-between items-center border-b border-app-gray/10 pb-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <FiUser className="text-app-brand" size={16} />
            <span>Update User Profile</span>
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="text-app-gray hover:text-app-text transition-colors cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        <form
          onSubmit={handleUpdateSubmit}
          className="space-y-4 text-left"
          encType="multipart/form-data"
        >
          <div className="flex flex-col items-center justify-center space-y-2 pb-2">
            <div className="relative group w-20 h-20">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border border-app-gray/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-app-brand/10 text-app-brand border border-app-brand/20 flex items-center justify-center font-bold text-xl uppercase">
                  {(user.name || user.email || "U").charAt(0)}
                </div>
              )}

              <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                <FiCamera size={18} />

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <span className="text-[11px] text-app-gray font-medium">
              Click photo to update
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Full Name</label>

            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-app-gray opacity-50">
                <FiUser size={15} />
              </div>

              <input
                type="text"
                name="name"
                required
                defaultValue={user.name}
                className="w-full px-3 py-2.5 pl-10 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5 opacity-60">
            <label className="text-xs font-semibold">
              Email Address (Read-only)
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-app-gray opacity-50">
                <FiMail size={15} />
              </div>

              <input
                type="email"
                disabled
                readOnly
                defaultValue={user.email}
                className="w-full px-3 py-2.5 pl-10 rounded-lg border border-app-gray/20 bg-app-gray/5 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Assign Role</label>

            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-app-gray opacity-50">
                <FiShield size={15} />
              </div>

              <select
                name="role"
                defaultValue={user.role}
                required
                className="w-full px-3 py-2.5 pl-10 rounded-lg border border-app-gray/30 bg-app-bg text-sm focus:outline-none focus:border-app-brand cursor-pointer"
              >
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Account Status</label>

            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-app-gray opacity-50">
                <FiCheckCircle size={15} />
              </div>

              <select
                name="isActive"
                defaultValue={user.isActive ? "true" : "false"}
                required
                className="w-full px-3 py-2.5 pl-10 rounded-lg border border-app-gray/30 bg-app-bg text-sm focus:outline-none focus:border-app-brand cursor-pointer"
              >
                {USER_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2 text-xs font-bold">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-app-gray/30 text-app-text hover:bg-app-gray/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-5 py-2 rounded-lg bg-app-brand text-white hover:opacity-90 transition-opacity cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
