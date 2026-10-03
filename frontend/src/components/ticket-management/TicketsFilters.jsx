import { Filter, RotateCcw, Search, X } from "lucide-react";
import { useState } from "react";

const TicketsFilters = ({
  filters = {},
  onFilterChange,
  onReset,
}) => {
  const [search, setSearch] = useState(filters.search || "");

  const handleSearchChange = (value) => {
    setSearch(value);
    onFilterChange?.("search", value);
  };

  const handleChange = (key, value) => {
    onFilterChange?.(key, value);
  };

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.priority ||
    filters.assignedTo;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search tickets..."
            className="
              h-11 w-full rounded-xl border border-gray-200
              bg-gray-50 pl-10 pr-10 text-sm text-gray-900
              outline-none transition
              placeholder:text-gray-400
              focus:border-[#0F766E]
              focus:bg-white
              focus:ring-2
              focus:ring-[#0F766E]/10
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-600">
            <Filter size={16} />
            <span className="hidden sm:inline">Filters</span>
          </div>

          {/* Status */}
          <select
            value={filters.status || ""}
            onChange={(e) => handleChange("status", e.target.value)}
            className="
              h-11 rounded-xl border border-gray-200 bg-white
              px-3 text-sm text-gray-700 outline-none transition
              focus:border-[#0F766E]
              focus:ring-2 focus:ring-[#0F766E]/10
            "
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Priority */}
          <select
            value={filters.priority || ""}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="
              h-11 rounded-xl border border-gray-200 bg-white
              px-3 text-sm text-gray-700 outline-none transition
              focus:border-[#0F766E]
              focus:ring-2 focus:ring-[#0F766E]/10
            "
          >
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          {/* Assigned */}
          <select
            value={filters.assignedTo || ""}
            onChange={(e) => handleChange("assignedTo", e.target.value)}
            className="
              h-11 rounded-xl border border-gray-200 bg-white
              px-3 text-sm text-gray-700 outline-none transition
              focus:border-[#0F766E]
              focus:ring-2 focus:ring-[#0F766E]/10
            "
          >
            <option value="">All Assignees</option>

            {filters.assignees?.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullName}
              </option>
            ))}
          </select>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                onReset?.();
              }}
              className="
                flex h-11 items-center gap-2 rounded-xl
                px-3 text-sm font-medium text-gray-500
                transition hover:bg-gray-100 hover:text-gray-900
              "
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketsFilters;
