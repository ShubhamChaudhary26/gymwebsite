import { User } from "../models/user.model.js";
import { throwApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  const tokenFromCookie = req.cookies?.adminAccessToken;
  const tokenFromHeader = req.header("Authorization")?.replace("Bearer ", "");
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    throw throwApiError(401, "Admin access token missing");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw throwApiError(404, "Invalid access token - Admin not found");
    }

    // CRITICAL: Verify admin role
    if (user.role !== "admin") {
      throw throwApiError(403, "Admin access required");
    }

    if (!user.isActive) {
      throw throwApiError(403, "Admin account is deactivated");
    }

    req.admin = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw throwApiError(401, "Invalid admin access token format");
    } else if (error.name === "TokenExpiredError") {
      throw throwApiError(401, "Admin access token expired");
    }
    throw throwApiError(401, "Invalid admin access token");
  }
});
