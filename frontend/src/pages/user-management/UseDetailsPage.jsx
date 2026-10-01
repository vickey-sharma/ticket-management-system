import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUserDetailsAndUpdate } from "../../services/userService";

import PageHeader from "../../components/page-layout/PageHeader";
import PageCard from "../../components/auth/PageCard";
import InputField from "../../components/ui/InputField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import SecondaryButton from "../../components/ui/SecondaryButton";
import ToggleSwitch from "../../components/ui/ToggleSwitch";
import toast from "react-hot-toast";
import DetailField from "../../components/ui/DetailField";

export default function UserDetailsPage() {

  const { state } = useLocation();

  const navigate = useNavigate();

  const user = state?.user;

  if (!user) {
    return (
      <div className="text-center py-10">
        User not found.
      </div>
    );
  }

  console.log(user);


  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    companyName: user.companyName || "",
    isActive: user.isActive,
    isDeleted: user.isDeleted,
    role: user.role,
    fullAddress: user.fullAddress || "",
    state: user.state || "",
    city: user.city || "",
    pincode: user.pincode || ""
  });

  // const handleSubmit = () => {
  //   // console.log(formData);

  //   getUserDetailsAndUpdate(formData.email, formData);
  //   navigate(-1)
  // };

  const handleSubmit = async () => {
  try {
    await getUserDetailsAndUpdate(formData.email, formData);

    toast.success("User details updated successfully");
    navigate(-1);
  } catch (error) {
    console.log("UPDATE USER ERROR:", error.response?.data);
    toast.error(
      error.response?.data?.message || "Failed to update user details"
    );
  }
};


  return (
    <div className="space-y-6">

      <PageHeader
        title="User Details"
        description="View and update user information."
      />

      <PageCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <InputField
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({
                ...formData,
                fullName: e.target.value,
              })
            }
          />

          <DetailField
  label="Email"
  value={formData.email}
/>

          <InputField
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
              })
            }
          />

          <DetailField
  label="Role"
  value={formData.role}
/>


   {(formData.role === "client" || formData.role === "vendor") && (
  <div className="md:col-span-2">

    {/* Full Address */}
    <InputField
      label="Full Address"
      name="fullAddress"
      value={formData.fullAddress}
      onChange={(e) =>
        setFormData({
          ...formData,
          fullAddress: e.target.value,
        })
      }
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

      {/* Company Name */}
      <InputField
        label="Company Name"
        name="companyName"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({
            ...formData,
            companyName: e.target.value,
          })
        }
      />

      {/* City */}
      <InputField
        label="City"
        name="city"
        value={formData.city}
        onChange={(e) =>
          setFormData({
            ...formData,
            city: e.target.value,
          })
        }
      />

      {/* State */}
      <InputField
        label="State"
        name="state"
        value={formData.state}
        onChange={(e) =>
          setFormData({
            ...formData,
            state: e.target.value,
          })
        }
      />

      {/* Pincode */}
      <InputField
        label="Pincode"
        name="pincode"
        value={formData.pincode}
        onChange={(e) =>
          setFormData({
            ...formData,
            pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
          })
        }
      />

    </div>
  </div>
)}

        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
            <ToggleSwitch
              label="Account Active"
              checked={formData.isActive}
              onChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: checked,
                }))
              }
            />
          
            <ToggleSwitch
              label="Temporarily Disable Account"
              checked={formData.isDeleted}
              onChange={() => {
                toast.error("Account can't be disabled here.");
              }}
            />
          
          </div>


        <div className="mt-8 flex justify-end gap-3">

          <SecondaryButton text="Cancel" onClick={() => navigate(-1)} />

          <PrimaryButton onClick={handleSubmit} text="Save Changes" />

        </div>

      </PageCard>

    </div>
  );
}