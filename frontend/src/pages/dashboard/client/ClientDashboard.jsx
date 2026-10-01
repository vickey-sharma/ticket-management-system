import Sidebar from "../../../components/app-layout/Sidebar";
import StatsCard from "../../../components/app-layout/StatsCard";
import Topbar from "../../../components/app-layout/Topbar";

export default function ClientDashboard({ user }) {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* <Sidebar role={user.role} /> */}

      <div className="flex-1 p-0">
         {/* <Topbar user={user} /> */}

<div className="px-8  pt-8">

        <h1 className="text-3xl font-bold">
          Welcome back, {user.fullName}
        </h1>

        <p className="text-gray-500 mt-2">
          Track your support requests here.
        </p>

        <div className="grid grid-cols-3 gap-6 mt-8">
          <StatsCard title="Total Tickets" value="12" />
          <StatsCard title="Pending" value="4" />
          <StatsCard title="Resolved" value="8" />
        </div>

        <div className="bg-white mt-8 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">My Tickets</h2>

          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500">
                <th>Issue</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Password Reset</td>
                <td>Resolved</td>
                <td>02 July 2026</td>
              </tr>
            </tbody>
          </table>
        </div>

        
        </div>

      </div>
    </div>
  );
}