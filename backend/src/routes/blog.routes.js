import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.get("/slug/:slug", getBlogBySlug);

// Private routes
router.post(
  "/create",
  verifyAdminJWT,
  upload.fields([{ name: "image", maxCount: 1 }]),
  createBlog
);
router.put(
  "/:id",
  verifyAdminJWT,
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateBlog
);
router.delete("/:id", verifyAdminJWT, deleteBlog);

export default router;
