import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOwnProfileDetails, updateOwnProfileDetails, } from "../../services/userService";
import { getCurrentUser } from "../../services/dashboardService";

import PageHeader from "../../components/page-layout/PageHeader";
import PageCard from "../../components/auth/PageCard";
import InputField from "../../components/ui/InputField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import SecondaryButton from "../../components/ui/SecondaryButton";
import ToggleSwitch from "../../components/ui/ToggleSwitch";
import toast from "react-hot-toast";
import DetailField from "../../components/ui/DetailField";

export default function ProfileDetailsPage() {

  const { state } = useLocation();

  const navigate = useNavigate();

 const [user, setUser] = useState({
  fullName: "",
  email: "",
  phoneNumber: "",
  role: "",
  companyName: "",
  fullAddress: "",
  city: "",
  state: "",
  pincode: "",
  isActive: false,
  isDeleted: false,
});

  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetchCurrentUserDetails();
  }, []);

  const fetchCurrentUserDetails = async ()=> {
     try {
        const response = await getOwnProfileDetails();
    // console.log(response);
        setUser(response.data.data.user);
    
        // console.log(user);
    
      } catch (error) {
        // console.log(error);
      } finally {
        setLoading(false)
      }
  }


  const handleSubmit = () => {

    updateOwnProfileDetails(user);
navigate(-1)
  };

  return (
    <div className="space-y-6">

      <PageHeader
        title="My Profile"
        description="View and update your information."
      />

      <PageCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <InputField
            label="Full Name"
            type="text"
            value={user.fullName}
            onChange={(e) =>
              setUser({
                ...user,
                fullName: e.target.value,
              })
            }
          />

          <DetailField
  label="Email"
  value={user.email}
/>

          <InputField
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={user.phoneNumber}
            onChange={(e) =>
              setUser({
                ...user,
                phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
              })
            }
          />

          <DetailField
  label="Role"
  value={user.role}
/>

         {(user.role === "client") && (
  <div className="md:col-span-2">

    {/* Full Address */}
    <InputField
      label="Full Address"
      name="fullAddress"
      value={user.fullAddress}
      onChange={(e) =>
        setUser({
          ...user,
          fullAddress: e.target.value,
        })
      }
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

      {/* Company Name */}
      <InputField
        label="Company Name"
        name="companyName"
        value={user.companyName}
        onChange={(e) =>
          setUser({
            ...user,
            companyName: e.target.value,
          })
        }
      />

      {/* City */}
      <InputField
        label="City"
        name="city"
        value={user.city}
        onChange={(e) =>
          setUser({
            ...user,
            city: e.target.value,
          })
        }
      />

      {/* State */}
      <InputField
        label="State"
        name="state"
        value={user.state}
        onChange={(e) =>
          setUser({
            ...user,
            state: e.target.value,
          })
        }
      />

      {/* Pincode */}
      <InputField
        label="Pincode"
        name="pincode"
        value={user.pincode}
        onChange={(e) =>
          setUser({
            ...user,
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
  checked={user.isActive}
  onChange={()=> {
    toast.error("Account status can't be changed here.");
  }}
/>

<ToggleSwitch
  label="Temporarily Disable Account"
  checked={user.isDeleted}
  onChange={()=> {
    toast.error("Account can't be disabled here.");
  }}
/>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <SecondaryButton text="Cancel" onClick={() => navigate(-1)} />

        <PrimaryButton onClick={handleSubmit} text="Save Changes"/>

        </div>

      </PageCard>

    </div>
  );
}