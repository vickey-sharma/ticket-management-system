import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import Dashboard from "./pages/dashboard/Dashboard";
import UsersPage from "./pages/user-management/UserPage";

import ChangePasswordPage from "./pages/common-pages/ChangePasswordPage";
import ProfilePage from "./pages/common-pages/ProfilePage";

import AppLayout from "./layouts/AppLayout";

import AdminCreateTicketPage from "./pages/ticket-management/admin/AdminCreateTicketPage";
import AdminTicketsPage from "./pages/ticket-management/admin/AdminTicketPage";
// import AdminTicketDetailsPage from "./pages/ticket-management/admin/AdminTicketDetailsPage";

import AgentTicketsPage from "./pages/ticket-management/agent/AgentTicketPage";
// import AgentTicketDetailsPage from "./pages/ticket-management/agent/AgentTicketDetailsPage";

import CustomerCreateTicketPage from "./pages/ticket-management/customer/CustomerCreateTicketPage";
import CustomerTicketsPage from "./pages/ticket-management/customer/CustomerTicketPage";
// import CustomerTicketDetailsPage from "./pages/ticket-management/customer/CustomerTicketDetailsPage";

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={<Navigate to="/auth/login" replace />}
        />

        <Route
          path="/auth/login"
          element={<LoginPage />}
        />

        <Route
          path="/auth/register"
          element={<RegisterPage />}
        />

        {/* Protected application layout */}
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Admin ticket routes */}
       <Route
  path="/dashboard/tickets/admin"
  element={<AdminTicketsPage />}
/>

<Route
  path="/dashboard/tickets/admin/create"
  element={<AdminCreateTicketPage />}
/>

          {/* <Route
            path="/dashboard/admin/tickets/:ticketId"
            element={<AdminTicketDetailsPage />}
          /> */}

          {/* Agent ticket routes */}
        <Route
  path="/dashboard/tickets/agent"
  element={<AgentTicketsPage />}
/>

          {/* <Route
            path="/dashboard/agent/tickets/:ticketId"
            element={<AgentTicketDetailsPage />}
          /> */}

          {/* Customer ticket routes */}
        <Route
  path="/dashboard/tickets/customer"
  element={<CustomerTicketsPage />}
/>

<Route
  path="/dashboard/tickets/customer/create"
  element={<CustomerCreateTicketPage />}
/>

{/* 
          <Route
            path="/dashboard/customer/tickets/:ticketId"
            element={<CustomerTicketDetailsPage />}
          /> */}

          {/* User management */}
          <Route
            path="/dashboard/users"
            element={<UsersPage />}
          />

          {/* Common pages */}
          <Route
            path="/dashboard/profile"
            element={<ProfilePage />}
          />

          <Route
            path="/dashboard/change-password"
            element={<ChangePasswordPage />}
          />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/auth/login" replace />}
        />
      </Routes>
    </>
  );
}

export default App;