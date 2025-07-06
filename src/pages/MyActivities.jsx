import { useEffect, useState } from "react";
import {
  GalleryVertical,
  ArrowBigUp,
  MessageCircle,
} from "lucide-react";
import api from "../services/api";
import ReportCard from "../components/ReportCard";

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState("my");
  const [myPosts, setMyPosts] = useState([]);
  const [upvotedPosts, setUpvotedPosts] = useState([]);
  const [commentedPosts, setCommentedPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "my") {
          const res = await api.get("/report/my-reports");
          setMyPosts(res.data);
        } else if (activeTab === "upvoted") {
          const res = await api.get("/report/my-upvotes");
          setUpvotedPosts(res.data);
        } else if (activeTab === "commented") {
          const res = await api.get("/report/my-comments");
          setCommentedPosts(res.data);
        }
      } catch (err) {
        console.error("Error fetching activity:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]); // fetch every time tab changes

  const renderPostGrid = (reports) => {
    if (reports.length === 0) {
      return <p className="text-center text-gray-500 py-20">No posts found.</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {reports.map((r) => (
          <ReportCard key={r._id} report={r} />
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    if (loading) return <p className="text-center py-6 text-gray-500">Loading...</p>;
    if (activeTab === "my") return renderPostGrid(myPosts);
    if (activeTab === "upvoted") return renderPostGrid(upvotedPosts);
    if (activeTab === "commented") return renderPostGrid(commentedPosts);
    return null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] max-w-[calc(100vw)] mx-auto pt-3">
      {/* Tabs */}
      <div className="flex-shrink-0 border-b border-gray-300 mb-2 sm:mx-4">
        <div className="flex sm:justify-center justify-around sm:gap-x-12 text-sm sm:text-base">
          <button
            className={`flex items-center gap-1 py-2 px-3 border-b-2 transition ${
              activeTab === "my"
                ? "border-green-600 text-green-600 font-semibold"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("my")}
          >
            <GalleryVertical size={18} /> My Posts
          </button>
          <button
            className={`flex items-center gap-1 py-2 px-3 border-b-2 transition ${
              activeTab === "upvoted"
                ? "border-green-600 text-green-600 font-semibold"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("upvoted")}
          >
            <ArrowBigUp size={20} /> Upvoted
          </button>
          <button
            className={`flex items-center gap-1 py-2 px-3 border-b-2 transition ${
              activeTab === "commented"
                ? "border-green-600 text-green-600 font-semibold"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("commented")}
          >
            <MessageCircle size={18} /> Commented
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pb-4 px-3 sm:px-8">
        {renderTabContent()}
      </div>
    </div>
  );
}
