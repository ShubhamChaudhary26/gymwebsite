// controllers/payment.controller.js
import Razorpay from "razorpay";
import crypto from "crypto";
import { Plan } from "../models/plan.model.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { throwApiError } from "../utils/apiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
// ✅ CHECK: Razorpay instance ko controller ke bahar initialize karo
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Verify initialization
console.log("🔑 Razorpay initialized with key:", process.env.RAZORPAY_KEY_ID);
export const getRazorpayConfig = asyncHandler(async (req, res) => {
  return sendResponse(
    res,
    200,
    {
      key: process.env.RAZORPAY_KEY_ID, // ✅ Backend se aayegi
    },
    "Razorpay config fetched"
  );
});
export const createOrder = asyncHandler(async (req, res) => {
  const { planId } = req.body;
  const userId = req.user._id;

  console.log("📝 Create Order Request:");
  console.log("  - User ID:", userId);
  console.log("  - Plan ID:", planId);

  // Check existing subscription
  const existingSubscription = await Subscription.findOne({
    userId,
    status: "active",
  });

  if (existingSubscription) {
    console.log("❌ User already has active subscription");
    throw throwApiError(400, "You already have an active subscription");
  }

  // Get plan
  const plan = await Plan.findById(planId);
  console.log("📦 Plan found:", plan);

  if (!plan || !plan.isActive) {
    console.log("❌ Plan not found or inactive");
    throw throwApiError(404, "Plan not found or inactive");
  }

  // ✅ Generate unique receipt (max 40 chars)
  const timestamp = Date.now().toString();
  const randomStr = crypto.randomBytes(4).toString("hex"); // 8 chars
  const receipt = `${timestamp.slice(-10)}_${randomStr}`; // 19 chars total

  console.log("🧾 Receipt:", receipt);

  // Create Razorpay order
  const options = {
    amount: plan.price * 100,
    currency: "INR",
    receipt: receipt, // ✅ Max 40 chars
    notes: {
      userId: userId.toString(),
      planId: planId.toString(),
      planName: plan.name,
      userEmail: req.user.email,
    },
  };

  console.log("💳 Creating Razorpay order with options:", options);

  try {
    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay order created:", order);

    // Create pending subscription
    const subscription = await Subscription.create({
      userId,
      planId,
      razorpayOrderId: order.id,
      amount: plan.price,
      status: "pending",
    });

    console.log("✅ Pending subscription created:", subscription._id);

    return sendResponse(
      res,
      200,
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
        subscriptionId: subscription._id,
      },
      "Order created successfully"
    );
  } catch (razorpayError) {
    console.error("❌ Razorpay order creation failed:", razorpayError);
    console.error("  - Error details:", razorpayError.error);

    throw throwApiError(
      500,
      `Payment gateway error: ${
        razorpayError.error?.description || razorpayError.message
      }`
    );
  }
});

