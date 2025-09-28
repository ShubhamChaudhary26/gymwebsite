// routes/adminSubscription.routes.js - FINAL
import express from "express";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";
import {
  getSubscriptions,
  getSubscriptionStats,
  cancelSubscription,
  getSubscriptionById,
  adminInitiateRenewal,
  updateSubscription,
} from "../controllers/adminSubscription.controller.js";

const router = express.Router();

router.use(verifyAdminJWT);

router.get("/", getSubscriptions); // GET /api/v1/admin/subscriptions/
router.get("/stats", getSubscriptionStats); // GET /api/v1/admin/subscriptions/stats
router.post("/renew", adminInitiateRenewal); // POST /api/v1/admin/subscriptions/renew
router.get("/:id", getSubscriptionById); // GET /api/v1/admin/subscriptions/:id
router.put("/:id", updateSubscription);
router.put("/:id/cancel", cancelSubscription); // PUT /api/v1/admin/subscriptions/:id/cancel

export default router;
