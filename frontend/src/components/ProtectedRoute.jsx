import { Navigate, Outlet } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem(ACCESS_TOKEN)
  );

  useEffect(() => {
    const checkAuth = () => {
      console.log("Checking authentication status...");
      setIsAuthenticated(!!localStorage.getItem(ACCESS_TOKEN));
    };

    window.addEventListener("storage", checkAuth);

    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log("Protected Route Check: Token found?", !!token);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);
  if (isAuthenticated === null) return null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