// Verify Payment
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    subscriptionId,
  } = req.body;

  // TEST MODE - Skip signature verification in development
  if (
    process.env.NODE_ENV === "development" &&
    razorpay_signature === "test_signature"
  ) {
    console.log("⚠️ TEST MODE: Skipping signature verification");
  } else {
    // Production signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw throwApiError(400, "Invalid payment signature");
    }
  }

  // Update subscription
  const subscription = await Subscription.findById(subscriptionId)
    .populate("planId")
    .populate("userId");

  if (!subscription) {
    throw throwApiError(404, "Subscription not found");
  }

  const plan = subscription.planId;
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.duration);

  subscription.razorpayPaymentId = razorpay_payment_id;
  subscription.razorpaySignature = razorpay_signature;
  subscription.status = "active";
  subscription.startDate = startDate;
  subscription.endDate = endDate;
  subscription.paymentDetails = {
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    signature: razorpay_signature,
    paidAt: new Date(),
  };

  await subscription.save();
  // Update user's current subscription
  await User.findByIdAndUpdate(subscription.userId._id, {
    currentSubscription: {
      subscriptionId: subscription._id,
      planId: plan._id,
      status: "active",
      expiryDate: endDate,
    },
  });
  if (subscription.previousSubscriptionId) {
    // Cancel/expire old subscription
    await Subscription.findByIdAndUpdate(subscription.previousSubscriptionId, {
      status: "cancelled",
    });

    // Send renewal confirmation
    const renewalEmailHtml = `
    <h2>Subscription Renewed Successfully!</h2>
    <p>Dear ${subscription.userId.fullname},</p>
    <p>Your <strong>${
      plan.name
    }</strong> subscription has been renewed successfully.</p>
    <p>New validity period: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}</p>
    <p>Thank you for continuing with us!</p>
  `;

    await sendEmail(
      subscription.userId.email,
      "Subscription Renewed Successfully",
      `Your ${plan.name} subscription has been renewed!`,
      renewalEmailHtml
    );
  }
  // Send confirmation email to USER
  const userEmailHtml = `
    <h2>Payment Confirmation</h2>
    <p>Dear ${subscription.userId.fullname},</p>
    <p>Your payment for ${plan.name} plan has been successfully processed.</p>
    <ul>
      <li>Plan: ${plan.name}</li>
      <li>Amount: ₹${subscription.amount}</li>
      <li>Valid Till: ${endDate.toLocaleDateString()}</li>
    </ul>
    <p>Thank you for your subscription!</p>
  `;

  try {
    await sendEmail(
      subscription.userId.email,
      "Payment Confirmation - Subscription Activated",
      `Your ${plan.name} plan is now active!`,
      userEmailHtml
    );
  } catch (emailError) {
    console.error("Failed to send user confirmation email:", emailError);
    // Don't throw error, payment is already successful
  }

  // 🆕 ADMIN EMAIL NOTIFICATION
  try {
    const admins = await User.find({ role: "admin" }).select("email fullname");

    for (const admin of admins) {
      const adminEmailHtml = `
        <h2>New Gym Subscription Alert! 💪</h2>
        <p>Hi ${admin.fullname},</p>
        <p>A new subscription has been activated:</p>
        <table border="1" cellpadding="10" style="border-collapse: collapse;">
          <tr>
            <td><strong>Customer Name:</strong></td>
            <td>${subscription.userId.fullname}</td>
          </tr>
          <tr>
            <td><strong>Email:</strong></td>
            <td>${subscription.userId.email}</td>
          </tr>
          <tr>
            <td><strong>Username:</strong></td>
            <td>${subscription.userId.username}</td>
          </tr>
          <tr>
            <td><strong>Plan:</strong></td>
            <td>${plan.name}</td>
          </tr>
          <tr>
            <td><strong>Amount:</strong></td>
            <td>₹${subscription.amount}</td>
          </tr>
          <tr>
            <td><strong>Duration:</strong></td>
            <td>${plan.duration} days</td>
          </tr>
          <tr>
            <td><strong>Start Date:</strong></td>
            <td>${startDate.toLocaleDateString()}</td>
          </tr>
          <tr>
            <td><strong>End Date:</strong></td>
            <td>${endDate.toLocaleDateString()}</td>
          </tr>
          <tr>
            <td><strong>Payment ID:</strong></td>
            <td>${razorpay_payment_id}</td>
          </tr>
          <tr>
            <td><strong>Order ID:</strong></td>
            <td>${razorpay_order_id}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">
          <a href="${
            process.env.ADMIN_PANEL_URL || "http://localhost:5174"
          }/subscriptions" 
             style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View in Admin Panel
          </a>
        </p>
      `;

      await sendEmail(
        admin.email,
        `New Subscription: ${subscription.userId.fullname} - ${plan.name} Plan`,
        `New subscription activated for ${subscription.userId.fullname} - ${plan.name} plan for ₹${subscription.amount}`,
        adminEmailHtml
      );
    }

    console.log(`Admin notifications sent to ${admins.length} admin(s)`);
  } catch (adminEmailError) {
    console.error("Failed to send admin notification:", adminEmailError);
    // Admin email fail ho jaye to bhi payment success rahega
  }

  return sendResponse(
    res,
    200,
    {
      subscription,
      message: "Payment verified and subscription activated",
    },
    "Payment successful"
  );
});

