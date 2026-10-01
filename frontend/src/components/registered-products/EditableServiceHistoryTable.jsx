
import EmptyState from "../ui/EmptyState";
import EditableServiceHistoryRow from "./EditableServiceHistoryRow";

export default function EditableServiceHistoryTable({
  serviceHistory = [],
  setServiceHistory,
  vendors = [],
}) {
  if (!serviceHistory.length) {
    return (
      <div>
        <h2 className="mb-5 text-lg font-semibold text-slate-800">
          Service History
        </h2>

        <EmptyState
          title="No Service History"
          description="This product has not been repaired or replaced yet."
        />
      </div>
    );
  }

const handleChange = (index, field, value) => {
  setServiceHistory((prev) =>
    prev.map((history, i) => {
      if (i !== index) {
        return history;
      }

      if (field === "performedBy") {
        const selectedVendor = vendors.find(
          (vendor) => vendor._id === value
        );

        return {
          ...history,
          performedBy: selectedVendor || null,
        };
      }

      return {
        ...history,
        [field]: value,
      };
    })
  );
};

  return (
    <div>
      <h2 className="mb-5 text-lg font-semibold text-slate-800">
        Service History
      </h2>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-max">
          <thead className="whitespace-nowrap bg-slate-50">
            <tr>
              <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Type
              </th>

              <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
                From Serial
              </th>

              <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
                To Serial
              </th>

              <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Vendor
              </th>

              <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Created By
              </th>

              <th className="whitespace-nowrap border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Service Date
              </th>

              <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Remark
              </th>

              <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="whitespace-nowrap">
            {serviceHistory.map((history, index) => (
              <EditableServiceHistoryRow
                key={history._id}
                history={history}
                index={index}
                vendors={vendors}
                onChange={handleChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

