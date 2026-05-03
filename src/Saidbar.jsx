import React from "react";
import { motion } from "framer-motion";
import {
  FaAmbulance,
  FaPhoneAlt,
  FaHospital,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";
import { RiRobot2Fill } from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { NavLink } from "react-router-dom";

const Saidbar = ({ handleClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl w-full mx-auto p-5 bg-white rounded-2xl shadow-xl space-y-4"
    >
      {/* Manzil */}
      <div>
        <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <HiOutlineLocationMarker className="text-red-500" /> Belgilangan
          manzil
        </p>
        <p className="text-gray-800 font-medium">
          {/* Farg‘ona shahri, Shukrona ko‘chasi 4B */}
        </p>
      </div>

      {/* Tugmalar */}
      <div className="space-y-3">
        <NavLink
          to={"/temporarilyunavailable"}
          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
        >
          {" "}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
          >
            <FaAmbulance /> Tez yordam chaqirish
          </motion.button>
        </NavLink>
        <a
          href="tel:103"
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white  rounded-xl font-semibold hover:bg-blue-600 transition"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
          >
            <FaPhoneAlt /> 103 ga qo‘ng‘iroq qilish
          </motion.button>
        </a>
      </div>

      {/* Quick Access */}
      <div>
        <p className="text-gray-700 font-semibold mb-2">Quick Access</p>
        <div className="grid grid-cols-2 gap-3">
          <NavLink to={"/temporarilyunavailable"}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`flex flex-col items-center justify-center py-4 rounded-xl bg-pink-100 hover:bg-pink-200 transition`}
            >
              <MdMedicalServices className="text-red-500 text-2xl" />
              <p className="text-sm font-semibold text-gray-700 mt-1">
                Birinchi yordam
              </p>
            </motion.div>
          </NavLink>
          <NavLink to={"/medicalAI"}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`flex flex-col items-center justify-center py-4 rounded-xl bg-blue-100 hover:bg-blue-200 transition`}
            >
              <RiRobot2Fill className="text-blue-600 text-2xl" />
              <p className="text-sm font-semibold text-gray-700 mt-1">
                AI Maslahatchi
              </p>
            </motion.div>
          </NavLink>
          <div onClick={handleClick}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`flex flex-col items-center justify-center py-4 rounded-xl bg-orange-100 hover:bg-orange-200 transition`}
            >
              <FaHospital className="text-orange-500 text-2xl" />
              <p className="text-sm font-semibold text-gray-700 mt-1">
                Yaqin Shifoxonalar
              </p>
            </motion.div>
          </div>
          <NavLink to={"/temporarilyunavailable"}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`flex flex-col items-center justify-center py-4 rounded-xl bg-green-100 hover:bg-green-200 transition`}
            >
              <FaMapMarkerAlt className="text-green-600 text-2xl" />
              <p className="text-sm font-semibold text-gray-700 mt-1">
                Previous Locations
              </p>
            </motion.div>
          </NavLink>
        </div>
      </div>
    </motion.div>
  );
};

export default Saidbar;
