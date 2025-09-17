// scripts/testUserPaymentFlow.js
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const API_URL = "http://localhost:3000/api/v1";

async function testPaymentFlow() {
  try {
    console.log("🔄 Testing Complete Payment Flow...\n");

    // 1. User Login
    console.log("1️⃣ User Login...");
    const loginRes = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "john_doe",
        password: "Test@123",
      }),
    });

    if (!loginRes.ok) {
      throw new Error(`Login failed: ${await loginRes.text()}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.data?.accessToken || loginData.accessToken;
    console.log("✅ Logged in successfully\n");

    // 2. Get Plans
    console.log("2️⃣ Fetching available plans...");
    const plansRes = await fetch(`${API_URL}/plans`);
    const plansData = await plansRes.json();
    console.log("Available Plans:");
    plansData.data.forEach((plan) => {
      console.log(`  - ${plan.name}: ₹${plan.price} for ${plan.duration} days`);
    });

    const selectedPlan = plansData.data[0]; // Select Basic plan
    console.log(`\n✅ Selected: ${selectedPlan.name} plan\n`);

    // 3. Check Current Subscription Status
    console.log("3️⃣ Checking current subscription...");
    const statusRes = await fetch(`${API_URL}/payments/subscription-status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const statusData = await statusRes.json();

    if (statusData.data?.hasSubscription) {
      console.log("⚠️  User already has an active subscription:");
      console.log(`  Plan: ${statusData.data.subscription.planName}`);
      console.log(`  Expires: ${statusData.data.subscription.endDate}`);
      console.log(
        `  Days Remaining: ${statusData.data.subscription.daysRemaining}`
      );
      return;
    }
    console.log("✅ No active subscription found\n");

    // 4. Create Order
    console.log("4️⃣ Creating payment order...");
    const orderRes = await fetch(`${API_URL}/payments/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planId: selectedPlan._id }),
    });

    if (!orderRes.ok) {
      throw new Error(`Order creation failed: ${await orderRes.text()}`);
    }

    const orderData = await orderRes.json();
    console.log(`✅ Order created:`);
    console.log(`  Order ID: ${orderData.data.orderId}`);
    console.log(`  Amount: ₹${orderData.data.amount / 100}`);
    console.log(`  Subscription ID: ${orderData.data.subscriptionId}\n`);

    // 5. Simulate Payment (In production, this would be done by Razorpay)
    console.log("5️⃣ Simulating payment verification...");
    const verifyRes = await fetch(`${API_URL}/payments/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        razorpay_order_id: orderData.data.orderId,
        razorpay_payment_id: `pay_test_${Date.now()}`,
        razorpay_signature: "test_signature",
        subscriptionId: orderData.data.subscriptionId,
      }),
    });

    if (!verifyRes.ok) {
      throw new Error(`Payment verification failed: ${await verifyRes.text()}`);
    }

    const verifyData = await verifyRes.json();
    console.log("✅ Payment verified and subscription activated!\n");

    // 6. Check Updated Status
    console.log("6️⃣ Fetching updated subscription status...");
    const newStatusRes = await fetch(
      `${API_URL}/payments/subscription-status`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const newStatusData = await newStatusRes.json();

    if (newStatusData.data?.hasSubscription) {
      console.log("✅ Subscription Active:");
      console.log(`  Plan: ${newStatusData.data.subscription.planName}`);
      console.log(`  Start Date: ${newStatusData.data.subscription.startDate}`);
      console.log(`  End Date: ${newStatusData.data.subscription.endDate}`);
      console.log(
        `  Days Remaining: ${newStatusData.data.subscription.daysRemaining}`
      );
    }

    console.log("\n🎉 Payment flow completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testPaymentFlow();
