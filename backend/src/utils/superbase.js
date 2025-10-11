// utils/superbase.js - COMPLETE FIX

import { createClient } from "@supabase/supabase-js";
import fs from "fs"; // ✅ Use sync fs (not promises)
import path from "path";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "files";
const PUBLIC_BASE = (
  process.env.PUBLIC_BASE_URL || "http://localhost:3000"
).replace(/\/$/, "");

console.log("📡 Supabase URL:", process.env.SUPABASE_URL);
console.log("🪣 Bucket:", BUCKET);
console.log("🌐 Public Base:", PUBLIC_BASE);

// Build proxy URL for a storage key
export const buildProxyUrl = (key) => ${PUBLIC_BASE}/Uploads/${key};

// Extract storage key from URL or raw key
export const extractKey = (input) => {
  if (!input) return null;
  if (!/^https?:\/\//i.test(input)) return input.replace(/^\/+/, "");

  let m = input.match(/\/Uploads\/(.+)$/i);
  if (m) return m[1];

  m = input.match(/\/storage\/v1\/object\/(?:public\/)?[^/]+\/(.+)$/i);
  if (m) return m[1];

  return null;
};

export const uploadToSupabase = async (file, folder) => {
  if (!file || !file.path) {
    throw new Error("No file to upload");
  }

  console.log("📤 Uploading file:", file.path);
  console.log("📂 Target folder:", folder);

  try {
    // ✅ Check if file exists before reading
    if (!fs.existsSync(file.path)) {
      throw new Error(File not found: ${file.path});
    }

    // ✅ Read file synchronously (works better on Vercel)
    const buffer = fs.readFileSync(file.path);
    console.log("✅ File read successfully, size:", buffer.length, "bytes");

    const ext = path.extname(file.originalname).toLowerCase();
    const fileName = ${Date.now()}-${Math.round(Math.random() * 1e9)}${ext};
    const key = ${folder}/${fileName};

    console.log("📁 Uploading to Supabase as:", key);

    const { error } = await supabase.storage.from(BUCKET).upload(key, buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

    // ✅ Delete temp file (critical for Vercel)
    try {
      fs.unlinkSync(file.path);
      console.log("🗑 Temp file deleted:", file.path);
    } catch (unlinkError) {
      console.warn("⚠ Failed to delete temp file:", unlinkError.message);
    }

    if (error) {
      console.error("❌ Supabase upload error:", error);
      throw error;
    }

    const proxyUrl = buildProxyUrl(key);
    console.log("✅ File uploaded successfully:", proxyUrl);

    return { key, url: proxyUrl };
  } catch (error) {
    console.error("❌ Upload failed:", error);

    // ✅ Cleanup on error
    try {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
        console.log("🗑 Cleaned up failed upload file");
      }
    } catch (cleanupError) {
      console.warn("⚠ Cleanup failed:", cleanupError.message);
    }

    throw new Error("Failed to upload to Supabase", { cause: error });
  }
};

// Delete from Supabase
export const deleteFromSupabase = async (fileRef) => {
  if (!fileRef) return;

  const key = extractKey(fileRef);
  if (!key) {
    console.warn("deleteFromSupabase: could not parse key from", fileRef);
    return;
  }

  console.log("🗑 Deleting from Supabase:", key);

  const { error } = await supabase.storage.from(BUCKET).remove([key]);

  if (error) {
    console.error("❌ Failed to delete file from Supabase:", key, error);
  } else {
    console.log("✅ Deleted from Supabase:", key);
  }
};