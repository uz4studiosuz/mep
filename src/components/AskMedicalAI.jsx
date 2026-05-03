import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiRobot2Fill, RiSendPlane2Fill } from "react-icons/ri";
import { FaUser, FaExclamationTriangle } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { BsShieldFillCheck } from "react-icons/bs";

// ── Demo AI response bank ──────────────────────────────────────
const DEMO_RESPONSES = [
  {
    triggers: ["bosh og'ri", "boshim og'ri", "bosh aylan", "migran", "kallam"],
    title: "Bosh og'rig'i",
    response: `Bosh og'rig'i uchun quyidagi choralar ko'ring:

• Tinch, qorong'i xonada yoting va ko'zingizni yuming
• 1–2 stakan iliq suv iching — ko'pincha suvsizlanish sabab bo'ladi
• Peshonangizga sovuq namlik qo'ying (10–15 daqiqa)
• Ekran va yorug'lik ta'sirini kamaytiring
• Engil bosh massaji qiling — chakkalar va bo'yin sohasida

⚠️ ZUDLIK bilan 103 ga murojaat qiling, agar:
→ Og'riq keskin va to'satdan boshlangan bo'lsa
→ Ko'rish yo'qolsa yoki qo'l-oyoq uvishsa
→ Nutq buzilsa yoki yuz qiyshaysa`,
  },
  {
    triggers: ["yurak", "ko'krak", "ko'kragim", "infarkt", "yuragim", "nafas ol"],
    title: "Yurak / Ko'krak og'rig'i",
    response: `Yurak sohasidagi og'riq JIDDIY belgi bo'lishi mumkin.

DARHOL quyidagilarni qiling:
• Bemorni o'tqazing yoki yotqizing — siljitmang
• Kiyimini bo'shatib bering, havo kirishini ta'minlang
• 103 ga DARHOL qo'ng'iroq qiling

Yurak xuruji belgilari:
→ Ko'krak sohasi bosish/siqish hissi
→ Chap yelka, jag', qo'lga tarqaluvchi og'riq
→ Sovuq ter, ko'ngil aynishi
→ Havo yetishmasligi hissi

❗ Ushbu holat kutishni talab qilmaydi — 103 ga qo'ng'iroq qiling.`,
  },
  {
    triggers: ["qon", "qonash", "qon ket", "jarohat", "yara", "lat ye"],
    title: "Qon ketish / Jarohat",
    response: `Qon ketishda birinchi yordam:

1. Toza mato yoki doka bilan jarohat ustiga bosing
2. Bosimni 10–15 daqiqa uzliksiz saqlang
3. Qo'l yoki oyoqda bo'lsa — yuqori ko'taring
4. Qon singib o'tayotgan bo'lsa — ustiga yangi doka qo'ying

Tourniquet (to'sqich) faqat:
→ Kuchli qon oqayotganda (to'xtamayotganda)
→ Qo'l yoki oyoqda bo'lganda
→ Vaqtini yozing (masalan: "14:35")

🚨 Agar qon to'xtamasa yoki juda ko'p yo'qotilgan bo'lsa:
Darhol 103 ga murojaat qiling!`,
  },
  {
    triggers: ["zahar", "zaharlan", "ovqat", "ich ketish", "ko'ngil ayn", "qayt"],
    title: "Zaharlanish / Ich ketish",
    response: `Zaharlanish belgilari va birinchi yordam:

Darhol bajaring:
• Ko'proq suv iching (iliq)
• Sho'r cracker yoki guruch sho'rvasi iching
• Faollashtirilgan ko'mir (aptekadan) iching — 1 tabletka / 10 kg vazn

QAYTARISH hosil qilmang, agar:
→ Kislota, ishqor yoki neft mahsulotlari ichilgan bo'lsa
→ Bemor hushini yo'qotgan bo'lsa

Shifokorga murojaat qiling, agar:
→ Qon aralash qayt bo'lsa
→ Ich ketish 24 soatdan oshsa
→ Bolada (5 yoshgacha) bo'lsa`,
  },
  {
    triggers: ["harorat", "isitma", "gripp", "shamoll", "sovuq ol", "burun", "tomog'im"],
    title: "Isitma / Shamollash",
    response: `Isitma (harorat) uchun birinchi yordam:

38°C gacha:
• Ko'p suv iching (8+ stakan/kun)
• Iliq libos kiyib, dam oling
• Badan artish — iliq suvli doka bilan

38–39°C da:
• Paracetamol yoki ibuprofen qabul qiling
• Sovuq kompresslar qo'ying

39°C dan yuqori bo'lsa:
• Zudlik bilan shifokorga boring
• Bolalarda 38°C dan yuqori bo'lsa — darhol

❄️ Sovuq dushdan saqlaning — bu isitmani ko'tarib yuboradi!

Kasalxonaga boring, agar:
→ 3 kundan ko'p davom etsa
→ Tez nafas olish, og'riq kuchaysa`,
  },
  {
    triggers: ["suyak sin", "suyak", "chiqiq", "qo'lim sin", "oyog'im sin", "shikast"],
    title: "Suyak sinishi / Chiqiq",
    response: `Suyak sinishi yoki chiqiqda birinchi yordam:

BAJARMANG:
✗ Shikastlangan joyni o'zingiz to'g'rilashga urinmang
✗ Bemorni shoshilinch ko'chirmang
✗ Og'riq bor joyga bosim bermang

BAJARING:
• Jarohatlangan qo'l/oyoqni harakatsiz qiling (shinaga o'rang)
• Shina bo'lmasa — taxta, umbrella yoki o'rik shoxidan foydalaning
• Muzli kompressni sochiqqa o'rab qo'ying (shish kamaytiradi)
• Jarohat bo'lsa — tozalab bog'lang

🚑 103 ga murojaat qiling, agar:
→ Suyak teri tashqarisiga chiqqan bo'lsa
→ Bemor qo'l/oyog'ini his etmasa
→ Bo'yin yoki orqa umurtqa shikastlangan bo'lsa`,
  },
  {
    triggers: ["kuy", "olov", "qaynoq", "kuyd"],
    title: "Kuyish",
    response: `Kuyishda birinchi yordam:

Darhol:
• Kuygan joyni 15–20 daqiqa SOVUQ suv ostida ushlab turing
• Kiyim va zargarlik buyumlarini sekin yoqib oling
• Pufakchalarni yorib yubormang!

Maz va moylarga YO'Q:
✗ Sariyog', tuxum oqi, tish pastasi QOYMANG — infeksiya qo'shiladi

Bog'lang:
• Toza doka yoki idish plyonkasi bilan yopmang (bosim bermay)

🚨 Darhol 103 ga murojaat qiling, agar:
→ Kuyish 2 kafdan katta bo'lsa
→ Yuz, qo'l, jinsiy organ yoki bo'g'in sohasida bo'lsa
→ Bola 5 yoshdan kichik bo'lsa`,
  },
  {
    triggers: ["hush", "hushdan ket", "behush", "yiqil", "aytmaydi", "ko'zini och"],
    title: "Hushini yo'qotish",
    response: `Hushini yo'qotgan bemorda birinchi yordam:

DARHOL:
1. 103 ga qo'ng'iroq qiling
2. Bemorni yonboshiga yotqizing (til yutmaslik uchun)
3. Havo yo'lini oching — boshini orqaga egib, iyagini ko'taring
4. Nafas olayotganini tekshiring (ko'rish + eshitish)
5. Nafas yo'q bo'lsa — CPR boshlang (30 bosish : 2 nafas)

QILMANG:
✗ Suvga botirib yuvmang
✗ Silkimang yoki qo'zg'atmang
✗ Og'ziga narsa berma

Boshini jarohatlangan bo'lishi mumkin — ko'chirish ehtiyotkorlik bilan!`,
  },
];

