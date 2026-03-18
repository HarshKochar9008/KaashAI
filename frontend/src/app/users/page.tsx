"use client";
import React, { useEffect, useState } from "react";
import { useUserStore, User } from "@/store";

const roleBadge: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  teacher: "bg-blue-100 text-blue-700",
  student: "bg-emerald-100 text-emerald-700",
};

const statusDot: Record<string, string> = {
  active: "bg-green-500",
  inactive: "bg-slate-300",
};

function AddUserModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { createUser, error, clearError } = useUserStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "student" as "student" | "teacher" | "admin",
    department: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    clearError();
    const user = await createUser({
      ...form,
      department: form.department || undefined,
      phone: form.phone || undefined,
    } as any);
    setSubmitting(false);
    if (user) {
      setForm({ name: "", email: "", role: "student", department: "", phone: "" });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Add New User</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">
              {error}
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              Full Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              Email
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="john@university.edu"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as any })
                }
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition bg-white"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Department
              </label>
              <input
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                placeholder="Computer Science"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              Phone
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="+91 98765 43210"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 text-white rounded-full py-3 font-medium hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
}

function UserDetailPanel({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const { updateUser, deleteUser } = useUserStore();
  const [confirming, setConfirming] = useState(false);

  const handleToggleStatus = async () => {
    await updateUser(user._id, {
      status: user.status === "active" ? "inactive" : "active",
    });
  };

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    await deleteUser(user._id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">User Details</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">{user.name}</h4>
              <p className="text-slate-500 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Role</p>
              <span
                className={`text-sm font-semibold px-2.5 py-1 rounded-full ${roleBadge[user.role]}`}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${statusDot[user.status]}`}
                />
                <span className="text-sm font-semibold text-slate-700 capitalize">
                  {user.status}
                </span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Department</p>
              <p className="text-sm font-semibold text-slate-700">
                {user.department || "Not set"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Phone</p>
              <p className="text-sm font-semibold text-slate-700">
                {user.phone || "Not set"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Joined</p>
              <p className="text-sm font-semibold text-slate-700">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Last Active</p>
              <p className="text-sm font-semibold text-slate-700">
                {new Date(user.lastActive).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleToggleStatus}
              className="flex-1 border border-slate-200 text-slate-700 rounded-full py-2.5 text-sm font-medium hover:bg-slate-50 transition"
            >
              {user.status === "active" ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={handleDelete}
              className={`flex-1 rounded-full py-2.5 text-sm font-medium transition ${
                confirming
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "border border-red-200 text-red-600 hover:bg-red-50"
              }`}
            >
              {confirming ? "Confirm Delete?" : "Delete User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { users, stats, loading, fetchUsers, fetchStats } = useUserStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading && users.length === 0) {
    return (
      <div className="text-slate-500 animate-pulse">Loading users...</div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex gap-2 items-center text-slate-700">
        <span className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        <h2 className="text-xl font-bold leading-none">Users</h2>
      </div>
      <p className="text-slate-500 text-sm mb-6 pb-4 border-b border-slate-200">
        Manage users, view details, and track activity.
      </p>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-slate-900">
              {stats.totalUsers}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.activeUsers}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Teachers</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.teachers}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Students</p>
            <p className="text-2xl font-bold text-emerald-600">
              {stats.students}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-8 flex-wrap">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M3%205l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Admins</option>
        </select>

        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
          <span className="absolute left-4 top-2.5 text-slate-400 text-sm">
            &#128269;
          </span>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 text-white rounded-full px-6 py-2 text-sm font-medium hover:bg-slate-800 transition shadow-lg"
        >
          + Add User
        </button>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20">
          <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">&#128100;</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {users.length === 0 ? "No users yet" : "No matching users"}
          </h3>
          <p className="text-slate-500 text-center max-w-sm mb-6">
            {users.length === 0
              ? "Add your first user to get started with managing your organization."
              : "Try adjusting your search or filter criteria."}
          </p>
          {users.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-slate-900 text-white font-medium rounded-full py-3 px-6 hover:bg-slate-800 transition"
            >
              + Add First User
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Department
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Joined
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleBadge[user.role]}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 hidden md:table-cell">
                    {user.department || "—"}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${statusDot[user.status]}`}
                      />
                      <span className="text-sm text-slate-600 capitalize">
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 hidden lg:table-cell">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-slate-400 hover:text-slate-700 transition">
                      &#8250;
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddUserModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      {selectedUser && (
        <UserDetailPanel
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
