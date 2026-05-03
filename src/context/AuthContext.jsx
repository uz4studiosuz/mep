import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "mep_role";

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem(STORAGE_KEY));

  const login = (r) => {
    localStorage.setItem(STORAGE_KEY, r);
    setRole(r);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// ── Emergency requests helpers (localStorage) ──────────────────
const REQ_KEY = "mep_requests";

export function saveRequest(req) {
  const existing = getRequests();
  existing.unshift(req);
  localStorage.setItem(REQ_KEY, JSON.stringify(existing));
}

export function getRequests() {
  try {
    return JSON.parse(localStorage.getItem(REQ_KEY) || "[]");
  } catch {
    return [];
  }
}

export function updateRequest(id, patch) {
  const list = getRequests().map((r) => (r.id === id ? { ...r, ...patch } : r));
  localStorage.setItem(REQ_KEY, JSON.stringify(list));
}
