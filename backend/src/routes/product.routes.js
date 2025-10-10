import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin routes
router.post(
  "/create",
  verifyAdminJWT,
  upload.fields([{ name: "photo", maxCount: 1 }]),
  createProduct
);
router.put(
  "/:id",
  verifyAdminJWT,
  upload.fields([{ name: "photo", maxCount: 1 }]),
  updateProduct
);
router.delete("/:id", verifyAdminJWT, deleteProduct);

export default router;
