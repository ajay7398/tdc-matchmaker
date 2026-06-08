

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Import all route files
import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import matchRoutes from "./routes/match.routes.js";
import aiRoutes from "./routes/ai.routes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // needed so cookies are sent with requests
  })
);


app.use(express.json());

app.use(cookieParser());

// ─── ROUTES SETUP ────────────────────────────────────────────
// All routes are prefixed with /api/
app.use("/api/auth", authRoutes);         // /api/auth/login, /api/auth/logout
app.use("/api/customers", customerRoutes); // /api/customers/
app.use("/api/matches", matchRoutes);     // /api/matches/:customerId
app.use("/api/ai", aiRoutes);             // /api/ai/score, /api/ai/intro

// ─── HEALTH CHECK ────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "TDC Matchmaker API is running 🚀" });
});

// ─── START SERVER ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
