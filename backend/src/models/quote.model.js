import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Full Name is required"],
      minlength: [3, "Full Name must be at least 3 characters"],
      maxlength: [50, "Full Name cannot exceed 50 characters"],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, "Official Email is required"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      required: [true, "Mobile Number is required"],
      trim: true,
    },
    city: {
      type: String,
      minlength: [3, "City must be at least 3 characters"],
      maxlength: [50, "City cannot exceed 50 characters"],
      trim: true,
    },
    selectedProducts: {
      type: [String],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["New", "In Progress", "Resolved", "Closed"],
        message: "Status must be one of: New, In Progress, Resolved, Closed",
      },
      default: "New",
    },
    replies: [
      {
        message: {
          type: String,
          required: [true, "Reply message is required"],
          minlength: [3, "Reply message must be at least 3 characters"],
          maxlength: [1000, "Reply message cannot exceed 1000 characters"],
          trim: true,
        },
        repliedAt: {
          type: Date,
          required: [true, "Reply date is required"],
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Quote = mongoose.model("Quote", quoteSchema);
