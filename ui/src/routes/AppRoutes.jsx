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

const ProductList = React.lazy(() => import('../pages/ERP Master/product/ProductList'));
const ProductDetails = React.lazy(() => import('../pages/ERP Master/product/ProductDetails'));
const VehicleList = React.lazy(() => import('../pages/ERP Master/vehicle/VehicleList'));
const VehicleDetails = React.lazy(() => import('../pages/ERP Master/vehicle/VehicleDetails'));

// Material Management Sub-Pages
const StoreList = React.lazy(() => import('../pages/Material Mgmt Transaction/Store/StoreList'));
const InwardList = React.lazy(() => import('../pages/Material Mgmt Transaction/Inward/InwardList'));
const InwardDetails = React.lazy(() => import('../pages/Material Mgmt Transaction/Inward/InwardDetails'));
const OutwardList = React.lazy(() => import('../pages/Material Mgmt Transaction/Outward/OutwardList'));
const OutwardDetails = React.lazy(() => import('../pages/Material Mgmt Transaction/Outward/OutwardDetails'));
const StockList = React.lazy(() => import('../pages/Material Mgmt Transaction/Stock/StockList'));
const StockTakingList = React.lazy(() => import('../pages/Material Mgmt Transaction/Stock Taking/StockTakingList'));
const StockTakingDetails = React.lazy(() => import('../pages/Material Mgmt Transaction/Stock Taking/StockTakingDetails'));

// Safety Management Sub-Pages
const DttrList = React.lazy(() => import('../pages/Safety/DTTR/DttrList'));
const DttrDetails = React.lazy(() => import('../pages/Safety/DTTR/DttrDetails'));
const SafetyInspectionList = React.lazy(() => import('../pages/Safety/Safety Inspection/SafetyInspectionList'));
const SafetyInspectionDetails = React.lazy(() => import('../pages/Safety/Safety Inspection/SafetyInspectionDetails'));
const SafetyInspectionNewList = React.lazy(() => import('../pages/Safety/Safety Inspection New/SafetyInspectionNewList'));
const SafetyInspectionNewDetails = React.lazy(() => import('../pages/Safety/Safety Inspection New/SafetyInspectionNewDetails'));
const PtwList = React.lazy(() => import('../pages/Safety/PTW/PtwList'));
const PtwDetails = React.lazy(() => import('../pages/Safety/PTW/PtwDetails'));

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
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/view/:id"
            element={
              <ProtectedRoute requiredPermission="read:users">
                <ProductDetails />
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

          {/* Material Management Routes */}
          <Route
            path="/store"
            element={
              <ProtectedRoute requiredPermission="read:store">
                <StoreList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inward"
            element={
              <ProtectedRoute requiredPermission="read:Inward">
                <InwardList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inward/view/:id"
            element={
              <ProtectedRoute requiredPermission="read:Inward">
                <InwardDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outward"
            element={
              <ProtectedRoute requiredPermission="read:Outward">
                <OutwardList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outward/view/:id"
            element={
              <ProtectedRoute requiredPermission="read:Outward">
                <OutwardDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock"
            element={
              <ProtectedRoute requiredPermission="read:stock">
                <StockList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stocktaking"
            element={
              <ProtectedRoute requiredPermission="read:stocktaking">
                <StockTakingList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stocktaking/view/:id"
            element={
              <ProtectedRoute requiredPermission="read:stocktaking">
                <StockTakingDetails />
              </ProtectedRoute>
            }
          />

          {/* Safety Management Routes */}
          <Route
            path="/dttr"
            element={
              <ProtectedRoute requiredPermission="read:dttr">
                <DttrList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dttr/view/:id"
            element={
              <ProtectedRoute requiredPermission="read:dttr">
                <DttrDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/safetyinspection"
            element={
              <ProtectedRoute requiredPermission="read:safetyinspection">
                <SafetyInspectionList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/safetyinspection/view/:id"
            element={
              <ProtectedRoute requiredPermission="read:safetyinspection">
                <SafetyInspectionDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/safetyinspectionnew"
            element={
              <ProtectedRoute requiredPermission="read:safetyinspectionnew">
                <SafetyInspectionNewList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/safetyinspectionnew/view/:id"
            element={
              <ProtectedRoute requiredPermission="read:safetyinspectionnew">
                <SafetyInspectionNewDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ptw"
            element={
              <ProtectedRoute requiredPermission="read:ptw">
                <PtwList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ptw/view/:id"
            element={
              <ProtectedRoute requiredPermission="read:ptw">
                <PtwDetails />
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

