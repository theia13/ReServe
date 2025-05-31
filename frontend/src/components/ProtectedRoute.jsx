import { Navigate, Outlet } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

export default function ProtectedRoute({ allowedRole }) {
  // const [isAuthenticated, setIsAuthenticated] = useState(
  //   !!localStorage.getItem(ACCESS_TOKEN)
  // );

  const [isAllowed, setIsAllowed] = useState(null);

  // useEffect(() => {
  //   const checkAuth = () => {
  //     console.log("Checking authentication status...");
  //     setIsAuthenticated(!!localStorage.getItem(ACCESS_TOKEN));
  //   };

  useEffect(() => {
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    const role = sessionStorage.getItem("role");

    const isAuthenticated = !!token;
    const isAuthorized = isAuthenticated && role === allowedRole;

    setIsAllowed(isAuthorized);
  }, [allowedRole]);

  if (isAllowed === null) return null;

  return isAllowed ? <Outlet /> : <Navigate to="/auth/login" replace />;
}

// window.addEventListener("storage", checkAuth);

// const token = localStorage.getItem(ACCESS_TOKEN);
// console.log("Protected Route Check: Token found?", !!token);

//     return () => window.removeEventListener("storage", checkAuth);
//   }, []);
//   if (isAuthenticated === null) return null;

//   return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
// }
