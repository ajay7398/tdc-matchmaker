// ============================================================
// src/routes/auth.routes.js
// Defines URL paths for authentication endpoints.
// Routes connect URLs → Controller functions.
// ============================================================

import express from "express";
import { login, logout, getMe } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/auth/login   → login controller
router.post("/login", login);

// POST /api/auth/logout  → logout controller (protected: must be logged in)
router.post("/logout", protect, logout);

// GET /api/auth/me       → get current user (protected)
router.get("/me", protect, getMe);

export default router;
