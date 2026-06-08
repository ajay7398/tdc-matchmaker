

import jwt from "jsonwebtoken";
import { findMatchmakerByEmail } from "../models/user.model.js";

// POST /api/auth/login
export const login = (req, res) => {
  const { email, password } = req.body;

  // 1. Basic validation — make sure both fields are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password.",
    });
  }


  const matchmaker = findMatchmakerByEmail(email);

  if (!matchmaker) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }


  if (matchmaker.password !== password) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const token = jwt.sign(
    { id: matchmaker.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );


  res.cookie("tdc_token", token, {
    httpOnly: true,        // JS cannot access this cookie
    secure: false,         // Set to true in production (HTTPS only)
    sameSite: "lax",       // Prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  // 6. Send success response with user info (no password)
  res.status(200).json({
    success: true,
    message: "Login successful!",
    user: {
      id: matchmaker.id,
      name: matchmaker.name,
      email: matchmaker.email,
      role: matchmaker.role,
      avatar: matchmaker.avatar,
    },
  });
};

// POST /api/auth/logout
export const logout = (req, res) => {
  
  res.cookie("tdc_token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

export const getMe = (req, res) => {
  // req.user is set by the auth middleware (protect)
  res.status(200).json({
    success: true,
    user: req.user,
  });
};
