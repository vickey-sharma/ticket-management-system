export default function LoadingState({
  variant = "table",
  rows = 5,
  columns = 6,
  className = "",
}) {
  const Skeleton = ({ className = "" }) => (
    <div
      className={`animate-pulse rounded-md bg-slate-200 ${className}`}
    />
  );

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`rounded-xl border border-slate-200 bg-white p-6 ${className}`}
      >
        <Skeleton className="h-6 w-40" />

        <Skeleton className="mt-6 h-4 w-full" />
        <Skeleton className="mt-3 h-4 w-5/6" />
        <Skeleton className="mt-3 h-4 w-3/4" />

        <div className="mt-8 flex gap-3">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div className={className}>
        <Skeleton className="h-8 w-72" />

        <Skeleton className="mt-3 h-4 w-96" />

        <div className="mt-8 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-16 w-full"
            />
          ))}
        </div>
      </div>
    );
  }

  // Default Variant -> Table
  return (
    <div
      className={`overflow-hidden rounded-xl border border-slate-200 ${className}`}
    >
      {/* Table Header */}
      <div className="grid grid-flow-col gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-5 w-24"
          />
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="grid grid-flow-col gap-4 border-b border-slate-100 px-6 py-5 last:border-none"
        >
          {Array.from({ length: columns }).map((_, column) => (
            <Skeleton
              key={column}
              className="h-4 w-24"
            />
          ))}
        </div>
      ))}
    </div>
  );
}