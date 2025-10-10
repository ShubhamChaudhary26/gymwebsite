// routes/adminSubscription.routes.js - ADD THESE ROUTES

import express from "express";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";
import {
  getSubscriptions,
  getSubscriptionStats,
  cancelSubscription,
  getSubscriptionById,
  adminInitiateRenewal,
  updateSubscription,
  extendSubscription, // ✅ NEW
  changeSubscriptionPlan, // ✅ NEW
  addSubscriptionNote, // ✅ NEW
  getUserSubscriptionHistory, // ✅ NEW
} from "../controllers/adminSubscription.controller.js";

const router = express.Router();

router.use(verifyAdminJWT);

router.get("/", getSubscriptions);
router.get("/stats", getSubscriptionStats);
router.post("/renew", adminInitiateRenewal);
router.get("/:id", getSubscriptionById);
router.put("/:id", updateSubscription);
router.put("/:id/cancel", cancelSubscription);

// ✅ NEW ROUTES
router.put("/:id/extend", extendSubscription); // Extend days
router.put("/:id/change-plan", changeSubscriptionPlan); // Change plan
router.post("/:id/notes", addSubscriptionNote); // Add note

// User history
router.get("/user/:userId/history", getUserSubscriptionHistory);

export default router;
