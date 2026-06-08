

import jwt from "jsonwebtoken";
import { findMatchmakerById } from "../models/user.model.js";

const protect = (req, res, next) => {

  const token = req.cookies?.tdc_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Please login first.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the matchmaker from our "database" using the ID inside the token
    const matchmaker = findMatchmakerById(decoded.id);

    if (!matchmaker) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = {
      id: matchmaker.id,
      name: matchmaker.name,
      email: matchmaker.email,
      role: matchmaker.role,
      assignedCustomers: matchmaker.assignedCustomers,
    };

    // 5. Call next() to move to the actual route handler
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

export default protect;
