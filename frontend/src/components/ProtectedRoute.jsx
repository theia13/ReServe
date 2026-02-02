import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRole }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (user?.user?.user_type === allowedRole) {
    return <Outlet />;
  }

  return <Navigate to="/auth/login" replace />;
}
