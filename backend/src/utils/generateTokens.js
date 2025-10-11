import { User } from "../models/user.model.js";

export const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = await user.generateToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error.message);
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

// ✅ For Refresh Token (longer expiry)
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // ✅ HTTPS only in prod
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ Needed for cross-origin cookies (e.g., frontend on Vercel)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

// ✅ For Access Token (shorter expiry)
export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 60 * 60 * 1000, // 1 hour
  path: "/",
};
