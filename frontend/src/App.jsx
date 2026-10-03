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

          <Route
            path="/dashboard/users"
            element={<UsersPage />}
          /> 

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