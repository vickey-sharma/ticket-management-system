
import { ChevronDown } from "lucide-react";

const FilterDropdown = ({
  label,
  value = "",
  options = [],
  onChange,
  placeholder = "Select",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-gray-500">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className="
            h-11 w-full appearance-none rounded-xl
            border border-gray-200 bg-white
            px-3.5 pr-10 text-sm text-gray-700
            outline-none transition
            hover:border-gray-300
            focus:border-[#0F766E]
            focus:ring-2 focus:ring-[#0F766E]/10
          "
        >
          <option value="">{placeholder}</option>

          {options.map((option) => {
            const optionValue =
              typeof option === "object" ? option.value : option;

            const optionLabel =
              typeof option === "object" ? option.label : option;

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
};

export default FilterDropdown;