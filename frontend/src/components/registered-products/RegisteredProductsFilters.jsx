import SearchBar from "../ui/SearchBar";
import InputField from "../ui/InputField";
import SecondaryButton from "../ui/SecondaryButton";
import FilterDropdown from "../ui/FilterDropdown";

export default function RegisteredProductsFilters({
  filters,
  onFilterChange,
  onReset,
})

{
  

return (
    <div className="space-y-5">

      {/* ================================================== */}
      {/* GLOBAL SEARCH */}
      {/* ================================================== */}

      <SearchBar
        value={filters.search}
        onChange={(e) =>
          onFilterChange("search", e.target.value)
        }
        placeholder="Search bill no., serial no., company, product or model..."
      />


      {/* ================================================== */}
      {/* ALL FILTERS */}
      {/* ================================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

        {/* ================================================== */}
        {/* BILL COMPANY NAME */}
        {/* ================================================== */}

        <InputField
          label="Bill Company Name"
          name="billCompanyName"
          value={filters.billCompanyName}
          placeholder="Filter by Bill company name"
          onChange={(e) =>
            onFilterChange(
              "billCompanyName",
              e.target.value
            )
          }
        />


        {/* ================================================== */}
        {/* END COMPANY NAME */}
        {/* ================================================== */}

        <InputField
          label="End Company Name"
          name="endCompanyName"
          value={filters.endCompanyName}
          placeholder="Filter by End company name"
          onChange={(e) =>
            onFilterChange(
              "endCompanyName",
              e.target.value
            )
          }
        />


        {/* ================================================== */}
        {/* PRODUCT NAME */}
        {/* ================================================== */}

        <InputField
          label="Product Name"
          name="productName"
          value={filters.productName}
          placeholder="Filter by product"
          onChange={(e) =>
            onFilterChange(
              "productName",
              e.target.value
            )
          }
        />


        {/* ================================================== */}
        {/* MODEL NUMBER */}
        {/* ================================================== */}

        <InputField
          label="Model Number"
          name="modelNumber"
          value={filters.modelNumber}
          placeholder="Filter by model"
          onChange={(e) =>
            onFilterChange(
              "modelNumber",
              e.target.value
            )
          }
        />


        {/* ================================================== */}
        {/* SERIAL NUMBER */}
        {/* ================================================== */}

        <InputField
          label="Serial Number"
          name="serialNumber"
          value={filters.serialNumber}
          placeholder="Filter by serial"
          onChange={(e) =>
            onFilterChange(
              "serialNumber",
              e.target.value
            )
          }
        />


        {/* ================================================== */}
        {/* BILL NUMBER */}
        {/* ================================================== */}

        <InputField
          label="Bill Number"
          name="billNumber"
          value={filters.billNumber}
          placeholder="Filter by Bill Number"
          onChange={(e) =>
            onFilterChange(
              "billNumber",
              e.target.value
            )
          }
        />


        {/* ================================================== */}
        {/* PRODUCT STATUS */}
        {/* ================================================== */}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Product Status
          </label>

          <FilterDropdown
            value={filters.productStatus}
            onChange={(value) =>
              onFilterChange(
                "productStatus",
                value
              )
            }
            options={[
              {
                value: "all",
                label: "All Statuses",
              },
              {
                value: "new",
                label: "New",
              },
              {
                value: "repaired",
                label: "Repaired",
              },
              {
                value: "replaced",
                label: "Replaced",
              },
            ]}
            className="w-55"
          />
        </div>


        {/* ================================================== */}
        {/* DATE FILTER */}
        {/* ================================================== */}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 text-nowrap">
            Date Filter
          </label>

          <FilterDropdown
            value={filters.dateFilter}
            onChange={(value) =>
              onFilterChange(
                "dateFilter",
                value
              )
            }
            options={[
              {
                value: "all",
                label: "All Time",
              },
              {
                value: "daily",
                label: "Daily",
              },
              {
                value: "weekly",
                label: "Weekly",
              },
              {
                value: "monthly",
                label: "Monthly",
              },
              {
                value: "yearly",
                label: "Yearly",
              },
              {
                value: "custom",
                label: "Customized",
              },
            ]}
            className="w-55"
          />
        </div>


        {/* ================================================== */}
        {/* CUSTOM START DATE */}
        {/* ================================================== */}

        {filters.dateFilter === "custom" && (
          <InputField
            label="Start Date"
            type="date"
            name="startDate"
            value={filters.startDate}
            placeholder="DD-MM-YYYY"
            className="w-full"
            onChange={(e) =>
              onFilterChange(
                "startDate",
                e.target.value
              )
            }
          />
        )}


        {/* ================================================== */}
        {/* CUSTOM END DATE */}
        {/* ================================================== */}

        {filters.dateFilter === "custom" && (
          <InputField
            label="End Date"
            type="date"
            name="endDate"
            value={filters.endDate}
            placeholder="DD-MM-YYYY"
            className="w-39"
            onChange={(e) =>
              onFilterChange(
                "endDate",
                e.target.value
              )
            }
          />
        )}

      </div>


      {/* ================================================== */}
      {/* CUSTOM DATE INFORMATION */}
      {/* ================================================== */}

      {filters.dateFilter === "custom" && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-xs text-blue-700">
            Custom date range must be entered in
            <span className="font-semibold">
              {" "}DD-MM-YYYY{" "}
            </span>
            format and cannot exceed 365 days.
          </p>
        </div>
      )}


      {/* ================================================== */}
      {/* CLEAR FILTERS */}
      {/* ================================================== */}

      <div className="flex justify-end border-t border-slate-100 pt-5">

        <SecondaryButton
          text="Clear Filters"
          onClick={onReset}
          className="w-40 mt-0"
        />

      </div>

    </div>
  );
}