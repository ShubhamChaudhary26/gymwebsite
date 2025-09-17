import { Trainer } from "../models/trainer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/apiResponse.js";
import { throwApiError } from "../utils/apiError.js";
import { uploadToSupabase, deleteFromSupabase } from "../utils/superbase.js";
// Create Trainer
export const createTrainer = asyncHandler(async (req, res) => {
  const { name, instagramId, post } = req.body;

  if (!name || !post) throw throwApiError(400, "Name and Post are required");

  const imageFile = req.files?.image?.[0];
  if (!imageFile) throw throwApiError(400, "Image file is required");

  const uploadResult = await uploadToSupabase(imageFile, "trainers");
  if (!uploadResult?.url)
    throw throwApiError(500, "Failed to upload trainer image");

  const trainer = await Trainer.create({
    name,
    instagramId,
    post,
    image: uploadResult.url,
  });

  return sendResponse(res, 201, trainer, "Trainer created successfully");
});

// Get all trainers
export const getAllTrainers = asyncHandler(async (req, res) => {
  const trainers = await Trainer.find().sort({ createdAt: -1 });
  return sendResponse(res, 200, trainers, "Trainers fetched successfully");
});

// Get single trainer
export const getTrainerById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trainer = await Trainer.findById(id);
  if (!trainer) throw throwApiError(404, "Trainer not found");
  return sendResponse(res, 200, trainer, "Trainer fetched successfully");
});

// Update trainer
export const updateTrainer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const imageFile = req.files?.image?.[0];
  if (imageFile) {
    const uploadResult = await uploadToSupabase(imageFile, "trainers");
    if (!uploadResult?.url)
      throw throwApiError(500, "Failed to upload trainer image");
    updateData.image = uploadResult.url;
  }

  const trainer = await Trainer.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!trainer) throw throwApiError(404, "Trainer not found");

  return sendResponse(res, 200, trainer, "Trainer updated successfully");
});

// Delete trainer
// Delete trainer
export const deleteTrainer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trainer = await Trainer.findById(id);

  if (!trainer) throw throwApiError(404, "Trainer not found");

  // Agar image stored hai to pehle Supabase se delete karo
  if (trainer.image) {
    try {
      await deleteFromSupabase(trainer.image);
    } catch (error) {
      console.error("Failed to delete trainer image from Supabase:", error);
      // ⚠ Fail hone par bhi trainer delete kar denge, image orphan rahegi
    }
  }

  // Trainer ko DB se delete karo
  await Trainer.findByIdAndDelete(id);

  return sendResponse(res, 200, trainer, "Trainer deleted successfully");
});
