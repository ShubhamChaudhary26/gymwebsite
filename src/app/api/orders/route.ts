import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/db";
import Plan from "@/models/Plan";
import Payment from "@/models/Payment";
import { requireAuth } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { uid } = requireAuth();
    const body = await req.json();
    const { planId } = body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const order = await razorpay.orders.create({
      amount: plan.priceInPaise,
      currency: "INR",
      receipt: "rcpt_" + Date.now(), // ✅ FIXED
    });

    await Payment.create({
      userId: uid,
      planId,
      razorpayOrderId: order.id,
     amountInPaise: plan.priceInPaise, // ✅ fixed field name
      status: "created",
    });

    return NextResponse.json(order);
  } catch (err: any) {
    console.error("Order API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
