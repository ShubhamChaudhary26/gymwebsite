import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 chars"],
      maxlength: [100, "Name cannot exceed 100 chars"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [5, "Description must be at least 5 chars"],
      maxlength: [1000, "Description cannot exceed 1000 chars"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    photo: {
      type: String, // Supabase image URL
      required: [true, "Product image is required"],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
