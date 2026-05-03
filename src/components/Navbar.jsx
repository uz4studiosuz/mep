import React from "react";
import { motion } from "framer-motion";
import { FaAmbulance, FaPhoneAlt, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logout } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
              <FaAmbulance className="text-white text-lg" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white blink" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight tracking-tight">
              MEP
            </h1>
            <p className="text-[10px] text-gray-400 leading-none font-medium tracking-wide uppercase">
              Tibbiy Tez Yordam
            </p>
          </div>
        </div>

        {/* Center — status */}
        <div className="hidden sm:flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full blink" />
          <span className="text-xs text-green-700 font-semibold">
            Xizmat faol · 24/7
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Emergency call */}
          <motion.a
            href="tel:103"
            whileTap={{ scale: 0.93 }}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-2 rounded-xl text-sm font-bold shadow-md shadow-red-200 hover:from-red-700 hover:to-red-600 transition-all"
          >
            <FaPhoneAlt className="text-xs animate-pulse" />
            <span>103</span>
          </motion.a>

          {/* Logout — mobile only (desktop has sidebar button) */}
          <button
            onClick={logout}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all border border-gray-200 hover:border-red-200"
            title="Chiqish"
          >
            <FaSignOutAlt className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
