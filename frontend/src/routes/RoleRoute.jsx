import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RoleRoute = ({ allowedRoles }) => {
  const { role, loading } = useContext(AuthContext);
  
  if (loading) return <LoadingSpinner fullScreen />;

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (roles.includes(role)) {
    return <Outlet />;
  }

  // Redirect based on user's actual role if they try to access unauthorized path
  if (role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
  if (role === 'patient') return <Navigate to="/patient/dashboard" replace />;
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'receptionist') return <Navigate to="/receptionist/dashboard" replace />;
  
  return <Navigate to="/" replace />;
};

export default RoleRoute;
