import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../../../components/page-layout/PageHeader";
import PageCard from "../../../components/auth/PageCard";
import StatusBadge from "../../../components/ui/StatusBadge";
import LoadingState from "../../../components/ui/LoadingState";
import EmptyState from "../../../components/ui/EmptyState";
import SecondaryButton from "../../../components/ui/SecondaryButton";
import DetailField from "../../../components/ui/DetailField";
import ServiceHistoryTable from "../../../components/registered-products/ServiceHistoryTable";

import { getRegisteredProductBySerialNumber } from "../../../services/registeredProductService";



export default function RegisteredProductDetailsPage() {
  const navigate = useNavigate();
  const { serialNumber } = useParams();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response =
          await getRegisteredProductBySerialNumber(serialNumber);
console.log(response.data.data)
        setProduct(response.data.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to fetch registered product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [serialNumber]);

  if (loading) {
    return <LoadingState variant="page" />;
  }

  if (!product) {
    return (
      <EmptyState
        title="Registered product not found"
        description="The requested product could not be found."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Registered Product Details"
        description="View complete information about the registered product." />

      <PageCard className="mt-6">
              {/* ---------------- General Information ---------------- */}

        <h2 className="mb-5 text-lg font-semibold text-slate-800">
          General Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <DetailField
            label="Bill Number"
            value={product.billNumber}
          />

          <DetailField
            label="Bill Date"
            value={new Date(product.billDate).toLocaleDateString()}
          />

          <DetailField
            label="Bill Company Name"
            value={product.billCompanyName}
          />

          <DetailField
            label="End Company Name"
            value={product.endCompanyName}
          />

          <DetailField
            label="Product Name"
            value={product.productName}
          />

          <DetailField
            label="Model Number"
            value={product.modelNumber}
          />

          <DetailField
            label="Serial Number"
            value={product.serialNumber}
          />

          <DetailField
            label="Warranty End Date"
            value={new Date(product.warrantyEndDate).toLocaleDateString()}
          />

        </div>

        {/* ---------------- System Information ---------------- */}

        <div className="mt-10 border-t border-slate-200 pt-8">

          <h2 className="mb-5 text-lg font-semibold text-slate-800">
            System Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <DetailField
              label="Created By"
              value={product.createdBy?.fullName}
            />

            <DetailField
              label="Created On"
              value={new Date(product.createdAt).toLocaleString()}
            />

            <DetailField
              label="Last Updated On"
              value={new Date(product.updatedAt).toLocaleString()}
            />

            <div className="bg-slate-50">
              <p className="mb-1 text-sm font-medium text-slate-500">
                Product Status
              </p>

              <div className="flex min-h-[42px] items-center rounded-xl border border-slate-200 bg-slate-50 px-4">

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

              </div>
            </div>

          </div>

        </div>

        {/* ---------------- Replacement History ---------------- */}

{/* ---------------- Service History ---------------- */}

{product.serviceHistory?.length > 0 && (
//   <div className="mt-10 border-t border-slate-200 pt-8">
//     <h2 className="mb-5 text-lg font-semibold text-slate-800">
//       Service History
//     </h2>

//     <div className="overflow-x-auto rounded-xl border border-slate-200">
//       <table className="min-w-full">
//         <thead className="bg-slate-50">
//           <tr>
//             <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
//               Type
//             </th>

//             <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
//               From Serial
//             </th>

//             <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
//               To Serial
//             </th>

//             <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
//               Vendor
//             </th>

//             <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
//               Created By
//             </th>

//             <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600 whitespace-nowrap">
//               Performed On
//             </th>

//             <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
//               Remark
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {product.serviceHistory.map((history) => (
//             <tr
//               key={history._id}
//               className="border-t border-slate-100 hover:bg-slate-50"
//             >
//               <td className="px-5 capitalize">
//                 {/* {history.type} */}
//                 <StatusBadge
//   text={
//     history.type === "new"
//       ? "New"
//       : history.type === "repaired"
//       ? "Repaired"
//       : "Replaced"
//   }
//   color={
//     history.type === "new"
//       ? "green"
//       : history.type === "repaired"
//       ? "blue"
//       : "yellow"
//   }
// />
//               </td>

//               <td className="px-5 py-4">
//                 {history.fromSerialNumber || "-"}
//               </td>

//               <td className="px-5 py-4">
//                 {history.toSerialNumber || "-"}
//               </td>

//               <td className="px-5 py-4">
//                 {history.performedBy?.fullName || "-"}
//                 <div className="text-xs text-slate-500">
//                   {history.performedBy?.email}
//                 </div>
//               </td>

//               <td className="px-5 py-4">
//                 {history.createdBy?.fullName || "-"}
//               </td>

//               <td className="px-5 py-4 whitespace-nowrap">
//                {new Date(history.performedAt).toLocaleDateString("en-GB", {
//   day: "2-digit",
//   month: "short",
//   year: "numeric",
// })}
//               </td>

//               <td className="px-5 py-4 whitespace-nowrap">
//                 {history.remark || "-"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>

<div className="mt-10 border-t border-slate-200 pt-8">
  <ServiceHistoryTable
    serviceHistory={product.serviceHistory}
  />
</div>

)}

<div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
  <SecondaryButton
    text="Go Back"
    onClick={() => navigate(-1)}
  />
</div>

        </PageCard>
        </>
        )
      }