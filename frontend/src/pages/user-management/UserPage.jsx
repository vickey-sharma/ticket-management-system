 import { useState, useEffect } from "react";
import PageHeader from "../../components/page-layout/PageHeader";
import PageCard from "../../components/auth/PageCard";
import SearchBar from "../../components/ui/SearchBar";
import FilterDropdown from "../../components/ui/FilterDropdown";
import DataTable from "../../components/table/DataTable";
import UserTableRow from "../../components/user-management/UserTableRow";
import { getUsers } from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import { User } from 'lucide-react'
import { useNavigate } from "react-router-dom";

export default function UsersPage() {

const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


const [search, setSearch] = useState("");
const [role, setRole] = useState("allRoles");
const [status, setStatus] = useState("all");

const { user, loading: authLoading } = useAuth();

if (authLoading) {
  return <div>Loading...</div>;
}

const roleOptions = {
  superadmin: [
    { value: "allRoles", label: "All Roles" },
    { value: "superadmin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "engineer", label: "Engineer" },
    { value: "l1_engineer", label: "L1 Engineer" },
    { value: "client", label: "Client" },
     { label: "Sales Manager", value: "sales_manager" },
      { label: "Inventory Manager", value: "inventory_manager" },
      { label: "Vendor", value: "vendor" },
  ],

  admin: [
    { value: "allRoles", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "engineer", label: "Engineer" },
    { value: "l1_engineer", label: "L1 Engineer" },
    { value: "client", label: "Client" },
     { label: "Sales Manager", value: "sales_manager" },
      { label: "Inventory Manager", value: "inventory_manager" },
      { label: "Vendor", value: "vendor" },
  ],

  engineer: [
    { value: "allRoles", label: "All Roles" },
    { value: "client", label: "Client" },
  ],

  l1_engineer: [
    { value: "allRoles", label: "All Roles" },
    { value: "client", label: "Client" },
  ],
   sales_manager: [
      { label: "Select Role", value: "" },
      { label: "Client", value: "client" },
    ],
};

useEffect(()=> {
  fetchUsers();
}, []);




const fetchUsers = async()=> {
  try {
    const response = await getUsers();

    //  console.log(response)
    setUsers(response.data.data.users);

  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false)
  }
}

const filteredUsers = users.filter((user) => {

    const matchesSearch =
    user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase());


  // Role filter
  const matchesRole =
    role === "allRoles" || user.role === role;

  // Status filter
  const matchesStatus =
    status === "all" ||
    (status === "active" && user.isActive) ||
    (status === "inactive" && !user.isActive);

  return matchesSearch && matchesRole && matchesStatus;
});


if (loading) {
  return (
    <div className="text-center py-10">
      Loading users...
    </div>
  );
}

  return (
    <div className="space-y-6">

     <PageHeader
  title="Users"
  description="Manage user accounts, roles and account status."
>
  {/* <button className="rounded-xl bg-[#56BD05] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#4CA504]">
    <User /> Create User
  </button> */}
  <button className="flex items-center gap-2 rounded-xl bg-[#56BD05] px-3 py-3 text-sm font-medium text-white transition hover:bg-[#4CA504]"
  onClick={() => navigate("/admin/dashboard/create-user")}>
  <User className="h-4 w-4" />
  <span>Create User</span>
</button>

</PageHeader>

<PageCard>

  <div className="flex flex-col gap-4 md:flex-row">

    <div className="flex-1">
      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
      />
    </div>

    <FilterDropdown
      value={role}
     onChange={(value) => setRole(value)}
  options={roleOptions[user?.role] || []}
  className="w-50"
    />

    <FilterDropdown
      value={status}
       onChange={(value) => setStatus(value)}
      options={[
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]}
      className="w-50"
    />

  </div>

  <DataTable
  columns={[
    "Name",
    "Email",
    "Role",
    "Status",
    "Action",
  ]}
>
{filteredUsers.map((user, index) => (
  <UserTableRow
    key={user._id}
    user={user}
    index={index}
    
  />
))}
</DataTable>


</PageCard>

    </div>
  );
}