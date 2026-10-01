// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import toast from "react-hot-toast";

// import PageHeader from "../../../components/page-layout/PageHeader";
// import PageCard from "../../../components/auth/PageCard";

// import DetailField from "../../../components/ui/DetailField";
// import InputField from "../../../components/ui/InputField";
// import TextArea from "../../../components/ui/TextArea";
// import LoadingState from "../../../components/ui/LoadingState";
// import EmptyState from "../../../components/ui/EmptyState";
// import PrimaryButton from "../../../components/ui/PrimaryButton";
// import SecondaryButton from "../../../components/ui/SecondaryButton";
// import FilterDropdown from "../../../components/ui/FilterDropdown";
// import StatusBadge from "../../../components/ui/StatusBadge";

// import {
//   getRegisteredProductBySerialNumber,
//   addRegisteredProductService,
// } from "../../../services/registeredProductService";

// import { getUserByRole } from "../../../services/userService";

// export default function AddRegisteredProductServicePage() {
//   const navigate = useNavigate();
//   const { serialNumber } = useParams();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [product, setProduct] = useState(null);
//   const [vendors, setVendors] = useState([]);

//   const [formData, setFormData] = useState({
//     serviceType: "repaired",
//     performedBy: "",
//     toSerialNumber: "",
//     remark: "",
//   });

