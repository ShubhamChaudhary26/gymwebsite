import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  userId: string;
  planId: string;
  amountInPaise: number;
  status: "created" | "paid" | "failed";
  method: "online" | "offline";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  userId: { type: String, required: true },
  planId: { type: String, required: true },
  amountInPaise: { type: Number, required: true },
  status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
  method: { type: String, enum: ["online", "offline"], default: "online" },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
