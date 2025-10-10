import { User } from "../models/user.model.js";
import { throwApiError } from "../utils/apiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import Blog from "../models/blog.model.js";
import { Quote } from "../models/quote.model.js";
import { Subscriber } from "../models/subscriber.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Plan } from "../models/plan.model.js";
// Get all admins
export const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({ role: "admin" })
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  return sendResponse(res, 200, admins, "Admins fetched successfully");
});
// Create regular user
export const createNewUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  if (!username || !email || !fullname || !password) {
    throw throwApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existingUser) {
    throw throwApiError(409, "User with this email or username already exists");
  }

  const newUser = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    fullname,
    password,
    role: "user", // 🚨 important: user banate time role=user
    avatar: `https://avatar.iran.liara.run/public/${
      Math.floor(Math.random() * 100) + 1
    }.png`,
  });

  const userData = newUser.toObject();
  delete userData.password;
  delete userData.refreshToken;

  return sendResponse(res, 201, userData, "User created successfully");
});

// Update user
export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  // Prevent role manipulation directly
  delete updateData.role;

  const user = await User.findById(userId);
  if (!user) throw throwApiError(404, "User not found");

  // Password hashing if update includes password
  if (updateData.password) {
    await user.isPasswordCorrect("dummy"); // triggers hashing hook
    user.password = updateData.password;
    delete updateData.password;
  }

  Object.assign(user, updateData);
  await user.save({ validateBeforeSave: false });

  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.refreshToken;

  return sendResponse(res, 200, safeUser, "User updated successfully");
});
// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, status } = req.query;

  let filter = {};
  if (role && role !== "all") {
    filter.role = role;
  }
  if (status && status !== "all") {
    filter.isActive = status === "active";
  }

  const users = await User.find(filter)
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  return sendResponse(res, 200, users, "Users fetched successfully");
});

// Create new admin (by existing admin)
export const createNewAdmin = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  if (!username || !email || !fullname || !password) {
    throw throwApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existingUser) {
    throw throwApiError(409, "User with this email or username already exists");
  }

  const newAdmin = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    fullname,
    password,
    role: "admin",
    avatar: `https://avatar.iran.liara.run/public/${
      Math.floor(Math.random() * 100) + 1
    }.png`,
  });

  const adminData = newAdmin.toObject();
  delete adminData.password;
  delete adminData.refreshToken;

  // Send email to new admin (but don't fail if email fails)
  try {
    await sendEmail(
      email,
      "Admin Access Granted",
      `Dear ${fullname},\n\nYou have been granted admin access.\n\nUsername: ${username}\nPassword: ${password}\n\nAdmin Panel: ${
        process.env.ADMIN_PANEL_URL || "http://localhost:5174"
      }\n\nPlease change your password after first login.\n\nBest regards,\nAdmin Team`,
      `<h3>Admin Access Granted</h3>
     <p>Dear ${fullname},</p>
     <p>You have been granted admin access.</p>
     <p><strong>Username:</strong> ${username}<br>
     <strong>Password:</strong> ${password}<br>
     <strong>Admin Panel:</strong> <a href="${
       process.env.ADMIN_PANEL_URL || "http://localhost:5174"
     }">Click here</a></p>
     <p>Please change your password after first login.</p>
     <p>Best regards,<br>Admin Team</p>`
    );
    console.log("Email sent successfully to", email);
  } catch (emailError) {
    console.error("Email sending failed:", emailError.message);
    // Don't throw error, just log it
  }

  return sendResponse(
    res,
    201,
    adminData,
    "Admin created successfully (email may have failed)"
  );

  return sendResponse(res, 201, adminData, "Admin created successfully");
});

