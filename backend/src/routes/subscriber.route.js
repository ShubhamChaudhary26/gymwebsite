// routes/subscriber.route.js
import express from "express";
import {
  getSubscribers,
  createSubscriber,
  deleteSubscriber,
} from "../controllers/subscriber.controller.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Public route - Koi bhi subscribe kar sakta hai
router.post("/subscribers", createSubscriber);

// Admin only routes
router.get("/subscribers", verifyAdminJWT, getSubscribers);
router.delete("/subscribers/:id", verifyAdminJWT, deleteSubscriber);

export default router;
