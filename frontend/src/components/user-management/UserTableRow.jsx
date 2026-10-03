import { MoreHorizontal } from "lucide-react";

const UserTableRow = ({
  user,
  onClick,
  onMenuClick,
}) => {
  const getInitial = () => {
    return user?.fullName?.charAt(0)?.toUpperCase() || "U";
  };

  const getRoleClasses = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "bg-purple-50 text-purple-700";

      case "AGENT":
        return "bg-blue-50 text-blue-700";

      case "CUSTOMER":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <tr
      onClick={() => onClick?.(user)}
      className={`
        border-b border-gray-100
        transition-colors
        last:border-b-0
        ${
          onClick
            ? "cursor-pointer hover:bg-gray-50"
            : "hover:bg-gray-50/50"
        }
      `}
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E5F4F1] text-sm font-bold text-[#0F766E]">
            {getInitial()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user?.fullName || "Unnamed user"}
            </p>

            <p className="truncate text-xs text-gray-400">
              {user?.email || "—"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <span
          className={`
            inline-flex rounded-full px-2.5 py-1
            text-xs font-semibold
            ${getRoleClasses(user?.role)}
          `}
        >
          {user?.role || "—"}
        </span>
      </td>

      <td className="px-5 py-4 text-sm text-gray-600">
        {user?.email || "—"}
      </td>

      <td className="px-5 py-4 text-sm text-gray-500">
        {formatDate(user?.createdAt)}
      </td>

      <td className="px-5 py-4 text-right">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onMenuClick?.(user, event);
          }}
          className="
            inline-flex h-9 w-9 items-center justify-center
            rounded-lg text-gray-400
            transition
            hover:bg-gray-100
            hover:text-gray-700
          "
          aria-label="User actions"
        >
          <MoreHorizontal size={19} />
        </button>
      </td>
    </tr>
  );
};

export default UserTableRow;