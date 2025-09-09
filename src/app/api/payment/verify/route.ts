import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Subscription from "@/models/Subscription";
import Plan from "@/models/Plan";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    // 1. Verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const digest = hmac.digest("hex");

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Find payment
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // 3. Update payment status
    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    await payment.save();

    // 4. Create subscription
    const plan = await Plan.findById(payment.planId);
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    await Subscription.create({
      userId: payment.userId,
      planId: payment.planId,
      startDate,
      endDate,
      status: "active",
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and subscription created",
      subscription: { startDate, endDate },
    });
  } catch (err: any) {
    console.error("Verify API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
