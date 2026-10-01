import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../../components/page-layout/PageHeader";
import PageCard from "../../components/auth/PageCard";
import InputField from "../../components/ui/InputField";
import FilterDropdown from "../../components/ui/FilterDropdown";
import PrimaryButton from "../../components/ui/PrimaryButton";
import SecondaryButton from "../../components/ui/SecondaryButton";
import { useAuth } from "../../hooks/useAuth";

import { registerUserInitially } from "../../services/userService";

export default function RegisterUserPage() {
  const navigate = useNavigate();

  // const user = JSON.parse(localStorage.getItem("user"));
  const { user, loading: authLoading } = useAuth();

  //  console.log(user);

  const roleOptions = {
    superadmin: [
      { label: "Select Role", value: "" },
      { label: "Super Admin", value: "superadmin" },
      { label: "Admin", value: "admin" },
      { label: "Engineer", value: "engineer" },
      { label: "L1 Engineer", value: "l1_engineer" },
      { label: "Client", value: "client" },
      { label: "Sales Manager", value: "sales_manager" },
      { label: "Inventory Manager", value: "inventory_manager" },
      { label: "Vendor", value: "vendor" }
    ],

    admin: [
      { label: "Select Role", value: "" },
      { label: "Admin", value: "admin" },
      { label: "Engineer", value: "engineer" },
      { label: "L1 Engineer", value: "l1_engineer" },
      { label: "Client", value: "client" },
      { label: "Sales Manager", value: "sales_manager" },
      { label: "Inventory Manager", value: "inventory_manager" },
      { label: "Vendor", value: "vendor" }
    ],

    engineer: [
      { label: "Select Role", value: "" },
      { label: "Client", value: "client" },
    ],

    l1_engineer: [
      { label: "Select Role", value: "" },
      { label: "Client", value: "client" },
    ],
    sales_manager: [
      { label: "Select Role", value: "" },
      { label: "Client", value: "client" },
    ],
  };

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "",
    companyName: "",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.fullName ||
      !form.email ||
      !form.phoneNumber ||
      !form.role
    ) {
      return toast.error("Please fill all required fields.");
    }

    if (
      (form.role === "client" || form.role === "vendor") &&
      !form.companyName.trim()
    ) {
      return toast.error("Company Name is required.");
    }

    if (form.role === "vendor") {
      if (
        !form.fullAddress.trim() ||
        !form.city.trim() ||
        !form.state.trim() ||
        !form.pincode.trim()
      ) {
        return toast.error("Please fill all vendor address fields.");
      }
    }



    try {
      setLoading(true);

      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        role: form.role,
      };

      if (form.role === "client" || form.role === "vendor") {
        payload.companyName = form.companyName.trim();
      }

      if (form.role === "client" || form.role === "vendor") {
        payload.fullAddress = form.fullAddress.trim();
        payload.city = form.city.trim();
        payload.state = form.state.trim();
        payload.pincode = form.pincode.trim();
      }

      const response = await registerUserInitially(payload);
      console.log(payload);

      toast.success(response.data.message);

      // setForm({
      //   fullName: "",
      //   email: "",
      //   phoneNumber: "",
      //   role: "",
      //   companyName: "",
      //   fullAddress: "",
      //   city: "",
      //   state: "",
      //   pincode: "",
      // });

      setTimeout(() => navigate(-1), 1000);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Register User"
        subtitle="Create a new user account."
      />
      <br />
      <PageCard>
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Full Name"
              value={form.fullName}
              placeholder="Enter full name"
              onChange={(e) =>
                handleChange("fullName", e.target.value)
              }
              disabled={loading}
            />

            <InputField
              label="Email Address"
              type="email"
              value={form.email}
              placeholder="Enter email"
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
              disabled={loading}
            />

            <InputField
              label="Phone Number"
              value={form.phoneNumber}
              placeholder="Enter phone number"
              onChange={(e) =>
                handleChange("phoneNumber", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              disabled={loading}
            />


            <div>
              <label className="block text-sm mb-1 text-light">
                Role
              </label>

              {/* <FilterDropdown
                value={form.role}
                onChange={(e) =>
                  handleChange("role", e.target)
                }
                options={roleOptions[user.role]}
              /> */}

              <FilterDropdown
                value={form.role}
                onChange={(value) => handleChange("role", value)}
                options={roleOptions[user.role]}
                className="w-118"
              />

            </div>
          </div>

          {/* COMPANY NAME - CLIENT & VENDOR */}

{/* {(form.role === "client" || form.role === "vendor") && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <InputField
      label="Company Name"
      value={form.companyName}
      placeholder="Enter company name"
      onChange={(e) =>
        handleChange("companyName", e.target.value)
      }
      disabled={loading}
    />
  </div>
)} */}

{/* CLIENT & VENDOR ADDRESS FIELDS */}

{(form.role === "client" || form.role === "vendor") && (
  <div className="space-y-5">

    <InputField
      label="Full Address"
      value={form.fullAddress}
      placeholder="Enter full address"
      onChange={(e) =>
        handleChange("fullAddress", e.target.value)
      }
      disabled={loading}
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

 {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> */}
    <InputField
      label="Company Name"
      value={form.companyName}
      placeholder="Enter company name"
      onChange={(e) =>
        handleChange("companyName", e.target.value)
      }
      disabled={loading}
    />


      <InputField
        label="City"
        value={form.city}
        placeholder="Enter city"
        onChange={(e) =>
          handleChange("city", e.target.value)
        }
        disabled={loading}
      />

      <InputField
        label="State"
        value={form.state}
        placeholder="Enter state"
        onChange={(e) =>
          handleChange("state", e.target.value)
        }
        disabled={loading}
      />

      <InputField
        label="Pincode"
        value={form.pincode}
        placeholder="Enter pincode"
        onChange={(e) =>
          handleChange(
            "pincode",
            e.target.value.replace(/\D/g, "").slice(0, 6)
          )
        }
        disabled={loading}
      />

    </div>
  </div>
)}

          <div className="flex justify-end gap-4 pt-4">
            <SecondaryButton
              text="Cancel"
              className="w-36"
              onClick={() => navigate(-1)}
              disabled={loading}
            />

            <PrimaryButton
              text="Register User"
              type="submit"
              loading={loading}
              className="w-44"
            />
          </div>
        </form>
      </PageCard>
    </>
  );
}