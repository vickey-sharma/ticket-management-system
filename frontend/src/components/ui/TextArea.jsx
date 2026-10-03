
const TextArea = ({
  label,
  name,
  value = "",
  onChange,
  onBlur,
  placeholder = "",
  error,
  required = false,
  disabled = false,
  rows = 5,
  className = "",
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}

          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`
          w-full resize-y rounded-xl border
          bg-white px-3.5 py-3 text-sm text-gray-900
          outline-none transition
          placeholder:text-gray-400
          disabled:cursor-not-allowed
          disabled:bg-gray-50
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
              : "border-gray-200 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
          }
        `}
        {...props}
      />

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};

export default TextArea;
