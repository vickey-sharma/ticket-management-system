const statusStyles = {
  OPEN: "bg-blue-50 text-blue-700 ring-blue-600/10",
  IN_PROGRESS: "bg-amber-50 text-amber-700 ring-amber-600/10",
  RESOLVED: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  CLOSED: "bg-gray-100 text-gray-600 ring-gray-500/10",
};

const statusLabels = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export default function StatusBadge({ status }) {
  const normalizedStatus = status?.trim().toUpperCase();

  const className =
    statusStyles[normalizedStatus] ||
    "bg-gray-100 text-gray-600 ring-gray-500/10";

  const label =
    statusLabels[normalizedStatus] ||
    status?.replaceAll("_", " ") ||
    "Unknown";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {label}
    </span>
  );
}