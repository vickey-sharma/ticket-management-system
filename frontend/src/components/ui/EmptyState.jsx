import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "No data found",
  description = "There is nothing to display right now.",
  icon: Icon = Inbox,
  action = null,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-8 py-14 text-center ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <Icon
          size={32}
          className="text-slate-500"
        />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}