import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../../../components/page-layout/PageHeader";
import PageCard from "../../../components/auth/PageCard";

import InputField from "../../../components/ui/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import SecondaryButton from "../../../components/ui/SecondaryButton";

import { createRegisteredProduct } from "../../../services/registeredProductService";

export default function RegisterProductPage() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const resetForm = () => {

    setFormData({
      billNumber: "",
      billDate: "",
       billCompanyName: "",
    endCompanyName: "",
      productName: "",
      modelNumber: "",
      serialNumber: "",
      warrantyEndDate: "",
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const {
      billNumber,
      billDate,
       billCompanyName,
    endCompanyName,
      productName,
      modelNumber,
      serialNumber,
      warrantyEndDate,
    } = formData;

    if (
      !billNumber.trim() ||
      !billDate ||
      !billCompanyName.trim() ||
      !productName.trim() ||
      !modelNumber.trim() ||
      !serialNumber.trim() ||
      !warrantyEndDate
    ) {
      toast.error("All fields are required except End Company Name");
      return;
    }

    try {

      setLoading(true);

      console.log("FORM DATA BEFORE API:", formData);
      
      const response = await createRegisteredProduct(formData);

      toast.success(response.data.message);

      resetForm();

      // OR

      // navigate("/admin/dashboard/registered-products");

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Unable to register product"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <>

      <PageHeader
        title="Register Product"
        description="Register a sold product for warranty tracking."
      />

      <PageCard className="mt-6">

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-2 gap-5">

            <InputField
              label="Bill Number"
              name="billNumber"
              value={formData.billNumber}
              onChange={handleChange}
              placeholder="Enter bill number"
            />

            <InputField
              label="Bill Date"
              name="billDate"
              type="date"
              value={formData.billDate}
              onChange={handleChange}
            />

            <InputField
              label="Bill Company Name"
              name="billCompanyName"
              value={formData.billCompanyName}
              onChange={handleChange}
              placeholder="Enter bill company name"
            />

               <InputField
              label="End Company Name"
              name="endCompanyName"
              value={formData.endCompanyName}
              onChange={handleChange}
              placeholder="Enter bill company name"
            />

            <InputField
              label="Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
            />

            <InputField
              label="Model Number"
              name="modelNumber"
              value={formData.modelNumber}
              onChange={handleChange}
              placeholder="Enter model number"
            />

            <InputField
              label="Serial Number"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="Enter serial number"
            />

            <InputField
              label="Warranty End Date"
              name="warrantyEndDate"
              type="date"
              value={formData.warrantyEndDate}
              onChange={handleChange}
            />

          </div>

          <div className="flex justify-end gap-4">

            <SecondaryButton
              text="Reset"
              type="button"
              className="w-36 mt-10"
              onClick={resetForm}
            />

            <PrimaryButton
              text="Register Product"
              type="submit"
              loading={loading}
              className="w-52 mt-10"
              
            />

          </div>

        </form>

      </PageCard>

    </>
  );
}