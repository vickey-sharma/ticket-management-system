import {
  BarChart3,
  CheckCircle2,
  Circle,
  Clock3,
  XCircle,
} from "lucide-react";

const TicketStatusChart = ({ stats = {} }) => {
  const open = Number(stats.open) || 0;
  const inProgress = Number(stats.inProgress) || 0;
  const resolved = Number(stats.resolved) || 0;
  const closed = Number(stats.closed) || 0;

  const total = open + inProgress + resolved + closed;

  const statusItems = [
    {
      label: "Open",
      value: open,
      icon: Circle,
      iconClass: "text-blue-600",
      barClass: "bg-blue-500",
      bgClass: "bg-blue-50",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock3,
      iconClass: "text-orange-600",
      barClass: "bg-orange-500",
      bgClass: "bg-orange-50",
    },
    {
      label: "Resolved",
      value: resolved,
      icon: CheckCircle2,
      iconClass: "text-green-600",
      barClass: "bg-green-500",
      bgClass: "bg-green-50",
    },
    {
      label: "Closed",
      value: closed,
      icon: XCircle,
      iconClass: "text-gray-600",
      barClass: "bg-gray-500",
      bgClass: "bg-gray-100",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Ticket Status
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Distribution of tickets by status.
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F4F1] text-[#0F766E]">
          <BarChart3 size={19} />
        </div>
      </div>

      <div className="mt-7">
        <p className="text-3xl font-bold tracking-tight text-gray-900">
          {total}
        </p>

        <p className="mt-0.5 text-xs text-gray-400">
          Total tickets
        </p>

        <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-gray-100">
          {total > 0 &&
            statusItems.map((item) => (
              <div
                key={item.label}
                className={item.barClass}
                style={{
                  width: `${(item.value / total) * 100}%`,
                }}
              />
            ))}
        </div>
      </div>

      <div className="mt-7 space-y-4">
        {statusItems.map((item) => {
          const Icon = item.icon;

          const percentage =
            total > 0
              ? Math.round((item.value / total) * 100)
              : 0;

          return (
            <div
              key={item.label}
              className="flex items-center gap-3"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bgClass}`}
              >
                <Icon
                  size={17}
                  className={item.iconClass}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-gray-700">
                    {item.label}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {item.value}
                    </span>

                    <span className="w-9 text-right text-xs text-gray-400">
                      {percentage}%
                    </span>
                  </div>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${item.barClass}`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TicketStatusChart;