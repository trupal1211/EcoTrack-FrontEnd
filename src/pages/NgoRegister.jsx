import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function NGORegistration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        city: "",
        registrationNumber: "",
        mobileNumber: "",
        message: "",
        logo: null,
    });
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateMobile = (mobile) =>
        /^[6-9]\d{9}$/.test(mobile);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
            setLogoPreview(URL.createObjectURL(files[0]));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            return toast.error("Enter a valid email");
        }

        if (!validateMobile(formData.mobileNumber)) {
            return toast.error("Enter a valid 10-digit mobile number");
        }

        if (!formData.logo) {
            return toast.error("Please upload a logo image");
        }

        try {
            setLoading(true);
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });

            const res = await api.post("/auth/request-ngo", data);
            toast.success(res.data.msg || "NGO Request submitted successfully");
            navigate("/");
        } catch (err) {
            const msg = err?.response?.data?.message ||
                  err?.response?.data?.msg || 
                  err?.response?.data?.error ||
                  err?.message || "Submission failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-green-100 to-blue-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8 sm:p-10">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    NGO Registration Request 📝
                </h2>
                <p className="text-sm text-center text-gray-500 mb-6">
                    Submit your NGO details for verification
                </p>

                <div className="text-xs text-gray-600 mt-2 mb-6 border-t pt-4 space-y-2">
                    <p className="font-semibold text-gray-800 mb-1">📌 Note:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Your request will be reviewed by our admin team.</li>
                        <li>You’ll receive an email on approval or rejection.</li>
                        <li>Once approved, login using Google OAuth.</li>
                        <li className="text-red-700">Make sure details are correct — they can't be changed later.</li>
                        <li>NGOs can take and resolve environmental reports.</li>
                    </ul>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            NGO Logo <span className="text-red-500">*</span>
                        </label>

                        <div className="relative w-24 h-24">
                            {/* Circular Preview */}
                            <img
                                src={
                                    logoPreview ||
                                    "https://cdn-icons-png.flaticon.com/512/149/149071.png" // fallback default avatar
                                }
                                alt="Logo Preview"
                                className="w-24 h-24 rounded-full object-cover border shadow-sm"
                            />

                            {/* Camera Overlay */}
                            <label
                                htmlFor="logo"
                                className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 cursor-pointer shadow-sm hover:bg-gray-100 transition"
                                title="Change Logo"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 10l4.553 4.553A1.5 1.5 0 0118.553 17H5.447a1.5 1.5 0 01-1.06-2.553L9 10m6 0V7a3 3 0 00-6 0v3m6 0a3 3 0 01-6 0"
                                    />
                                </svg>
                            </label>

                            {/* Hidden Input */}
                            <input
                                type="file"
                                id="logo"
                                name="logo"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                                required
                            />
                        </div>

                        {/* Optional file name text */}
                        {formData.logo && (
                            <p className="text-xs mt-2 text-gray-500">{formData.logo.name}</p>
                        )}
                    </div>



                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="NGO Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md text-sm"
                    />

                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="Official Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md text-sm"
                    />

                    <input
                        type="text"
                        name="city"
                        required
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md text-sm"
                    />

                    <input
                        type="text"
                        name="registrationNumber"
                        required
                        placeholder="Registration Number"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md text-sm"
                    />

                    <input
                        type="tel"
                        name="mobileNumber"
                        required
                        placeholder="Mobile Number"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md text-sm"
                    />

                    <textarea
                        name="message"
                        rows={3}
                        placeholder="Message (Intent or Purpose)"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md text-sm"
                    ></textarea>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-green-600 text-white py-2 rounded-md font-medium transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
                            }`}
                    >
                        {loading ? "Submitting..." : "Submit Request"}
                    </button>

                    <button
                        type="button"
                        onClick={()=>navigate(-1)}
                        className="w-full bg-white text-green-600 py-2 rounded-md border border-green-600 font-medium transition duration-200 hover:bg-green-50"
                    >
                       Cancle
                    </button>
                </form>

            </div>
        </div>
    );
}
