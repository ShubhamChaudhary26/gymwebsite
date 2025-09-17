import express from "express";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";
import {
  getAllAdmins,
  getAllUsers,
  createNewAdmin,
  createNewUser, // 👈 add
  updateUser,
  removeAdminAccess,
  promoteToAdmin,
  getDashboardStats,
  deleteUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All routes need admin authentication
router.use(verifyAdminJWT);
router.delete("/users/:userId", deleteUser);
// Admin management
router.get("/admins", getAllAdmins);
router.post("/admins/create", createNewAdmin);
router.put("/users/:userId/promote", promoteToAdmin);
router.put("/users/:userId/demote", removeAdminAccess);

// User management
router.get("/users", getAllUsers);
router.post("/users/create", createNewUser);
router.put("/users/:userId", updateUser);

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

export default router;
