import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/Subscription";
import Plan from "@/models/Plan";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { uid } = requireAuth();
    await connectDB();

    const sub = await Subscription.findOne({ userId: uid, status: "active" })
      .sort({ createdAt: -1 })
      .populate("planId");

    if (!sub) return NextResponse.json({ active: false });

    return NextResponse.json({
      active: true,
      plan: (sub as any).planId.name,
      startDate: sub.startDate,
      endDate: sub.endDate,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
