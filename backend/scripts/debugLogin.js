// scripts/debugLogin.js
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const API_URL = "http://localhost:3000/api/v1";

async function debugLogin() {
  try {
    console.log("🔍 Debug Login Test\n");

    // Try login
    console.log("Attempting login...");
    const loginRes = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "john_doe",
        password: "Test@123",
      }),
    });

    const loginData = await loginRes.json();

    // Full response dekho
    console.log("\n📦 Full Response:");
    console.log(JSON.stringify(loginData, null, 2));

    // Token locations check karo
    console.log("\n🔑 Token Locations:");
    console.log("data.accessToken:", loginData.data?.accessToken);
    console.log("data.user.accessToken:", loginData.data?.user?.accessToken);
    console.log("data.user:", loginData.data?.user ? "User exists" : "No user");
    console.log("Direct accessToken:", loginData.accessToken);

    // Response structure
    console.log("\n📊 Response Structure:");
    console.log("Keys in response:", Object.keys(loginData));
    if (loginData.data) {
      console.log("Keys in data:", Object.keys(loginData.data));
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

debugLogin();
