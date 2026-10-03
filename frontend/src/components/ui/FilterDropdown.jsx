
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const FilterDropdown = ({
  label,
  value = "",
  options = [],
  onChange,
  placeholder = "Select",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((option) => {
    const optionValue =
      typeof option === "object" ? option.value : option;

    return optionValue === value;
  });

  const selectedLabel = selectedOption
    ? typeof selectedOption === "object"
      ? selectedOption.label
      : selectedOption
    : placeholder;

  const handleSelect = (optionValue) => {
    onChange?.(optionValue);
    setOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative ${className}`}
    >
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-gray-500">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex h-11 w-full items-center justify-between
          rounded-xl border bg-white px-3.5 text-left text-sm
          outline-none transition
          ${
            open
              ? "border-[#0F766E] ring-2 ring-[#0F766E]/10"
              : "border-gray-200 hover:border-gray-300"
          }
        `}
      >
        <span className={value ? "text-gray-700" : "text-gray-400"}>
          {selectedLabel}
        </span>

        <ChevronDown
          size={16}
          className={`
            shrink-0 text-gray-400 transition-transform duration-200
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
          className="
            absolute left-0 right-0 z-50 mt-2
            overflow-hidden rounded-xl border border-gray-200
            bg-white p-1 shadow-lg shadow-gray-200/60
          "
        >
          <button
            type="button"
            onClick={() => handleSelect("")}
            className={`
              flex w-full items-center rounded-lg px-3 py-2.5
              text-left text-sm transition
              ${
                value === ""
                  ? "bg-[#E5F4F1] font-medium text-[#0F766E]"
                  : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            {placeholder}
          </button>

          {options.map((option) => {
            const optionValue =
              typeof option === "object" ? option.value : option;

            const optionLabel =
              typeof option === "object" ? option.label : option;

            const isSelected = optionValue === value;

            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => handleSelect(optionValue)}
                className={`
                  flex w-full items-center rounded-lg px-3 py-2.5
                  text-left text-sm transition
                  ${
                    isSelected
                      ? "bg-[#E5F4F1] font-medium text-[#0F766E]"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                {optionLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
