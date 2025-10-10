// controllers/adminSubscription.controller.js
import { Plan } from "../models/plan.model.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { throwApiError } from "../utils/apiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendEmail.js";

// Get all subscriptions with filters
export const getSubscriptions = asyncHandler(async (req, res) => {
  const { status, plan, page = 1, limit = 10 } = req.query;

  let filter = {};

  if (status && status !== "all") {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  let subscriptions = await Subscription.find(filter)
    .populate("userId", "fullname email username avatar")
    .populate("planId", "name price duration features")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Filter by plan name after population
  if (plan && plan !== "all") {
    subscriptions = subscriptions.filter(
      (sub) => sub.planId && sub.planId.name === plan
    );
  }

  const total = await Subscription.countDocuments(filter);

  // ✅ FIX: Return array directly in data
  return sendResponse(
    res,
    200,
    subscriptions, // 👈 Direct array, not object
    "Subscriptions fetched successfully"
  );
});

// Get subscription statistics
// controllers/adminSubscription.controller.js

export const getSubscriptionStats = asyncHandler(async (req, res) => {
  // Count active subscriptions
  const activeSubscriptions = await Subscription.countDocuments({
    status: "active",
  });

  // Total revenue = sirf active + expired (jo paid ho chuke)
  const revenueData = await Subscription.aggregate([
    {
      $match: {
        status: { $in: ["active", "expired"] }, // ✅ cancelled mat lo
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRevenue = revenueData[0]?.totalRevenue || 0;
  const totalSubscriptions = revenueData[0]?.count || 0;

  // Expiring soon (within 7 days)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  const expiringSoon = await Subscription.countDocuments({
    status: "active",
    endDate: {
      $gte: new Date(),
      $lte: expiryDate,
    },
  });

  // New subscriptions this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const newThisMonth = await Subscription.countDocuments({
    status: "active",
    createdAt: { $gte: startOfMonth },
  });

  // Average value
  const avgValue =
    totalSubscriptions > 0 ? totalRevenue / totalSubscriptions : 0;

  const stats = {
    activeSubscriptions,
    totalRevenue,
    expiringSoon,
    newThisMonth,
    avgValue,
  };

  return sendResponse(res, 200, stats, "Stats fetched successfully");
});

// Get single subscription details
export const getSubscriptionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const subscription = await Subscription.findById(id)
    .populate("userId", "fullname email username avatar")
    .populate("planId", "name price duration features");

  if (!subscription) {
    throw throwApiError(404, "Subscription not found");
  }

  return sendResponse(
    res,
    200,
    subscription,
    "Subscription details fetched successfully"
  );
});

