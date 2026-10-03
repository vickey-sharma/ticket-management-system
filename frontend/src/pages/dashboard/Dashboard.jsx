import AdminDashboard from "./admin/AdminDashboard";
import AgentDashboard from "./agent/AgentDashboard";
import CustomerDashboard from "./customer/CustomerDashboard";

import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const role = user.role?.trim().toLowerCase();

  if (role === "admin") {
    return <AdminDashboard user={user} />;
  }

  if (role === "agent") {
    return <AgentDashboard user={user} />;
  }

  if (role === "customer") {
    return <CustomerDashboard user={user} />;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-red-500">
        Invalid user role.
      </p>
    </div>
  );
}