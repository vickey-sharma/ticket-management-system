export default function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}