const TabButton = ({
  children,
  active = false,
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex-1 px-4 py-3
        text-sm font-semibold
        transition-all duration-200
        focus:outline-none
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${
          active
            ? "text-[#0F766E]"
            : "text-gray-500 hover:text-gray-900"
        }
        ${className}
      `}
    >
      {children}

      {active && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#0F766E]" />
      )}
    </button>
  );
};

export default TabButton;