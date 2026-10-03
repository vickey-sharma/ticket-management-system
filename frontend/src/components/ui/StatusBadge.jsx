const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toUpperCase();

  const statusConfig = {
    OPEN: {
      label: "Open",
      className: "bg-blue-50 text-blue-700",
      dotClassName: "bg-blue-500",
    },
    IN_PROGRESS: {
      label: "In Progress",
      className: "bg-orange-50 text-orange-700",
      dotClassName: "bg-orange-500",
    },
    RESOLVED: {
      label: "Resolved",
      className: "bg-green-50 text-green-700",
      dotClassName: "bg-green-500",
    },
    CLOSED: {
      label: "Closed",
      className: "bg-gray-100 text-gray-600",
      dotClassName: "bg-gray-500",
    },
  };

  const config = statusConfig[normalizedStatus] || {
    label: status || "Unknown",
    className: "bg-gray-100 text-gray-600",
    dotClassName: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dotClassName}`}
      />

      {config.label}
    </span>
  );
};

export default StatusBadge;
