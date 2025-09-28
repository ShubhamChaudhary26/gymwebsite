// models/subscription.model.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "expired",
        "cancelled",
        "failed",
        "grace_period",
      ],
      default: "pending",
    },
    startDate: Date,
    endDate: Date,
    paymentDetails: Object,

    // 🆕 NEW FIELDS (Without discount fields)
    renewalCount: {
      type: Number,
      default: 0,
    },
    expiredAt: Date,
    gracePeriodEnd: Date,
    reactivatedAt: Date,
    isAutoRenew: {
      type: Boolean,
      default: false,
    },
    remindersSent: {
      sevenDay: { type: Boolean, default: false },
      threeDay: { type: Boolean, default: false },
      oneDay: { type: Boolean, default: false },
      expiryDay: { type: Boolean, default: false },
      gracePeriod: { type: Boolean, default: false },
    },
    lastReminderSent: Date,
    previousSubscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
  },
  { timestamps: true }
);

// Indexes
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });
subscriptionSchema.index({ gracePeriodEnd: 1, status: 1 });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
