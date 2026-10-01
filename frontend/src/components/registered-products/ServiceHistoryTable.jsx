
// import EmptyState from "../ui/EmptyState";

// export default function ServiceHistoryTable({
//   serviceHistory = [],
// }) {
//   if (!serviceHistory.length) {
//     return null;
//   }

//   return (
//     <div className="mt-8">
//       <h3 className="mb-4 text-lg font-semibold text-slate-800">
//         Service History
//       </h3>

//       <div className="overflow-x-auto rounded-xl border border-slate-200">
//         <table className="min-w-full">
//           <thead className="bg-slate-50">
//             <tr>
//               <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
//                 Type
//               </th>

//               <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
//                 From Serial Number
//               </th>

//               <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
//                 To Serial Number
//               </th>

//               <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
//                 Vendor
//               </th>

//               <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
//                 Service Date
//               </th>

//               <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
//                 Remark
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {serviceHistory.map((history, index) => (
//               <tr
//                 key={history._id}
//                 className={`
//                   border-b border-slate-100
//                   transition-colors
//                   hover:bg-slate-50
//                   ${
//                     index % 2 === 0
//                       ? "bg-white"
//                       : "bg-slate-50/50"
//                   }
//                 `}
//               >
//                 <td className="px-5 py-4 font-medium capitalize text-slate-800">
//                   {history.type}
//                 </td>

//                 <td className="px-5 py-4 text-slate-600">
//                   {history.fromSerialNumber || "-"}
//                 </td>

//                 <td className="px-5 py-4 text-slate-600">
//                   {history.toSerialNumber || "-"}
//                 </td>

//                 <td className="px-5 py-4 text-slate-600">
//                   {history.performedBy?.fullName || "-"}
//                 </td>

//                 <td className="px-5 py-4 text-slate-600">
//                   {new Date(
//                     history.performedAt
//                   ).toLocaleDateString()}
//                 </td>

//                 <td className="max-w-sm px-5 py-4 text-slate-600">
//                   {history.remark || "-"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import StatusBadge from "../ui/StatusBadge";
import EmptyState from "../ui/EmptyState";

export default function ServiceHistoryTable({
  serviceHistory = [],
}) {
  if (!serviceHistory.length) {
    return (
      <div className="mt-10 border-t border-slate-200 pt-8">
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

  console.log(serviceHistory);

  return (
    <div className="mt-10 border-t border-slate-200 pt-8">
      <h2 className="mb-5 text-lg font-semibold text-slate-800">
        Service History
      </h2>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full">
          <thead className="bg-slate-50 whitespace-nowrap">
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

              <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold whitespace-nowrap text-slate-600">
                Service Date
              </th>

              <th className="border-b border-slate-200 px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Remark
              </th>
            </tr>
          </thead>

          <tbody className="whitespace-nowrap">
            {serviceHistory.map((history, index) => (
              <tr
                key={history._id}
                className={`
                  border-b border-slate-100
                  transition-colors
                  hover:bg-slate-100
                  ${
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-slate-50"
                  }
                `}
              >
                <td className="px-5 py-4">
                  <StatusBadge
                    text={
                      history.type === "repaired"
                        ? "Repaired"
                        : "Replaced"
                    }
                    color={
                      history.type === "repaired"
                        ? "blue"
                        : "yellow"
                    }
                  />
                </td>

                <td className="px-5 py-4 font-medium text-slate-700">
                  {history.fromSerialNumber || "-"}
                </td>

                <td className="px-5 py-4 font-medium text-slate-700">
                  {history.toSerialNumber || "-"}
                </td>

                {/* <td className="px-5 py-4">
                  {history.performedBy ? (
                    <>
                      <div className="font-medium text-slate-800">
                        {history.performedBy.fullName}
                      </div>

                      <div className="text-xs text-slate-500">
                        {history.performedBy.email}
                      </div>
                    </>
                  ) : (
                    "-"
                  )}
                </td> */}

                {/* <td className="px-5 py-4">
                  {history.createdBy ? (
                    <>
                      <div className="font-medium text-slate-800">
                        {history.createdBy.fullName}
                      </div>

                      <div className="text-xs text-slate-500">
                        {history.createdBy.email}
                      </div>
                    </>
                  ) : (
                    "-"
                  )}
                </td> */}

                {/* Vendor */}
<td className="px-5 py-4">
  {history.performedBy?.fullName ? (
    <>
      <div className="font-medium text-slate-800">
        {history.performedBy.fullName}
      </div>

      <div className="text-xs text-slate-500">
        {history.performedBy.email || "-"}
      </div>
    </>
  ) : (
    "-"
  )}
</td>

{/* Created By */}
<td className="px-5 py-4">
  {history.createdBy?.fullName ? (
    <>
      <div className="font-medium text-slate-800">
        {history.createdBy.fullName}
      </div>

      <div className="text-xs text-slate-500">
        {history.createdBy.email || "-"}
      </div>
    </>
  ) : (
    "-"
  )}
</td>


                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {new Date(history.performedAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </td>

                <td className="max-w-sm px-5 py-4 text-slate-600">
                  {history.remark || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}