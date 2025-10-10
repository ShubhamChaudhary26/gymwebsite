import dotenv from "dotenv";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import mime from "mime";

dotenv.config();

const router = express.Router();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "files";
const allowedPrefixes = (
  process.env.ASSET_PROXY_ALLOWED_PREFIXES || "products,blog,nature,avatars"
)
  .split(",")
  .map((s) => s.trim().replace(/\/?$/, "/"));

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

router.get(/^\/(.+)$/, async (req, res) => {
  const key = req.params[0]; // e.g. "products/somefile.jpg"
  console.log(
    "Received request for:",
    req.originalUrl,
    "Origin:",
    req.headers.origin
  ); // Debug log

  try {
    if (!key) return res.status(400).send("Bad request");
    if (key.includes("..")) return res.status(400).send("Invalid path");

    if (!allowedPrefixes.some((p) => key.startsWith(p))) {
      return res.status(403).send("Forbidden path");
    }

    const { data, error } = await supabase.storage.from(BUCKET).download(key);
    if (error || !data) {
      console.error("Supabase download error:", error?.message || error);
      return res.status(404).send("Not found");
    }

    // Dynamic CORS based on request origin
    const allowedOrigins = [
      "https://gajpatiindustries.com",
      "https://www.gajpatiindustries.com",
      "https://admin.gajpatiindustries.com",
      "https://gajpatiadminfrontend.onrender.com",
      "https://gajpatifrontend.onrender.com",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000", // Add server origin
    ];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*"); // Fallback for non-browser requests
    }
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Range"
    );

    // Set correct MIME type
    const type = mime.getType(key) || "application/octet-stream";
    res.setHeader("Content-Type", type);

    // Cache strongly (1 year)
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    // Inline preview for PDFs
    if (type === "application/pdf") {
      const filename = key.split("/").pop();
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    }

    // Convert and send as buffer
    const buffer = Buffer.from(await data.arrayBuffer());
    return res.status(200).end(buffer);
  } catch (err) {
    console.error("Uploads proxy error:", err);
    return res.status(500).send("Server error");
  }
});

export default router;
