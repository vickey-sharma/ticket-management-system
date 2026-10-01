export default function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">
        {label}
      </span>

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-[#56BD05]" : "bg-gray-300"
        } ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}