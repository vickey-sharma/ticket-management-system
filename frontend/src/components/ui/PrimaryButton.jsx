
import { Loader2 } from "lucide-react";

const PrimaryButton = ({
  children,
  type = "button",
  onClick,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex h-11 items-center justify-center gap-2
        rounded-xl bg-[#073B3A] px-5
        text-sm font-semibold text-white
        shadow-sm transition-all duration-200
        hover:bg-[#0A4D4A]
        hover:shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-[#0F766E]/30
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader2
          size={17}
          className="animate-spin"
        />
      )}

      {children}
    </button>
  );
};

export default PrimaryButton;
