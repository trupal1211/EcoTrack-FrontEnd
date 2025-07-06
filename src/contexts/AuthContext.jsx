import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();

// 🪝 Hook for accessing Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // holds logged-in user
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔄 Fetch current user
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/me", { withCredentials: true }); // ensure cookies are sent
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null); // Unauthenticated
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true }); // call logout API
      setUser(null); // Clear user from state
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    }
  };

  // 🔁 On mount, check if user is logged in
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {loading ? (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 to-blue-100">
    <div className="flex flex-col items-center space-y-4">
      <svg
        className="animate-spin h-10 w-10 text-green-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 100 16v-4l4 4-4 4v-4a8 8 0 01-8-8z"
        />
      </svg>
      <p className="text-gray-700 text-sm font-medium">
        Please wait while we prepare your experience...
      </p>
    </div>
  </div>
) : (
  children
)}

    </AuthContext.Provider>
  );
};
