import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const h = req.headers.authorization || "";
    let token = null;
    if (h.startsWith("Bearer ")) token = h.slice(7);
    else if (req.headers["x-auth-token"]) token = req.headers["x-auth-token"]; 
    else if (req.query.token) token = req.query.token;

    if (!token) return res.status(401).json({ success: false, message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (e) {
    console.error("Auth error", e.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};