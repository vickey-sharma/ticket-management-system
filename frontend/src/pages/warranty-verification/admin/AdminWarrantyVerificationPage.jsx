import { useState } from "react";
import toast from "react-hot-toast";

import PageHeader from "../../../components/page-layout/PageHeader";
import PageCard from "../../../components/auth/PageCard";
import LoadingState from "../../../components/ui/LoadingState";

import WarrantyDetails from "../../../components/warranty/WarrantyDetails";
import WarrantySearchForm from "../../../components/warranty/WarrantySearchForm";
import ServiceHistoryTable from "../../../components/registered-products/ServiceHistoryTable";

import { checkAdminProductWarranty } from "../../../services/registeredProductService";

export default function AdminWarrantyVerificationPage() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [serialNumber, setSerialNumber] = useState("");

  const handleWarrantyCheck = async () => {
    if (!serialNumber.trim()) {
      toast.error("Please enter a serial number.");
      return;
    }

    try {
      setLoading(true);

      const response = await checkAdminProductWarranty(
        serialNumber
      );

      setProduct(response.data.data);

      toast.success(response.data.message);
    } catch (error) {
      setProduct(null);

      toast.error(
        error.response?.data?.message ||
          "Unable to verify warranty."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Warranty Verification"
        description="Verify product warranty using its serial number."
      />

      <PageCard className="mt-6">
        <WarrantySearchForm
          serialNumber={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          onSubmit={handleWarrantyCheck}
          loading={loading}
        />

        {loading ? (
          <LoadingState />
        ) : (
          <>
            <WarrantyDetails product={product} />

            <ServiceHistoryTable
              serviceHistory={product?.serviceHistory}
            />
          </>
        )}
      </PageCard>
    </>
  );
}