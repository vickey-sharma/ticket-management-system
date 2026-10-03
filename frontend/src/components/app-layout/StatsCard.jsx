import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = "from last month",
  trendType = "up",
}) => {
  const isPositive = trendType === "up";

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F4F1] text-[#0F766E]">
            <Icon size={21} strokeWidth={2} />
          </div>
        )}
      </div>

      {(trend !== undefined || trendLabel) && (
        <div className="mt-5 flex items-center gap-2">
          {trend !== undefined && (
            <span
              className={`
                inline-flex items-center gap-0.5 rounded-full
                px-2 py-1 text-xs font-semibold
                ${
                  isPositive
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }
              `}
            >
              {isPositive ? (
                <ArrowUpRight size={13} />
              ) : (
                <ArrowDownRight size={13} />
              )}

              {trend}
            </span>
          )}

          <span className="text-xs text-gray-400">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;

