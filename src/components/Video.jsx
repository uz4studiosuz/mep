import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowBack, IoSearch } from "react-icons/io5";
import { FaPlay, FaVideo } from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";

const videos = [
  { id: "DuMEjPm_nGQ", title: "Birinchi tibbiy yordam – umumiy tushuncha", tag: "Asosiy" },
  { id: "YDHNQppWjhQ", title: "Birinchi yordam ko'rsatish qoidalari", tag: "Asosiy" },
  { id: "sWVhaynSRPE", title: "Birinchi yordamning 5 ta asosiy tamoyili", tag: "Asosiy" },
  { id: "gMpS5xpBOZ8", title: "Qon ketganda birinchi yordam", tag: "Jarohat" },
  { id: "nkGltvogWq0", title: "Suyak sinishida birinchi yordam", tag: "Jarohat" },
  { id: "WT3MGRXzXNM", title: "Kuyganda birinchi yordam", tag: "Kuyish" },
  { id: "AirKsjsAVHY", title: "Issiq urganda birinchi yordam", tag: "Issiqlik" },
  { id: "auOavGBPOeM", title: "Hushdan ketganda birinchi yordam", tag: "Favqulodda" },
  { id: "uL8J-wnLPC0", title: "Hushdan ketish holatida tez yordam", tag: "Favqulodda" },
  { id: "HWioJVza2WE", title: "Zaharlanishda birinchi yordam", tag: "Zaharlanish" },
  { id: "NzYLtYzt2pM", title: "Ovqatdan zaharlanganda yordam", tag: "Zaharlanish" },
  { id: "_gSKdaozykI", title: "Tok urgan odamga birinchi yordam", tag: "Favqulodda" },
  { id: "h_2ZsfMqE08", title: "Yurak xuruji (infarkt)da birinchi yordam", tag: "Yurak" },
  { id: "POIDsAIWI2g", title: "Yurak to'xtaganda CPR qilish", tag: "Yurak" },
  { id: "G1nmlDgKQZo", title: "Haydovchilar uchun birinchi yordam", tag: "Transport" },
  { id: "jvkKF3Ocgu4", title: "Birinchi yordam bo'yicha savol-javob", tag: "Asosiy" },
  { id: "gMpS5xpBOZ8", title: "Kuchli qon ketishni to'xtatish", tag: "Jarohat" },
  { id: "nkGltvogWq0", title: "Qo'l-oyoq shikastlanganda yordam", tag: "Jarohat" },
  { id: "WT3MGRXzXNM", title: "Uy sharoitida kuyishni davolash", tag: "Kuyish" },
  { id: "AirKsjsAVHY", title: "Quyosh urishida birinchi yordam", tag: "Issiqlik" },
];

const TAG_COLORS = {
  Asosiy: "bg-blue-100 text-blue-700",
  Jarohat: "bg-red-100 text-red-700",
  Kuyish: "bg-orange-100 text-orange-700",
  Issiqlik: "bg-yellow-100 text-yellow-700",
  Favqulodda: "bg-purple-100 text-purple-700",
  Zaharlanish: "bg-rose-100 text-rose-700",
  Yurak: "bg-pink-100 text-pink-700",
  Transport: "bg-teal-100 text-teal-700",
};

const allTags = ["Barchasi", ...new Set(videos.map((v) => v.tag))];

export default function Video() {
  const [currentVideo, setCurrentVideo] = useState(videos[0]);
  const [activeTag, setActiveTag] = useState("Barchasi");
  const [search, setSearch] = useState("");

  const filtered = videos.filter((v) => {
    const matchTag = activeTag === "Barchasi" || v.tag === activeTag;
    const matchSearch =
      !search || v.title.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <div className="min-h-[calc(100vh-57px)] bg-slate-100">
      <div className="max-w-5xl mx-auto lg:px-4 lg:py-4">
        <div className="bg-white lg:rounded-3xl shadow-sm overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-3 flex items-center gap-3">
            <NavLink
              to="/"
              className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            >
              <IoArrowBack className="text-white text-base" />
            </NavLink>
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <MdMedicalServices className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm leading-tight">
                  Birinchi Yordam
                </h2>
                <p className="text-rose-200 text-[10px]">
                  {videos.length} ta video darslik
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left — Player + info */}
            <div className="lg:flex-1 lg:border-r border-gray-100">
              {/* Video player */}
              <div className="relative w-full aspect-video bg-black">
                <AnimatePresence mode="wait">
                  <motion.iframe
                    key={currentVideo.id + currentVideo.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=0&rel=0`}
                    title={currentVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </AnimatePresence>
              </div>

              {/* Video info */}
              <div className="p-4 border-b border-gray-50">
                <div className="flex items-start gap-3">
                  <div>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${
                        TAG_COLORS[currentVideo.tag] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {currentVideo.tag}
                    </span>
                    <h3 className="text-gray-900 font-bold text-base leading-snug">
                      {currentVideo.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                      <FaVideo className="text-xs" />
                      YouTube · Tibbiy video darslik
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="hidden lg:grid grid-cols-3 gap-px bg-gray-100 border-b border-gray-100">
                {[
                  { label: "Jami videolar", value: videos.length },
                  { label: "Kategoriyalar", value: allTags.length - 1 },
                  { label: "Bepul kirish", value: "✓" },
                ].map((s) => (
                  <div key={s.label} className="bg-white p-4 text-center">
                    <p className="text-xl font-black text-gray-800">{s.value}</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Playlist */}
            <div className="lg:w-80 flex flex-col">
              {/* Search */}
              <div className="p-3 border-b border-gray-50">
                <div className="relative">
                  <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Video qidirish..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all"
                  />
                </div>
              </div>

              {/* Tag filter */}
              <div className="flex gap-1.5 px-3 py-2.5 overflow-x-auto border-b border-gray-50 scrollbar-thin flex-shrink-0">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                      activeTag === tag
                        ? "bg-rose-500 text-white shadow-sm"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Playlist */}
              <div className="overflow-y-auto scrollbar-thin flex-1" style={{ maxHeight: "calc(100vh - 380px)", minHeight: 200 }}>
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <FaVideo className="text-3xl mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Video topilmadi</p>
                  </div>
                ) : (
                  filtered.map((video, i) => {
                    const isActive =
                      currentVideo.id === video.id &&
                      currentVideo.title === video.title;
                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentVideo(video)}
                        className={`w-full flex items-center gap-3 p-3 text-left transition-all border-b border-gray-50 last:border-0 ${
                          isActive
                            ? "bg-rose-50 border-l-2 border-l-rose-500"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-20 h-12 object-cover rounded-xl"
                          />
                          {isActive && (
                            <div className="absolute inset-0 bg-rose-500/30 rounded-xl flex items-center justify-center">
                              <FaPlay className="text-white text-xs" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-semibold leading-snug line-clamp-2 ${
                              isActive ? "text-rose-700" : "text-gray-800"
                            }`}
                          >
                            {video.title}
                          </p>
                          <span
                            className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 ${
                              TAG_COLORS[video.tag] || "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {video.tag}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
