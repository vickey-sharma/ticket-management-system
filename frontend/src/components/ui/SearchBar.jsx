
import { Search, X } from "lucide-react";

const SearchBar = ({
  value = "",
  onChange,
  placeholder = "Search...",
  className = "",
  disabled = false,
}) => {
  const handleClear = () => {
    onChange?.("");
  };

  return (
    <div className={`relative w-full ${className}`}>
      <Search
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="
          h-11 w-full rounded-xl
          border border-gray-200
          bg-white
          pl-10 pr-10
          text-sm text-gray-900
          outline-none
          transition
          placeholder:text-gray-400
          hover:border-gray-300
          focus:border-[#0F766E]
          focus:ring-2
          focus:ring-[#0F766E]/10
          disabled:cursor-not-allowed
          disabled:bg-gray-50
          disabled:opacity-60
        "
      />

      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="
            absolute right-3 top-1/2
            flex -translate-y-1/2
            items-center justify-center
            rounded-md p-1
            text-gray-400
            transition
            hover:bg-gray-100
            hover:text-gray-700
          "
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
