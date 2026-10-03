import {
  CheckCircle2,
  Clock3,
  ListTodo,
  Ticket,
} from "lucide-react";

import StatsCard from "../../../components/app-layout/StatsCard";
import DashboardHero from "../../../components/dashboard/DashboardHero";
import TicketStatusChart from "../../../components/dashboard/TicketStatusChart";
import RecentTickets from "../../../components/dashboard/RecentTickets";
import RecentActivity from "../../../components/dashboard/RecentActivity";

export default function CustomerDashboard({ user }) {
  /*
   * Temporary values.
   * These will be replaced with real API data.
   *
   * Customers should only see their own tickets.
   */
  const stats = {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  };

  const recentTickets = [];
  const recentActivities = [];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <DashboardHero
        user={user}
        openTickets={stats.open + stats.inProgress}
      />

      {/* Overview */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            My Tickets
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Track the status of your support requests.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total Tickets"
            value={stats.total}
            icon={Ticket}
          />

          <StatsCard
            title="Open"
            value={stats.open}
            icon={ListTodo}
          />

          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={Clock3}
          />

          <StatsCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
          />
        </div>
      </section>

      {/* Status + Activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TicketStatusChart
          stats={{
            open: stats.open,
            inProgress: stats.inProgress,
            resolved: stats.resolved,
            closed: stats.closed,
          }}
        />

        <RecentActivity
          activities={recentActivities}
        />
      </div>

      {/* My Recent Tickets */}
      <RecentTickets
        tickets={recentTickets}
      />
    </div>
  );
}