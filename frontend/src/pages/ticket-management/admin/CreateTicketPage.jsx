import React, { useState, useEffect } from 'react';
import { getClientsByCompanyName, getRegisteredProductsByCompanyName, getAllCompaniesFromRegisteredProducts, getAssignableUsersForTicket,  createTicketByAdmin } from '../../../services/ticketService';
import { getVendorUsers, getAdminUsers, getUsers } from '../../../services/userService';
import PageHeader from "../../../components/page-layout/PageHeader";
import PageCard from "../../../components/auth/PageCard";
import InputField from "../../../components/ui/InputField";
import TextArea from "../../../components/ui/TextArea";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import DetailField from '../../../components/ui/DetailField';
import PrimaryButton from "../../../components/ui/PrimaryButton";
import SecondaryButton from '../../../components/ui/SecondaryButton';
import toast from "react-hot-toast";

export function CreateTicketPage() {

  //TICKET FIELDS
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
const [priority, setPriority] = useState("");
const [department, setDepartment] = useState("");
const [problemCategory, setProblemCategory] = useState("");


//COMPANY
const [companies, setCompanies] = useState([]);
const [companyName, setCompanyName] = useState("");

// const [customerName, setCustomerName] = useState("");
// const [customerId, setCustomerId] = useState("");

// Data fetched based on company
const [clients, setClients] = useState([]);
const [selectedClientId, setSelectedClientId] = useState("");
const [products, setProducts] = useState([]);
const [selectedProductId, setSelectedProductId] = useState("");
const [expiredWarrantyDescription, setExpiredWarrantyDescription] = useState("");

const [contactPerson, setContactPerson] = useState("");
const [contactEmail, setContactEmail] = useState("");
const [contactNumber, setContactNumber] = useState("");
const [fullAddress, setFullAddress] = useState("");
const [state, setState] = useState("");
const [city, setCity] = useState("");
const [pincode, setPincode] = useState("");


const [productImage, setProductImage] = useState(null);

const [assignedToId, setAssignedToId] = useState("");
const [vendorId, setVendorId] = useState("");
const [engineers, setEngineers] = useState([]);
const [vendors, setVendors] = useState([]);

const [problemDescription, setProblemDescription] = useState("");
const [remarks, setRemarks] = useState("");


useEffect(()=> {
const fetchAllUsers = async()=>{
  const response = await getUsers();
  console.log(response);
}
},[]);

useEffect(() => {
  if (department !== "rma") {
    setProblemCategory("");
     setVendorId("");
    setProblemDescription("");
    setRemarks("");
  }
}, [department]);


useEffect(() => {
  const fetchCompanies = async () => {
    const response = await getAllCompaniesFromRegisteredProducts();
    console.log(response.data.data)
    setCompanies(response.data.data);
  };
fetchCompanies();
}, []);


useEffect(()=>{

  setSelectedClientId("");
setSelectedProductId("");
setClients([]);
setProducts([]);

  if (!companyName) {
    return;
  } 

const fetchClients = async ()=>{
  const response = await getClientsByCompanyName(companyName);
console.log("CLIENTS BY COMPANY", response.data.data);
 setClients(response.data.data)
 console.log(clients)
};
fetchClients();

const fetchRegisteredProducts = async ()=>{
  const response = await getRegisteredProductsByCompanyName(companyName);
  console.log("REGISTERED PRODUCTS:", response.data.data);
 setProducts(response.data.data);
};
fetchRegisteredProducts();
}, [companyName]);


useEffect(() => {
  const fetchUsers = async () => {
    try {
      const engineerResponse = await getAssignableUsersForTicket();

      console.log("ENGINEER RESPONSE:", engineerResponse);
      console.log("ENGINEERS DATA:", engineerResponse.data.data);

      setEngineers(engineerResponse.data.data);
    } catch (error) {
      console.error("ENGINEER FETCH ERROR:", error);
      console.error("ENGINEER STATUS:", error?.response?.status);
      console.error("ENGINEER MESSAGE:", error?.response?.data);
      toast.error("Failed to fetch engineers");
    }

    try {
      const vendorResponse = await getVendorUsers();

      console.log("VENDOR RESPONSE:", vendorResponse);
      console.log("VENDORS DATA:", vendorResponse.data.data);

      setVendors(vendorResponse.data.data);
    } catch (error) {
      console.error("VENDOR FETCH ERROR:", error);
      console.error("VENDOR STATUS:", error?.response?.status);
      console.error("VENDOR MESSAGE:", error?.response?.data);
      toast.error("Failed to fetch vendors");
    }
  };

  fetchUsers();
}, []);


const selectedClient = clients.find(
  (client) => client._id === selectedClientId
);

useEffect(() => {
  if (!selectedClient) {
    setContactPerson("");
    setContactEmail("");
    setContactNumber("");
    setFullAddress("");
    setState("");
    setCity("");
    setPincode("");
    return;
  }

  setContactPerson(selectedClient?.fullName || "");
  setContactEmail(selectedClient?.email || "");
  setContactNumber(selectedClient?.phoneNumber || "");
  setFullAddress(selectedClient?.fullAddress || "");
  setState(selectedClient?.state || "");
  setCity(selectedClient?.city || "");
  setPincode(selectedClient?.pincode || "");
}, [selectedClient]);


const selectedProduct = products.find(
  (product) => product._id === selectedProductId
);

const isWarrantyExpired =
  selectedProduct?.warrantyEndDate &&
  new Date(selectedProduct.warrantyEndDate) <= new Date();

  useEffect(() => {
  if (!isWarrantyExpired) {
    setExpiredWarrantyDescription("");
  }
}, [isWarrantyExpired]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !issueTitle ||
    !issueDescription ||
    !priority ||
    !department ||
    !companyName ||
    !selectedClientId ||
    !selectedProductId
  ) {
    toast.error("Please fill all required fields.");
    return;
  }

  if (department === "rma" && !problemCategory) {
    toast.error("Problem category is required for RMA.");
    return;
  };

  if (isWarrantyExpired && !expiredWarrantyDescription.trim()) {
  toast.error("Description is required for an expired warranty.");
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

       customerName: selectedClient?.fullName,
      customerId: selectedClientId,

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
      expiredWarrantyDescription,

      assignedToId,
      vendorId,
      problemDescription,
      remarks,

      productImage,
    };

    console.log("TICKET DATA:", ticketData);

    const response = await createTicketByAdmin(ticketData);

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

  {/* Full width */}
  <div className="md:col-span-2">
    <InputField
      label="Issue Title"
      name="issueTitle"
      value={issueTitle}
      onChange={(e) => setIssueTitle(e.target.value)}
      placeholder="Enter issue title"
    />
  </div>

  {/* Full width */}
  <div className="md:col-span-2">
    <TextArea
      label="Issue Description"
      name="issueDescription"
      value={issueDescription}
      onChange={(e) => setIssueDescription(e.target.value)}
      placeholder="Describe the issue"
    />
  </div>

  {/* Half width */}
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

  {/* Half width */}
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




<div className="md:col-span-2 mt-8">
  <h3 className="mb-4 text-lg font-semibold">
    Customer Details
  </h3>

  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

    {/* Company */}
    <FilterDropdown
      value={companyName}
      onChange={setCompanyName}
      className="w-full"
      options={[
        { value: "", label: "Select Company" },
        ...companies.map((company) => ({
          value: company,
          label: company,
        })),
      ]}
    />

    {/* Client */}
    <FilterDropdown
      value={selectedClientId}
      onChange={setSelectedClientId}
      className="w-full"
      options={[
        { value: "", label: "Select Client" },
        ...clients.map((client) => ({
          value: client._id,
          label: client.fullName,
        })),
      ]}
    />

  </div>
</div>




<div className="md:col-span-2 mt-8">
  <h3 className="mb-4 text-lg font-semibold">
    Contact & Address Details
  </h3>

  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

    {/* Contact Person */}
    <InputField
      label="Contact Person"
      name="contactPerson"
      value={contactPerson}
      onChange={(e) => setContactPerson(e.target.value)}
      placeholder="Enter contact person"
    />

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

  </div>
</div>



<div className="md:col-span-2 mt-8">
  <h3 className="mb-4 text-lg font-semibold">
    Product Details
  </h3>

  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

    <div>
  <label className="mb-1 block text-sm text-light">
    Serial Number
  </label>

  <FilterDropdown
    value={selectedProductId}
    onChange={setSelectedProductId}
    className="w-full"
    options={[
      { value: "", label: "Select Serial Number" },
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
      value={selectedProduct?.productName}
    />

    {/* Model Number */}
    <DetailField
      label="Model Number"
      value={selectedProduct?.modelNumber}
    />

    {/* Bill Number */}
    <DetailField
      label="Bill Number"
      value={selectedProduct?.billNumber}
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

{isWarrantyExpired && (
  <div className="md:col-span-2">
    <TextArea
      label="Expired Warranty Description"
      name="expiredWarrantyDescription"
      value={expiredWarrantyDescription}
      onChange={(e) => setExpiredWarrantyDescription(e.target.value)}
      placeholder="Enter reason for raising ticket after warranty expiration"
    />
  </div>
)}

  </div>
</div>


<div className="md:col-span-2 mt-8">
  <h3 className="mb-4 text-lg font-semibold">
    Vendor & Assignment Details
  </h3>

  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

    {/* Assigned To */}
    <div>
      <label className="mb-1 block text-sm text-light">
        Assigned To
      </label>

      <FilterDropdown
        value={assignedToId}
        onChange={setAssignedToId}
        className="w-full"
       options={[
  { value: "", label: "Select Engineer" },
  ...engineers.map((engineer) => ({
    value: engineer._id,
    label: engineer.fullName,
  })),
]}
      />
    </div>

    {/* Vendor */}
    {department === "rma" && (
    <div>
      <label className="mb-1 block text-sm text-light">
        Vendor
      </label>

      <FilterDropdown
        value={vendorId}
        onChange={setVendorId}
        className="w-full"
        options={[
  { value: "", label: "Select Vendor" },
  ...vendors.map((vendor) => ({
    value: vendor._id,
    label: vendor.fullName,
  })),
]}
      />
    </div>
    )}

{vendorId && (
  <>
    {/* Problem Description */}
    <div className="md:col-span-2">
      <TextArea
        label="Problem Description"
        name="problemDescription"
        value={problemDescription}
        onChange={(e) => setProblemDescription(e.target.value)}
        placeholder="Enter problem description for vendor"
      />
    </div>

    {/* Remarks */}
    <div className="md:col-span-2">
      <TextArea
        label="Remarks"
        name="remarks"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        placeholder="Enter remarks"
      />
    </div>
    </>
    )}

    {/* Product Image */}
    <div className="md:col-span-2">
      <label className="mb-1 block text-sm text-light">
        Product Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProductImage(e.target.files[0])}
        className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
      />
    </div>

  </div>
</div>


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
  )
}

