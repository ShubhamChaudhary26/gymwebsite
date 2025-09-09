import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import User from "@/models/User";
import Plan from "@/models/Plan";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const payments = await Payment.find()
      .populate("userId", "name email phone")
      .populate("planId", "name priceInPaise durationDays")
      .lean();

    return NextResponse.json({ payments });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
