// controllers/plan.controller.js
import { Plan } from "../models/plan.model.js";
import { Subscription } from "../models/subscription.model.js";
import { throwApiError } from "../utils/apiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all active plans
export const getAllPlans = asyncHandler(async (req, res) => {
  const { includeInactive } = req.query;

  const filter = includeInactive === "true" ? {} : { isActive: true };
  const plans = await Plan.find(filter).sort({ price: 1 });

  return sendResponse(res, 200, plans, "Plans fetched successfully");
});

// Get single plan
export const getPlanById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const plan = await Plan.findById(id);

  if (!plan) {
    throw throwApiError(404, "Plan not found");
  }

  return sendResponse(res, 200, plan, "Plan fetched successfully");
});

// Create new plan (Admin only)
export const createPlan = asyncHandler(async (req, res) => {
  const { name, price, duration, features } = req.body;

  // Check if plan with same name exists
  const existingPlan = await Plan.findOne({ name });

  if (existingPlan) {
    throw throwApiError(400, "Plan with this name already exists");
  }

  const plan = await Plan.create({
    name,
    price,
    duration,
    features: Array.isArray(features)
      ? features
      : features.split(",").map((f) => f.trim()),
  });

  return sendResponse(res, 201, plan, "Plan created successfully");
});

// Update plan (Admin only)
export const updatePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, duration, features, isActive } = req.body;

  const plan = await Plan.findById(id);

  if (!plan) {
    throw throwApiError(404, "Plan not found");
  }

  // Check if name is being changed and if new name already exists
  if (name && name !== plan.name) {
    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
      throw throwApiError(400, "Plan with this name already exists");
    }
  }

  // Update fields
  if (name !== undefined) plan.name = name;
  if (price !== undefined) plan.price = price;
  if (duration !== undefined) plan.duration = duration;
  if (features !== undefined) {
    plan.features = Array.isArray(features)
      ? features
      : features.split(",").map((f) => f.trim());
  }
  if (isActive !== undefined) plan.isActive = isActive;

  await plan.save();

  return sendResponse(res, 200, plan, "Plan updated successfully");
});

// Delete plan (Admin only)
export const deletePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if any active subscriptions exist for this plan
  const activeSubscriptions = await Subscription.countDocuments({
    planId: id,
    status: "active",
  });

  if (activeSubscriptions > 0) {
    throw throwApiError(
      400,
      `Cannot delete plan. ${activeSubscriptions} active subscriptions exist.`
    );
  }

  const plan = await Plan.findByIdAndDelete(id);

  if (!plan) {
    throw throwApiError(404, "Plan not found");
  }

  return sendResponse(res, 200, plan, "Plan deleted successfully");
});

// Toggle plan status (Admin only)
export const togglePlanStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const plan = await Plan.findById(id);

  if (!plan) {
    throw throwApiError(404, "Plan not found");
  }

  plan.isActive = !plan.isActive;
  await plan.save();

  return sendResponse(
    res,
    200,
    plan,
    `Plan ${plan.isActive ? "activated" : "deactivated"} successfully`
  );
});