// Promote user to admin
export const promoteToAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndUpdate(
    userId,
    { role: "admin" },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw throwApiError(404, "User not found");
  }

  await sendEmail(
    user.email,
    "Admin Access Granted",
    `Dear ${
      user.fullname
    },\n\nYou have been promoted to admin. You can now access the admin panel at ${
      process.env.ADMIN_PANEL_URL || "http://localhost:5174"
    }\n\nBest regards,\nAdmin Team`,
    `<h3>Admin Access Granted</h3>
     <p>Dear ${user.fullname},</p>
     <p>You have been promoted to admin. You can now access the admin panel.</p>
     <p><a href="${
       process.env.ADMIN_PANEL_URL || "http://localhost:5174"
     }">Go to Admin Panel</a></p>
     <p>Best regards,<br>Admin Team</p>`
  );

  return sendResponse(res, 200, user, "User promoted to admin successfully");
});

// Remove admin access
export const removeAdminAccess = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId === req.admin._id.toString()) {
    throw throwApiError(400, "You cannot remove your own admin access");
  }

  const adminCount = await User.countDocuments({ role: "admin" });
  if (adminCount <= 1) {
    throw throwApiError(400, "Cannot remove the last admin");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role: "user" },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw throwApiError(404, "User not found");
  }

  return sendResponse(res, 200, user, "Admin access removed successfully");
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId === req.admin._id.toString()) {
    throw throwApiError(400, "You cannot delete your own account");
  }

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw throwApiError(404, "User not found");
  }

  return sendResponse(res, 200, user, "User deleted successfully");
});
// Dashboard Stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalAdmins = await User.countDocuments({ role: "admin" });
  const totalRegularUsers = await User.countDocuments({ role: "user" });
  const totalBlogs = await Blog.countDocuments();
  const totalQuotes = await Quote.countDocuments();
  const totalSubscribers = await Subscriber.countDocuments();

  const stats = {
    totalUsers,
    totalAdmins,
    totalRegularUsers,
    totalBlogs,
    totalQuotes,
    totalSubscribers,
    recentActivity: {
      users: await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("fullname email createdAt"),
      quotes: await Quote.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("customerName status createdAt"),
    },
  };

  return sendResponse(res, 200, stats, "Dashboard stats fetched successfully");
});

// Offline subscription create karne ke liye
export const createOfflineSubscription = asyncHandler(async (req, res) => {
  const {
    userId,
    planId,
    paymentMethod, // cash/upi/cheque
    transactionId, // optional - UPI/Cheque number
    notes,
  } = req.body;

  // Validations
  if (!userId || !planId || !paymentMethod) {
    throw throwApiError(400, "User, Plan and Payment method are required");
  }

  // Check if user already has active subscription
  const existingSubscription = await Subscription.findOne({
    userId,
    status: "active",
  });

  if (existingSubscription) {
    throw throwApiError(400, "User already has an active subscription");
  }

  // Get plan details
  const plan = await Plan.findById(planId);
  if (!plan) throw throwApiError(404, "Plan not found");

  const user = await User.findById(userId);
  if (!user) throw throwApiError(404, "User not found");

  // Create subscription
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.duration);

  const subscription = await Subscription.create({
    userId,
    planId,
    amount: plan.price,
    status: "active",
    startDate,
    endDate,
    paymentDetails: {
      method: paymentMethod,
      transactionId: transactionId || `OFFLINE_${Date.now()}`,
      notes: notes || "Offline payment",
      isOffline: true,
      collectedBy: req.admin.fullname,
      paidAt: new Date(),
    },
  });

  // Update user's subscription
  await User.findByIdAndUpdate(userId, {
    currentSubscription: {
      subscriptionId: subscription._id,
      planId: plan._id,
      status: "active",
      expiryDate: endDate,
    },
  });

  // Send confirmation email to user
  try {
    await sendEmail(
      user.email,
      "Gym Subscription Activated",
      `Your ${plan.name} subscription is now active!`,
      `<h2>Subscription Confirmation</h2>
       <p>Dear ${user.fullname},</p>
       <p>Your ${plan.name} subscription has been activated.</p>
       <p>Valid till: ${endDate.toLocaleDateString()}</p>
       <p>Thank you!</p>`
    );
  } catch (err) {
    console.error("User email failed:", err);
  }

  return sendResponse(
    res,
    201,
    subscription,
    "Offline subscription created successfully"
  );
});
