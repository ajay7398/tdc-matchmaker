// src/services/auth.service.js
// Functions that call the backend auth API endpoints.
import api from "./api.js";

// POST /api/auth/login
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

// POST /api/auth/logout
export const logoutUser = () => api.post("/auth/logout");

// GET /api/auth/me — check if user is still logged in
export const getMe = () => api.get("/auth/me");
