// routes/payment.routes.js
import express from "express";
import {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  getPaymentHistory,
  handleWebhook,
  renewSubscription,
  checkRenewalEligibility,
  getExpiryStatus,
  getRazorpayConfig,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.get("/config", getRazorpayConfig);
// User routes (need authentication)
router.use(verifyJWT); // Apply to all routes below

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.get("/subscription-status", getSubscriptionStatus);
router.get("/history", getPaymentHistory);

// routes/payment.routes.js - Add these routes

// Remove extra verifyJWT:
router.post("/renew", renewSubscription);
router.get("/renewal-eligibility", checkRenewalEligibility);
router.get("/expiry-status", getExpiryStatus);

// Webhook (no auth needed) - Move this outside verifyJWT
router.post("/webhook", handleWebhook);

export default router;
