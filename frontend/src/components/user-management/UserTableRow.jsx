import StatusBadge from "../ui/StatusBadge";
import { Navigate, useNavigate } from "react-router-dom";

export default function UserTableRow({ user, index }) {

  const navigate = useNavigate();

    // console.log(user);
    // console.log(user.isActive);
  
    return (
    <tr   className={`
    border-b border-slate-100
    transition-colors
    hover:bg-slate-100
    ${index % 2 === 0 ? "bg-white" : "bg-slate-100/80"}
  `}>

      <td className="px-6 py-4 font-medium text-slate-800">
        {user.fullName}
      </td>

      <td className="px-6 py-4 text-slate-600">
        {user.email}
      </td>

      <td className="px-6 py-4">
        {user.role}
      </td>

      <td className="px-6 py-4">
        <StatusBadge isUserActive={user.isActive} />
      </td>

      <td className="px-6 py-4">

          <button
            onClick={() =>   navigate("/admin/dashboard/user-details", {
              state: { user },
            })}
            className="whitespace-nowrap rounded-lg border border-[#56BD05] px-2 py-2 text-sm font-medium text-[#56BD05] hover:bg-[#56BD05] hover:text-white transition">
            View Profile
        </button>

      </td>

    </tr>
  );
}