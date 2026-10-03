
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const InputField = ({
  label,
  name,
  type = "text",
  value = "",
  onChange,
  onBlur,
  placeholder = "",
  error,
  required = false,
  disabled = false,
  autoComplete,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

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

      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            h-11 w-full rounded-xl border
            bg-white px-3.5 text-sm text-gray-900
            outline-none transition
            placeholder:text-gray-400
            disabled:cursor-not-allowed
            disabled:bg-gray-50
            ${
              error
                ? "border-red-300 pr-11 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                : isPassword
                  ? "border-gray-200 pr-11 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                  : "border-gray-200 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
            }
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};

export default InputField;
