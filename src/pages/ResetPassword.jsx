import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../services/api"; // Axios instance
import { Navigate, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmNewPassword: false,
  });

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0); // for countdown

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { otp, newPassword, confirmNewPassword } = formData;

    if (!otp || !newPassword || !confirmNewPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

const passwordRegex = /^[A-Za-z\d@$!%*?&]{8}$/;

    if (!passwordRegex.test(newPassword)) {
      toast.error("Password must be 8 characters with letter, number, and special symbol");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/reset-password", {
        email: localStorage.getItem("emailForOtp"),
        otp,
        newPassword,
      });
      toast.success(res.data.message || "Password reset successful!");
      navigate("/login")
    } catch (err) {
      const errorMsg =  err?.response?.data?.message ||
                  err?.response?.data?.msg || 
                  err?.response?.data?.error ||
                  err?.message ||
                  "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const email = localStorage.getItem("emailForOtp");
    if (!email) {
      toast.error("Email not found. Please go back and enter your email.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/send-otp", { email });
      toast.success(res.data.message || "OTP sent again!");
      setResendTimer(30); // Start 30 sec countdown
    } catch (err) {
      const errorMsg =  err?.response?.data?.message ||
                        err?.response?.data?.msg || 
                        err?.response?.data?.error ||
                        err?.message ||
                        "Failed to resend OTP";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 to-blue-100 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8 sm:p-10 mx-4 sm:mx-0 my-6 md:my-12 lg:my-5">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Reset Password 🔁
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter the OTP sent to your email and set your new password
        </p>

        <form onSubmit={handleSubmit}>
          {/* OTP Field */}
          <div className="mb-6">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
              className="w-full rounded-md px-4 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-500 shadow-sm transition"
              placeholder="Enter 6-digit OTP"
            />
          </div>

          {/* New Password */}
          <div className="mb-6 relative">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.newPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full rounded-md px-4 py-2 pr-10 text-sm border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-500 shadow-sm transition"
                placeholder="New password"
              />
            <span
  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
  onClick={() => toggleVisibility("newPassword")}
>
  {showPassword.newPassword ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
      <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
    </svg>
  )}
</span>

            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-8 relative">
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirmNewPassword ? "text" : "password"}
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                required
                className="w-full rounded-md px-4 py-2 pr-10 text-sm border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-500 shadow-sm transition"
                placeholder="Confirm password"
              />
              <span
  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
  onClick={() => toggleVisibility("confirmNewPassword")}
>
  {showPassword.confirmNewPassword ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
      <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
    </svg>
  )}
</span>

            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 ${
              loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            } text-white py-2 rounded-md font-medium transition`}
            style={{ minHeight: "42px" }}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            ) : (
              "Reset Password"
            )}
          </button>

          {/* Resend OTP */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Didn't receive the OTP?{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendTimer > 0 || loading}
                className={`${
                  resendTimer > 0 || loading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-green-600 hover:underline font-medium"
                }`}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
