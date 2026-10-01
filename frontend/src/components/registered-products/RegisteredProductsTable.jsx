import { Eye, Pencil, RefreshCw } from "lucide-react";

import DataTable from "../table/DataTable";
import StatusBadge from "../ui/StatusBadge";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";

export default function RegisteredProductsTable({
  products = [],
  loading = false,
  onView,
  onEdit,
  onReplace,
}) {
  const columns = [
    "Bill No.",
    "Bill Date",
     "Bill Company Name",
    "End Company Name",
    "Product",
    "Model",
    "Serial Number",
    "Warranty End",
    "Status",
    "Actions",
  ];

  if (loading) {
    return (
      <LoadingState
        variant="table"
        rows={8}
        columns={columns.length}
      />
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        title="No registered products found"
        description="Try changing your search or filters."
      />
    );
  }

  return (
    <DataTable columns={columns}>
      {products.map((product, index) => (
        <tr
          key={product._id}
    className={`
    border-b border-slate-100
    transition-colors
    hover:bg-slate-100
    ${index % 2 === 0 ? "bg-white" : "bg-slate-100/80"}
  `}
        >
          <td className="whitespace-nowrap px-6 py-4 text-">
            {product.billNumber}
          </td>

           <td className="whitespace-nowrap px-6 py-4 text-">
            {new Date(product.billDate).toLocaleDateString()}
          </td>

          <td className="whitespace-nowrap px-6 py-4 text-">
            {product.billCompanyName}
          </td>

          <td className="whitespace-nowrap px-6 py-4 text-">
            {product.endCompanyName}
          </td>

          <td className="whitespace-nowrap px-6 py-4 text-">
            {product.productName}
          </td>

          <td className="whitespace-nowrap px-6 py-4 text-">
            {product.modelNumber}
          </td>

          <td className="whitespace-nowrap px-6 py-4 text- font-medium">
            {product.serialNumber}
          </td>

          <td className="whitespace-nowrap px-6 py-4 text-">
            {new Date(product.warrantyEndDate).toLocaleDateString()}
          </td>

          <td className="whitespace-nowrap px-6 py-4">
       <StatusBadge
  text={
    product.productStatus === "new"
      ? "New"
      : product.productStatus === "repaired"
      ? "Repaired"
      : "Replaced"
  }
  color={
    product.productStatus === "new"
      ? "green"
      : product.productStatus === "repaired"
      ? "blue"
      : "yellow"
  }
/>
          </td>

          <td className="whitespace-nowrap px-6 py-4">
       <div className="flex items-center gap-2">

              <button
                onClick={() => onView(product)}
                className="rounded-lg p-2 hover:bg-slate-100 transition"
                title="View"
              >
                <Eye size={18} />
              </button>

              <button
                onClick={() => onEdit(product)}
                className="rounded-lg p-2 hover:bg-slate-100 transition"
                title="Edit"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => onReplace(product)}
                className="rounded-lg p-2 hover:bg-slate-100 transition"
                title="Replace Product"
              >
                <RefreshCw size={18} />
              </button>

            </div>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}