// controllers/payment.controller.js - Add these functions

// RENEW SUBSCRIPTION (No discounts)
export const renewSubscription = asyncHandler(async (req, res) => {
  const { subscriptionId, planId } = req.body;
  const userId = req.user._id;

  // Get current/expired subscription
  const currentSub = await Subscription.findOne({
    _id: subscriptionId,
    userId: userId,
    status: { $in: ["active", "grace_period", "expired"] },
  }).populate("planId");

  if (!currentSub) {
    throw throwApiError(404, "Subscription not found");
  }

  // Get the plan (same or new)
  const plan = await Plan.findById(planId || currentSub.planId._id);
  if (!plan || !plan.isActive) {
    throw throwApiError(404, "Plan not found or inactive");
  }

  // Full price - no discounts
  const amount = plan.price;

  // Create Razorpay order
  const options = {
    amount: amount * 100, // Convert to paise
    currency: "INR",
    receipt: `renew_${userId}_${Date.now()}`,
    notes: {
      userId: userId.toString(),
      planId: plan._id.toString(),
      renewalOf: subscriptionId,
      type: "renewal",
    },
  };

  const order = await razorpay.orders.create(options);

  // Create new pending subscription
  const newSubscription = await Subscription.create({
    userId,
    planId: plan._id,
    razorpayOrderId: order.id,
    amount: amount,
    status: "pending",
    previousSubscriptionId: subscriptionId,
    renewalCount: (currentSub.renewalCount || 0) + 1,
  });

  return sendResponse(
    res,
    200,
    {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      subscriptionId: newSubscription._id,
      planName: plan.name,
      planPrice: amount,
    },
    "Renewal order created successfully"
  );
});

// CHECK RENEWAL ELIGIBILITY
export const checkRenewalEligibility = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const subscription = await Subscription.findOne({
    userId,
    status: { $in: ["active", "grace_period"] },
  }).populate("planId");

  if (!subscription) {
    return sendResponse(
      res,
      200,
      {
        eligible: false,
        message: "No active subscription to renew",
      },
      "Not eligible for renewal"
    );
  }

  const daysUntilExpiry = Math.ceil(
    (subscription.endDate - new Date()) / (1000 * 60 * 60 * 24)
  );

  let message = "";

  if (subscription.status === "grace_period") {
    message = "In grace period - Renew now to restore full access!";
  } else if (daysUntilExpiry <= 7) {
    message = "Your subscription is expiring soon. Renew now!";
  } else {
    message = "You can renew your subscription anytime.";
  }

  return sendResponse(
    res,
    200,
    {
      eligible: true,
      subscription: {
        id: subscription._id,
        planName: subscription.planId.name,
        planPrice: subscription.planId.price,
        expiryDate: subscription.endDate,
        daysUntilExpiry,
        status: subscription.status,
      },
      message,
    },
    "Renewal eligibility checked"
  );
});