//   //---------------------------------------------------
//   // Fetch Product + Vendors
//   //---------------------------------------------------

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const [productResponse, vendorResponse] = await Promise.all([
//           getRegisteredProductBySerialNumber(serialNumber),
//           getUserByRole("vendor"),
//         ]);

//         const productData = productResponse.data.data;
// const vendorData = vendorResponse.data.data;

// console.log("PRODUCT DATA:", productData);
// console.log("PRODUCT STATUS:", productData.productStatus);
// console.log("SERVICE HISTORY:", productData.serviceHistory);
// console.log("VENDORS:", vendorData);

// setProduct(productData);
// setVendors(vendorData);

//       } catch (error) {
//         toast.error(
//           error.response?.data?.message || "Unable to fetch data."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [serialNumber]);

//   //---------------------------------------------------
//   // Input Change
//   //---------------------------------------------------

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   //---------------------------------------------------
//   // Dropdown Change
//   //---------------------------------------------------

//   const handleDropdownChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   //---------------------------------------------------
//   // Submit
//   //---------------------------------------------------

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setSaving(true);

//       const response = await addRegisteredProductService(
//         serialNumber,
//         formData
//       );

//       toast.success(response.data.message);

//       const updatedSerial =
//         formData.serviceType === "replaced"
//           ? formData.toSerialNumber
//           : serialNumber;

//       navigate(
//         `/admin/dashboard/registered-products/${updatedSerial}`
//       );
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Unable to save service."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   //---------------------------------------------------
//   // Loading
//   //---------------------------------------------------

//   if (loading) {
//     return <LoadingState variant="page" />;
//   }

//   //---------------------------------------------------
//   // Empty State
//   //---------------------------------------------------

//   if (!product) {
//     return (
//       <EmptyState
//         title="Registered product not found"
//         description="The requested registered product could not be found."
//       />
//     );
//   }

//   //---------------------------------------------------
//   // UI
//   //---------------------------------------------------

//   return (
//     <>
//       <PageHeader
//         title="Add Product Service"
//         description="Record repair or replacement details for the selected product."
//       />

//       <PageCard className="mt-6">
//         <form onSubmit={handleSubmit} className="space-y-10">
//           {/* Product Details */}

//           <div>
//             <h2 className="mb-5 text-lg font-semibold text-slate-800">
//               Current Product Information
//             </h2>

//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//               <DetailField
//                 label="Bill Number"
//                 value={product.billNumber}
//               />

//               <DetailField
//                 label="Product Name"
//                 value={product.productName}
//               />

//               <DetailField
//                 label="Model Number"
//                 value={product.modelNumber}
//               />

//               <DetailField
//                 label="Current Serial Number"
//                 value={product.serialNumber}
//               />

//               <DetailField
//                 label="Warranty End Date"
//                 value={new Date(
//                   product.warrantyEndDate
//                 ).toLocaleDateString()}
//               />

//               {/* <DetailField
//                 label="Product Status"
//                 value={product.productStatus}
//               /> */}
//                <div className="bg-slate-50">
//   <p className="mb-1 text-sm font-medium text-slate-500">
//     Product Status
//   </p>

//   <div className="flex min-h-[42px] items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
//     <StatusBadge
//       text={
//         product.productStatus === "new"
//           ? "New"
//           : product.productStatus === "repaired"
//           ? "Repaired"
//           : "Replaced"
//       }
//       color={
//         product.productStatus === "new"
//           ? "green"
//           : product.productStatus === "repaired"
//           ? "blue"
//           : "yellow"
//       }
//     />
//   </div>
// </div>

//             </div>
//           </div>

//           {/* Service Details */}

//           <div className="border-t border-slate-200 pt-8">
//             <h2 className="mb-5 text-lg font-semibold text-slate-800">
//               Service Information
//             </h2>

//             <div className="space-y-5">
//               <div className="flex gap-5 mb-5">
//                 <div>
//                 <label className="mb-1 block text-sm text-light">
//                   Service Type
//                 </label>


  
//                 <FilterDropdown
//                   value={formData.serviceType}
//                   onChange={(value) =>
//                     handleDropdownChange("serviceType", value)
//                   }
//                   options={[
//                     {
//                       label: "Repair",
//                       value: "repaired",
//                     },
//                     {
//                       label: "Replacement",
//                       value: "replaced",
//                     },
//                   ]}
//                   className="w-50"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm text-light">
//                   Performed By
//                 </label>

//                 <FilterDropdown
//                   value={formData.performedBy}
//                   onChange={(value) =>
//                     handleDropdownChange("performedBy", value)
//                   }
//                   options={[
//                     {
//                       label: "Select Vendor",
//                       value: "",
//                     },
//                     ...vendors.map((vendor) => ({
//                       label: `${vendor.fullName}`,
//                       value: vendor._id,
//                     })),
//                   ]}
//                   className="w-50"
//                 />
//               </div>


//               </div>
//               </div>

//               {formData.serviceType === "replaced" && (
//                 <InputField
//                   label="New Serial Number"
//                   name="toSerialNumber"
//                   value={formData.toSerialNumber}
//                   onChange={handleInputChange}
//                   placeholder="Enter new serial number"
//                 />
//               )}

//               <TextArea
//                 label="Remark"
//                 name="remark"
//                 rows={5}
//                 value={formData.remark}
//                 onChange={handleInputChange}
//                 placeholder="Enter service remark"
//               />
//             </div>
          

//           {/* Buttons */}

//           <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
//             <SecondaryButton
//               text="Cancel"
//               type="button"
//               onClick={() => navigate(-1)}
//               className="w-auto px-6"
//             />

//             <PrimaryButton
//               type="submit"
//               loading={saving}
//               text={saving ? "Saving..." : "Save Service"}
//               className="w-auto px-6"
//             />
//           </div>
//         </form>
//       </PageCard>
//     </>
//   );
// }






import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../../../components/page-layout/PageHeader";
import PageCard from "../../../components/auth/PageCard";

import DetailField from "../../../components/ui/DetailField";
import InputField from "../../../components/ui/InputField";
import TextArea from "../../../components/ui/TextArea";
import LoadingState from "../../../components/ui/LoadingState";
import EmptyState from "../../../components/ui/EmptyState";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import SecondaryButton from "../../../components/ui/SecondaryButton";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import StatusBadge from "../../../components/ui/StatusBadge";

import {
  getRegisteredProductBySerialNumber,
  addRegisteredProductService,
} from "../../../services/registeredProductService";

import { getUserByRole } from "../../../services/userService";

export default function AddRegisteredProductServicePage() {
  const navigate = useNavigate();
  const { serialNumber } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState(null);
  const [vendors, setVendors] = useState([]);

  const [formData, setFormData] = useState({
    serviceType: "repaired",
    performedBy: "",
    toSerialNumber: "",
    remark: "",
  });

  // ---------------------------------------------------
  // Fetch Product + Vendors
  // ---------------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch product
        const productResponse =
          await getRegisteredProductBySerialNumber(
            serialNumber
          );

        const productData = productResponse.data.data;

        console.log("PRODUCT DATA:", productData);
        console.log(
          "PRODUCT STATUS:",
          productData.productStatus
        );
        console.log(
          "SERVICE HISTORY:",
          productData.serviceHistory
        );

        setProduct(productData);

        // Fetch vendors
        const vendorResponse =
          await getUserByRole("vendor");

        const vendorData = vendorResponse.data.data;

        console.log("VENDORS:", vendorData);

        setVendors(vendorData || []);
      } catch (error) {
        console.error(
          "FETCH SERVICE PAGE ERROR:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Unable to fetch data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serialNumber]);

  // ---------------------------------------------------
  // Input Change
  // ---------------------------------------------------

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------------------------------------------
  // Dropdown Change
  // ---------------------------------------------------

  const handleDropdownChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ---------------------------------------------------
  // Submit
  // ---------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.performedBy) {
      toast.error("Please select a vendor.");
      return;
    }

    if (!formData.remark.trim()) {
      toast.error("Please enter a service remark.");
      return;
    }

    if (
      formData.serviceType === "replaced" &&
      !formData.toSerialNumber.trim()
    ) {
      toast.error("Please enter the new serial number.");
      return;
    }

    try {
      setSaving(true);

      console.log(
        "SERVICE DATA BEING SENT:",
        formData
      );

      const response =
        await addRegisteredProductService(
          serialNumber,
          formData
        );

      toast.success(
        response.data.message ||
          "Service added successfully."
      );

      const updatedSerial =
        formData.serviceType === "replaced"
          ? formData.toSerialNumber.trim()
          : serialNumber;

      navigate(
        `/admin/dashboard/registered-products/${updatedSerial}`
      );
    } catch (error) {
      console.error(
        "ADD SERVICE ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to save service."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------
  // Loading
  // ---------------------------------------------------

  if (loading) {
    return <LoadingState />;
  }

  // ---------------------------------------------------
  // Empty State
  // ---------------------------------------------------

  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        description="Unable to find the registered product."
      />
    );
  }

  // ---------------------------------------------------
  // Product Status
  // ---------------------------------------------------

  const productStatus = product.productStatus;

  const statusText =
    productStatus === "new"
      ? "New"
      : productStatus === "repaired"
      ? "Repaired"
      : productStatus === "replaced"
      ? "Replaced"
      : "-";

  const statusColor =
    productStatus === "new"
      ? "green"
      : productStatus === "repaired"
      ? "blue"
      : productStatus === "replaced"
      ? "yellow"
      : "gray";

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------

  return (
    <>
      <PageHeader
        title="Add Service"
        description="Add a repair or replacement service for this registered product."
      />

      <PageCard className="mt-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-10"
        >
          {/* Product Details */}

          <div>
            <h2 className="mb-5 text-lg font-semibold text-slate-800">
              Current Product Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <DetailField
                label="Bill Number"
                value={product.billNumber}
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
                label="Current Serial Number"
                value={product.serialNumber}
              />

              <DetailField
                label="Warranty End Date"
                value={new Date(
                  product.warrantyEndDate
                ).toLocaleDateString()}
              />

              {/* Product Status */}

              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Product Status
                </p>

                <div className="flex min-h-[42px] items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <StatusBadge
                    text={statusText}
                    color={statusColor}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}

          <div className="border-t border-slate-200 pt-8">
            <h2 className="mb-5 text-lg font-semibold text-slate-800">
              Service Information
            </h2>

            <div className="space-y-5">
              <div className="mb-5 flex gap-5">
                {/* Service Type */}

                <div>
                  <label className="mb-1 block text-sm text-slate-600">
                    Service Type
                  </label>

                  <FilterDropdown
                    value={formData.serviceType}
                    onChange={(value) =>
                      handleDropdownChange(
                        "serviceType",
                        value
                      )
                    }
                    options={[
                      {
                        label: "Repair",
                        value: "repaired",
                      },
                      {
                        label: "Replacement",
                        value: "replaced",
                      },
                    ]}
                    className="w-50"
                  />
                </div>

                {/* Performed By */}

                <div>
                  <label className="mb-1 block text-sm text-slate-600">
                    Performed By
                  </label>

                  <FilterDropdown
                    value={formData.performedBy}
                    onChange={(value) =>
                      handleDropdownChange(
                        "performedBy",
                        value
                      )
                    }
                    options={[
                      {
                        label: "Select Vendor",
                        value: "",
                      },
                      ...vendors.map((vendor) => ({
                        label: vendor.fullName,
                        value: vendor._id,
                      })),
                    ]}
                    className="w-50"
                  />
                </div>
              </div>

              {/* New Serial Number */}

              {formData.serviceType === "replaced" && (
                <InputField
                  label="New Serial Number"
                  name="toSerialNumber"
                  value={formData.toSerialNumber}
                  onChange={handleInputChange}
                  placeholder="Enter new serial number"
                />
              )}

              {/* Remark */}

              <TextArea
                label="Remark"
                name="remark"
                rows={5}
                value={formData.remark}
                onChange={handleInputChange}
                placeholder="Enter service remark"
              />
            </div>
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
            <SecondaryButton
              text="Cancel"
              type="button"
              onClick={() => navigate(-1)}
              className="w-auto px-6"
            />

            <PrimaryButton
              type="submit"
              loading={saving}
              text={
                saving
                  ? "Saving..."
                  : "Save Service"
              }
              className="w-auto px-6"
            />
          </div>
        </form>
      </PageCard>
    </>
  );
}

