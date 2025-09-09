import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Subscription from "@/models/Subscription";
import Plan from "@/models/Plan";

export const runtime = "nodejs"; // required for raw body

function verifySignature(body: string, signature?: string) {
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!);
  hmac.update(body, "utf8");
  return hmac.digest("hex") === signature;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await connectDB();
    const event = JSON.parse(rawBody);

    if (event.event !== "payment.captured") {
      return NextResponse.json({ ok: true }); // ignore others
    }

    const paymentEntity = event.payload.payment.entity;
    const razorpayOrderId = paymentEntity.order_id;

    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

    if (payment.status === "paid") return NextResponse.json({ ok: true }); // already processed

    // Mark payment as paid
    payment.status = "paid";
    payment.razorpayPaymentId = paymentEntity.id;
    payment.razorpaySignature = signature;
    await payment.save();

    // Create subscription
    const plan = await Plan.findById(payment.planId);
    if (!plan) return NextResponse.json({ error: "Plan missing" }, { status: 500 });

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

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
