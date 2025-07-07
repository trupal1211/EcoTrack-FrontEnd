import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Camera } from "lucide-react";
import api from "../services/api";
import ReportCard from "../components/ReportCard";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState({ name: "", city: "" });
  const [activeTab, setActiveTab] = useState("taken");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef();

  const [ngoReports, setNgoReports] = useState({
    taken: [],
    completed: [],
    incompleted: [],
  });
  const [userReports, setUserReports] = useState([]);

  const isOwnProfile = !userId || userId === user._id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = userId
          ? await api.get(`/user/${userId}`)
          : await api.get(`/user/me`);

        const userData = userId ? res.data.user : res.data;
        setProfile(userData);
        setFormData({ name: userData.name, city: userData.city });
        setPreview(userData.photo);
      } catch (err) {
        console.error("Error fetching profile", err);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (!profile) return;

    const fetchReports = async () => {
      try {
        if (profile.role === "ngo") {
          const id = userId || user?._id;
          const [taken, completed, incompleted] = await Promise.all([
            api.get(`/ngo/taken/${id}`),
            api.get(`/ngo/completed/${id}`),
            api.get(`/ngo/incompleted/${id}`),
          ]);
          setNgoReports({
            taken: taken.data.reports,
            completed: completed.data.reports,
            incompleted: incompleted.data.reports,
          });
        } else if (isOwnProfile && (profile.role === "user" || profile.role === "admin")) 
          {
         const res = await api.get(`/report/reports-by/${user._id}`);
          setUserReports(res.data.reports);
        }else if (profile.role === "user" || profile.role === "admin") {
          const res = await api.get(`/report/reports-by/${userId}`);
          setUserReports(res.data.reports);}
      } catch (err) {
        console.error("Error fetching reports", err);
        toast.error("Failed to load reports.");
      }
    };
    fetchReports();
  }, [profile]);

  const handleInputChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("city", formData.city);
      if (fileRef.current.files[0]) {
        data.append("photo", fileRef.current.files[0]);
      }

      await api.put("/user/update-profile", data);
      toast.success("Profile updated successfully!");
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      console.error("Profile update failed", err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const renderReports = () => {
    if (profile.role === "ngo") {
      const list = ngoReports[activeTab];
      if (!list || list.length === 0)
        return <p className="text-center py-6 text-gray-500">No reports.</p>;

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {list.map((r) => (
            <ReportCard key={r._id} report={r} />
          ))}
        </div>
      );
    } else {
      if (userReports.length === 0)
        return <p className="text-center py-6 text-gray-500">No reports.</p>;
      return (
        <>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Reports</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userReports.map((r) => (
              <ReportCard key={r._id} report={r} />
            ))}
          </div>
        </>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-gray-500 text-lg animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-full max-h-[calc(100vh-68px)] scrollbar-thin overflow-y-auto mx-auto p-4 sm:px-28">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-center sm:gap-6 gap-4 w-full">
          <img
            src={profile?.photo}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border shadow"
          />

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">{profile?.name}</h2>
            <p className="text-gray-600">{profile?.city}</p>

            {profile.role === "ngo" && (
              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Reg. No:</strong> {profile.regNumber}</p>
                <p><strong>Mobile:</strong> {profile.mobile}</p>
              </div>
            )}
          </div>
        </div>

        {isOwnProfile && profile.role !== "ngo" && (
          <div className="flex justify-center sm:justify-end w-full sm:w-full">
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-3 py-1 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition rounded-lg shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Report Stats */}
      {profile.role === "ngo" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 text-blue-700 px-4 py-4 rounded shadow text-center">
            <p className="text-sm">Total Taken</p>
            <p className="text-lg font-semibold">
              {ngoReports.completed.length + ngoReports.incompleted.length + ngoReports.taken.length}
            </p>
          </div>
          <div className="bg-green-50 text-green-700 px-4 py-4 rounded shadow text-center">
            <p className="text-sm">Resolved</p>
            <p className="text-lg font-semibold">{ngoReports.completed.length}</p>
          </div>
          <div className="bg-red-50 text-red-700 px-4 py-4 rounded shadow text-center">
            <p className="text-sm">incompleted</p>
            <p className="text-lg font-semibold">{ngoReports.incompleted.length}</p>
          </div>
          <div className="bg-yellow-50 text-yellow-700 px-4 py-4 rounded shadow text-center">
            <p className="text-sm">Yet To Resolved</p>
            <p className="text-lg font-semibold">{ngoReports.taken.length}</p>
          </div>
        </div>
      )}

      {/* NGO Tabs */}
      {profile.role === "ngo" && (
        <div className="flex gap-4 mt-6 border-b">
          {["taken", "completed", "incompleted"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-3 border-b-2 transition ${activeTab === tab
                ? "border-green-600 text-green-600 font-semibold"
                : "border-transparent text-gray-500"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Report Grid */}
      <div className="mt-6">{renderReports()}</div>

      {/* Edit Modal */}
      {editMode && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <div className="flex justify-center mb-4 relative">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border shadow"
              />
              <button
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-[calc(50%-50px)] bg-white p-1 rounded-full border shadow"
              >
                <Camera size={18} />
              </button>
              <input
                type="file"
                hidden
                ref={fileRef}
                onChange={handleUpload}
              />
            </div>

            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded mb-3"
              placeholder="Your Name"
            />
            <input
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded mb-4"
              placeholder="Your City"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${saving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
