import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Dashboard from "./pages/dashboard/Dashboard";
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