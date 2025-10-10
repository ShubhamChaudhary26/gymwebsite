// routes/quote.routes.js
import express from "express";
import {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
} from "../controllers/quotes.controller.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllQuotes);
router.get("/:id", getQuoteById);
router.post("/create", createQuote); // Quote create public rakha hai

// Admin only routes
router.put("/:id", verifyAdminJWT, updateQuote); // Admin reply kar sake
router.delete("/:id", verifyAdminJWT, deleteQuote);

export default router;
