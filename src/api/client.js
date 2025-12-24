import axios from "axios";
import { useAuthStore } from "../store/auth";

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

export const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  try {
    // Access token from store if available
    const token = useAuthStore.getState().token;
    // Only attach Authorization for our own API calls (not external like OMDb)
    const url = config.url || "";
    const isAbsolute = /^https?:\/\//i.test(url);
    const isOurApi = !isAbsolute || (baseURL && typeof url === "string" && url.startsWith(baseURL));

    if (token && isOurApi) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // Surface server messages consistently
    const message = error?.response?.data?.message || error.message || "Request failed";
    return Promise.reject({ ...error, message });
  }
);

export default api;