// Cancel subscription
export const cancelSubscription = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const subscription = await Subscription.findById(id);

  if (!subscription) {
    throw throwApiError(404, "Subscription not found");
  }

  if (subscription.status !== "active") {
    throw throwApiError(400, "Only active subscriptions can be cancelled");
  }

  // Update subscription status
  subscription.status = "cancelled";
  subscription.endDate = new Date();
  await subscription.save();

  // Update user's current subscription
  await User.findByIdAndUpdate(subscription.userId, {
    $unset: { currentSubscription: 1 },
  });

  return sendResponse(
    res,
    200,
    subscription,
    "Subscription cancelled successfully"
  );
});
// Add this function at the end of the file
// controllers/adminSubscription.controller.js
export const adminInitiateRenewal = asyncHandler(async (req, res) => {
  const { subscriptionId, planId, paymentMethod } = req.body;
  const admin = req.admin;

  const oldSubscription = await Subscription.findById(subscriptionId).populate(
    "userId planId"
  );
  if (!oldSubscription) throw throwApiError(404, "Subscription not found");

  const newPlan = await Plan.findById(planId);
  if (!newPlan) throw throwApiError(404, "New plan not found");

  // Create new active subscription
  // ✅ SMART DATE LOGIC
  let startDate = new Date();
  if (
    oldSubscription.status === "active" &&
    oldSubscription.endDate > new Date()
  ) {
    // Agar existing plan active hai to expiry se start karo
    startDate = new Date(oldSubscription.endDate);
  }
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + newPlan.duration);

  const newSubscription = await Subscription.create({
    userId: oldSubscription.userId._id,
    planId: newPlan._id,
    amount: newPlan.price,
    status: "active",
    startDate,
    endDate,
    previousSubscriptionId: oldSubscription._id,
    paymentDetails: {
      method: paymentMethod,
      isOffline: true,
      collectedBy: admin.fullname,
      paidAt: new Date(),
    },
  });

  // Update user's current subscription
  await User.findByIdAndUpdate(oldSubscription.userId._id, {
    currentSubscription: {
      subscriptionId: newSubscription._id,
      planId: newSubscription.planId,
      status: "active",
      expiryDate: endDate,
    },
  });

  // Deactivate old one
  oldSubscription.status = "cancelled";
  await oldSubscription.save();

  // ✅ GRACEFUL EMAIL HANDLING
  try {
    await sendEmail(
      oldSubscription.userId.email,
      "Subscription Renewed by Admin",
      `Your ${newPlan.name} subscription has been renewed successfully.`,
      `<h2>Subscription Renewed</h2>
       <p>Hi ${oldSubscription.userId.fullname},</p>
       <p>Your subscription for the <strong>${
         newPlan.name
       }</strong> plan has been renewed by our admin team.</p>
       <p>Your new validity is from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}.</p>
       <p>Thank you!</p>`
    );
  } catch (emailError) {
    console.error(
      "⚠️ Email sending failed but subscription was renewed:",
      emailError
    );
    // Don't throw error, just log it. Operation is still successful.
  }

  return sendResponse(
    res,
    201,
    newSubscription,
    "Subscription renewed successfully (email may have failed)"
  );
});

export const updateSubscription = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { endDate, status, notes } = req.body;

  const subscription = await Subscription.findById(id);
  if (!subscription) throw throwApiError(404, "Subscription not found");

  if (endDate) {
    subscription.endDate = new Date(endDate);
  }
  if (status) {
    subscription.status = status;
  }
  if (notes) {
    subscription.paymentDetails.notes = notes;
  }

  await subscription.save();

  // Update user's current subscription if changed
  await User.findByIdAndUpdate(subscription.userId, {
    "currentSubscription.status": subscription.status,
    "currentSubscription.expiryDate": subscription.endDate,
  });

  return sendResponse(res, 200, subscription, "Subscription updated");
});
// controllers/adminSubscription.controller.js
// controllers/adminSubscription.controller.js - ADD THESE FUNCTIONS

// 1️⃣ EXTEND SUBSCRIPTION
export const extendSubscription = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { days } = req.body;

  if (!days || days <= 0) {
    throw throwApiError(400, "Valid number of days required");
  }

  const subscription = await Subscription.findById(id)
    .populate("userId", "fullname email")
    .populate("planId", "name");

  if (!subscription) {
    throw throwApiError(404, "Subscription not found");
  }

  // Calculate new end date
  const newEndDate = new Date(subscription.endDate);
  newEndDate.setDate(newEndDate.getDate() + parseInt(days));

  subscription.endDate = newEndDate;

  // If expired/grace_period, reactivate
  if (
    subscription.status === "expired" ||
    subscription.status === "grace_period"
  ) {
    subscription.status = "active";
  }

  await subscription.save();

  // Update user's current subscription
  await User.findByIdAndUpdate(subscription.userId._id, {
    "currentSubscription.expiryDate": newEndDate,
    "currentSubscription.status": subscription.status,
  });

  // ✅ OPTIONAL: Send email to user
  try {
    await sendEmail(
      subscription.userId.email,
      "Subscription Extended",
      `Your subscription has been extended by ${days} days.`,
      `<p>Hi ${subscription.userId.fullname},</p>
       <p>Great news! Your <strong>${
         subscription.planId.name
       }</strong> subscription has been extended by <strong>${days} days</strong>.</p>
       <p>New expiry date: <strong>${newEndDate.toLocaleDateString()}</strong></p>`
    );
  } catch (emailError) {
    console.error("Email failed:", emailError);
  }

  return sendResponse(
    res,
    200,
    subscription,
    `Subscription extended by ${days} days`
  );
});

