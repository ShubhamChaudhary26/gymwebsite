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
    const { uid } = requireAuth(); // user must be logged in
    await connectDB();

    const body = await req.json();
    const { planId } = body;

    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: plan.priceInPaise,
      currency: "INR",
      receipt: `rcpt_${uid}_${Date.now()}`,
      notes: { userId: uid, planId: planId },
    });

    // Save Payment entry
    await Payment.create({
      userId: uid,
      planId: planId,
      amountInPaise: plan.priceInPaise,
      status: "created",
      method: "online",
      razorpayOrderId: order.id,
    });

    return NextResponse.json({ orderId: order.id, amount: plan.priceInPaise, currency: "INR" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
