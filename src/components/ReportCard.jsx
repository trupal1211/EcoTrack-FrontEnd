import { useState, useEffect } from "react";
import Slider from "react-slick";
import { MessageCircle, ArrowBigUp, ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import api from "../services/api"; // Make sure this is correctly pointing to your API service
import { useAuth } from "../contexts/AuthContext"; // Assuming you have auth context for user info
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ReportCard({ report }) {
  const {
    _id,
    title,
    postedBy,
    photos = [],
    status,
    description,
    city,
    landmark,
    comments = [],
    upvotes = [],
    createdAt,
  } = report;

  const { user } = useAuth(); // Get logged-in user
  const [currentSlide, setCurrentSlide] = useState(1);
  const [upvoted, setUpvoted] = useState(false);
  const [upvotesCount, setUpvotesCount] = useState(upvotes.length);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()

  useEffect(() => {
    if (user && upvotes.includes(user._id)) {
      setUpvoted(true);
    }
  }, [user, upvotes]);

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    taken: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  }[status] || "bg-gray-100 text-gray-700";

  const CustomNextArrow = ({ onClick }) => (
    <button
      className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full z-20 hover:bg-white"
      onClick={onClick}
    >
      <ChevronRight size={18} />
    </button>
  );

  const CustomPrevArrow = ({ onClick }) => (
    <button
      className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full z-20 hover:bg-white"
      onClick={onClick}
    >
      <ChevronLeft size={18} />
    </button>
  );

  const sliderSettings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlide(index + 1),
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  const handleUpvote = async () => {
    if (!user) return toast.error("You must be logged in to upvote.");
    if (!_id) return;

    try {
      setLoading(true);
      if (upvoted) {
        await api.delete(`/report/upvote/${_id}`);
        setUpvoted(false);
        setUpvotesCount((prev) => prev - 1);
      } else {
        await api.post(`/report/upvote/${_id}`);
        setUpvoted(true);
        setUpvotesCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update vote.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={()=>navigate(`/report/${_id}`)} className="max-w-[500px] w-full bg-white border rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={postedBy?.photo || `https://ui-avatars.com/api/?name=${postedBy?.name}`}
            alt="user"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <p className="font-semibold text-sm text-gray-800">{postedBy?.name}</p>
            <p className="text-xs text-gray-500">{postedBy?.city || "Unknown"}</p>
          </div>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColor}`}>
          {status}
        </span>
      </div>

      {/* Title */}
      <h3 className="px-4 pb-1 text-base font-semibold text-gray-800">{title}</h3>

      {/* Image Slider */}
      {photos.length > 0 && (
        <div onClick={(e) => e.stopPropagation()} className="relative">
          <Slider {...sliderSettings}>
            {photos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`report-photo-${i}`}
                className="w-full h-[280px] md:h-[340px] object-cover"
              />
            ))}
          </Slider>
          {photos.length > 1 && (
            <span className="absolute top-2 right-3 text-xs bg-black bg-opacity-60 text-white px-2 py-0.5 rounded-md">
              {currentSlide}/{photos.length}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      <div className="px-4 py-3 space-y-1 text-sm text-gray-800">
        <p>{description}</p>
        <p className="text-xs text-gray-500">{landmark}, {city}</p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-4 py-2.5 border-t text-gray-600 text-sm">
        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
          <ArrowBigUp
            size={26}
            stroke={upvoted ? "#3b82f6" : "#9ca3af"}
            fill={upvoted ? "#3b82f6" : "none"}
            className={`cursor-pointer transition hover:scale-110 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleUpvote}
          />
          <span>{upvotesCount}</span>
        </div>
        <div className="flex items-center gap-2  cursor-pointer">
          <MessageCircle size={20} />
          <span>{comments.length}</span>
        </div>
        <span className="text-xs text-gray-500">{moment(createdAt).fromNow()}</span>
      </div>
    </div>
  );
}
