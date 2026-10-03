const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No data found",
  rowKey = "_id",
  onRowClick,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 ${
                    column.headerClassName || ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center"
                >
                  <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#0F766E]" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row[rowKey] || index}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    group transition-colors
                    ${
                      onRowClick
                        ? "cursor-pointer hover:bg-gray-50"
                        : "hover:bg-gray-50/50"
                    }
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-5 py-4 text-sm text-gray-700 ${
                        column.cellClassName || ""
                      }`}
                    >
                      {column.render
                        ? column.render(row, index)
                        : row[column.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-gray-100 md:hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-3 px-5 py-12 text-sm text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#0F766E]" />
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          data.map((row, index) => (
            <div
              key={row[rowKey] || index}
              onClick={() => onRowClick?.(row)}
              className={`
                space-y-3 p-4 transition-colors
                ${
                  onRowClick
                    ? "cursor-pointer hover:bg-gray-50"
                    : "hover:bg-gray-50/50"
                }
              `}
            >
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="flex items-start justify-between gap-4"
                >
                  <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-gray-400">
                    {column.label}
                  </span>

                  <span className="text-right text-sm text-gray-700">
                    {column.render
                      ? column.render(row, index)
                      : row[column.key] ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DataTable;
