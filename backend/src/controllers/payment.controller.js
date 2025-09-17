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

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
export const createOrder = asyncHandler(async (req, res) => {
  const { planId } = req.body;
  const userId = req.user._id;

  // Check existing active subscription
  const existingSubscription = await Subscription.findOne({
    userId,
    status: "active",
  });

  if (existingSubscription) {
    throw throwApiError(400, "You already have an active subscription");
  }

  // Get plan details
  const plan = await Plan.findById(planId);
  if (!plan || !plan.isActive) {
    throw throwApiError(404, "Plan not found or inactive");
  }

  // Create Razorpay order
  const options = {
    amount: plan.price * 100, // amount in paise
    currency: "INR",
    receipt: `sub_${userId}_${Date.now()}`,
    notes: {
      userId: userId.toString(),
      planId: planId.toString(),
      planName: plan.name,
    },
  };

  const order = await razorpay.orders.create(options);

  // Create pending subscription
  const subscription = await Subscription.create({
    userId,
    planId,
    razorpayOrderId: order.id,
    amount: plan.price,
    status: "pending",
  });

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

  // Send confirmation email
  const emailHtml = `
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
      emailHtml
    );
  } catch (emailError) {
    console.error("Failed to send confirmation email:", emailError);
    // Don't throw error, payment is already successful
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
