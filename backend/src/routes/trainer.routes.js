import express from "express";
import {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
} from "../controllers/trainer.controller.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; // 👈 import multer

const router = express.Router();

// Public
router.get("/", getAllTrainers);
router.get("/:id", getTrainerById);

// Admin only
router.post(
  "/create",
  verifyAdminJWT,
  upload.fields([{ name: "image", maxCount: 1 }]), // 👈 multer enable
  createTrainer
);
router.put(
  "/:id",
  verifyAdminJWT,
  upload.fields([{ name: "image", maxCount: 1 }]), // 👈 multer again for update
  updateTrainer
);
router.delete("/:id", verifyAdminJWT, deleteTrainer);

export default router;
