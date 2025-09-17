// routes/payment.routes.js
import express from "express";
import {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  getPaymentHistory,
  handleWebhook,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// User routes (need authentication)
router.use(verifyJWT); // Apply to all routes below

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.get("/subscription-status", getSubscriptionStatus);
router.get("/history", getPaymentHistory);

// Webhook (no auth needed) - Move this outside verifyJWT
router.post("/webhook", handleWebhook);

export default router;