// 2️⃣ CHANGE SUBSCRIPTION PLAN
export const changeSubscriptionPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { planId } = req.body;

  const subscription = await Subscription.findById(id)
    .populate("userId", "fullname email")
    .populate("planId");

  if (!subscription) {
    throw throwApiError(404, "Subscription not found");
  }

  const newPlan = await Plan.findById(planId);
  if (!newPlan) {
    throw throwApiError(404, "New plan not found");
  }

  const oldPlan = subscription.planId;

  // Update subscription
  subscription.planId = newPlan._id;
  subscription.amount = newPlan.price;

  await subscription.save();

  // Update user's current subscription
  await User.findByIdAndUpdate(subscription.userId._id, {
    "currentSubscription.planId": newPlan._id,
  });

  // ✅ Send email notification
  try {
    await sendEmail(
      subscription.userId.email,
      "Subscription Plan Changed",
      `Your plan has been changed from ${oldPlan.name} to ${newPlan.name}.`,
      `<p>Hi ${subscription.userId.fullname},</p>
       <p>Your subscription plan has been changed:</p>
       <ul>
         <li>Old Plan: <strong>${oldPlan.name}</strong> (₹${oldPlan.price})</li>
         <li>New Plan: <strong>${newPlan.name}</strong> (₹${newPlan.price})</li>
       </ul>`
    );
  } catch (emailError) {
    console.error("Email failed:", emailError);
  }

  return sendResponse(
    res,
    200,
    subscription,
    `Plan changed to ${newPlan.name}`
  );
});

// 3️⃣ ADD NOTE TO SUBSCRIPTION
export const addSubscriptionNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  if (!note || note.trim().length === 0) {
    throw throwApiError(400, "Note cannot be empty");
  }

  const subscription = await Subscription.findById(id);
  if (!subscription) {
    throw throwApiError(404, "Subscription not found");
  }

  // Initialize paymentDetails if not exists
  if (!subscription.paymentDetails) {
    subscription.paymentDetails = {};
  }

  // Append note with timestamp
  const timestamp = new Date().toISOString();
  const adminName = req.admin.fullname;
  const noteEntry = `[${timestamp}] ${adminName}: ${note.trim()}`;

  // Store as array or string
  if (!subscription.paymentDetails.notes) {
    subscription.paymentDetails.notes = [noteEntry];
  } else if (Array.isArray(subscription.paymentDetails.notes)) {
    subscription.paymentDetails.notes.push(noteEntry);
  } else {
    subscription.paymentDetails.notes = [
      subscription.paymentDetails.notes,
      noteEntry,
    ];
  }

  await subscription.save();

  return sendResponse(res, 200, subscription, "Note added successfully");
});

// 4️⃣ GET USER SUBSCRIPTION HISTORY
export const getUserSubscriptionHistory = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const subscriptions = await Subscription.find({ userId })
    .populate("planId", "name price duration")
    .sort({ createdAt: -1 });

  const history = subscriptions.map((sub) => ({
    _id: sub._id,
    planName: sub.planId?.name,
    amount: sub.amount,
    status: sub.status,
    startDate: sub.startDate,
    endDate: sub.endDate,
    createdAt: sub.createdAt,
    renewalCount: sub.renewalCount || 0,
  }));

  return sendResponse(
    res,
    200,
    history,
    "Subscription history fetched successfully"
  );
});
