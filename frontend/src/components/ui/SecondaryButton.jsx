const SecondaryButton = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex h-11 items-center justify-center gap-2
        rounded-xl border border-gray-200
        bg-white px-5
        text-sm font-semibold text-gray-700
        shadow-sm transition-all duration-200
        hover:border-gray-300
        hover:bg-gray-50
        hover:text-gray-900
        focus:outline-none
        focus:ring-2
        focus:ring-gray-200
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
