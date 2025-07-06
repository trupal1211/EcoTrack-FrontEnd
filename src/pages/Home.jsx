import { useEffect, useState } from "react";
import GoogleMap from "../components/GoogleMap";
import ReportCard from "../components/ReportCard";
import api from "../services/api";
import toast from "react-hot-toast";
import CreateReport from "../components/CreateReport";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showMapMobile, setShowMapMobile] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [city, status, page]);

  const fetchReports = async () => {
    try {
      const res = await api.get("/report/filter", {
        params: { city:user.city, status , page: 1, limit: 10 },
      });
      setReports(res.data.reports);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to fetch reports");
    }
  };

  const dummyReports = reports.map((r) => ({
    _id: r._id,
    title: r.title,
    status: r.status,
    location: r.autoLocation || { lat: 22.7446, lng: 74.3933 },
  }));

  return (
    <div className="flex h-[calc(100vh-68px)] bg-gray-100 relative">
      {/* Left - Report List */}
      <div className="w-full md:w-[60%] h-full px-3 pt-0 pb-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {/* Sticky Filter */}
        <div className="sticky top-0 z-20 bg-gray-100 pt-2 pb-0">
          <div className="bg-white shadow-md p-2 rounded-lg flex flex-row gap-3 justify-between items-center">
            <input
              type="text"
              placeholder="Search by city..."
              className="w-1/2 px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <select
              className="w-1/3 px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="taken">Taken</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Report Cards */}
        <div className="mt-2 space-y-4 flex flex-col items-center">
          {reports.map((report) => (
            <ReportCard key={report._id} report={report} />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex gap-6 justify-center items-center mt-4">
              <button
                className="text-sm px-3 py-1 border rounded-md hover:bg-gray-200 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                className="text-sm px-3 py-1 border rounded-md hover:bg-gray-200 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right - Map (Desktop only) */}
      <div className="hidden md:block w-[40%] p-4">
        <div className="w-full h-[82%] rounded-xl overflow-hidden border shadow-md sticky top-[28px]">
          <GoogleMap reports={dummyReports} />
        </div>
      </div>

      {/* Mobile Fullscreen Map */}
      {showMapMobile && (
        <div className="fixed inset-0 z-40 bg-white">
          <div className="absolute top-16 right-4 z-50">
            <button
              onClick={() => setShowMapMobile(false)}
              className="p-2 bg-gray-800 text-white rounded-full shadow-md"
            >
              &#x2715;
            </button>
          </div>
          <GoogleMap reports={dummyReports} />
        </div>
      )}

      {/* FAB: Map (📍 icon, position varies) */}
      <button
        onClick={() => setShowMapMobile(true)}
        className={`fixed z-30 bg-white border text-gray-800 rounded-full shadow text-xl w-12 h-12 flex items-center justify-center md:hidden ${
          user ? "bottom-[84px] right-3" : "bottom-6 right-3"
        }`}
        aria-label="Show Map"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="bi bi-geo-alt"
          viewBox="0 0 16 16"
        >
          <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
          <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
        </svg>
      </button>

      {/* FAB: + Report (if logged in) */}
      {user && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-3 bg-green-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-green-700 flex items-center justify-center text-xl z-30 md:w-auto md:px-4 md:py-2 md:text-base"
          aria-label="Create Report"
        >
          <span className="block md:hidden">+</span>
          <span className="hidden md:block">+ Report</span>
        </button>
      )}

      {/* Modal - Create Report */}
      {showForm && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-xl p-6 relative mx-3">
            <button
              className="absolute top-6 right-7 text-gray-500 hover:text-gray-700"
              onClick={() => setShowForm(false)}
            >
              &#x2715;
            </button>
            <CreateReport onClose={() => setShowForm(false)} onSuccess={fetchReports} />
          </div>
        </div>
      )}
    </div>
  );
}





