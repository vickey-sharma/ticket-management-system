export default function SecondaryButton({
  text,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-slate-200 text-slate-700 py-2 rounded-lg mt-0 disabled:opacity-50 transition-all duration-300 hover:bg-slate-300 hover:-translate-y-[2px] ${className}`}
    >
      {text}
    </button>
  );
}