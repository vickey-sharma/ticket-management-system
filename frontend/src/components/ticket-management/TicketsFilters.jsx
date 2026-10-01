import React from "react";
import SearchBar from "../ui/SearchBar";
import InputField from "../ui/InputField";
import FilterDropdown from "../ui/FilterDropdown";
import SecondaryButton from "../ui/SecondaryButton";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const priorityOptions = [
  { value: "", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const departmentOptions = [
  { value: "", label: "All Departments" },
  { value: "rma", label: "RMA" },
  { value: "technical_support", label: "Technical Support" },
  { value: "general_query", label: "General Query" },
];

const createdByRoleOptions = [
  { value: "", label: "All Created By Roles" },
  { value: "superadmin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "engineer", label: "Engineer" },
  { value: "l1_engineer", label: "L1 Engineer" },
  { value: "client", label: "Client" },
];

const dateFilterOptions = [
  { value: "all", label: "All Dates" },
  { value: "daily", label: "Today" },
  { value: "weekly", label: "This Week" },
  { value: "monthly", label: "This Month" },
  { value: "yearly", label: "This Year" },
  { value: "custom", label: "Custom Range" },
];

export default function TicketsFilters({
  filters,
  onFilterChange,
  onReset,
  createdByOptions = [],
  assignedToOptions = [],
  role
}) {
  const handleChange = (field, value) => {
    onFilterChange(field, value);
  };

  return (
    <div className="space-y-5">

      {/* Global Search */}
      <div>
        <SearchBar
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          placeholder="Search ticket no., issue title or serial number..."
        />
      </div>

      {/* Text Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

      {role !== "client" && (
  <InputField
    label="Company Name"
    value={filters.companyName}
    onChange={(e) =>
      handleChange("companyName", e.target.value)
    }
    placeholder="Enter company name"
  />
)}

        <InputField
          label="Product Name"
          value={filters.productName}
          onChange={(e) =>
            handleChange("productName", e.target.value)
          }
          placeholder="Enter product name"
        />

        <InputField
          label="Model Number"
          value={filters.modelNumber}
          onChange={(e) =>
            handleChange("modelNumber", e.target.value)
          }
          placeholder="Enter model number"
        />

        <InputField
          label="Serial Number"
          value={filters.serialNumber}
          onChange={(e) =>
            handleChange("serialNumber", e.target.value)
          }
          placeholder="Enter serial number"
        />

        <InputField
          label="Bill Number"
          value={filters.billNumber}
          onChange={(e) =>
            handleChange("billNumber", e.target.value)
          }
          placeholder="Enter bill number"
        />

      </div>

      {/* Dropdown Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Ticket Status
          </label>

          <FilterDropdown
            value={filters.ticketStatus}
            onChange={(value) =>
              handleChange("ticketStatus", value)
            }
            options={statusOptions}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Priority
          </label>

          <FilterDropdown
            value={filters.priority}
            onChange={(value) =>
              handleChange("priority", value)
            }
            options={priorityOptions}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Department
          </label>

          <FilterDropdown
            value={filters.department}
            onChange={(value) =>
              handleChange("department", value)
            }
            options={departmentOptions}
            className="w-full"
          />
        </div>

        {/* Date Filter */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Date Filter
          </label>

          <FilterDropdown
            value={filters.dateFilter || "all"}
            onChange={(value) =>
              handleChange("dateFilter", value)
            }
            options={dateFilterOptions}
            className="w-full"
          />
        </div>



      </div>

      {/* User Filters */}
      {role !== "client" && (

        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

<div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Created By Role
          </label>

          <FilterDropdown
            value={filters.createdByRole}
            onChange={(value) =>
              handleChange("createdByRole", value)
            }
            options={createdByRoleOptions}
            className="w-full"
          />

        </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Created By
            </label>

            <FilterDropdown
              value={filters.createdBy}
              onChange={(value) =>
                handleChange("createdBy", value)
              }
              options={[
                { value: "", label: "All Creators" },
                ...createdByOptions,
              ]}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Assigned To
            </label>

            <FilterDropdown
              value={filters.assignedTo}
              onChange={(value) =>
                handleChange("assignedTo", value)
              }
              options={[
                { value: "", label: "All Assignees" },
                ...assignedToOptions,
              ]}
              className="w-full"
            />
          </div>

        </div>
      )}

      {/* Custom Date Range */}
      {filters.dateFilter === "custom" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          <InputField
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              handleChange("startDate", e.target.value)
            }
          />

          <InputField
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              handleChange("endDate", e.target.value)
            }
          />

        </div>
      )}

      {filters.dateFilter === "custom" && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Select a custom date range. Maximum range allowed is 365 days.
        </div>
      )}

      {/* Reset */}
      <div className="flex justify-end">
        <SecondaryButton
          text="Clear Filters"
          onClick={onReset}
          className="w-auto px-5"
        />
      </div>

    </div>
  );
}