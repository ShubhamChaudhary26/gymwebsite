import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Trainer name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    image: {
      type: String,
      required: [true, "Trainer image is required"], // Store image URL (Supabase ya Cloudinary)
    },
    instagramId: {
      type: String,
      trim: true,
    },
    post: {
      type: String,
      required: [true, "Trainer designation/post is required"], // e.g. "Fitness Coach", "Yoga Trainer"
      trim: true,
    },
  },
  { timestamps: true }
);

export const Trainer = mongoose.model("Trainer", trainerSchema);
