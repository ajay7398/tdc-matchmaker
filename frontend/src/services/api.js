// src/services/api.js
// Central Axios instance used by all services.
// Sets base URL and ensures cookies are sent with every request.
import axios from "axios";

const api = axios.create({
  baseURL: "/api",          // Proxied to http://localhost:5000/api by Vite
  withCredentials: true,    // IMPORTANT: send cookies (JWT) with every request
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
