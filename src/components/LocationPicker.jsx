import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const GOOGLE_MAPS_API_KEY = "AIzaSyD-IkRv4nTNWx45lAxqEqP_xBtCWwQajOM";
const GOOGLE_MAPS_SRC = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;

// Load Google Maps JS script
const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve();

    const existingScript = document.querySelector(`script[src="${GOOGLE_MAPS_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", resolve);
      existingScript.addEventListener("error", () => reject("Failed to load Google Maps"));
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_MAPS_SRC;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject("Failed to load Google Maps");
    document.body.appendChild(script);
  });
};

// Geocode the city name to lat/lng
const geocodeCity = async (cityName) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  if (data.status === "OK" && data.results.length > 0) {
    const loc = data.results[0].geometry.location;
    return { lat: loc.lat, lng: loc.lng };
  } else {
    throw new Error("Failed to geocode city.");
  }
};

export default function LocationPicker({ onSelect, onClose, city }) {
  const mapRef = useRef(null);
  const [center, setCenter] = useState({ lat: 21.17, lng: 72.83 }); // fallback
  const mapInstance = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMaps();

        let geoCenter = center;
        if (city) {
          try {
            geoCenter = await geocodeCity(city);
            setCenter(geoCenter);
          } catch (err) {
            toast.error("Could not find city location. Showing default.");
            console.warn("Geocoding failed:", err);
          }
        }

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: geoCenter,
          zoom: 15,
          disableDefaultUI: true,
        });

        // 🔥 Ensure the map actually focuses on the geocoded center
        mapInstance.current.setCenter(geoCenter);

        // Track center changes to save current position
        mapInstance.current.addListener("center_changed", () => {
          const newCenter = mapInstance.current.getCenter();
          setCenter({
            lat: newCenter.lat(),
            lng: newCenter.lng(),
          });
        });
      } catch (err) {
        console.error(err);
        toast.error("Google Maps failed to load.");
        onClose(); // Close modal if map fails
      }
    };

    initMap();

    return () => {
      if (mapInstance.current) {
        window.google.maps.event.clearInstanceListeners(mapInstance.current);
      }
    };
  }, [city]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="relative w-full max-w-2xl h-[80vh] bg-white rounded-lg overflow-hidden shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white hover:bg-gray-200 text-gray-700 border rounded-full w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>

        <div ref={mapRef} className="w-full h-full relative" />

        <div className="pointer-events-none absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <svg width="36" height="48" viewBox="0 0 24 24" fill="#ef4444" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" fill="white" />
          </svg>
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-white p-3 border-t z-10">
          <button
            onClick={() => onSelect(center)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
          >
            Set Location
          </button>
        </div>
      </div>
    </div>
  );
}
