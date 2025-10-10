import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  isVerified: boolean;
  role: "USER" | "ADMIN";
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User<IUser> || mongoose.model<IUser>("User", UserSchema);
