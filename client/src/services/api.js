/**
 * API Service - InternVerify
 * Axios instance with JWT interceptor
 */
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/verify")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default API;

export const getUploadUrl = () => API_URL.replace("/api", "");
