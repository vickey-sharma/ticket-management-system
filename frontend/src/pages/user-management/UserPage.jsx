import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Users } from "lucide-react";
import FilterDropdown from "../../components/ui/FilterDropdown";

import {
  getUsersBySearch,
} from "../../services/authService";

import CreateUserModal from "../../components/user-management/CreateUserModal";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = {
        page: 1,
        limit: 20,
      };

      if (role) {
        params.role = role;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await getUsersBySearch(params);

      setUsers(response.data?.data?.users || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, role]);

  const handleUserCreated = () => {
    setCreateModalOpen(false);
    fetchUsers();
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F4F1] text-[#0F766E]">
                <Users size={20} />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-[#073B3A]">
                  Users
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage users and support team accounts.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#073B3A]
              px-5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#0A4D4A]
              focus:outline-none
              focus:ring-2
              focus:ring-[#0F766E]/30
            "
          >
            <Plus size={17} />
            Create User
          </button>
        </section>

        {/* Filters */}
        <section
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-4
            shadow-sm
          "
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, role or ID..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  pl-10
                  pr-4
                  text-sm
                  text-gray-800
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#0F766E]/40
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#0F766E]/10
                "
              />
            </div>

            {/* Role filter */}
            <FilterDropdown
              value={role}
              onChange={setRole}
              placeholder="All Roles"
              options={[
                { value: "admin", label: "Admin" },
                { value: "agent", label: "Agent" },
                { value: "customer", label: "Customer" },
              ]}
              className="sm:w-44"
            />
          </div>
        </section>

        {/* Users table */}
        <section
          className="
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Role
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-12 text-center text-sm text-gray-400"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                          <Users size={21} />
                        </div>

                        <p className="mt-3 text-sm font-medium text-gray-700">
                          No users found
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Try changing your search or filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-gray-50/70"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E5F4F1] text-sm font-semibold text-[#0F766E]">
                            {user.fullName
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {user.fullName}
                            </p>

                            <p className="text-xs text-gray-400">
                              User account
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {user.email}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={handleUserCreated}
      />
    </>
  );
}

function RoleBadge({ role }) {
  const normalizedRole = role?.trim().toLowerCase();

  const styles = {
    admin: "bg-violet-50 text-violet-700 border-violet-100",
    agent: "bg-blue-50 text-blue-700 border-blue-100",
    customer: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };

  return (
    <span
      className={`
        inline-flex
        rounded-full
        border
        px-2.5
        py-1
        text-xs
        font-medium
        capitalize
        ${styles[normalizedRole] || "bg-gray-50 text-gray-600 border-gray-100"}
      `}
    >
      {normalizedRole || "unknown"}
    </span>
  );
}