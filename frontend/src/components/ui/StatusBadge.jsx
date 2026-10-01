export default function StatusBadge({
  isUserActive,
  text,
  color,
}) {
  // Backward compatibility
  if (typeof isUserActive === "boolean") {
    text = isUserActive ? "Active" : "Inactive";
    color = isUserActive ? "green" : "red";
  }

  const styles = {
    green: {
      bg: "bg-green-100 text-green-700",
      dot: "bg-green-600",
    },
    red: {
      bg: "bg-red-100 text-red-700",
      dot: "bg-red-600",
    },
    yellow: {
      bg: "bg-yellow-100 text-yellow-700",
      dot: "bg-yellow-600",
    },
      blue: {
    bg: "bg-blue-100 text-blue-700",
    dot: "bg-blue-600",
  },
    gray: {
      bg: "bg-gray-100 text-gray-700",
      dot: "bg-gray-600",
    },
  };

  const currentStyle = styles[color] || styles.gray;

  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-medium ${currentStyle.bg}`}
    >
      <span
        className={`mr-2 h-2 w-2 rounded-full ${currentStyle.dot}`}
      />

      {text}
    </span>
  );
}