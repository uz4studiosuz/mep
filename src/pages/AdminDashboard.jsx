import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaAmbulance,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaRoute,
  FaSignOutAlt,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { RiShieldUserFill } from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdMedicalServices, MdOutlinePendingActions } from "react-icons/md";
import { BsFillCursorFill } from "react-icons/bs";
import { IoMdAlert } from "react-icons/io";
import { useAuth, getRequests, updateRequest } from "../context/AuthContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: shadow,
});

// Custom icons
const userIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:36px;height:36px;
    background:linear-gradient(135deg,#ef4444,#dc2626);
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 4px 14px rgba(220,38,38,0.5);
    border:3px solid white;
  ">
    <span style="transform:rotate(45deg);font-size:14px;">🏥</span>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const adminIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:36px;height:36px;
    background:linear-gradient(135deg,#2563eb,#1d4ed8);
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 4px 14px rgba(37,99,235,0.5);
    border:3px solid white;
    font-size:16px;
  ">🚑</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

const DEFAULT_CENTER = [41.311081, 69.240562];

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    const valid = positions.filter(
      (p) => Array.isArray(p) && p.length === 2 && p.every((v) => typeof v === "number" && isFinite(v))
    );
    if (valid.length >= 2) {
      try {
        const bounds = L.latLngBounds(valid);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [60, 60], animate: true });
        }
      } catch { }
    }
  }, [positions, map]);
  return null;
}

// Fetch route from OSRM
async function fetchOsrmRoute(adminLat, adminLng, userLat, userLng) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${adminLng},${adminLat};${userLng},${userLat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === "Ok" && data.routes?.[0]) {
      const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      const dist = (data.routes[0].distance / 1000).toFixed(1);
      const dur = Math.ceil(data.routes[0].duration / 60);
      return { coords, dist, dur };
    }
  } catch { }
  // Fallback: straight line
  return {
    coords: [
      [adminLat, adminLng],
      [userLat, userLng],
    ],
    dist: null,
    dur: null,
  };
}

