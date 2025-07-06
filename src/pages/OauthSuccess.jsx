import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function OAuthSuccess() {
  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      await fetchUser();
      navigate("/");
    };

    getUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 md:p-12 max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <svg
            className="animate-spin h-10 w-10 text-green-500"
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
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Signing you in...</h2>
        <p className="text-gray-600 text-sm">
          Just a moment! We’re fetching your account details and redirecting you
          to EcoTrack.
        </p>
      </div>
    </div>
  );
}
