
import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AppLayout from "./layouts/AppLayout";


//AUTH PAGES
import LoginAndActivatePage from "./pages/auth/LoginAndActivatePage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyOTPPage from "./pages/auth/VerifyOTPPage";
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import ResetPasswordPage from './pages/auth/UpdatePasswordPage';


//PARENT DASHBOARD
import Dashboard from './pages/dashboard/Dashboard';

// CLIENT PAGES
// import ClientDashboard from "./pages/client/ClientDashboardPage";
// import ClientDashboardPageTesting from './pages/client/ClientDashboardPage';
import ClientWarrantyVerificationPage from './pages/warranty-verification/client/ClientWarrantyVerificationPage';
import { CreateTicketPage as CreateTicketPageByClient } from './pages/ticket-management/client/CreateTicketPage';
import { TicketsPage as ClientTicketsPage } from "./pages/ticket-management/client/TicketsPage";
// ADMIN PAGES
import UserPage from "./pages/user-management/UserPage";
import UseDetailsPage from './pages/user-management/UseDetailsPage';
import CreateUserPage from './pages/user-management/CreateUserPage';

import RegisterProductPage from "./pages/product-management/admin/RegisterProductPage";
import RegisteredProductsPage from "./pages/product-management/admin/RegisteredProductsPage";
import RegisteredProductDetailsPage from "./pages/product-management/admin/RegisteredProductDetailsPage";
import EditRegisteredProductPage from "./pages/product-management/admin/EditRegisteredProductPage";
import AddRegisteredProductServicePage from "./pages/product-management/admin/AddRegisteredProductServicePage";
import AdminWarrantyVerificationPage from './pages/warranty-verification/admin/AdminWarrantyVerificationPage';
import BulkRegisterProductsPage from './pages/product-management/admin/BulkRegisterProductsPage';
import { CreateTicketPage as CreateTicketPageByAdmin } from './pages/ticket-management/admin/CreateTicketPage';
import { TicketsPage as AdminTicketsPage } from './pages/ticket-management/admin/TicketsPage';


//COMMON PAGES
import ChangePasswordPage from './pages/common-pages/ChangePasswordPage';
import ProfileDetailsPage from './pages/common-pages/ProfilePage';
import UpdatePasswordPage from './pages/auth/UpdatePasswordPage';


//  PUBLIC
import PublicLayout from "./layouts/PublicLayout";
import PublicWarrantyVerificationPage from "./pages/warranty-verification/public/PublicWarrantyVerificationPage";



function App() {


  return (
    <>
      <Toaster position="top-right" />

      <Routes>

        {/* default route */}
        <Route path="/" element={<Navigate to="/auth/login-activate" />} />

        {/* auth pages */}
        <Route path="/auth/login-activate" element={<LoginAndActivatePage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/update-password" element={<UpdatePasswordPage />} />

        {/* <Route path="/warranty-check" element={<PublicWarrantyVerificationPage />} /> */}
        <Route element={<PublicLayout />}>
  <Route path="/warranty-check" element={<PublicWarrantyVerificationPage />}  /> </Route>


        {/* Client Routes */}
        <Route path="/client/dashboard" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          {/* <Route path="testing" element={<ClientDashboardPageTesting />} /> */}
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="profile-details" element={<ProfileDetailsPage />} />
          <Route path="warranty-check" element={<ClientWarrantyVerificationPage />} />

                   {/* Ticket Management */}
<Route path="ticket/create" element={<CreateTicketPageByClient />} />
<Route path="all-tickets" element={<ClientTicketsPage />} />
        </Route>



        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AppLayout />}>

          <Route index element={<Dashboard />} />

          <Route path="change-password" element={<ChangePasswordPage />} />

          <Route path="users" element={<UserPage />} />
          <Route path="user-details" element={<UseDetailsPage />} />
          <Route path="create-user" element={<CreateUserPage />} />
          <Route path="profile-details" element={<ProfileDetailsPage />} />


          {/* <Route path="registered-products/create" element={<RegisterProductPage />} /> */}

          {/* // Registered Products */}
          <Route path="registered-products"  element={<RegisteredProductsPage />} />

          <Route path="registered-products/create" element={<RegisterProductPage />} />

          <Route path="registered-products/bulk-upload" element={<BulkRegisterProductsPage />} />

          <Route path="registered-products/:serialNumber" element={<RegisteredProductDetailsPage />} />

          <Route path="registered-products/:serialNumber/edit" element={<EditRegisteredProductPage />} />

          <Route path="registered-products/:serialNumber/services" element={<AddRegisteredProductServicePage />}  />

          <Route path="warranty-check" element={<AdminWarrantyVerificationPage />} />
          

          {/* Ticket Management */}
<Route path="ticket/create" element={<CreateTicketPageByAdmin />} />
<Route path="all-tickets" element={<AdminTicketsPage />} />
        </Route>


      </Routes>
    </>
  )
}

export default App

