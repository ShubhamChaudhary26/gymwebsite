// routes/plan.routes.js
import express from "express";
import {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,
} from "../controllers/plan.controller.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPlans);
router.get("/:id", getPlanById);

// Admin only routes
router.post("/create", verifyAdminJWT, createPlan);
router.put("/:id", verifyAdminJWT, updatePlan);
router.delete("/:id", verifyAdminJWT, deletePlan);
router.patch("/:id/toggle-status", verifyAdminJWT, togglePlanStatus);

export default router;
