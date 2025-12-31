import { create } from "zustand";
import { loginApi, registerApi, meApi } from "../api/auth";

const LOCAL_KEY = "user";

const persisted = () => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: persisted()?.user || null,
  token: persisted()?.token || null,
  status: "idle", // idle | loading | error
  error: null,

  setAuth: ({ user, token }) => {
    const payload = { user, token };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(payload));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem(LOCAL_KEY);
    set({ user: null, token: null, status: "idle", error: null });
  },

  login: async (username, password) => {
    set({ status: "loading", error: null });
    try {
      const data = await loginApi({ username, password });
      // Expect backend returns { user, token }
      const user = data.user || { username };
      const token = data.token || data.access || null;
      get().setAuth({ user, token });
      set({ status: "idle" });
      return { ok: true };
    } catch (err) {
      set({ status: "error", error: err.message || "Login failed" });
      return { ok: false, error: err };
    }
  },

  register: async (username, password, email, fullName) => {
    set({ status: "loading", error: null });
    try {
      const data = await registerApi({ username, password, email, fullName });
      const user = data.user || { username };
      const token = data.token || data.access || null;
      get().setAuth({ user, token });
      set({ status: "idle" });
      return { ok: true };
    } catch (err) {
      set({ status: "error", error: err.message || "Signup failed" });
      return { ok: false, error: err };
    }
  },

  loadMe: async () => {
    try {
      const data = await meApi();
      if (data?.user) {
        const token = get().token;
        get().setAuth({ user: data.user, token });
      }
    } catch {
      // ignore
    }
  },
}));
