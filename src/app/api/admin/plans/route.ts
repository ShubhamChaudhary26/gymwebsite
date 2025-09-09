import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Plan from "@/models/Plan";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const plan = await Plan.create(body);
  return NextResponse.json(plan);
}
