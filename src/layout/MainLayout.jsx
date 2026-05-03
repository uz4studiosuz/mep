import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaHome, FaVideo, FaSignOutAlt } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import { MdMedicalServices } from "react-icons/md";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { path: "/", icon: FaHome, label: "Bosh sahifa", end: true },
  { path: "/medicalAI", icon: RiRobot2Fill, label: "AI Maslahat", end: false },
  { path: "/video", icon: FaVideo, label: "Birinchi yordam", end: false },
];

function MainLayout() {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-[57px] bottom-0 w-64 bg-white border-r border-gray-100 flex-col z-40">
        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">
            Menyu
          </p>
          {navItems.map(({ path, icon: Icon, label, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "bg-red-50 text-red-600 border border-red-100 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`text-lg ${
                      isActive ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    <Icon />
                  </span>
                  {label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 bg-red-500 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Emergency card */}
        <div className="p-4 border-t border-gray-50">
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-4 text-white shadow-lg shadow-red-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <MdMedicalServices className="text-white text-base" />
              </div>
              <div>
                <p className="text-xs font-bold leading-none">Favqulodda</p>
                <p className="text-[10px] text-red-200 leading-none mt-0.5">
                  24 soat
                </p>
              </div>
            </div>
            <p className="text-xs text-red-100 mb-3 leading-relaxed">
              Xavfli holat yuzaga kelsa, darhol tez yordam chaqiring.
            </p>
            <motion.a
              href="tel:103"
              whileTap={{ scale: 0.97 }}
              className="block w-full bg-white text-red-600 text-sm font-bold py-2.5 rounded-xl text-center hover:bg-red-50 transition-colors"
            >
              📞 103 ga qo'ng'iroq
            </motion.a>
          </div>

          {/* Stats */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <p className="text-lg font-bold text-gray-800">4.2</p>
              <p className="text-[10px] text-gray-400 font-medium">
                min o'rtacha
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <p className="text-lg font-bold text-green-600">98%</p>
              <p className="text-[10px] text-gray-400 font-medium">
                muvaffaqiyat
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-red-500 py-2.5 rounded-xl hover:bg-red-50 transition-all font-semibold border border-transparent hover:border-red-100"
          >
            <FaSignOutAlt />
            Hisobdan chiqish
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 pt-[57px] pb-20 lg:pb-0 min-h-screen">
        <Outlet />
      </main>

      {/* Mobile bottom tab bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl z-50">
        <div className="flex max-w-screen-sm mx-auto">
          {navItems.map(({ path, icon: Icon, label, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-3 transition-all relative ${
                  isActive ? "text-red-600" : "text-gray-400"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-500 rounded-full" />
                  )}
                  <Icon className={`text-xl ${isActive ? "scale-110" : ""} transition-transform`} />
                  <span className="text-[10px] font-semibold">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
