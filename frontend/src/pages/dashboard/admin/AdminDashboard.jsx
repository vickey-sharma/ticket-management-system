import Sidebar from "../../../components/app-layout/Sidebar";
import StatsCard from "../../../components/app-layout/StatsCard";
import Topbar from "../../../components/app-layout/Topbar";

export default function AdminDashboard({ user }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* <Sidebar role={user.role} /> */}

      <div className="flex-1">
         {/* <Topbar user={user} /> */}
         
         <div className="px-8  pt-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Welcome back, {user.fullName}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your CRM Helpdesk efficiently.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Total Clients" value="5423" />
          <StatsCard title="Open Tickets" value="128" />
          <StatsCard title="Engineers" value="15" />
          <StatsCard title="Resolved" value="984" />
        </div>

        {/* Recent Tickets */}
        <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Tickets
            </h2>

            <button className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Issue</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Priority</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-3 text-slate-800">John Doe</td>
                  <td className="py-3 text-slate-700">Login issue</td>

                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  </td>

                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                      High
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3 text-slate-800">Sarah Lee</td>
                  <td className="py-3 text-slate-700">Payment failed</td>

                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      Resolved
                    </span>
                  </td>

                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                      Medium
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

</div>

      </div>
    </div>
  );
}

