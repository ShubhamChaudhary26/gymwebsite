// src/routes/about.routes.js (UPDATED)
import express from "express";
import {
  getAbout,
  updateAbout,
  resetAbout,
} from "../controllers/about.controller.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js"; // ✅ Your existing middleware

const router = express.Router();

// Public route (No auth needed)
router.get("/", getAbout);

// Admin routes (Protected with your existing admin middleware)
router.put("/", verifyAdminJWT, updateAbout);
router.delete("/", verifyAdminJWT, resetAbout);

export default router;