// ── Routing map modal ─────────────────────────────────────────
function RoutingMapModal({ request, adminPos, onClose, onAccept }) {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  const adminLat = adminPos?.lat || DEFAULT_CENTER[0];
  const adminLng = adminPos?.lng || DEFAULT_CENTER[1];
  // If user's GPS was not captured, place them slightly offset from admin for demo
  const userLat = (request.lat != null && !isNaN(request.lat))
    ? request.lat
    : adminLat + 0.03;
  const userLng = (request.lng != null && !isNaN(request.lng))
    ? request.lng
    : adminLng + 0.04;

  useEffect(() => {
    fetchOsrmRoute(adminLat, adminLng, userLat, userLng).then((r) => {
      setRoute(r);
      setLoading(false);
    });
  }, [adminLat, adminLng, userLat, userLng]);

  const allPositions = [[adminLat, adminLng], [userLat, userLng]];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: "#0f172a" }}
    >
      {/* Top bar */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-3 flex items-center gap-3 flex-shrink-0 shadow-lg">
        <button
          onClick={onClose}
          className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
        >
          <FaTimes className="text-white" />
        </button>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <FaRoute className="text-white text-base" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm leading-tight">
              Yo'nalish Xaritasi
            </h2>
            <p className="text-blue-200 text-[10px]">
              Ambulans → Bemor joylashuvi
            </p>
          </div>
        </div>
        {route && !loading && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {route.dist && (
              <div className="text-right">
                <p className="text-white font-black text-lg leading-none">
                  {route.dist} km
                </p>
                <p className="text-blue-200 text-[9px]">masofa</p>
              </div>
            )}
            {route.dur && (
              <div className="text-right">
                <p className="text-white font-black text-lg leading-none">
                  ~{route.dur} min
                </p>
                <p className="text-blue-200 text-[9px]">taxminiy</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900">
            <div className="text-center">
              <FaSpinner className="text-blue-400 text-4xl spin-slow mx-auto mb-3" />
              <p className="text-white font-semibold">Yo'l hisoblanmoqda...</p>
              <p className="text-slate-400 text-sm mt-1">OSRM xizmati bilan bog'lanilmoqda</p>
            </div>
          </div>
        )}
        <MapContainer
          center={[adminLat, adminLng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution=""
          />

          {/* Admin marker */}
          {isFinite(adminLat) && isFinite(adminLng) && (
            <Marker position={[adminLat, adminLng]} icon={adminIcon}>
              <Popup>
                <div className="text-center p-1">
                  <p className="font-bold text-blue-700">🚑 Ambulans joylashuvi</p>
                  <p className="text-xs text-gray-500 mt-0.5">Sizning pozitsiyangiz</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* User marker */}
          {isFinite(userLat) && isFinite(userLng) && (
            <Marker position={[userLat, userLng]} icon={userIcon}>
              <Popup>
                <div className="text-center p-1">
                  <p className="font-bold text-red-600">🏥 Bemor joylashuvi</p>
                  <p className="text-xs text-gray-500 mt-0.5 max-w-[180px] line-clamp-2">
                    {request.placeName || "Noma'lum manzil"}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Route polyline */}
          {route && route.coords && route.coords.length >= 2 && (
            <>
              <Polyline
                positions={route.coords}
                color="#1d4ed8"
                weight={8}
                opacity={0.2}
              />
              <Polyline
                positions={route.coords}
                color="#3b82f6"
                weight={5}
                opacity={0.9}
              />
            </>
          )}

          <FitBounds positions={allPositions} />
        </MapContainer>

        {/* Legend overlay */}
        <div className="absolute bottom-4 left-4 z-[1000] space-y-2">
          <div className="glass rounded-xl px-3 py-2.5 shadow-md border border-white/60 flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-sm flex-shrink-0">
              🚑
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Ambulans</p>
              <p className="text-[10px] text-gray-500">Sizning joylashuvingiz</p>
            </div>
          </div>
          <div className="glass rounded-xl px-3 py-2.5 shadow-md border border-white/60 flex items-center gap-2.5">
            <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
              🏥
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Bemor</p>
              <p className="text-[10px] text-gray-500 max-w-[140px] line-clamp-1">
                {request.placeName || "Manzil"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="bg-white px-4 py-4 flex gap-3 flex-shrink-0 shadow-2xl">
        <button
          onClick={onClose}
          className="flex-1 border-2 border-gray-100 bg-gray-50 text-gray-600 py-4 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors"
        >
          Orqaga
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onAccept(request.id)}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-green-200 hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
        >
          <FaCheckCircle />
          Qabul qilindi
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Request card ─────────────────────────────────────────────
function RequestCard({ req, index, onNavigate }) {
  const statusConfig = {
    pending: {
      label: "Kutilmoqda",
      bg: "bg-amber-50",
      border: "border-amber-200",
      dot: "bg-amber-500",
      text: "text-amber-700",
    },
    accepted: {
      label: "Qabul qilindi",
      bg: "bg-green-50",
      border: "border-green-200",
      dot: "bg-green-500",
      text: "text-green-700",
    },
    resolved: {
      label: "Bajarildi",
      bg: "bg-slate-50",
      border: "border-slate-200",
      dot: "bg-slate-400",
      text: "text-slate-500",
    },
  };
  const cfg = statusConfig[req.status] || statusConfig.pending;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`${cfg.bg} border ${cfg.border} rounded-2xl overflow-hidden`}
    >
      {/* Card header */}
      <div className="px-4 pt-4 pb-3 flex items-start gap-3">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${req.status === "pending"
              ? "bg-red-100"
              : req.status === "accepted"
                ? "bg-green-100"
                : "bg-slate-100"
            }`}
        >
          {req.status === "pending" ? (
            <FaAmbulance className="text-red-500 text-lg" />
          ) : req.status === "accepted" ? (
            <FaCheckCircle className="text-green-500 text-lg" />
          ) : (
            <FaCheckCircle className="text-slate-400 text-lg" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-black text-gray-900">{req.id}</p>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${req.status === 'pending' ? 'animate-pulse' : ''}`} />
              {cfg.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <FaClock className="text-gray-400 text-[10px]" />
            <p className="text-[11px] text-gray-500 font-medium">{req.time}</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="px-4 pb-3 flex items-start gap-2">
        <HiOutlineLocationMarker className="text-red-400 text-base flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600 leading-snug line-clamp-2">
          {req.placeName || "Joylashuv aniqlanmagan"}
        </p>
      </div>

      {/* Disease info */}
      {req.disease && (
        <div className="px-4 pb-3">
          <div className="bg-red-50 border border-red-100 rounded-xl p-3">
            <p className="text-xs font-bold text-red-700 mb-1">🏥 Kasallik varaqasi:</p>
            <p className="text-sm font-semibold text-gray-800 mb-2">{req.disease.name}</p>
            <div className="bg-white rounded-lg p-2 border border-red-100">
              <p className="text-xs font-bold text-red-600 flex items-center gap-1 mb-1">
                <IoMdAlert /> Mumkin emas:
              </p>
              <ul className="list-disc pl-4 text-xs text-gray-700 space-y-0.5">
                {req.disease.contraindications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Coords pill */}
      {req.lat && req.lng && (
        <div className="px-4 pb-3">
          <span className="text-[10px] bg-white/80 border border-gray-100 rounded-lg px-2 py-1 text-gray-500 font-mono">
            {req.lat.toFixed(5)}, {req.lng.toFixed(5)}
          </span>
        </div>
      )}

      {/* Action button */}
      {req.status === "pending" && (
        <div className="px-4 pb-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate(req)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-blue-200 hover:from-blue-700 hover:to-blue-600 transition-all"
          >
            <FaRoute className="text-base" />
            Yo'lga chiqish
          </motion.button>
        </div>
      )}

      {req.status === "accepted" && (
        <div className="px-4 pb-4">
          <div className="w-full bg-green-100 border border-green-200 text-green-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
            <FaCheckCircle />
            Brigada yo'lda
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Main AdminDashboard ───────────────────────────────────────
export default function AdminDashboard() {
  const { logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [adminPos, setAdminPos] = useState(null);
  const [locating, setLocating] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const refreshRef = useRef(null);

  const loadRequests = () => {
    setRequests(getRequests());
  };

  useEffect(() => {
    loadRequests();
    // Poll every 3s for new requests (mock real-time)
    refreshRef.current = setInterval(loadRequests, 3000);
    return () => clearInterval(refreshRef.current);
  }, []);

  const getAdminLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAdminPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        // fallback to default
        setAdminPos({ lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] });
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleNavigate = (req) => {
    setActiveRequest(req);
    if (!adminPos) {
      // Try to get location, then open map
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setAdminPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocating(false);
          setShowMap(true);
        },
        () => {
          setAdminPos({ lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] });
          setLocating(false);
          setShowMap(true);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setShowMap(true);
    }
  };

  const handleAccept = (id) => {
    updateRequest(id, { status: "accepted" });
    loadRequests();
    setShowMap(false);
    setActiveRequest(null);
  };

  const pending = requests.filter((r) => r.status === "pending");
  const others = requests.filter((r) => r.status !== "pending");

  return (
    <>
      {/* Routing map modal */}
      <AnimatePresence>
        {showMap && activeRequest && (
          <RoutingMapModal
            request={activeRequest}
            adminPos={adminPos}
            onClose={() => setShowMap(false)}
            onAccept={handleAccept}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-100">
        {/* Admin Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-white/10 shadow-lg">
          <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <FaAmbulance className="text-white text-base" />
              </div>
              <div>
                <h1 className="text-white font-bold text-sm leading-tight">MEP Admin Panel</h1>
                <div className="flex items-center gap-1.5">
                  <RiShieldUserFill className="text-red-400 text-xs" />
                  <p className="text-slate-400 text-[10px] font-medium">Dispetcher rejimi</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Location button */}
              <button
                onClick={getAdminLocation}
                disabled={locating}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${adminPos
                    ? "bg-green-600/20 text-green-400 border border-green-600/30"
                    : "bg-white/10 text-slate-300 border border-white/20 hover:bg-white/20"
                  }`}
              >
                {locating ? (
                  <FaSpinner className="spin-slow" />
                ) : (
                  <BsFillCursorFill />
                )}
                <span className="hidden sm:inline">
                  {adminPos ? "GPS faol" : "GPS aniqlash"}
                </span>
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl text-xs font-semibold transition-all border border-white/20"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Chiqish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-[57px] max-w-2xl mx-auto px-4 py-4 space-y-4">

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              {
                value: pending.length,
                label: "Kutilmoqda",
                icon: MdOutlinePendingActions,
                color: "text-amber-500",
                bg: "bg-amber-50",
                border: "border-amber-100",
              },
              {
                value: requests.filter((r) => r.status === "accepted").length,
                label: "Qabul qilindi",
                icon: FaCheckCircle,
                color: "text-green-500",
                bg: "bg-green-50",
                border: "border-green-100",
              },
              {
                value: requests.length,
                label: "Jami",
                icon: MdMedicalServices,
                color: "text-blue-500",
                bg: "bg-blue-50",
                border: "border-blue-100",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.bg} border ${s.border} rounded-2xl p-3 text-center`}
              >
                <s.icon className={`${s.color} text-xl mx-auto mb-1`} />
                <p className="text-2xl font-black text-gray-800">{s.value}</p>
                <p className="text-[10px] text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Pending section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                {pending.length > 0 && (
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Yangi so'rovlar
                </p>
              </div>
              {pending.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {pending.length}
                </span>
              )}
            </div>

            {pending.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <MdOutlinePendingActions className="text-slate-300 text-3xl" />
                </div>
                <p className="text-gray-500 font-semibold text-sm">
                  Hozircha yangi so'rovlar yo'q
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Foydalanuvchi tez yordam chaqirganda bu yerda ko'rinadi
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Avtomatik yangilanadi
                </div>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {pending.map((req, i) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    index={i}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            )}
          </div>

          {/* History */}
          {others.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Tarix
              </p>
              <div className="space-y-3">
                {others.map((req, i) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    index={i}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Instructions card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <IoMdAlert className="text-amber-400 text-lg flex-shrink-0" />
              <p className="font-bold text-sm">Demo ko'rsatma</p>
            </div>
            <ol className="space-y-2">
              {[
                "Foydalanuvchi sifatida kiring",
                "'Tez Yordam Chaqirish' tugmasini bosing",
                "So'rov yuboring, keyin chiqing",
                "Admin sifatida kiring — so'rov bu yerda ko'rinadi",
                "'Yo'lga chiqish' tugmasini bosing",
                "Xaritada yo'nalishni ko'ring va 'Qabul qilindi' bosing",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </motion.div>

          <div className="h-4" />
        </div>
      </div>
    </>
  );
}
