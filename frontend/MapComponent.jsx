import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ hospitals = [], center }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || !center) return;

    // Create map only once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [center.lat, center.lng],
        13
      );

      // OpenStreetMap
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "&copy; OpenStreetMap contributors",
        }
      ).addTo(mapInstanceRef.current);
    }

    // Update map center
    mapInstanceRef.current.setView(
      [center.lat, center.lng],
      13
    );

    // Remove old markers
    markersRef.current.forEach((marker) => {
      marker.remove();
    });

    markersRef.current = [];

    // User location marker
    const userMarker = L.marker(
      [center.lat, center.lng]
    )
      .addTo(mapInstanceRef.current)
      .bindPopup("📍 Your Current Location");

    markersRef.current.push(userMarker);

    // Hospital markers
    hospitals.forEach((hospital) => {
      if (!hospital.lat || !hospital.lng) return;

      const marker = L.marker([
        hospital.lat,
        hospital.lng,
      ])
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="min-width:200px">
            <h3 style="margin:0 0 8px">
              🏥 ${hospital.name}
            </h3>

            <p style="margin:4px 0">
              📍 ${hospital.address}
            </p>

            <p style="margin:4px 0">
              📏 ${hospital.distance?.toFixed(2) || "0"} km
            </p>

            ${
              hospital.phone
                ? `<p style="margin:4px 0">
                     📞 ${hospital.phone}
                   </p>`
                : ""
            }

            <br/>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}"
              target="_blank"
              rel="noopener noreferrer"
            >
              🧭 Get Directions
            </a>
          </div>
        `);

      markersRef.current.push(marker);
    });

    return () => {
      // markers are handled on next update
    };
  }, [center, hospitals]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "600px",
        borderRadius: "24px",
        overflow: "hidden",
      }}
    />
  );
};

export default MapComponent;