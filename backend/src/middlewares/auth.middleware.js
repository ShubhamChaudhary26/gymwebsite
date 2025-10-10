import { User } from "../models/user.model.js";
import { throwApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// middlewares/auth.middleware.js - ADD LOGGING

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const tokenFromCookie = req.cookies?.accessToken;
  const tokenFromHeader = req.header("Authorization")?.replace("Bearer ", "");
  const token = tokenFromCookie || tokenFromHeader;

  console.log("🔐 verifyJWT called:");
  console.log("  - Cookie token:", tokenFromCookie ? "Present" : "Missing");
  console.log("  - Header token:", tokenFromHeader ? "Present" : "Missing");
  console.log("  - All cookies:", req.cookies);

  if (!token) {
    console.log("❌ No token found");
    throw throwApiError(401, "Access token missing");
  }

  try {
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("✅ Token decoded:", decodeToken);

    const user = await User.findById(decodeToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      console.log("❌ User not found for token");
      throw throwApiError(404, "Invalid access token - User not found");
    }

    if (!user.isActive) {
      console.log("❌ User account is deactivated");
      throw throwApiError(403, "Account is deactivated");
    }

    console.log("✅ User authenticated:", user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ JWT verification failed:", error.message);

    if (error.name === "JsonWebTokenError") {
      throw throwApiError(401, "Invalid access token format");
    } else if (error.name === "TokenExpiredError") {
      throw throwApiError(401, "Access token expired");
    }
    throw throwApiError(401, "Invalid access token");
  }
});
