import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet marker fix
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: shadow,
});

// Default markaz (agar GPS bo‘lmasa)
const DEFAULT_CENTER = [41.311081, 69.240562]; // Toshkent

function RecenterMap({ lat, lng }) {
  const map = useMap();
  map.setView([lat, lng], 14);
  return null;
}

export default function MapComponent() {
  const [position, setPosition] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState("");

  // 📍 MENING JOYLASHUVIM (ANIQ)
  const getMyLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("Brauzer geolokatsiyani qo‘llab-quvvatlamaydi");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition({ lat, lng });

        // joy nomini olish
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          setPlaceName(data.display_name || "Noma'lum joy");
        } catch {
          setPlaceName("Noma'lum joy");
        }
      },
      () => {
        setError("Joylashuvga ruxsat berilmadi yoki GPS o‘chiq");
      },
      {
        enableHighAccuracy: true, // 🔥 MUHIM
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // 🏥 YAQIN SHIFOXONALAR (ISHONCHLI)
  const getHospitals = async () => {
    setError("");

    const lat = position?.lat || DEFAULT_CENTER[0];
    const lng = position?.lng || DEFAULT_CENTER[1];

    // 5–6 km radius
    const viewbox = `${lng - 0.05},${lat - 0.05},${lng + 0.05},${lat + 0.05}`;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=hospital&limit=20&viewbox=${viewbox}&bounded=1`
      );
      const data = await res.json();

      const list = data.map((h, i) => ({
        id: i,
        lat: Number(h.lat),
        lng: Number(h.lon),
        name: h.display_name,
      }));

      setHospitals(list);
    } catch {
      setError("Shifoxonalarni olishda xatolik");
    }
  };

  return (
    <div className="p-4">
      {/* BUTTONLAR */}
      <div className="flex gap-3 mb-3">
        <button
          onClick={getMyLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          📍 Mening joylashuvim
        </button>

        <button
          onClick={getHospitals}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          🏥 Yaqin shifoxonalar
        </button>
      </div>

      {/* XATOLIK */}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      {/* JOY NOMI */}
      {placeName && <div className="text-sm mb-2">📌 {placeName}</div>}

      {/* XARITA */}
      <MapContainer
        center={position ? [position.lat, position.lng] : DEFAULT_CENTER}
        zoom={13}
        style={{ height: "60vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {position && <RecenterMap lat={position.lat} lng={position.lng} />}

        {/* MENING JOYIM */}
        {position && (
          <Marker position={[position.lat, position.lng]}>
            <Popup>
              📍 Siz shu yerdasiz <br />
              {placeName}
            </Popup>
          </Marker>
        )}

        {/* SHIFOXONALAR */}
        {hospitals.map((h) => (
          <Marker key={h.id} position={[h.lat, h.lng]}>
            <Popup>🏥 {h.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
