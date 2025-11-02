// src/components/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ redirectPath = "/" }) => {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user || !token) {
    // Not logged in, redirect to login
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  // Logged in, show nested route
  return <Outlet />;
};

export default ProtectedRoute;
