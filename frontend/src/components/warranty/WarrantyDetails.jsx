import DetailField from "../ui/DetailField";
import StatusBadge from "../ui/StatusBadge";
import { getWarrantyStatus } from "../utilities/warrantyUtils";

export default function WarrantyDetails({ product }) {
  if (!product) return null;

  const warrantyStatus = getWarrantyStatus(
    product.warrantyEndDate
  );

  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-slate-800">
        Warranty Details
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <DetailField
          label="Product Name"
          value={product.productName}
        />

        <DetailField
          label="Model Number"
          value={product.modelNumber}
        />

        <DetailField
          label="Current Serial Number"
          value={product.serialNumber}
        />

        <DetailField
          label="Warranty End Date"
          value={new Date(
            product.warrantyEndDate
          ).toLocaleDateString()}
        />

        <div>
          <p className="mb-2 text-sm font-medium text-slate-500">
            Product Status
          </p>

          <div className="flex min-h-[42px] items-center rounded-lg border border-slate-200 bg-slate-50 px-4">
            <StatusBadge
              text={
                product.productStatus === "new"
                  ? "New"
                  : "Replaced"
              }
              color={
                product.productStatus === "new"
                  ? "green"
                  : "yellow"
              }
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-500">
            Warranty Status
          </p>

          <div className="flex min-h-[42px] items-center rounded-lg border border-slate-200 bg-slate-50 px-4">
            <StatusBadge
              text={
                warrantyStatus === "active"
                  ? "Under Warranty"
                  : "Expired"
              }
              color={
                warrantyStatus === "active"
                  ? "green"
                  : "red"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}