import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaAmbulance,
  FaPhoneAlt,
  FaHospital,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";
import { RiRobot2Fill } from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BsFillCursorFill, BsShieldFillCheck } from "react-icons/bs";
import { IoMdAlert } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { saveRequest } from "./context/AuthContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: shadow,
});

const DEFAULT_CENTER = [41.311081, 69.240562];

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15, { animate: true });
  }, [lat, lng, map]);
  return null;
}

// Emergency modal states: null | 'idle' | 'sending' | 'sent' | 'rejected'
function EmergencyModal({ open, onClose, position, placeName }) {
  const [stage, setStage] = useState("idle");
  const timerRef = useRef(null);

  useEffect(() => {
    if (!open) {
      timerRef.current && clearTimeout(timerRef.current);
      setStage("idle");
    }
  }, [open]);

  const handleSend = () => {
    setStage("sending");
    // Save request to localStorage so admin can see it
    const reqId = `MEP-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    saveRequest({
      id: reqId,
      timestamp: now.toISOString(),
      time: now.toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" }),
      lat: position?.lat || null,
      lng: position?.lng || null,
      placeName: placeName || "Joylashuv aniqlanmagan",
      status: "pending",
    });
    timerRef.current = setTimeout(() => setStage("sent"), 2200);
  };

  const handleAccept = () => {
    setStage("rejected");
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: "rgba(15,23,42,0.65)" }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            key="modal"
            initial={{ y: 80, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 pt-6 pb-5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
                    <FaAmbulance className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg leading-tight">
                      Tez Yordam
                    </h2>
                    <p className="text-red-200 text-xs">
                      Favqulodda tibbiy yordam xizmati
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <FaTimes className="text-white text-sm" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* IDLE stage */}
              {stage === "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Location */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HiOutlineLocationMarker className="text-red-500 text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Joylashuvingiz
                        </p>
                        <p className="text-sm text-gray-800 font-medium leading-snug line-clamp-2">
                          {placeName || "📍 Joylashuv aniqlanmoqda..."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <IoMdAlert className="text-amber-500 text-lg flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Ushbu tugma faqat{" "}
                      <strong>haqiqiy favqulodda holatlarda</strong> bosing.
                      Noto'g'ri chaqiruvlar jarima bilan jazolanadi.
                    </p>
                  </div>

                  {/* Info row */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "O'rtacha kelish", value: "4.2 min" },
                      { label: "Brigadalar", value: "12 ta" },
                      { label: "Muvaffaqiyat", value: "98%" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100"
                      >
                        <p className="text-sm font-bold text-gray-800">
                          {item.value}
                        </p>
                        <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSend}
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-red-200 pulse-emergency hover:from-red-700 hover:to-red-600 transition-all"
                  >
                    <FaAmbulance className="text-xl" />
                    Tez Yordam Chaqirish
                  </motion.button>

                  <a
                    href="tel:103"
                    className="block w-full border-2 border-blue-100 bg-blue-50 text-blue-700 py-3.5 rounded-2xl font-bold text-sm text-center hover:bg-blue-100 transition-colors"
                  >
                    <FaPhoneAlt className="inline mr-2 text-xs" />
                    103 ga bevosita qo'ng'iroq
                  </a>
                </motion.div>
              )}

              {/* SENDING stage */}
              {stage === "sending" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 flex flex-col items-center gap-5"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center">
                      <FaAmbulance className="text-red-400 text-3xl" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-red-400 border-t-transparent spin-slow" />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-800 font-bold text-lg">
                      Xabar yuborilmoqda...
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Eng yaqin brigada aniqlanmoqda
                    </p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.2, ease: "linear" }}
                      className="bg-red-500 h-1.5 rounded-full"
                    />
                  </div>
                </motion.div>
              )}

              {/* SENT stage */}
              {stage === "sent" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col items-center gap-3 py-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-20 h-20 bg-green-50 border-4 border-green-200 rounded-full flex items-center justify-center"
                    >
                      <FaCheckCircle className="text-green-500 text-4xl" />
                    </motion.div>
                    <div className="text-center">
                      <p className="text-gray-900 font-bold text-xl">
                        Xabar yuborildi!
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Tez yordam brigadasi chaqirildi
                      </p>
                    </div>
                  </div>

                  {/* ETA card */}
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaAmbulance className="text-green-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-green-800 font-bold text-sm">
                        Taxminiy kelish vaqti
                      </p>
                      <p className="text-green-600 text-2xl font-black leading-tight">
                        ~4–7 daqiqa
                      </p>
                    </div>
                  </div>

                  {/* Location confirmation */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2.5">
                    <HiOutlineLocationMarker className="text-red-400 text-lg flex-shrink-0" />
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {placeName || "Joylashuvingiz yuborildi"}
                    </p>
                  </div>

                  {/* Accept button */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAccept}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-green-200 hover:from-green-600 hover:to-emerald-600 transition-all"
                  >
                    <BsShieldFillCheck className="text-xl" />
                    Qabul qildim
                  </motion.button>

                  <button
                    onClick={onClose}
                    className="w-full text-gray-400 text-sm py-2 font-medium hover:text-gray-600 transition-colors"
                  >
                    Yopish
                  </button>
                </motion.div>
              )}

              {/* REJECTED stage */}
              {stage === "rejected" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col items-center gap-3 py-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-20 h-20 bg-orange-50 border-4 border-orange-200 rounded-full flex items-center justify-center"
                    >
                      <FaTimesCircle className="text-orange-500 text-4xl" />
                    </motion.div>
                    <div className="text-center">
                      <p className="text-gray-900 font-bold text-xl">
                        Hozircha qabul qilinmadi
                      </p>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed max-w-xs">
                        Barcha brigadalar band bo'lishi mumkin. Iltimos kuting
                        yoki 103 ga murojaat qiling.
                      </p>
                    </div>
                  </div>

                  {/* Status info */}
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse flex-shrink-0" />
                      <p className="text-sm text-orange-700 font-medium">
                        So'rovingiz navbatda — buyurtma #MEP-
                        {Math.floor(Math.random() * 9000) + 1000}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        Eng yaqin bo'sh brigada siz bilan bog'lanadi
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <motion.a
                    href="tel:103"
                    whileTap={{ scale: 0.97 }}
                    className="block w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-2xl font-bold text-base text-center shadow-lg shadow-red-200"
                  >
                    <FaPhoneAlt className="inline mr-2" />
                    103 — Bevosita qo'ng'iroq
                  </motion.a>

                  <button
                    onClick={() => setStage("idle")}
                    className="w-full border-2 border-gray-100 bg-gray-50 text-gray-600 py-3.5 rounded-2xl font-semibold text-sm hover:bg-gray-100 transition-colors"
                  >
                    Qayta urinib ko'rish
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full text-gray-400 text-sm py-2 font-medium hover:text-gray-600 transition-colors"
                  >
                    Yopish
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Home() {
  const [position, setPosition] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const getMyLocation = () => {
    setError("");
    setLocating(true);
    if (!navigator.geolocation) {
      setError("Brauzer geolokatsiyani qo'llab-quvvatlamaydi");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition({ lat, lng });
        setLocating(false);
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
        setError("Joylashuvga ruxsat berilmadi yoki GPS o'chiq");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const getHospitals = async () => {
    const lat = position?.lat || DEFAULT_CENTER[0];
    const lng = position?.lng || DEFAULT_CENTER[1];
    const viewbox = `${lng - 0.05},${lat - 0.05},${lng + 0.05},${lat + 0.05}`;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=hospital&limit=20&viewbox=${viewbox}&bounded=1`
      );
      const data = await res.json();
      setHospitals(
        data.map((h, i) => ({ id: i, lat: Number(h.lat), lng: Number(h.lon), name: h.display_name }))
      );
    } catch {
      setError("Shifoxonalarni olishda xatolik");
    }
  };

  const quickCards = [
    {
      to: "/video",
      icon: MdMedicalServices,
      label: "Birinchi yordam",
      sub: "Video darsliklar",
      bg: "bg-rose-50",
      border: "border-rose-100",
      iconColor: "text-rose-500",
      iconBg: "bg-rose-100",
    },
    {
      to: "/medicalAI",
      icon: RiRobot2Fill,
      label: "AI Maslahatchi",
      sub: "Tibbiy maslahat",
      bg: "bg-blue-50",
      border: "border-blue-100",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      onClick: getHospitals,
      icon: FaHospital,
      label: "Yaqin Shifoxona",
      sub: "Xaritada ko'rish",
      bg: "bg-amber-50",
      border: "border-amber-100",
      iconColor: "text-amber-500",
      iconBg: "bg-amber-100",
    },
    {
      to: "/temporarilyunavailable",
      icon: FaMapMarkerAlt,
      label: "Joylashuvlar",
      sub: "Tarixiy ma'lumot",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
  ];

  return (
    <>
      <EmergencyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        position={position}
        placeName={placeName}
      />

      <div className="flex flex-col min-h-[calc(100vh-57px)]">
        {/* Map section */}
        <div className="relative flex-shrink-0" style={{ height: "52vh", minHeight: 260 }}>
          <MapContainer
            center={position ? [position.lat, position.lng] : DEFAULT_CENTER}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution=""
            />
            {position && <RecenterMap lat={position.lat} lng={position.lng} />}
            {position && (
              <Marker position={[position.lat, position.lng]}>
                <Popup>
                  <span className="font-semibold">📍 Siz shu yerdasiz</span>
                  <br />
                  <span className="text-xs text-gray-500 line-clamp-2">
                    {placeName}
                  </span>
                </Popup>
              </Marker>
            )}
            {hospitals.map((h) => (
              <Marker key={h.id} position={[h.lat, h.lng]}>
                <Popup>
                  <span className="font-semibold text-sm">🏥 {h.name}</span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map overlay controls */}
          <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={getMyLocation}
              disabled={locating}
              className={`w-11 h-11 bg-white shadow-lg rounded-2xl flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-all ${
                locating ? "opacity-60" : ""
              }`}
              title="Mening joylashuvim"
            >
              {locating ? (
                <FaSpinner className="text-blue-500 text-lg spin-slow" />
              ) : (
                <BsFillCursorFill className="text-blue-600 text-lg" />
              )}
            </motion.button>
          </div>

          {/* Location pill */}
          {placeName && (
            <div className="absolute top-3 left-3 right-3 z-[1000]">
              <div className="glass rounded-xl px-3 py-2 shadow-md border border-white/60 flex items-center gap-2 max-w-xs mx-auto sm:mx-0">
                <HiOutlineLocationMarker className="text-red-500 text-base flex-shrink-0" />
                <p className="text-xs text-gray-700 font-medium line-clamp-1">
                  {placeName}
                </p>
              </div>
            </div>
          )}

          {/* Error pill */}
          {error && (
            <div className="absolute top-3 left-3 right-3 z-[1000]">
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 shadow-md flex items-center gap-2 max-w-xs">
                <IoMdAlert className="text-red-500 text-base flex-shrink-0" />
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom panel */}
        <div className="flex-1 bg-slate-100 px-4 pt-4 pb-4 space-y-3 max-w-screen-sm mx-auto w-full lg:max-w-none lg:mx-0">
          {/* Location card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <HiOutlineLocationMarker className="text-red-500 text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                Joriy manzil
              </p>
              <p className="text-sm text-gray-700 font-medium leading-snug line-clamp-1 mt-0.5">
                {placeName || "📍 GPS orqali aniqlash uchun bosing"}
              </p>
            </div>
            {!position && (
              <button
                onClick={getMyLocation}
                className="flex-shrink-0 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Aniqlash
              </button>
            )}
          </motion.div>

          {/* Emergency + Call buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 gap-2.5"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setModalOpen(true)}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-red-200 pulse-emergency hover:from-red-700 hover:to-red-600 transition-all"
            >
              <FaAmbulance className="text-xl" />
              Tez Yordam Chaqirish
            </motion.button>

            <motion.a
              href="tel:103"
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-blue-200 hover:from-blue-700 hover:to-blue-600 transition-all"
            >
              <FaPhoneAlt />
              103 ga qo'ng'iroq qilish
            </motion.a>
          </motion.div>

          {/* Quick access grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5 px-1">
              Tezkor kirish
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {quickCards.map((card, i) => {
                const Icon = card.icon;
                const content = (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`${card.bg} border ${card.border} rounded-2xl p-4 flex items-center gap-3 cursor-pointer`}
                  >
                    <div
                      className={`${card.iconBg} w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`${card.iconColor} text-xl`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 leading-tight">
                        {card.label}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {card.sub}
                      </p>
                    </div>
                  </motion.div>
                );
                if (card.to) {
                  return (
                    <NavLink key={i} to={card.to}>
                      {content}
                    </NavLink>
                  );
                }
                return (
                  <div key={i} onClick={card.onClick}>
                    {content}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Home;
