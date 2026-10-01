import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../../../components/page-layout/PageHeader";
import PageCard from "../../../components/auth/PageCard";

import InputField from "../../../components/ui/InputField";
import LoadingState from "../../../components/ui/LoadingState";
import EmptyState from "../../../components/ui/EmptyState";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import SecondaryButton from "../../../components/ui/SecondaryButton";

import EditableServiceHistoryTable from "../../../components/registered-products/EditableServiceHistoryTable";

import {
  getRegisteredProductBySerialNumber,
  updateRegisteredProduct,
} from "../../../services/registeredProductService";

import { getUserByRole } from "../../../services/userService";

export default function EditRegisteredProductPage() {
  const navigate = useNavigate();
  const { serialNumber } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);

  const [formData, setFormData] = useState({
    billNumber: "",
    billDate: "",
    billCompanyName: "",
    endCompanyName: "",
    productName: "",
    modelNumber: "",
    serialNumber: "",
    warrantyEndDate: "",
  });

  useEffect(() => {
    fetchPageData();
  }, [serialNumber]);

  const fetchPageData = async () => {
    try {
      setLoading(true);

      const [productResponse, vendorResponse] =
        await Promise.all([
          getRegisteredProductBySerialNumber(serialNumber),
          getUserByRole("vendor"),
        ]);

      const productData = productResponse.data.data;

      setProduct(productData);

      setServiceHistory(
        productData.serviceHistory || []
      );

      setVendors(vendorResponse.data.data || []);

      setFormData({
        billNumber: productData.billNumber,
        billDate: productData.billDate.slice(0, 10),
        billCompanyName: productData.billCompanyName,
        endCompanyName: productData.endCompanyName,
        productName: productData.productName,
        modelNumber: productData.modelNumber,
        serialNumber: productData.serialNumber,
        warrantyEndDate:
          productData.warrantyEndDate.slice(0, 10),
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ??
          "Unable to fetch registered product."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.billNumber.trim() ||
      !formData.billCompanyName.trim() ||
      !formData.endCompanyName.trim() ||
      !formData.productName.trim() ||
      !formData.modelNumber.trim() ||
      !formData.billDate ||
      !formData.warrantyEndDate ||
      !formData.serialNumber
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (
      new Date(formData.warrantyEndDate) <
      new Date(formData.billDate)
    ) {
      toast.error(
        "Warranty end date cannot be before bill date."
      );
      return;
    }

    try {
      setSaving(true);

      const response =
        await updateRegisteredProduct(
          serialNumber,
          formData
        );

      toast.success(response.data.message);

      await fetchPageData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ??
          "Unable to update registered product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        description="Unable to fetch registered product."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Registered Product"
        description="Update product details and service history."
      />

      <PageCard className="mt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <InputField
              label="Bill Number"
              name="billNumber"
              value={formData.billNumber}
              onChange={handleChange}
            />

            <InputField
              label="Bill Date"
              type="date"
              name="billDate"
              value={formData.billDate}
              onChange={handleChange}
            />

            <InputField
              label="Bill Company Name"
              name="billCompanyName"
              value={formData.billCompanyName}
              onChange={handleChange}
            />

            <InputField
              label="End Company Name"
              name="endCompanyName"
              value={formData.endCompanyName}
              onChange={handleChange}
            />

            <InputField
              label="Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
            />

            <InputField
              label="Model Number"
              name="modelNumber"
              value={formData.modelNumber}
              onChange={handleChange}
            />
            

                         <InputField
              label="Serial Number"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
            />

                        <InputField
              label="Warranty End Date"
              type="date"
              name="warrantyEndDate"
              value={formData.warrantyEndDate}
              onChange={handleChange}
            />

          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">
            <SecondaryButton
              type="button"
              text="Cancel"
              onClick={() => navigate(-1)}
            />

            <PrimaryButton
              type="submit"
              text={saving ? "Saving..." : "Save Product"}
              disabled={saving}
            />
          </div>
        </form>
      </PageCard>

      <PageCard className="mt-6">
<EditableServiceHistoryTable
  serviceHistory={serviceHistory}
  setServiceHistory={setServiceHistory}
  vendors={vendors}
/>

      </PageCard>
          </>
  );
}