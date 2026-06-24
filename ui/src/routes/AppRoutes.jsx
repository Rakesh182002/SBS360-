import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { Loader } from '../components/ReusableComponents';

// Lazy load layouts & page components for optimization (code splitting)
const DashboardLayout = React.lazy(() => import('../layouts/Layout'));
const Login = React.lazy(() => import('../pages/Login'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Profile = React.lazy(() => import('../pages/Profile'));

// Employee Sub-Pages
const EmployeeList = React.lazy(() => import('../pages/ERP Master/employee/EmployeeList'));
const EmployeeDetails = React.lazy(() => import('../pages/ERP Master/employee/EmployeeDetails'));

// Client Sub-Pages
const ClientList = React.lazy(() => import('../pages/ERP Master/client/ClientList'));
const ClientDetails = React.lazy(() => import('../pages/ERP Master/client/ClientDetails'));

// Supplier Sub-Pages
const SupplierList = React.lazy(() => import('../pages/ERP Master/supplier/SupplierList'));
const SupplierDetails = React.lazy(() => import('../pages/ERP Master/supplier/SupplierDetails'));

const Product = React.lazy(() => import('../pages/ERP Master/product/Product'));
const VehicleList = React.lazy(() => import('../pages/ERP Master/vehicle/VehicleList'));
const VehicleDetails = React.lazy(() => import('../pages/ERP Master/vehicle/VehicleDetails'));
const Unauthorized = React.lazy(() => import('../pages/Unauthorized'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader open={true} />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Dashboard Shell Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Employee Pages */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute requiredPermission="read:users">
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/view/:id"
            element={
              <ProtectedRoute requiredPermission="read:users">
                <EmployeeDetails />
              </ProtectedRoute>
            }
          />
          
          {/* Client Pages */}
          <Route
            path="/client"
            element={
              <ProtectedRoute requiredPermission="read:users">
                <ClientList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/view/:id"
            element={
              <ProtectedRoute requiredPermission="read:users">
                <ClientDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product"
            element={
              <ProtectedRoute requiredPermission="read:users">
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier"
            element={
              <ProtectedRoute requiredPermission="read:users">
                <SupplierList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/view/:id"
            element={
              <ProtectedRoute requiredPermission="read:users">
                <SupplierDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicle"
            element={
              <ProtectedRoute requiredPermission="read:users">
                <VehicleList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicle/view/:id"
            element={
              <ProtectedRoute requiredPermission="read:users">
                <VehicleDetails />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch All 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

