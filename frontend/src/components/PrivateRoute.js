import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = adminOnly ? localStorage.getItem('adminToken') : localStorage.getItem('token');
  const user = adminOnly ? JSON.parse(localStorage.getItem('adminUser')) : JSON.parse(localStorage.getItem('user'));

  if (!token) {
    return <Navigate to={adminOnly ? "/admin/login" : "/login"} />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default PrivateRoute; 