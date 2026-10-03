
import {
  LayoutDashboard,
  Ticket,
  Users,
  User,
  LockKeyhole,
  PlusCircle,
} from "lucide-react";

export const sidebarConfig = {
  customer: [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Create Ticket",
      path: "/dashboard/tickets/create",
      icon: PlusCircle,
    },
    {
      name: "My Tickets",
      path: "/dashboard/tickets",
      icon: Ticket,
    },
    {
      name: "My Profile",
      path: "/dashboard/profile",
      icon: User,
    },
    {
      name: "Change Password",
      path: "/dashboard/change-password",
      icon: LockKeyhole,
    },
  ],

  agent: [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Assigned Tickets",
      path: "/dashboard/tickets",
      icon: Ticket,
    },
    {
      name: "My Profile",
      path: "/dashboard/profile",
      icon: User,
    },
    {
      name: "Change Password",
      path: "/dashboard/change-password",
      icon: LockKeyhole,
    },
  ],

  admin: [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "All Tickets",
      path: "/dashboard/tickets",
      icon: Ticket,
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: Users,
    },
    {
      name: "My Profile",
      path: "/dashboard/profile",
      icon: User,
    },
    {
      name: "Change Password",
      path: "/dashboard/change-password",
      icon: LockKeyhole,
    },
  ],
};
