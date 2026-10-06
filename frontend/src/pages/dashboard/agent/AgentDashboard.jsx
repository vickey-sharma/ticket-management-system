import { useEffect, useState } from "react";
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

import { getAgentTickets } from "../../../services/ticketService";

export default function AgentDashboard({ user }) {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });

  useEffect(() => {
    const fetchAgentTicketStats = async () => {
      try {
        const [
          openResponse,
          inProgressResponse,
          resolvedResponse,
          closedResponse,
        ] = await Promise.all([
          getAgentTickets({
            status: "open",
            page: 1,
            limit: 1,
          }),
          getAgentTickets({
            status: "in_progress",
            page: 1,
            limit: 1,
          }),
          getAgentTickets({
            status: "resolved",
            page: 1,
            limit: 1,
          }),
          getAgentTickets({
            status: "closed",
            page: 1,
            limit: 1,
          }),
        ]);

        const open =
          openResponse?.data?.data?.pagination?.totalTickets || 0;

        const inProgress =
          inProgressResponse?.data?.data?.pagination?.totalTickets || 0;

        const resolved =
          resolvedResponse?.data?.data?.pagination?.totalTickets || 0;

        const closed =
          closedResponse?.data?.data?.pagination?.totalTickets || 0;

        setStats({
          total: open + inProgress + resolved + closed,
          open,
          inProgress,
          resolved,
          closed,
        });
      } catch (error) {
        setStats({
          total: 0,
          open: 0,
          inProgress: 0,
          resolved: 0,
          closed: 0,
        });
      }
    };

    fetchAgentTicketStats();
  }, []);

  

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

      <RecentTickets user={user} />
    </div>
  );
}