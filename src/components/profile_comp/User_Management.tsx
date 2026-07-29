import { FaRegEdit } from "react-icons/fa";
import { FiTrash2, FiUsers } from "react-icons/fi";
import { useDeleteUser, useGetUsers } from "../../context/useUserQuery";
import Swal from "sweetalert2";

import { useState } from "react";
import User_Update from "./User_Update";
import { useAuth } from "../../context/AuthProvider";

export default function User_Management() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // 🎯 Search State
  const [searchQuery, setSearchQuery] = useState("");

  const { user: loggedInUser } = useAuth();

  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [sortBy, setSortBy] = useState("Newest First");

  const { data: users = [], isLoading } = useGetUsers();
  const deleteMutation = useDeleteUser();

  const handleDeleteUser = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handlerUserEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  // 🎯 Input Change Handler
  const handlerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user: any) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();

    const nameMatch = user.name?.toLowerCase().includes(searchLower);
    const emailMatch = user.email?.toLowerCase().includes(searchLower);

    const matchesSearch = nameMatch || emailMatch;

    // Role filter
    const matchesRole = selectedRole === "ALL" || user.role === selectedRole;

    // User status filter
    const matchesStatus =
      selectedStatus === "ALL" ||
      (selectedStatus === "ACTIVE" && user.isActive === true) ||
      (selectedStatus === "INACTIVE" && user.isActive === false);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // sorting users based on the selected option
  const sortedUsers = [...filteredUsers].sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();

    return sortBy === "Newest First" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="w-full my-16 bg-app-bg text-app-text p-4 md:p-6 border border-app-gray/20 rounded-xl shadow-xs transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FiUsers size={20} className="text-app-brand" />
          <h2 className="text-base font-bold tracking-tight">
            User Management
          </h2>
        </div>

        <span className="text-xs text-app-gray font-medium">
          Total: {isLoading ? "..." : filteredUsers.length}
        </span>
      </div>

      {/* Filters Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handlerSearch}
          placeholder="Search by name or email..."
          className="px-3 py-2 rounded-lg border border-app-gray/30 bg-transparent text-sm focus:outline-none focus:border-app-brand placeholder:text-app-gray/40 w-full"
        />

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 rounded-lg border border-app-gray/30 bg-app-bg text-sm focus:outline-none focus:border-app-brand cursor-pointer w-full"
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="FINANCE">Finance</option>
          <option value="IT">IT</option>
          <option value="GUEST">Guest</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-app-gray/30 bg-app-bg text-sm focus:outline-none focus:border-app-brand cursor-pointer w-full"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-lg border border-app-gray/30 bg-app-bg text-sm focus:outline-none focus:border-app-brand cursor-pointer w-full"
        >
          <option>Newest First</option>
          <option>Oldest First</option>
        </select>
      </div>

      {/* Responsive Table Container */}
      <div className="w-full overflow-x-auto border border-app-gray/10 rounded-lg">
        <table className="w-full text-left border-collapse min-w-200 table-fixed">
          <thead>
            <tr className="bg-app-gray/5 border-b border-app-gray/10 font-bold text-sm">
              <th className="p-4 pl-6 w-[22%]">User</th>
              <th className="p-4 w-[28%]">Email</th>
              <th className="p-4 w-[15%]">Role</th>
              <th className="p-4 w-[15%]">Status</th>
              <th className="p-4 w-[10%]">Joined</th>
              <th className="p-4 text-center pr-6 w-[10%]">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-app-gray/10">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-app-gray font-medium"
                >
                  Loading users data...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-app-gray font-medium"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              // 🎯 Render filtered list
              sortedUsers.map((user: any) => (
                <tr
                  key={user.id}
                  className="hover:bg-app-gray/5 transition-colors"
                >
                  {/* User Column */}
                  <td className="p-4 pl-6 flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.image ? (
                      <img
                        src={
                          user.image?.startsWith("http")
                            ? user.image
                            : `${import.meta.env.VITE_BACKEND_URL_LINK}${user.image}`
                        }
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-app-gray/20 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-app-brand/10 text-app-brand border border-app-brand/20 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {(user.name || user.email).charAt(0)}
                      </div>
                    )}
                    <span className="font-medium capitalize truncate">
                      {user.name || "N/A"}
                    </span>
                  </td>

                  {/* Email Column */}
                  <td className="p-4 text-app-text truncate">{user.email}</td>

                  {/* Role Column */}
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded border font-bold text-[12px] uppercase ${
                        user.role === "ADMIN"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : user.role === "FINANCE"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "bg-app-gray/5 text-app-gray border-app-gray/10"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Status Column */}
                  <td className="p-4">
                    {user.isActive ? (
                      <span className="inline-block px-3 py-1 rounded border bg-emerald-500/5 text-emerald-500 border-emerald-500/20 font-bold text-[12px] uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded border bg-amber-500/5 text-amber-500 border-amber-500/20 font-bold text-[12px] uppercase">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Joined Date Column */}
                  <td className="p-4 text-app-gray font-medium whitespace-nowrap">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* Actions Column */}
                  <td className="p-4 text-center pr-6 whitespace-nowrap">


<button
  onClick={() => {
    if (loggedInUser?.id === user.id) {
      Swal.fire({
        icon: "warning",
        title: "Not Allowed",
        text: "You cannot edit your own account.",
      });
      return;
    }

    handlerUserEdit(user);
  }}
  type="button"
  className="p-2 mx-1 bg-app-brand rounded-md cursor-pointer text-app-secondary transition-all hover:opacity-90 inline-flex items-center justify-center"
>
  <FaRegEdit size={15} />
</button>







                    <button
                      onClick={() => {
                        if (loggedInUser?.id === user.id) {
                          Swal.fire({
                            icon: "warning",
                            title: "Not Allowed",
                            text: "You cannot delete your own account.",
                          });
                          return;
                        }

                        handleDeleteUser(user.id);
                      }}
                      type="button"
                      className="p-2 mx-1 bg-red-500 rounded-md cursor-pointer text-app-secondary transition-all hover:bg-red-600 inline-flex items-center justify-center"
                    >
                      <FiTrash2 size={15} />
                    </button>



                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isEditOpen && selectedUser && (
        <User_Update
          user={selectedUser}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
