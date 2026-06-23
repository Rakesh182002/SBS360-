import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Route protection wrapper based on session status and optional RBAC permissions
 */
export default function ProtectedRoute({ children, requiredPermission }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page but store the intended target page in history
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific permission is required, check if user matches it
  if (requiredPermission) {
    const isSuperAdmin = user?.role === 'Super Admin';
    const hasPermission = user?.permissions && user.permissions.includes(requiredPermission);
    
    if (!isSuperAdmin && !hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
