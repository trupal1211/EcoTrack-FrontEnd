import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // ✅ If user is logged in, redirect to /
  if (user) {
    return <Navigate to="/" replace />;
  }

  // ✅ If not logged in, allow them to visit the page (login/register)
  return children;
}
