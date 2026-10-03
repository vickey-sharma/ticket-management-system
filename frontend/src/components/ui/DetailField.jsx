const DetailField = ({
  label,
  value,
  icon: Icon,
  className = "",
}) => {
  return (
    <div className={`rounded-xl border border-gray-100 bg-gray-50/70 p-4 ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#0F766E] shadow-sm">
            <Icon size={15} />
          </div>
        )}

        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
      </div>

      <p className="mt-2 break-words text-sm font-medium leading-6 text-gray-900">
        {value ?? "—"}
      </p>
    </div>
  );
};

export default DetailField;