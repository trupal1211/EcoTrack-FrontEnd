import { useEffect, useState } from "react";
import { useNavigate, useParams,useNavigation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import Slider from "react-slick";
import moment from "moment";
import {
  MessageCircle,
  ArrowBigUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import GoogleMapLocation from "../components/GoogleMapLocation"

// Custom slider arrows
const CustomNextArrow = ({ onClick }) => (
  <button
    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full z-10 hover:bg-white hidden md:flex"
    onClick={onClick}
  >
    <ChevronRight size={18} />
  </button>
);
const CustomPrevArrow = ({ onClick }) => (
  <button
    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full z-10 hover:bg-white hidden md:flex"
    onClick={onClick}
  >
    <ChevronLeft size={18} />
  </button>
);

export default function ReportDetails() {
  const { reportId } = useParams();
  const { user } = useAuth();

  const navigate=useNavigate();

  const [report, setReport] = useState(null);
  const [comment, setComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingUpvote, setLoadingUpvote] = useState(false);
  const [loadingTake, setLoadingTake] = useState(false);
  const [showDueModal, setShowDueModal] = useState(false);
  const [dueDateInput, setDueDateInput] = useState("");
  const [photoSlide, setPhotoSlide] = useState(1);
  const [resolvedSlide, setResolvedSlide] = useState(1);
  const [showMobileComments, setShowMobileComments] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionDescriptionInput, setResolutionDescriptionInput] = useState("");
  const [previewResolveImages, setPreviewResolveImages] = useState([]);
  const [resolveImages, setResolveImages] = useState([]);
  const [resolving, setResolving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletionStatus, setDeletionStatus] = useState(false);
  const [openMap,setOpenMap]=useState(false)


  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    api
      .get(`/report/reports/${reportId}`)
      .then((res) => setReport(res.data.report))
      .catch(() => toast.error("Failed to fetch report"));
  }, [reportId]);


  if (!report) return null;

  const {
    _id, title, description, photos = [], landmark, city, status,
    postedBy, takenBy, resolvedImages = [], resolutionDescription,
    dueDate, createdAt,incompletedBy = [], comments = [], upvotes = [], takenOn, resolvedOn , autoLocation
  } = report;

  const hasUpvoted = user && upvotes.includes(user._id);
  const canTake = status === "pending" && (user?.role === "ngo" || user?.role === "admin");

  const toggleUpvote = async () => {
    if (!user) return toast.error("Login to vote");
    setLoadingUpvote(true);
    await api[hasUpvoted ? "delete" : "post"](`/report/upvote/${_id}`).catch(() =>
      toast.error("Failed vote")
    );
    const res = await api.get(`/report/reports/${_id}`);
    setReport(res.data.report);
    setLoadingUpvote(false);
  };

  const submitComment = async () => {
    if (!comment.trim()) return;
    setLoadingComment(true);
    await api
      .post(`/report/comment/${_id}`, { text: comment })
      .catch(() => toast.error("Comment error"));
    const res = await api.get(`/report/reports/${_id}`);
    setReport(res.data.report);
    setComment("");
    setLoadingComment(false);
  };

  const submitDueDate = async () => {
    if (!dueDateInput) return toast.error("Select a date");

    setLoadingTake(true);
    try {
      await api.put(`/ngo/take/${_id}`, { dueDate: dueDateInput });
      const res = await api.get(`/report/reports/${_id}`);
      setReport(res.data.report);
      setShowDueModal(false);
      toast.success("Report taken successfully!");
    } catch {
      toast.error("Failed to take");
    } finally {
      setLoadingTake(false);
    }
  };


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + resolveImages.length > 5) {
      return toast.error("You can upload max 5 images");
    }
    setResolveImages((prev) => [...prev, ...files]);
    setPreviewResolveImages((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleResolveSubmit = async () => {
    if (resolveImages.length < 1) return toast.error("At least 1 image required");
    if (!resolutionDescriptionInput.trim()) return toast.error("Description required");
    setResolving(true);
    try {
      const formData = new FormData();
      resolveImages.forEach((img) => formData.append("resolvedImages", img));
      formData.append("description", resolutionDescriptionInput);

      await api.put(`/ngo/complete/${_id}`, formData);
      const res = await api.get(`/report/reports/${_id}`);
      setReport(res.data.report);
      setShowResolveModal(false);
      toast.success("Report resolved successfully!");
      setResolutionDescriptionInput("");
      setResolveImages([]);
      setPreviewResolveImages([]);
    } catch (error) {
      toast.error(error?.response || error || "Resolve failed");
    }
    setResolving(false);
  };

  const handleDeleteReport = async () => {
    setDeletionStatus(true)
    try {
      await api.delete(`/admin/report/${_id}`);
      toast.success("Report deleted");
      window.location.href = "/";
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletionStatus(false)
    }
  };



  const sliderSettings = (setIndex) => ({
    dots: false, arrows: true, infinite: false, speed: 300, slidesToShow: 1,
    afterChange: (idx) => setIndex(idx + 1),
    nextArrow: <CustomNextArrow />, prevArrow: <CustomPrevArrow />,
  });


  const location = {
  _id:_id,
  title: title,       
  status: status,                  
  location: autoLocation
};


  return (
    <div className="fixed inset-0 top-[68px] bg-gray-100 overflow-hidden">
      <div className="w-full max-w-[1050px] mx-auto h-[calc(100vh-68px)] flex flex-col md:flex-row bg-white shadow-md overflow-y-auto">
        {/* Left Section */}
        <div className="w-full md:w-[60%] h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300">
          <div className="max-w-[500px] w-full mx-auto space-y-4">
            {/* Report Card */}
            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
              <div onClick={(e) => { navigate(`/profile/${postedBy._id}`); e.stopPropagation() }}
                className="flex justify-between items-center px-4 py-3 hover:cursor-pointer">
                <div className="flex items-center gap-3">
                  <img src={postedBy?.photo} alt={postedBy?.name}
                    className="w-10 h-10 rounded-full object-cover border" />
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{postedBy?.name}</p>
                    <p className="text-xs text-gray-500">{city}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full capitalize font-medium ${status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  status === "taken" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"
                  }`}>{status}</span>
              </div>

              <h3 className="px-5 pb-2 text-base font-semibold">{title}</h3>

              {/* Photos Slider */}
              {photos.length > 0 && (
                <div className="relative">
                  <Slider {...sliderSettings(setPhotoSlide)}>
                    {photos.map((url, i) => (
                      <img key={i} src={url}
                        className="w-full h-[280px] md:h-[340px] object-cover" />
                    ))}
                  </Slider>
                  {photos.length > 1 && (
                    <span className="absolute top-2 right-3 text-xs bg-black/60 text-white px-2 py-0.5 rounded">
                      {photoSlide}/{photos.length}
                    </span>
                  )}
                </div>
              )}

              <div className="px-4 py-2 space-y-1 text-sm text-gray-800">
                <p>{description}</p>
                <p className="text-xs text-gray-500">{landmark}, {city}</p>
              </div>

              <div className="flex justify-between items-center px-4 mb-2 py-2.5 border-t text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ArrowBigUp size={24} stroke={hasUpvoted ? "#3b82f6" : "#9ca3af"}
                    fill={hasUpvoted ? "#3b82f6" : "none"}
                    className={`cursor-pointer ${loadingUpvote && "opacity-50"}`}
                    onClick={toggleUpvote} />
                  <span>{upvotes.length}</span>
                </div>
                <div onClick={() => setShowMobileComments(true)} className="flex items-center gap-2">
                  <MessageCircle size={20} />
                  <span>{comments.length}</span>
                </div>
                <span className="text-xs text-gray-500">{moment(createdAt).fromNow()}</span>
              </div>



              {status !== "pending" && takenBy && (
                <div className={`${status === "completed" ? "bg-green-50" : "bg-blue-50"} p-4 text-sm mt-2`}>
                  {/* Header Row: NGO Info + Taken/Due Dates */}
                  <div className={"mb-4 font-semibold text-[16px]"}> {status === "completed" ? "Resolved By " : "taken By"} </div>
                  <div className={`flex justify-between items-start flex-wrap gap-3`}>
                    <div className="flex items-center gap-3">
                      <img src={takenBy.photo} alt={takenBy.name} className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <p className={`${status === "completed" ? "text-green-700" : "text-blue-700"} font-semibold text-[15px]`}>{takenBy.name}</p>
                        <p className={`text-x text-gray-600`}>{takenBy.city}</p>
                      </div>
                    </div>

                    <div className="text-right text-xs text-gray-900 space-y-1 min-w-[140px]">
                      {takenOn && <p>Taken On : {moment(takenOn).format("MMM D, YYYY")}</p>}
                      {dueDate && <p className="text-red-500">Due Date : {moment(dueDate).format("MMM D, YYYY")}</p>}
                    </div>
                  </div>

                  {/* Resolved Date */}
                  {status === "completed" && resolvedOn && (
                    <p className="text-green-700 text-x font-medium mt-4">
                      Completed On : {moment(resolvedOn).format("MMM D, YYYY")}
                    </p>
                  )}

                  {/* Description */}
                  {status === "completed" && resolutionDescription && (
                    <p className="mt-3 text-gray-700">{resolutionDescription}</p>
                  )}

                  {/* Images */}
                  {status === "completed" && resolvedImages.length > 0 && (
                    <div className="relative mt-3">
                      <Slider {...sliderSettings(setResolvedSlide)}>
                        {resolvedImages.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            className="w-full h-full object-cover rounded"
                            alt={`Resolved ${i}`}
                          />
                        ))}
                      </Slider>
                      {resolvedImages.length > 1 && (
                        <span className="absolute top-2 right-3 text-xs bg-black/60 text-white px-2 py-0.5 rounded">
                          {resolvedSlide}/{resolvedImages.length}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}


              {/* IncompletedBy block (after resolution section) */}
              {report.incompletedBy?.length > 0 && (
                <div className="bg-red-100 p-4 text-sm mt-0">
                  <p className="mb-4 font-semibold text-black-700 text-[16px]">Previously Incomplete By</p>
                  {report.incompletedBy.map((user) => (
                    <div key={user._id} className="flex items-center gap-3">
                      <img src={user.photo} className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <p className="text-red-700 font-semibold text-[15px]">{user.name}</p>
                        <p className="text-gray-600 text-sm">{user.city}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {canTake && (
                <button
                  onClick={() => setShowDueModal(true)}
                  disabled={loadingTake}
                  className={`w-full sm:py-3 py-2.5 bg-green-600 text-white font-semibold ${report.incompletedBy.length > 0 ? "mt-0" : "mt-2"} hover:bg-green-700`}
                >
                  {loadingTake ? "Processing…" : "Take this report"}
                </button>
              )}

              {status === "taken" && takenBy?._id === user?._id && (user?.role === "ngo" || user?.role === "admin") && (
                <button
                  onClick={() => setShowResolveModal(true)}
                  className="w-full sm:py-3 py-2.5 bg-blue-600 text-white font-semibold mt-0 hover:bg-blue-700"
                >
                  Resolve Report
                </button>
              )}


              {/* Delete Report (admin only) */}
              {user?.role === "admin" && (
                <div className="p">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full sm:py-3 py-2.5 bg-red-600 text-white font-semibold mt-2 hover:bg-red-700"
                  >
                    Delete Report
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Comments Toggle */}
            {windowWidth <= 768 && (
              <div className="md:hidden mt-3">
                <button
                  onClick={() => setShowMobileComments(true)}
                  className="w-full py-2.5 mb-3 bg-gray-100 rounded hover:bg-gray-200 text-sm font-medium"
                >
                  View Comments
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Comments */}
        <div className="hidden md:flex flex-col w-[40%] border-l h-full">
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 p-4 space-y-4">
            {comments.length === 0 ? (
              <p className="text-sm text-center text-gray-400 mt-4">
                No comments yet.
              </p>
            ) : comments.map((c) => (
              <div className="flex gap-2">
                <img src={c.user?.photo} alt={c.user?.name}
                  key={c._id} onClick={(e)=>{navigate(`/profile/${c._id}`); e.stopPropagation()}}
                  className="w-8 h-8 rounded-full object-cover  hover:cursor-pointer" />
                <div>
                  <p onClick={(e)=>{navigate(`/profile/${c._id}`); e.stopPropagation()} } className="text-sm font-medium hover:cursor-pointer">{c.user?.name}</p>
                  <p className="text-sm">{c.text}</p>
                  <span className="text-xs text-gray-400">
                    {moment(c.createdAt).fromNow()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={comment}
              disabled={loadingComment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              onClick={submitComment}
              disabled={loadingComment}
              className={`px-3 py-2 bg-green-600 text-white rounded ${loadingComment ? "opacity-50" : "hover:bg-green-700"}`}
            >
              Send
            </button>
          </div>
        </div>

        {showMobileComments && (
          <div className="fixed inset-0 z-[999] bg-white flex flex-col"
            style={{ top: '130px', height: 'calc(100vh - 130px)' }}>

            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-100">
              <h3 className="text-base font-semibold">Comments</h3>
              <button
                onClick={() => setShowMobileComments(false)}
                className="text-gray-500 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Scrollable Comments */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 mb-[76px]">
              {comments.length === 0 ? (
                <p className="text-sm text-center text-gray-400 mt-4">No comments yet.</p>
              ) : comments.map((c) => (
                <div key={c._id} className="flex gap-2">
                  <img src={c.user?.photo} alt={c.user?.name}
                    onClick={(e)=>{navigate(`/profile/${c._id}`); e.stopPropagation()}}
                    className="w-8 h-8 rounded-full object-cover  hover:cursor-pointer" />
                  <div>
                    <p onClick={(e)=>{navigate(`/profile/${c._id}`); e.stopPropagation()}}
                      className="text-sm font-medium  hover:cursor-pointer">{c.user?.name}</p>
                    <p className="text-sm">{c.text}</p>
                    <span className="text-xs text-gray-400">{moment(c.createdAt).fromNow()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Fixed input at bottom */}
            <div className="p-4 border-t bg-white fixed bottom-0 left-0 w-full">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={comment}
                  disabled={loadingComment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  onClick={submitComment}
                  disabled={loadingComment}
                  className={`px-3 py-2 bg-green-600 text-white rounded ${loadingComment ? "opacity-50" : "hover:bg-green-700"}`}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Due Date Modal */}
        {showDueModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 mx-4 rounded shadow-lg w-full max-w-sm">
              <h3 className="font-semibold flex items-center gap-1 mb-3">
                <Calendar size={20} /> Set Due Date
              </h3>
              <input
                type="date"
                value={dueDateInput}
                min={new Date().toISOString().split("T")[0]} // ✅ sets today as minimum date
                max={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} // Today + 15 days
                onChange={(e) => setDueDateInput(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDueModal(false)}
                  className="px-4 py-2 rounded border"
                  disabled={loadingTake}
                >
                  Cancel
                </button>
                <button
                  onClick={submitDueDate}
                  disabled={loadingTake}
                  className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700"
                >
                  Take
                </button>
              </div>
            </div>
          </div>
        )}


        {showResolveModal && (
          <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">
            <div className="bg-white p-6 rounded max-w-md mx-4  mt-20 w-full space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Resolve Report</h2>


              <label className="block font-medium mb-1">Upload Photos</label>
              <div className="border border-dashed border-gray-400 rounded-lg p-4 bg-gray-50 text-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="photoUpload"
                />
                <label htmlFor="photoUpload" className="cursor-pointer text-sm text-gray-600">
                  Drag & drop or click to upload (1–5 photos)
                </label>
                <div className="mt-2 flex flex-wrap gap-2 justify-center">
                  {previewResolveImages.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt="preview"
                      className="h-16 w-16 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>


              <label className="block text-sm font-medium text-gray-700">Resolution Description</label>
              <textarea
                rows={4}
                value={resolutionDescriptionInput}
                onChange={(e) => setResolutionDescriptionInput(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                disabled={resolving}
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 border rounded"
                  disabled={resolving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveSubmit}
                  disabled={resolving}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {resolving ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
            <div className="bg-white p-6 rounded max-w-sm w-full  mx-4 text-center">
              <h2 className="text-lg font-semibold text-black-600">Delete Report?</h2>
              <p className="text-sm text-gray-600 mt-2 mb-4">Are You Sure to delete this reprot ,This action cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border rounded"
                  disabled={deletionStatus}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteReport}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  disabled={deletionStatus}
                >
                  {deletionStatus ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

       <button
        onClick={(e) => {setOpenMap(true); e.stopPropagation()}}
        className={`fixed z-30 bg-gray-200 border text-gray-800 rounded-full shadow text-xl w-14 h-14 flex items-center justify-center sm:right-5 sm:bottom-8 right-5 bottom-4`}
        aria-label="Show Map"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          className="bi bi-geo-alt"
          viewBox="0 0 16 16"
        >
          <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
          <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
        </svg>
      </button>

       {openMap && (
              <div className="fixed inset-0 z-40 bg-white">
                <div className="absolute top-16 right-4 z-50">
                  <button
                    onClick={() => setOpenMap(false)}
                    className="p-2 bg-gray-800 text-white rounded-full shadow-md"
                  >
                    &#x2715;
                  </button>
                </div>
                <GoogleMapLocation reports={location} userCity={user.city} />
              </div>
      )}
    </div>
  );
}
