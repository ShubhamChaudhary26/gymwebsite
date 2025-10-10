export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error("❌ AsyncHandler caught error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};
