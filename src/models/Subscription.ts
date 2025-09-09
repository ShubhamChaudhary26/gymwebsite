import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "expired" | "cancelled";
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: { type: String, required: true },
  planId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
});

export default mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
