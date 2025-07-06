import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import LocationPicker from "./LocationPicker";

export default function CreateReport({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    landmark: "",
    city: "",
    photos: [],
    location: null,
  });

  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const selectedFiles = Array.from(files).slice(0, 5);
      if (selectedFiles.length === 0) {
        toast.error("Please select at least one photo.");
        return;
      }
      setFormData((prev) => ({ ...prev, photos: selectedFiles }));
      setPreviewImages(selectedFiles.map((file) => URL.createObjectURL(file)));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, landmark, city, photos, location } = formData;

    if (!title || !description || !landmark || !city) {
      toast.error("All fields are required.");
      return;
    }

    if (!photos || photos.length === 0) {
      toast.error("At least one photo is required.");
      return;
    }

    if (!location) {
      toast.error("Location is required. Please select from map.");
      return;
    }

    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("landmark", landmark);
    data.append("city", city);
    data.append("autoLocation", JSON.stringify(location));
    photos.forEach((file) => data.append("photos", file));

    try {
      setLoading(true);

      const res = await api.post("/report", data);
      if (res.status === 201 || res.data?.msg) {
        toast.success(res.data.msg || "Report created successfully!");
        onSuccess?.();
        onClose?.();
      } else {
        toast.error("Unexpected server response.");
        return;
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      toast.error(err.response?.data?.msg || "Failed to create report.");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Report</h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="landmark"
          placeholder="Landmark"
          value={formData.landmark}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Upload Photos */}
        <div>
          <label className="block font-medium mb-1">Upload Photos</label>
          <div className="border border-dashed border-gray-400 rounded-lg p-4 bg-gray-50 text-center cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="hidden"
              id="photoUpload"
            />
            <label htmlFor="photoUpload" className="cursor-pointer text-sm text-gray-600">
              Drag & drop or click to upload (1–5 photos)
            </label>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {previewImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="preview"
                  className="h-16 w-16 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Select Location */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Select Location</span>
          <button
            type="button"
            onClick={() => {
              if (!formData.city) {
                toast.error("Please enter the city before selecting location.");
                return;
              }
              setShowMap(true);
            }}
            className="text-sm text-blue-600 underline"
          >
            Open Map
          </button>
        </div>

        {formData.location && (
          <div className="text-xs text-green-700">
            ✅ Location set: Lat {formData.location.lat.toFixed(5)}, Lng {formData.location.lng.toFixed(5)}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-600 text-white py-2 rounded font-semibold transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>

      {/* Map Modal */}
      {showMap && (
        <LocationPicker
          city={formData.city}
          onSelect={(loc) => {
            setFormData((prev) => ({ ...prev, location: loc }));
            toast.success("Location selected!");
            setShowMap(false);
          }}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
}
