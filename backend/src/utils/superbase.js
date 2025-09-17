// utils/superbase.js
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // server only
);

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "files";
const PUBLIC_BASE = (
  process.env.PUBLIC_BASE_URL || "http://localhost:3000"
).replace(/\/$/, "");

// Build your-domain URL for a storage key
export const buildProxyUrl = (key) => `${PUBLIC_BASE}/Uploads/${key}`;

// Extract storage key from: your-domain URL OR supabase public URL OR raw key
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
  if (!file || !file.path) throw new Error("No file to upload");

  try {
    const buffer = await fs.readFile(file.path);
    const ext = path.extname(file.originalname).toLowerCase();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const key = `${folder}/${fileName}`;

    const { error } = await supabase.storage.from(BUCKET).upload(key, buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
    await fs.unlink(file.path).catch(() => {});

    if (error) throw error;

    // Return your-domain URL for storing/display + the key internally if needed
    return { key, url: buildProxyUrl(key) };
  } catch (error) {
    await fs.unlink(file.path).catch(() => {});
    console.error("Supabase upload error:", error);
    throw new Error("Failed to upload to Supabase", { cause: error });
  }
};

// Accepts your-domain URL, supabase URL, or raw key
export const deleteFromSupabase = async (fileRef) => {
  if (!fileRef) return;
  const key = extractKey(fileRef);
  if (!key) {
    console.warn("deleteFromSupabase: could not parse key from", fileRef);
    return;
  }
  const { error } = await supabase.storage.from(BUCKET).remove([key]);
  if (error) {
    console.error("Failed to delete file from Supabase:", key, error);
  } else {
    console.log("Deleted from Supabase:", key);
  }
};
