export default function DataTable({
  columns,
  children,
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">

      <table className="min-w-full">

        <thead className="bg-slate-50 border-b border-slate-100">

          <tr>

            {columns.map((column) => (
              <th
                key={column}
                className="px-6 py-4 text-left text-sm font-semibold text-slate-700 whitespace-nowrap"
              >
                {column}
              </th>
            ))}

          </tr>

        </thead>

        <tbody className="divide-y divide-slate-200 bg-white">
          {children}
        </tbody>

      </table>

    </div>
  );
}