import React, { useState, useEffect }  from 'react';
import { createTicketByClient, getRegisteredProductsByCompanyName } from "../../../services/ticketService.js";
import PageHeader from "../../../components/page-layout/PageHeader";
import PageCard from "../../../components/auth/PageCard";
import InputField from "../../../components/ui/InputField";
import TextArea from "../../../components/ui/TextArea";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import DetailField from '../../../components/ui/DetailField';
import PrimaryButton from "../../../components/ui/PrimaryButton";
import SecondaryButton from '../../../components/ui/SecondaryButton';
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth.js";


export function CreateTicketPage() {

   const { user, loading: authLoading } = useAuth();
  // console.log("USER IS:",user);

  //TICKET FIELDS
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
const [priority, setPriority] = useState("");
const [department, setDepartment] = useState("");
const [problemCategory, setProblemCategory] = useState("");

const [companyName, setCompanyName] = useState("");

const [products, setProducts] = useState([]);
const [selectedProductId, setSelectedProductId] = useState("");

const [contactPerson, setContactPerson] = useState("");
const [contactEmail, setContactEmail] = useState("");
const [contactNumber, setContactNumber] = useState("");
const [fullAddress, setFullAddress] = useState("");
const [state, setState] = useState("");
const [city, setCity] = useState("");
const [pincode, setPincode] = useState("");

const [productImage, setProductImage] = useState(null);

useEffect(() => {
  if (department !== "rma") {
    setProblemCategory("");
  }
}, [department]);


useEffect(()=>{
if(!user) return;

setCompanyName(user.companyName);
setContactPerson(user.fullName);
setContactEmail(user.email);
setContactNumber(user.phoneNumber);
setFullAddress(user.fullAddress? user.fullAddress : "");
setState(user.state? user.state : "");
setCity(user.city? user.city : "");
setPincode(user.pincode? user.pincode : "");

}, [user]);


useEffect(()=>{
  if(!user?.companyName) return;

  const fetchRegisteredProducts = async ()=>{
  const response = await getRegisteredProductsByCompanyName(user?.companyName);
  // console.log("REGISTERED PRODUCTS:", response.data.data);
 setProducts(response.data.data);
};
fetchRegisteredProducts();
},[user?.companyName]);


const selectedProduct = products.find(
  (product) => product._id === selectedProductId
);


const isWarrantyExpired =
  selectedProduct?.warrantyEndDate &&
  new Date(selectedProduct.warrantyEndDate) <= new Date();

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !issueTitle ||
    !issueDescription ||
    !priority ||
    !department ||
    !companyName ||
    !selectedProductId
  ) {
    toast.error("Please fill all required fields.");
    return;
  }

  if (department === "rma" && !problemCategory) {
    toast.error("Problem category is required for RMA.");
    return;
  };

  if (isWarrantyExpired) {
  toast.error("Product Warranty Expired.");
  return;
}

  try {
    const ticketData = {
      issueTitle,
      issueDescription,
      priority,
      department,
      problemCategory,

      companyName,

      contactPerson,
      contactEmail,
      contactNumber,
      fullAddress,
      state,
      city,
      pincode,

      productName: selectedProduct?.productName,
      modelNumber: selectedProduct?.modelNumber,
      serialNumber: selectedProduct?.serialNumber,
      billNumber: selectedProduct?.billNumber,

      productImage,
    };

    console.log("TICKET DATA:", ticketData);

    const response = await createTicketByClient(ticketData);

    console.log("CREATE TICKET RESPONSE:", response.data);

    toast.success("Ticket created successfully.");

  } catch (error) {
    console.error("CREATE TICKET ERROR:", error);

    toast.error(
      error?.response?.data?.message ||
      "Failed to create ticket. Please try again."
    );
  }
};


 return (
  <>
    <PageHeader
      title="Create Ticket"
      description="Create a new Ticket."
    />

    <PageCard className="mt-6">
      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* ================= ISSUE DETAILS ================= */}

          <div className="md:col-span-2">
            <InputField
              label="Issue Title"
              name="issueTitle"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="Enter issue title"
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              label="Issue Description"
              name="issueDescription"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Describe the issue"
            />
          </div>

          <FilterDropdown
            value={priority}
            onChange={setPriority}
            options={[
              { value: "", label: "Select Priority" },
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />

          <FilterDropdown
            value={department}
            onChange={setDepartment}
            options={[
              { value: "", label: "Select Department" },
              { value: "rma", label: "Rma" },
              { value: "technical_support", label: "Technical Support" },
              { value: "general_query", label: "General Query" },
            ]}
          />

          {department === "rma" && (
            <div className="md:col-span-2">
              <FilterDropdown
                value={problemCategory}
                className="w-full"
                onChange={setProblemCategory}
                options={[
                  { value: "", label: "Select Problem Category" },
                  { value: "hw_failure", label: "Hardware Failure" },
                  { value: "sw_failure", label: "Software Failure" },
                  { value: "port_issue", label: "Port Issue" },
                  { value: "poe_issue", label: "POE Issue" },
                  { value: "power_issue", label: "Power Issue" },
                  { value: "others", label: "Others" },
                ]}
              />
            </div>
          )}


          {/* ================= CUSTOMER DETAILS ================= */}

          <div className="md:col-span-2 mt-8">
            <h3 className="mb-4 text-lg font-semibold">
              Customer Details
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Company */}
              <DetailField
                label="Company Name"
                value={companyName || "-"}
              />

              {/* Contact Person */}
              <InputField
                label="Contact Person"
                name="contactPerson"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Enter contact person"
              />

            </div>
          </div>


          {/* ================= CONTACT & ADDRESS ================= */}

          <div className="md:col-span-2 mt-8">
            <h3 className="mb-4 text-lg font-semibold">
              Contact & Address Details
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Contact Email */}
              <InputField
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Enter contact email"
              />

              {/* Contact Number */}
              <InputField
                label="Contact Number"
                name="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter contact number"
              />

 {/* Full Address */}
              <div className="md:col-span-2">
                <InputField
                  label="Full Address"
                  name="fullAddress"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="Enter full address"
                />
              </div>

              
              {/* State */}
              <InputField
                label="State"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter state"
              />

              {/* City */}
              <InputField
                label="City"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
              />

              {/* Pincode */}
              <InputField
                label="Pincode"
                name="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter pincode"
              />


            </div>
          </div>


          {/* ================= PRODUCT DETAILS ================= */}

          <div className="md:col-span-2 mt-8">
            <h3 className="mb-4 text-lg font-semibold">
              Product Details
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Serial Number */}
              <div>
                <label className="mb-1 block text-sm text-light">
                  Serial Number
                </label>

                <FilterDropdown
                  value={selectedProductId}
                  onChange={setSelectedProductId}
                  className="w-full"
                  options={[
                    {
                      value: "",
                      label: "Select Serial Number"
                    },
                    ...products.map((product) => ({
                      value: product._id,
                      label: product.serialNumber,
                    })),
                  ]}
                />
              </div>


              {/* Product Name */}
              <DetailField
                label="Product Name"
                value={selectedProduct?.productName || "-"}
              />

              {/* Model Number */}
              <DetailField
                label="Model Number"
                value={selectedProduct?.modelNumber || "-"}
              />

              {/* Bill Number */}
              <DetailField
                label="Bill Number"
                value={selectedProduct?.billNumber || "-"}
              />

              {/* Warranty End Date */}
              <DetailField
                label="Warranty End Date"
                value={
                  selectedProduct?.warrantyEndDate
                    ? new Date(selectedProduct.warrantyEndDate)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")
                    : "-"
                }
              />

              {/* Warranty Expired Message */}
              {isWarrantyExpired && (
                <div className="md:col-span-2">
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    This product's warranty has expired. You cannot
                    create a ticket for this product.
                  </div>
                </div>
              )}

              {/* Product Image */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-light">
                  Product Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProductImage(e.target.files[0])
                  }
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

            </div>
          </div>


          {/* ================= BUTTONS ================= */}

          <div className="md:col-span-2 mt-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <SecondaryButton
                text="Cancel"
                type="button"
              />

              <PrimaryButton
                text="Create Ticket"
                type="submit"
              />

            </div>
          </div>

        </div>

      </form>
    </PageCard>
  </>
);
};
