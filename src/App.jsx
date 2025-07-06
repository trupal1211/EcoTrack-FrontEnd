import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";

import Layout from "./pages/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OAuthSuccess from "./pages/OauthSuccess";

import Home from "./pages/Home";
import ReportDetails from "./pages/ReportDetails";

import NgoDashboard from "./pages/NgoDashboard";
import AdminPanel from "./pages/AdminPanel";
import MyActivities from "./pages/MyActivities";
import NgoRegistration from "./pages/NgoRegister";
import Profile from "./pages/Profile";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContectUs";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
  {/* 👇 Wrap public + protected pages under Layout */}
  <Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    <Route path="/oauth/success" element={<OAuthSuccess />} />
    <Route path="/ngo-registration" element={<NgoRegistration />} />
    <Route path="/about" element={<AboutUs/>}></Route>
    <Route path="/contect" element={<ContactUs/>}></Route>


    {/* Public routes restricted for logged-in users */}
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
    <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

    {/* Authenticated users */}
    <Route element={<PrivateRoute />}>
      <Route path="/my-activities" element={<MyActivities />} />
      <Route path="/report/:reportId" element={<ReportDetails />} />
      <Route path="/profile" element={<Profile/>}></Route>
      <Route path="/profile/:userId" element={<Profile/>}></Route>

    </Route>

    {/* NGO-only */}
    <Route element={<PrivateRoute allowedRoles={["ngo", "admin"]} />}>
      <Route path="/ngo-dashboard" element={<NgoDashboard />} />
    </Route>

    {/* Admin-only */}
    <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
      <Route path="/admin-panel" element={<AdminPanel />} />
    </Route>

    {/* 404 */}
    <Route path="*" element={<div className="p-6 text-center text-gray-500">404 – Page Not Found</div>} />
  </Route>
</Routes>

    </>
  );
}

export default App;
