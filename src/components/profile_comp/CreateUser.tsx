import { FiUser, FiMail, FiShield, FiLock, FiPlusCircle } from "react-icons/fi";
import { useCreateUser } from "../../context/useUserQuery";

export default function CreateUser() {
  const createUser = useCreateUser();

  const handlerNewUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newUser = {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      password: formData.get("password"),
    };

    createUser.mutate(newUser);
    e.currentTarget.reset();
  };

  return (
    <div className="w-full bg-app-bg border border-app-gray/15 rounded-xl p-6 shadow-xs space-y-5 transition-colors duration-300">
      {/* Header */}
      <h2 className="text-sm font-bold flex items-center gap-2 border-b border-app-gray/10 pb-3">
        <FiPlusCircle className="text-app-brand" size={16} />
        <span>Create New User</span>
      </h2>

      <form onSubmit={handlerNewUser} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Full Name Input */}
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
                placeholder="Enter full name"
                className="w-full px-3 py-2.5 pl-10 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand text-sm transition-colors"
              />
            </div>
          </div>

          {/* Email Address Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-app-gray opacity-50">
                <FiMail size={15} />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="user@company.com"
                className="w-full px-3 py-2.5 pl-10 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand text-sm transition-colors"
              />
            </div>
          </div>

          {/* Role Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Assign Role</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-app-gray opacity-50">
                <FiShield size={15} />
              </div>
              <select
                name="role"
                defaultValue=""
                required
                className="w-full px-3 py-2.5 pl-10 rounded-lg border border-app-gray/30 bg-app-bg text-sm focus:outline-none focus:border-app-brand cursor-pointer appearance-none"
              >
                <option value="" disabled>
                  {" "}
                  Select Your Role
                </option>

                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="FINANCE">Finance</option>
                <option value="IT">IT</option>
                <option value="GUEST">Guest</option>
              </select>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-app-gray opacity-50">
                <FiLock size={15} />
              </div>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 pl-10 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand text-sm transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-3 text-sm font-semibold">
          <button
            disabled={createUser.isPending}
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-app-brand text-white hover:opacity-90 transition-opacity active:scale-98 cursor-pointer shadow-sm"
          >
            {createUser.isPending ? "Adding..." : "Add User"}
          </button>
        </div>
      </form>
    </div>
  );
}
