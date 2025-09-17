// routes/adminSubscription.routes.js
import express from "express";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";
import {
  getSubscriptions,
  getSubscriptionStats,
  cancelSubscription,
  getSubscriptionById,
} from "../controllers/adminSubscription.controller.js";

const router = express.Router();

// All routes need admin authentication
router.use(verifyAdminJWT);

// Admin subscription management
router.get("/subscriptions", getSubscriptions);
router.get("/subscriptions/stats", getSubscriptionStats);
router.get("/subscriptions/:id", getSubscriptionById);
router.put("/subscriptions/:id/cancel", cancelSubscription);

export default router;
