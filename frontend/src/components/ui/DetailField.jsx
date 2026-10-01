export default function DetailField({
  label,
  value,
  className = "",
}) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm text-light">
          {label}
        </label>
      )}

      <div
        className={`
          flex h-10.5 w-full items-center
          rounded-lg border border-gray-200
          bg-slate-50 px-4
          text-sm text-slate-900
          ${className}
        `}
      >
        {value || "-"}
      </div>
    </div>
  );
}