const DEFAULT_RESPONSE = `Savolingiz uchun rahmat!

Afsuski, bu mavzu bo'yicha aniq ma'lumotim yo'q. Iltimos, quyidagi mavzularda savol bering:

• Bosh og'rig'i
• Yurak/ko'krak og'rig'i
• Qon ketish/jarohat
• Zaharlanish
• Isitma/shamollash
• Suyak sinishi
• Kuyish
• Hushini yo'qotish

🔴 Favqulodda holat bo'lsa — darhol 103 ga qo'ng'iroq qiling!`;

function findResponse(question) {
  const q = question.toLowerCase();
  for (const item of DEMO_RESPONSES) {
    if (item.triggers.some((trigger) => q.includes(trigger))) {
      return { title: item.title, text: item.response };
    }
  }
  return { title: "Tibbiy maslahat", text: DEFAULT_RESPONSE };
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
        <RiRobot2Fill className="text-white text-sm" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-teal-400 rounded-full typing-dot" />
          <span className="w-2 h-2 bg-teal-400 rounded-full typing-dot" />
          <span className="w-2 h-2 bg-teal-400 rounded-full typing-dot" />
        </div>
      </div>
    </div>
  );
}

export default function AskMedicalAI() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Salom! Men MEP tibbiy AI maslahatchi (Demo) — demo rejimda ishlayman.\n\nQuyidagi mavzularda yordam bera olaman:\n• Bosh og'rig'i, isitma, shamollash\n• Yurak va nafas muammolari\n• Jarohat, qon ketish, kuyish\n• Zaharlanish, ich ketish\n• Suyak sinishi, chiqiq\n• Hushini yo'qotish holatlari\n\nSavolingizni yozing, javob beraman!",
      time: new Date().toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q) return;

    const now = new Date().toLocaleTimeString("uz", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [...prev, { role: "user", text: q, time: now }]);
    setInput("");
    setTyping(true);

    // Simulate AI "thinking" time (1.5–2.5s)
    const delay = 1500 + Math.random() * 1000;
    await new Promise((r) => setTimeout(r, delay));

    const { title, text } = findResponse(q);
    const aiTime = new Date().toLocaleTimeString("uz", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setTyping(false);
    setMessages((prev) => [
      ...prev,
      { role: "ai", text, title, time: aiTime },
    ]);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "Boshim og'riyapti",
    "Isitmam bor",
    "Yuragim og'riyapti",
    "Qo'lim singan",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-57px)] lg:h-[calc(100vh-57px)] bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <NavLink
            to="/"
            className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <IoArrowBack className="text-gray-600 text-base" />
          </NavLink>
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
            <RiRobot2Fill className="text-white text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-gray-900">
              AI Tibbiy Maslahatchi
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full blink" />
              <span className="text-xs text-green-600 font-medium">
                Demo rejim · Ma'lumot bazasidan
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-2.5 py-1.5 flex-shrink-0">
            <FaExclamationTriangle className="text-amber-500 text-xs" />
            <span className="text-[10px] text-amber-700 font-semibold">
              Demo
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3">
        <div className="max-w-2xl mx-auto space-y-1">
          {messages.map((msg, i) => (
            <AnimatePresence key={i}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-end gap-2 mb-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {msg.role === "ai" ? (
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                      <RiRobot2Fill className="text-white text-sm" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                      <FaUser className="text-white text-xs" />
                    </div>
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[80%] sm:max-w-md ${
                    msg.role === "user" ? "items-end" : "items-start"
                  } flex flex-col`}
                >
                  {msg.role === "ai" && msg.title && (
                    <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-1 px-1">
                      {msg.title}
                    </p>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-sm"
                        : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          ))}

          {typing && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && !typing && (
        <div className="px-3 pb-2 max-w-2xl mx-auto w-full">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2 px-1">
            Tez savollar
          </p>
          <div className="flex gap-2 flex-wrap">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-all font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="px-3 pb-1 max-w-2xl mx-auto w-full flex-shrink-0">
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
          <BsShieldFillCheck className="text-amber-500 text-sm flex-shrink-0" />
          <p className="text-[10px] text-amber-700 leading-tight">
            Bu AI maslahat shifokor ko'rigini almashtirmaydi. Jiddiy holatda{" "}
            <strong>103</strong> ga qo'ng'iroq qiling.
          </p>
        </div>
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-100 shadow-sm px-3 py-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
            }}
            onKeyDown={handleKey}
            placeholder="Savolingizni yozing..."
            className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 bg-gray-50 scrollbar-thin min-h-[44px] max-h-[100px] overflow-y-auto"
            style={{ height: "44px" }}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim() || typing}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${
              input.trim() && !typing
                ? "bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md shadow-teal-200 hover:from-teal-600 hover:to-teal-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <RiSendPlane2Fill className="text-lg" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
