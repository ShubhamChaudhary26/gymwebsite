import { User } from "../models/user.model.js";
import { throwApiError } from "../utils/apiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateTokens } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

// Admin specific cookie options
export const adminCookieOptions = {
  httpOnly: true,
  secure: false, // <-- TEMP: ✅ Set to false for local testing
  sameSite: "Lax", // <-- TEMP: Lax for localhost
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

// Admin Login
export const adminLogin = asyncHandler(async (req, res) => {
  console.log("=== ADMIN LOGIN START ===");

  // ❌ BUG: Variables declare nahi kiye
  const { username, email, password } = req.body; // ✅ ADD THIS LINE

  if (!username && !email) {
    throw throwApiError(400, "Username or email is required");
  }
  if (!password) {
    throw throwApiError(400, "Password is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email: email?.toLowerCase() }],
  });

  if (!user) {
    throw throwApiError(404, "Invalid credentials");
  }

  // IMPORTANT: Check admin role
  if (user.role !== "admin") {
    console.log(
      `Non-admin login attempt at admin endpoint: ${username || email}`
    );
    throw throwApiError(403, "Access denied. Admin credentials required.");
  }

  const isPasswordValid = await user.isPasswordCorrect(String(password));
  if (!isPasswordValid) {
    throw throwApiError(401, "Invalid credentials");
  }

  if (!user.isActive) {
    throw throwApiError(403, "Account is deactivated");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const adminUser = user.toObject();
  delete adminUser.password;
  delete adminUser.refreshToken;

  console.log(`Admin login successful: ${username || email}`);

  return sendResponse(
    res
      .cookie("adminAccessToken", accessToken, adminCookieOptions)
      .cookie("adminRefreshToken", refreshToken, adminCookieOptions),
    200,
    {
      admin: adminUser,
      role: user.role,
      accessToken, // 👈 Add it directly
      refreshToken, // 👈 Add it
    },
    "Admin login successful"
  );
});

// Admin Logout
export const adminLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.admin._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  return sendResponse(
    res
      .clearCookie("adminAccessToken", adminCookieOptions)
      .clearCookie("adminRefreshToken", adminCookieOptions),
    200,
    {},
    "Admin logged out successfully"
  );
});

// Admin Refresh Token
export const refreshAdminToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.adminRefreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw throwApiError(401, "Admin refresh token is required");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw throwApiError(401, "Invalid refresh token");
    }

    if (user.role !== "admin") {
      throw throwApiError(403, "Admin access required");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw throwApiError(401, "Refresh token is invalid or expired");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      user._id
    );

    return sendResponse(
      res
        .cookie("adminAccessToken", accessToken, adminCookieOptions)
        .cookie("adminRefreshToken", newRefreshToken, adminCookieOptions),
      200,
      { accessToken, refreshToken: newRefreshToken },
      "Admin token refreshed successfully"
    );
  } catch (error) {
    throw throwApiError(401, "Invalid refresh token");
  }
});

// Admin Profile
export const adminProfile = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.admin._id).select(
    "-password -refreshToken"
  );

  if (!admin) {
    throw throwApiError(404, "Admin not found");
  }

  return sendResponse(res, 200, admin, "Admin profile fetched successfully");
});

// First Admin Setup (One time)
export const setupFirstAdmin = asyncHandler(async (req, res) => {
  const { username, email, fullname, password, secretKey } = req.body;

  // Secret key for first admin setup
  if (secretKey !== process.env.ADMIN_SETUP_SECRET) {
    throw throwApiError(403, "Invalid setup key");
  }

  // Check if any admin exists
  const adminExists = await User.findOne({ role: "admin" });
  if (adminExists) {
    throw throwApiError(400, "Admin already exists");
  }

  const admin = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    fullname,
    password,
    role: "admin",
    avatar: `https://avatar.iran.liara.run/public/1.png`,
  });

  const adminData = admin.toObject();
  delete adminData.password;
  delete adminData.refreshToken;

  return sendResponse(res, 201, adminData, "First admin created successfully");
});
