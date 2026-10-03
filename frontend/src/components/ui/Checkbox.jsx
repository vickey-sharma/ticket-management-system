const Checkbox = ({
  label,
  name,
  checked = false,
  onChange,
  disabled = false,
  error,
  className = "",
}) => {
  return (
    <div className={className}>
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="
            mt-0.5 h-4 w-4 shrink-0
            cursor-pointer appearance-none
            rounded border border-gray-300
            bg-white
            transition
            checked:border-[#0F766E]
            checked:bg-[#0F766E]
            focus:outline-none
            focus:ring-2
            focus:ring-[#0F766E]/20
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        />

        {label && (
          <span className="text-sm leading-5 text-gray-600">
            {label}
          </span>
        )}
      </label>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Checkbox;