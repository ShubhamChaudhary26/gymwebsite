import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/apiResponse.js";
import { throwApiError } from "../utils/apiError.js";
import { uploadToSupabase, deleteFromSupabase } from "../utils/superbase.js";

// Create Product
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    throw throwApiError(400, "All fields are required");
  }

  const imageFile = req.files?.photo?.[0];
  if (!imageFile) {
    throw throwApiError(400, "Photo is required");
  }

  const uploadResult = await uploadToSupabase(imageFile, "products");
  if (!uploadResult?.url) {
    throw throwApiError(500, "Failed to upload product image");
  }

  const product = await Product.create({
    name,
    description,
    price,
    photo: uploadResult.url,
  });

  return sendResponse(res, 201, product, "Product created successfully");
});

// Get all products
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  return sendResponse(res, 200, products, "Products fetched successfully");
});

// Get single product
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) throw throwApiError(404, "Product not found");
  return sendResponse(res, 200, product, "Product fetched successfully");
});

// Update product
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const imageFile = req.files?.photo?.[0];
  if (imageFile) {
    const uploadResult = await uploadToSupabase(imageFile, "products");
    if (!uploadResult?.url) {
      throw throwApiError(500, "Failed to upload new product image");
    }
    updateData.photo = uploadResult.url;
  }

  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!product) throw throwApiError(404, "Product not found");

  return sendResponse(res, 200, product, "Product updated successfully");
});

// Delete product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) throw throwApiError(404, "Product not found");

  if (product.photo) {
    try {
      await deleteFromSupabase(product.photo);
    } catch (err) {
      console.error("Failed to delete image from Supabase:", err);
    }
  }

  await Product.findByIdAndDelete(id);
  return sendResponse(res, 200, product, "Product deleted successfully");
});
