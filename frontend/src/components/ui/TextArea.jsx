export default function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  readOnly = false,
}) {
  return (
    <div className="mb-2">
      {label && (
        <label className="block text-sm mb-1 text-light">
          {label}
        </label>
      )}

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        readOnly={readOnly}
        className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 outline-none focus:ring-[1px] focus:ring-green-500"
      />
    </div>
  );
}