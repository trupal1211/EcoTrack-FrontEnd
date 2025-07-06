import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth();

//   if (loading) return <div>Loading...</div>;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // If allowedRoles are defined, check access
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
