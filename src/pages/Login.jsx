import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import {useAuth} from "../contexts/AuthContext"

export default function Login() {
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const navigate = useNavigate();
  const {fetchUser}=useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", formData, { withCredentials: true });
      await fetchUser();
      toast.success("Login successful 🎉");
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message ||
                  err?.response?.data?.msg || 
                  err?.response?.data?.error ||
                  err?.message ||
                  "Login failed";
      toast.error(msg);
      console.error("Login error:", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://ecotrack-2yax.onrender.com/api/oauth/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 to-blue-100 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8 sm:p-10 mx-4 sm:mx-0">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Please login to your account
        </p>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md px-4 py-2 text-sm border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm transition"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-md px-4 py-2 pr-10 text-sm border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm transition"
                placeholder="••••••••"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <i className="bi bi-eye-slash-fill text-lg"></i>
                ) : (
                  <i className="bi bi-eye-fill text-lg"></i>
                )}
              </span>
            </div>
          </div>

          {/* Forgot password */}
          <div onClick={() => navigate("/forgot-password")} className="flex justify-end text-sm mb-6">
            <span className="text-green-600 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-2 rounded-md font-medium transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 100 20v-4l-5 5 5 5v-4a8 8 0 01-8-8z" />
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500">OR</span>
          </div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">Continue with Google</span>
        </button>

        {/* Register Link */}
        <p className="text-sm text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")} className="text-green-600 font-medium hover:underline cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
