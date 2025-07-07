import { useEffect, useRef, useState } from "react";

export default function GoogleMap({ reports , userCity}) {
  console.log(userCity)
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  const getPinIcon = (status) => {
    const colorMap = {
      pending: "#f59e0b",
      taken: "#3b82f6",
      completed: "#22c55e",
    };

    const fillColor = colorMap[status] || "#9ca3af";

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="30" height="40" viewBox="0 0 24 24" fill="${fillColor}" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5" fill="white"/>
        </svg>`)}`
    };
  };

  useEffect(() => {
    const initMap = (latLng) => {
      const center = latLng || { lat: 21.1702, lng: 72.8311 }; // fallback center

      const newMap = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        mapId: "EcoTrackMap",
        styles: [
          { elementType: "geometry", stylers: [{ color: "#fafafa" }] },
          { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#999999" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#fafafa" }] },
          {
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [{ color: "#a0a0a0" }],
          },
          {
            featureType: "administrative.land_parcel",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#333333" }, { weight: 2 }],
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#f0f0f0" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#b0b0b0" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "road.arterial",
            elementType: "labels.text.fill",
            stylers: [{ color: "#888888" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#e0e0e0" }],
          },
          {
            featureType: "road.highway.controlled_access",
            elementType: "geometry",
            stylers: [{ color: "#d6d6d6" }],
          },
          {
            featureType: "transit",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#d8ebf9" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#7ca9bc" }],
          },
        ],
      });

      setMap(newMap);

      // User location marker
      new window.google.maps.Marker({
        position: center,
        map: newMap,
        title: "Your Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#10b981",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#064e3b",
          scale: 8,
        },
      });

      // Report markers
      reports.forEach((report) => {
        if (report.location?.lat && report.location?.lng) {
          new window.google.maps.Marker({
            position: report.location,
            map: newMap,
            title: report.title,
            icon: getPinIcon(report.status),
          });
          
        }
      });
    };

    const geocodeCity = (cityName) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: cityName }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          initMap({ lat: location.lat(), lng: location.lng() });
        } else {
          initMap(null); // fallback if failed
        }
      });
    };

    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyD-IkRv4nTNWx45lAxqEqP_xBtCWwQajOM";
      script.async = true;
      script.onload = () => {
        if (userCity) {
          geocodeCity(userCity);
        } else {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              initMap({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
            },
            () => initMap(null),
            { enableHighAccuracy: true }
          );
        }
      };
      document.body.appendChild(script);
    };

    if (!window.google || !window.google.maps) {
      loadGoogleMapsScript();
    } else {
      if (userCity) {
        geocodeCity(userCity);
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            initMap({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          () => initMap(null),
          { enableHighAccuracy: true }
        );
      }
    }
  }, [reports, userCity]);

  return (
    <div className="w-full h-full rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />
    </div>
  );
}
