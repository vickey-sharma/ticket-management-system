const ToggleSwitch = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  className = "",
}) => {
  return (
    <label
      className={`
        inline-flex items-center gap-3
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        ${className}
      `}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`
          relative h-6 w-11 shrink-0 rounded-full
          transition-colors duration-200
          focus:outline-none
          focus:ring-2
          focus:ring-[#0F766E]/20
          disabled:cursor-not-allowed
          ${
            checked
              ? "bg-[#0F766E]"
              : "bg-gray-300"
          }
        `}
      >
        <span
          className={`
            absolute top-1 h-4 w-4 rounded-full
            bg-white shadow-sm
            transition-transform duration-200
            ${
              checked
                ? "translate-x-6"
                : "translate-x-1"
            }
          `}
        />
      </button>

      {label && (
        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>
      )}
    </label>
  );
};

export default ToggleSwitch;