// GET EXPIRY STATUS
export const getExpiryStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const subscription = await Subscription.findOne({
    userId,
    status: { $in: ["active", "grace_period", "expired"] },
  })
    .populate("planId")
    .sort({ createdAt: -1 });

  if (!subscription) {
    return sendResponse(
      res,
      200,
      {
        hasSubscription: false,
        needsRenewal: true,
      },
      "No subscription found"
    );
  }

  const now = new Date();
  const daysRemaining = Math.ceil(
    (subscription.endDate - now) / (1000 * 60 * 60 * 24)
  );
  const daysInGracePeriod = subscription.gracePeriodEnd
    ? Math.ceil((subscription.gracePeriodEnd - now) / (1000 * 60 * 60 * 24))
    : 0;

  let statusInfo = {
    status: subscription.status,
    expiryDate: subscription.endDate,
    daysRemaining,
    showWarning: false,
    warningLevel: "none", // none, low, medium, high, critical
    message: "",
    canRenew: true,
    recommendedAction: "",
  };

  // Determine warning level and message
  if (subscription.status === "expired") {
    statusInfo.showWarning = true;
    statusInfo.warningLevel = "critical";
    statusInfo.message = "Your subscription has expired!";
    statusInfo.recommendedAction = "Purchase a new subscription";
    statusInfo.canRenew = false;
  } else if (subscription.status === "grace_period") {
    statusInfo.showWarning = true;
    statusInfo.warningLevel = "high";
    statusInfo.message = `Grace period: ${daysInGracePeriod} days remaining`;
    statusInfo.recommendedAction = "Renew immediately to restore full access";
    statusInfo.gracePeriodDays = daysInGracePeriod;
  } else if (daysRemaining <= 1) {
    statusInfo.showWarning = true;
    statusInfo.warningLevel = "critical";
    statusInfo.message = "Expires tomorrow!";
    statusInfo.recommendedAction = "Renew now to avoid interruption";
  } else if (daysRemaining <= 3) {
    statusInfo.showWarning = true;
    statusInfo.warningLevel = "high";
    statusInfo.message = `Only ${daysRemaining} days left!`;
    statusInfo.recommendedAction = "Renew now to continue";
  } else if (daysRemaining <= 7) {
    statusInfo.showWarning = true;
    statusInfo.warningLevel = "medium";
    statusInfo.message = `Expires in ${daysRemaining} days`;
    statusInfo.recommendedAction = "Consider renewal soon";
  }

  return sendResponse(
    res,
    200,
    {
      subscription: {
        id: subscription._id,
        planName: subscription.planId.name,
        amount: subscription.amount,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      },
      statusInfo,
      reminders: subscription.remindersSent,
    },
    "Expiry status fetched"
  );
});

// Get User Subscription Status
export const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const subscription = await Subscription.findOne({
    userId,
    status: "active",
  })
    .populate("planId")
    .sort({ createdAt: -1 });

  if (!subscription) {
    return sendResponse(
      res,
      200,
      { hasSubscription: false },
      "No active subscription"
    );
  }

  const daysRemaining = Math.ceil(
    (subscription.endDate - new Date()) / (1000 * 60 * 60 * 24)
  );

  return sendResponse(
    res,
    200,
    {
      hasSubscription: true,
      subscription: {
        planName: subscription.planId.name,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        daysRemaining,
        status: subscription.status,
        amount: subscription.amount,
      },
    },
    "Subscription status fetched"
  );
});

// 🆕 Get Payment History - Missing function add kar raha hun
export const getPaymentHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const subscriptions = await Subscription.find({ userId })
    .populate("planId", "name price duration")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Subscription.countDocuments({ userId });

  const history = subscriptions.map((sub) => ({
    _id: sub._id,
    planName: sub.planId?.name || "Unknown Plan",
    amount: sub.amount,
    status: sub.status,
    paymentId: sub.razorpayPaymentId,
    orderId: sub.razorpayOrderId,
    startDate: sub.startDate,
    endDate: sub.endDate,
    createdAt: sub.createdAt,
  }));

  return sendResponse(
    res,
    200,
    {
      history,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
    "Payment history fetched successfully"
  );
});

// Webhook for Razorpay
export const handleWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "test_webhook_secret";

  // Skip webhook verification in development
  if (process.env.NODE_ENV === "development") {
    console.log("⚠️ Webhook received (dev mode - skipping verification)");
  } else {
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest !== req.headers["x-razorpay-signature"]) {
      throw throwApiError(400, "Invalid webhook signature");
    }
  }

  const event = req.body.event;
  const payload = req.body.payload;

  switch (event) {
    case "payment.captured":
      // Handle payment captured
      console.log("Payment captured:", payload.payment.entity.id);
      break;

    case "payment.failed":
      // Handle payment failure
      const subscription = await Subscription.findOne({
        razorpayOrderId: payload.payment.entity.order_id,
      });

      if (subscription) {
        subscription.status = "failed";
        await subscription.save();
        console.log("Payment failed for subscription:", subscription._id);
      }
      break;

    default:
      console.log("Unhandled webhook event:", event);
  }

  res.json({ status: "ok" });
});
