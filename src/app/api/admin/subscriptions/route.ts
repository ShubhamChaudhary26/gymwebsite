import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/Subscription";
import User from "@/models/User";
import Plan from "@/models/Plan";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const subs = await Subscription.find()
      .populate("userId", "name email phone")
      .populate("planId", "name priceInPaise durationDays")
      .lean();

    return NextResponse.json({ subscriptions: subs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
