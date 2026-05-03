import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FaAmbulance, FaUserAlt, FaShieldAlt, FaHospital } from "react-icons/fa";
import { RiShieldUserFill } from "react-icons/ri";
import { MdMedicalServices } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";

const STATS = [
  { value: "103", label: "Tez yordam raqami" },
  { value: "24/7", label: "Ish vaqti" },
  { value: "4.2'", label: "O'rtacha kelish" },
];

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-3xl shadow-2xl shadow-red-900/50 mb-4"
          >
            <FaAmbulance className="text-white text-3xl" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-black text-white tracking-tight">MEP</h1>
            <p className="text-slate-400 text-sm font-medium mt-1 tracking-widest uppercase">
              Medical Emergency Platform
            </p>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-2 mb-8"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-sm"
            >
              <p className="text-white font-black text-xl">{s.value}</p>
              <p className="text-slate-400 text-[10px] font-medium mt-0.5 leading-tight">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Role cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-3"
        >
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest text-center mb-4">
            Kirish turini tanlang
          </p>

          {/* User card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => login("user")}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-3xl p-5 flex items-center gap-4 shadow-xl shadow-blue-900/40 transition-all group"
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FaUserAlt className="text-white text-2xl" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-black text-lg leading-tight">
                Foydalanuvchi
              </p>
              <p className="text-blue-200 text-sm mt-0.5">
                Tez yordam chaqirish · AI maslahat
              </p>
            </div>
            <BsArrowRight className="text-white/60 text-xl group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </motion.button>

          {/* Admin card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => login("admin")}
            className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 rounded-3xl p-5 flex items-center gap-4 shadow-xl shadow-red-900/50 transition-all group"
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <RiShieldUserFill className="text-white text-2xl" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-black text-lg leading-tight">
                Dispetcher / Admin
              </p>
              <p className="text-red-200 text-sm mt-0.5">
                So'rovlarni qabul qilish · Yo'nalish
              </p>
            </div>
            <BsArrowRight className="text-white/60 text-xl group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </motion.button>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-2"
        >
          <MdMedicalServices className="text-slate-500 text-sm" />
          <p className="text-slate-500 text-xs text-center">
            Demo versiya · Startup prezentatsiyasi uchun
          </p>
          <FaShieldAlt className="text-slate-500 text-xs" />
        </motion.div>
      </motion.div>
    </div>
  );
}
