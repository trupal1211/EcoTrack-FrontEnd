import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import ReportCard from "../components/ReportCard";

ChartJS.register(ArcElement, Tooltip, Legend);

// Icons (SVGs)
const icons = {
    analytics: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 12h2m-1-9v18m8-13h-3v6h3V8zm-6 4h-3v6h3v-6zM4 16h3v4H4v-4z" />
        </svg>
    ),
    completed: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    incompleted: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    pending: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

export default function NGODashboard() {
    const { user } = useAuth();
    const [counts, setCounts] = useState({ completed: 0, incompleted: 0, pending: 0 });
    const [reports, setReports] = useState([]);
    const [activeTab, setActiveTab] = useState("analytics");
    const [loading, setLoading] = useState(false);

    const tabs = [
        { label: "Analytics", value: "analytics" },
        { label: "Resolved", value: "completed" },
        { label: "Uncompleted", value: "incompleted" },
        { label: "Yet to Resolve", value: "pending" },
    ];

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const id = user._id;
                const [completed, uncompleted, pending] = await Promise.all([
                    api.get(`/ngo/completed/${id}`),
                    api.get(`/ngo/incompleted/${id}`),
                    api.get(`/ngo/taken/${id}`),
                ]);

                setCounts({
                    completed: completed.data.count || 0,
                    incompleted: uncompleted.data.count || 0,
                    pending: pending.data.count || 0,
                });
            } catch (err) {
                console.error("Error fetching counts", err);
            }
        };

        fetchCounts();
    }, [user._id]);

    useEffect(() => {
        const fetchReports = async () => {
            if (activeTab === "analytics") {
                setReports([]);
                return;
            }

            setLoading(true);
            try {
                const id = user._id;
                let res;

                if (activeTab === "completed") {
                    res = await api.get(`/ngo/completed/${id}`);
                } else if (activeTab === "incompleted") {
                    res = await api.get(`/ngo/incompleted/${id}`);
                } else if (activeTab === "pending") {
                    res = await api.get(`/ngo/taken/${id}`);
                }

                setReports(res?.data?.reports || []);
            } catch (err) {
                console.error("Error fetching reports", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [user._id, activeTab]);

    const chartData = {
        labels: ["Resolved", "Uncompleted", "Yet to Resolve"],
        datasets: [
            {
                label: "Reports",
                data: [counts.completed, counts.incompleted, counts.pending],
                backgroundColor: ["#16a34a", "#dc2626", "#eab308"],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="flex flex-col h-[calc(100vh-68px)] max-w-[calc(100vw)] mx-auto pt-3">
            {/* Tabs */}
            <div className="flex-shrink-0 border-b border-gray-300 mb-3 sm:mx-4">
                <div className="flex w-full justify-between sm:justify-center sm:gap-6 text-xs sm:text-base">
                    {tabs.map(({ label, value }) => (
                        <button
                            key={value}
                            className={`flex-1 sm:flex-initial flex items-center justify-center sm:gap-1 py-2 px-1 sm:px-3 border-b-2 transition duration-200 ${activeTab === value
                                    ? "border-green-600 text-green-600 font-semibold"
                                    : "border-transparent text-gray-500"
                                }`}
                            onClick={() => setActiveTab(value)}
                        >
                            <span className="hidden sm:inline">{icons[value]}</span>
                            <span className="sm:ml-1">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pb-4 px-3 sm:px-8">
                {activeTab === "analytics" ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="w-full max-w-sm">
                            <Pie data={chartData} />
                        </div>
                    </div>
                ) : loading ? (
                    <p className="text-center text-gray-500 py-10">Loading reports...</p>
                ) : reports.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No reports in this category.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {reports.map((report) => (
                            <ReportCard key={report._id} report={report} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
