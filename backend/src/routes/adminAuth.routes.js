import express from "express";
import {
  adminLogin,
  adminLogout,
  refreshAdminToken,
  adminProfile,
  setupFirstAdmin,
} from "../controllers/adminAuth.controller.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Public admin auth routes
router.post("/login", adminLogin);
router.post("/setup-first", setupFirstAdmin);

// Protected admin auth routes
router.post("/logout", verifyAdminJWT, adminLogout);
router.post("/refresh-token", refreshAdminToken);
router.get("/me", verifyAdminJWT, adminProfile);

export default router;
