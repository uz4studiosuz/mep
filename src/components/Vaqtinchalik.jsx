import React from "react";

// YENGI: Minimal va zamonaviy — React + Tailwind komponenti
// Foydalanish: import Vaqtinchalik from './VaqtinchaIshlamaydiComponent'
// <Vaqtinchalik mode="card" onRetry={...} />

export default function Vaqtinchalik({
  title = "Xizmat vaqtincha o‘chiq",
  message = "Kechirasiz, hozir bu bo‘lim ishlamayapti. Biz muammoni tuzatmoqdamiz.",
  showRetry = true,
  onRetry = null,
  mode = "center", // 'center' | 'inline' | 'card'
  compact = false,
}) {
  const containerBase = "flex items-center justify-center p-4";
  const centerStyle = compact ? "fixed inset-4 z-50" : "fixed inset-0 z-50";

  const containerClass =
    mode === "center"
      ? `${containerBase} ${centerStyle}`
      : `${containerBase} relative`;

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div
        className={`${
          mode === "card" || mode === "center"
            ? "max-w-xl w-full bg-white rounded-2xl shadow-lg ring-1 ring-gray-100"
            : "w-full"
        } overflow-hidden`}
      >
        <div className={`p-6 ${compact ? "space-y-2" : "space-y-4"}`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-yellow-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-6 w-6 text-yellow-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className={`text-sm font-semibold ${
                  compact ? "text-gray-900" : "text-lg text-gray-900"
                }`}
              >
                {title}
              </h3>
              <p
                className={`text-sm ${
                  compact ? "text-gray-500" : "text-gray-600"
                }`}
              >
                {message}
              </p>
            </div>

            <div className="flex-shrink-0">
              {showRetry && (
                <button
                  onClick={onRetry}
                  disabled={!onRetry}
                  className="inline-flex items-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm font-medium bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50"
                >
                  Qayta urinib ko‘rish
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-gray-400">
              Agar muammo davom etsa, biz bilan bog‘laning.
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => (window.location.href = "/")}
                className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200"
              >
                Bosh sahifaga
              </button>

              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium bg-transparent border border-gray-200 hover:bg-gray-50"
              >
                Yangilash
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Past shadow for center mode */}
      {mode === "center" && (
        <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent to-black/5" />
      )}
    </div>
  );
}
