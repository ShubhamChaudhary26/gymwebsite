// middlewares/multer.middleware.js - COMPLETE FIX

import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Use /tmp for Vercel, ./public/temp for localhost
const uploadDir = process.env.VERCEL ? "/tmp" : "./public/temp";

// ✅ Create directory if not exists (localhost only)
if (!process.env.VERCEL) {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("✅ Created upload directory:", uploadDir);
    }
  } catch (err) {
    console.error("❌ Failed to create upload directory:", err);
  }
}

console.log("📂 Upload directory:", uploadDir);

const customFileFilter = (req, file, cb) => {
  if (!file?.originalname) {
    return cb(new Error("File name is missing"), false);
  }

  // images field: only allow images
  if (
    file.fieldname === "image" ||
    file.fieldname === "images" ||
    file.fieldname === "photo" ||
    file.fieldname === "avatar" // ✅ Add avatar
  ) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(
      new Error(
        "Only image files (jpeg, jpg, png, gif, webp) are allowed for images"
      ),
      false
    );
  }

  // brochure or tds field: only allow PDF, DOC, DOCX
  if (file.fieldname === "brochure" || file.fieldname === "tds") {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const mimetype = allowedMimeTypes.includes(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(
      new Error("Only PDF, DOC, DOCX files are allowed for brochure and tds"),
      false
    );
  }

  // default: reject
  cb(new Error("Unexpected field"), false);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("📁 Saving file to:", uploadDir);
    cb(null, uploadDir); // ✅ Dynamic path
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    console.log("📝 Generated filename:", filename);
    cb(null, filename);
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
  fileFilter: customFileFilter,
});