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

export default function AgentDashboard({ user }) {
  // Temporary data.
  // These values will come from tickets assigned to the logged-in agent.
  const stats = {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  };

  const assignedTickets = [];

  return (
    <div className="space-y-6">
      <DashboardHero
        user={user}
        openTickets={stats.open + stats.inProgress}
        showCreateTicket={false}
      />

      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            My Assigned Tickets
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Overview of tickets currently assigned to you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Assigned Tickets"
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

      <TicketStatusChart
        stats={{
          open: stats.open,
          inProgress: stats.inProgress,
          resolved: stats.resolved,
          closed: stats.closed,
        }}
      />

      <RecentTickets tickets={assignedTickets} />
    </div>
  );
}