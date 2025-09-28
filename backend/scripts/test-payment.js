import http from "http";

// Configuration
const API_HOST = "localhost";
const API_PORT = 3000;
let authToken = "";

// Helper function for API calls
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: `/api/v1${path}`,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testPaymentFlow() {
  try {
    console.log("🏃 Starting Payment Test...\n");

    // 1. Create User
    console.log("1️⃣ Creating test user...");
    const timestamp = Date.now();
    const registerData = await makeRequest("POST", "/users/register", {
      username: `gymuser${timestamp}`,
      email: `gymuser${timestamp}@test.com`,
      fullname: "Test Gym User",
      password: "password123",
    });
    console.log("✅ User created");

    // 2. Login
    console.log("\n2️⃣ Logging in...");
    const loginData = await makeRequest("POST", "/users/login", {
      username: `gymuser${timestamp}`,
      password: "password123",
    });

    if (loginData.data && loginData.data.accessToken) {
      authToken = loginData.data.accessToken;
      console.log("✅ Login successful");
    } else {
      throw new Error("Login failed");
    }

    // 3. Get Plans
    console.log("\n3️⃣ Fetching plans...");
    const plansData = await makeRequest("GET", "/plans");
    const plans = plansData.data;

    if (!plans || plans.length === 0) {
      throw new Error("No plans found. Create plans first!");
    }

    const selectedPlan = plans[0];
    console.log(
      `✅ Selected plan: ${selectedPlan.name} - ₹${selectedPlan.price}`
    );

    // 4. Create Order
    console.log("\n4️⃣ Creating payment order...");
    const orderData = await makeRequest(
      "POST",
      "/payments/create-order",
      {
        planId: selectedPlan._id,
      },
      authToken
    );

    if (!orderData.data) {
      throw new Error("Order creation failed");
    }

    console.log(`✅ Order created: ${orderData.data.orderId}`);
    console.log(`   Amount: ₹${orderData.data.amount / 100}`);

    // 5. Simulate Payment
    console.log("\n5️⃣ Simulating payment verification...");
    const verifyData = await makeRequest(
      "POST",
      "/payments/verify",
      {
        razorpay_order_id: orderData.data.orderId,
        razorpay_payment_id: `pay_test_${Date.now()}`,
        razorpay_signature: "test_signature",
        subscriptionId: orderData.data.subscriptionId,
      },
      authToken
    );

    console.log("✅ Payment verified successfully!");

    // 6. Check Subscription Status
    console.log("\n6️⃣ Checking subscription status...");
    const statusData = await makeRequest(
      "GET",
      "/payments/subscription-status",
      null,
      authToken
    );

    if (statusData.data.hasSubscription) {
      console.log("✅ Subscription Active!");
      console.log(`   Plan: ${statusData.data.subscription.planName}`);
      console.log(`   Valid till: ${statusData.data.subscription.endDate}`);
      console.log(
        `   Days remaining: ${statusData.data.subscription.daysRemaining}`
      );
    }

    console.log("\n🎉 Payment flow test completed successfully!");
    console.log("📧 Check emails for user and admin notifications");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.error("Details:", error);
  }
}

// Run the test
testPaymentFlow();
