import axios from "axios";

const api = axios.create({
  // In production: uses Render URL
  // In development: uses Vite proxy (/api → localhost:5000)
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;