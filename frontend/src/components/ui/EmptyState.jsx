import { Inbox } from "lucide-react";

const EmptyState = ({
  title = "Nothing here yet",
  description = "There is no data to display.",
  icon: Icon = Inbox,
  action,
  className = "",
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        rounded-2xl border border-gray-200
        bg-white px-6 py-14 text-center
        shadow-sm
        ${className}
      `}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E5F4F1] text-[#0F766E]">
        <Icon size={23} strokeWidth={2} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 max-w-md text-sm leading-6 text-gray-500">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;