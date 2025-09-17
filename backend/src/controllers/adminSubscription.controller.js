// controllers/adminSubscription.controller.js
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { throwApiError } from "../utils/apiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
