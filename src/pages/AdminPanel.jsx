import { useEffect, useState } from "react";
import api from "../services/api";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("ngos");
  const [users, setUsers] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, action: null, id: null });
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "ngos") fetchNGOs();
    else if (activeTab === "users") fetchUsers();
    else if (activeTab === "requests") fetchRequests();
  }, [activeTab]);

  useEffect(() => {
  fetchAllData(); // fetch all 3 lists initially
}, []);

const fetchAllData = () => {
  fetchNGOs();
  fetchUsers();
  fetchRequests();
};


  const fetchUsers = async () => {
  setLoading(true);
  try {
    const res = await api.get("/admin/users");
    const data = Array.isArray(res.data) ? res.data : res.data.users || [];
    setUsers(data);
  } catch (err) {
    toast.error(err.response?.data?.msg || "Error loading users");
  }
  setLoading(false);
};


  const fetchNGOs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/ngos");
      const data = Array.isArray(res.data) ? res.data : res.data.ngos || [];
      setNgos(data);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error loading NGOs");
    }
    setLoading(false);
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/ngo-requests");
      const data = Array.isArray(res.data) ? res.data : res.data.requests || [];
      setRequests(data);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error loading requests");
    }
    setLoading(false);
  };

  const confirmAction = async () => {
    const { action, id } = modal;
    setButtonLoading(true);
    try {
      let res;
      if (action === "deleteUser") {
        res = await api.delete(`/admin/users/${id}`);
        fetchUsers();
      } else if (action === "removeNgoRole") {
        res = await api.put(`/admin/remove-ngo-role/${id}`);
        fetchNGOs();
      } else if (action.includes("request")) {
        const reqAction = action.split(":")[1];
        res = await api.put(`/admin/ngo-request/${id}`, { action: reqAction });
        fetchRequests();
      }
      toast.success(res?.data?.msg || "Action completed");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Action failed");
    } finally {
      setButtonLoading(false);
      setModal({ open: false, action: null, id: null });
    }
  };

const renderCard = (item, type) => {
  // Determine left border color and width for request type only
  const leftBorder = type === "request"
    ? item.status === "approved"
      ? "border-l-4 border-green-500"
      : item.status === "rejected"
      ? "border-l-4 border-red-500"
      : "border-l-4 border-yellow-400"
    : "border-l border-gray-200"; // light thin border for NGOs and Users

  return (
    <div
      className={`bg-white shadow-sm border ${leftBorder} rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 w-full text-center sm:text-left`}
    >
      {/* Left Side: Image */}
      <div className="flex justify-center sm:block">
        <img
          src={
            item.logo || item.photo || `https://ui-avatars.com/api/?name=${item.name}`
          }
          alt={item.name}
          className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover border"
        />
      </div>

      {/* Info Section */}
      <div className="flex-1 space-y-1 text-sm sm:text-sm">
        <h2 className="font-semibold text-base sm:text-lg">{item.name}</h2>

        {item.email && (
          <p className="text-gray-600 break-words">
            {type !== "user" && "Email: "} {item.email}
          </p>
        )}

        {item.city && (
          <p className="text-gray-600">
            {type !== "user" && "City: "} {item.city}
          </p>
        )}

        {type !== "user" && item.mobileNumber && (
          <p className="text-gray-600">Phone: {item.mobileNumber}</p>
        )}

        {type !== "user" && item.registrationNumber && (
          <p className="text-gray-600">Reg No: {item.registrationNumber}</p>
        )}

        {type === "request" && item.message && (
          <p className="text-gray-800 pt-2">
            <strong>Message:</strong> {item.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-end sm:flex-col items-center sm:items-end">
        {type === "ngo" && (
          <button
            onClick={() => setModal({ open: true, action: "removeNgoRole", id: item._id })}
            className="bg-red-500 text-white text-xs sm:text-sm px-3 sm:py-2 py-1.5 sm:mt-10 sm:mr-2 rounded hover:bg-red-700"
          >
            Demote to User
          </button>
        )}

        {type === "user" && item.role === "user" && (
          <button
            onClick={() => setModal({ open: true, action: "deleteUser", id: item._id })}
            className={`bg-red-600 text-white text-xs sm:text-sm px-4 py-1.5 ${item.city ? "sm:mt-6":"sm:mt-4"} sm:mr-3 rounded hover:bg-red-600`}
          >
            Delete
          </button>
        )}

        {type === "request" && item.status === "pending" && (
          <div className="flex gap-2 flex-wrap justify-center sm:justify-end sm:mt-14 sm:mr-3">
            <button
              onClick={() => setModal({ open: true, action: "request:approve", id: item._id })}
              className="bg-green-600 text-white text-xs sm:text-sm px-4 py-1.5 sm:py-2 rounded hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => setModal({ open: true, action: "request:reject", id: item._id })}
              className="bg-red-600 text-white text-xs sm:text-sm px-4 py-1.5 sm:py-2 rounded hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        )}

        {type === "request" && (
          <span
            className={`mt-1 text-xs font-semibold ${
              item.status === "approved"
                ? "text-green-600"
                : item.status === "rejected"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {item.status !== "pending" && item.status.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};


  const tabItems = [
    { key: "ngos", label: `NGOs (${ngos.length})` },
    { key: "users", label: `Users (${users.length})` },
    { key: "requests", label: `Requests (${requests.length})` },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] max-w-[100vw] mx-auto pt-3">
      {/* Tabs */}
      <div className="flex-shrink-0 border-b border-gray-300 mb-3 sm:mx-4">
        <div className="flex w-full justify-between sm:justify-center sm:gap-6 text-sm sm:text-base">
          {tabItems.map(({ key, label }) => (
            <button
              key={key}
              className={`flex-1 sm:flex-initial flex items-center justify-center py-2 px-1 sm:px-3 border-b-2 transition duration-200 ${
                activeTab === key
                  ? "border-green-600 text-green-600 font-semibold"
                  : "border-transparent text-gray-500"
              }`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pb-4 px-3 sm:px-8 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading...</p>
        ) : (
          <>
            {activeTab === "ngos" &&
              (ngos.length > 0 ? (
                ngos.map((ngo) => (
                  <div key={ngo._id} className="w-full max-w-4xl mx-auto">
                    {renderCard(ngo, "ngo")}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-10">No NGOs found.</p>
              ))}

            {activeTab === "users" &&
              (users.length > 0 ? (
                users.map((user) => (
                  <div key={user._id} className="w-full max-w-4xl mx-auto">
                    {renderCard(user, "user")}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-10">No users found.</p>
              ))}

            {activeTab === "requests" &&
              (requests.length > 0 ? (
                requests.map((req) => (
                  <div key={req._id} className="w-full max-w-4xl mx-auto">
                    {renderCard(req, "request")}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-10">No requests found.</p>
              ))}
          </>
        )}
      </div>

      {/* Modal */}
      <Dialog
        open={modal.open}
        onClose={() => setModal({ open: false, action: null, id: null })}
        className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30"
      >
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
          <Dialog.Title className="text-lg font-bold mb-4">Confirm Action</Dialog.Title>
          <p className="text-sm text-gray-700 mb-4">Are you sure you want to proceed?</p>
          <div className="flex justify-end gap-2">
            <button
              disabled={buttonLoading}
              onClick={() => setModal({ open: false, action: null, id: null })}
              className="px-4 py-1 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={confirmAction}
               disabled={buttonLoading}
              className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {buttonLoading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}



