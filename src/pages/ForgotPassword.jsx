import React, { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    try {
      setLoading(true);
      const res = await api.post("/auth/send-otp", { email });
      navigate('/reset-password')
      localStorage.setItem("emailForOtp",email)
      toast.success("OTP sent to your email 📩");
    } catch (err) {
      const msg = err?.response?.data?.message ||
                  err?.response?.data?.msg || 
                  err?.response?.data?.error ||
                  err?.message ||
                  "Failed to send OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 to-blue-100 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8 sm:p-10 mx-4 sm:mx-0 my-6 md:my-12 lg:my-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Forgot Password 🔒
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your email to receive an OTP
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md px-4 py-2 text-sm border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm transition"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-2 rounded-md font-medium transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 100 20v-4l-5 5 5 5v-4a8 8 0 01-8-8z" />
                </svg>
                Sending...
              </div>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <p onClick={() => navigate("/login")} className="text-sm text-center mt-6 text-gray-600 cursor-pointer">
          <span className="text-green-600 font-medium hover:underline">
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
}
