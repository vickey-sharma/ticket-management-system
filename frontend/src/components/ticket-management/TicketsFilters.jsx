
import { Filter, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import FilterDropdown from "../ui/FilterDropdown";
import SearchableDropdown from "../ui/SearchableDropdown";

import { getAllAgentUsers } from "../../services/authService";

const TicketsFilters = ({
  filters = {},
  onFilterChange,
  onReset,
  showAssigneeFilter = true,
  assignees = [],
}) => {
  const [search, setSearch] = useState(filters.search || "");

  const [agentSearch, setAgentSearch] = useState("");
  const [agentOptions, setAgentOptions] = useState(assignees);

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

  useEffect(() => {
    if (!showAssigneeFilter) return;

    const timer = setTimeout(async () => {
      try {
        const response = await getAllAgentUsers({
          page: 1,
          limit: 10,
          search: agentSearch.trim(),
        });

        const users =
          response.data?.data?.users || [];

        setAgentOptions(
          users.map((user) => ({
            value: user._id,
            label: user.fullName || user.email,
          }))
        );
      } catch (error) {
        setAgentOptions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [agentSearch, showAssigneeFilter]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              handleSearchChange(event.target.value)
            }
            placeholder="Search tickets..."
            className="
              h-11 w-full rounded-xl
              border border-gray-200
              bg-gray-50
              pl-10 pr-10
              text-sm text-gray-900
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

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-600">
            <Filter size={16} />

            <span className="hidden sm:inline">
              Filters
            </span>
          </div>

          <FilterDropdown
            value={filters.status || ""}
            options={[
              { value: "OPEN", label: "Open" },
              {
                value: "IN_PROGRESS",
                label: "In Progress",
              },
              {
                value: "RESOLVED",
                label: "Resolved",
              },
              {
                value: "CLOSED",
                label: "Closed",
              },
            ]}
            onChange={(value) =>
              handleChange("status", value)
            }
            placeholder="All Status"
          />

          <FilterDropdown
            value={filters.priority || ""}
            options={[
              { value: "LOW", label: "Low" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HIGH", label: "High" },
              {
                value: "CRITICAL",
                label: "Critical",
              },
            ]}
            onChange={(value) =>
              handleChange("priority", value)
            }
            placeholder="All Priority"
          />

          {showAssigneeFilter && (
            <SearchableDropdown
              value={filters.assignedTo || ""}
              options={agentOptions}
              onChange={(value) =>
                handleChange("assignedTo", value)
              }
              onSearch={setAgentSearch}
              placeholder="All Assignees"
            />
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                onReset?.();
              }}
              className="flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <RotateCcw size={16} />

              <span className="hidden sm:inline">
                Reset
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketsFilters;
