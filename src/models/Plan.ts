import mongoose, { Schema, Document } from "mongoose";

export interface IPlan extends Document {
  name: string;
  priceInPaise: number; // Razorpay works in paise
  durationDays: number;
  isActive: boolean;
}

const PlanSchema = new Schema<IPlan>({
  name: { type: String, required: true },
  priceInPaise: { type: Number, required: true },
  durationDays: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

export default mongoose.models.Plan || mongoose.model<IPlan>("Plan", PlanSchema);
