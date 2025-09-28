// scripts/createTestUser.js
import dotenv from "dotenv";
import { User } from "../src/models/user.model.js";
import { connectDB } from "../src/database/db.js";

dotenv.config();

async function createTestUser() {
  try {
    await connectDB(process.env.MONGODB_URI);

    // Check if user exists
    const existingUser = await User.findOne({ username: "john_doe" });
    if (existingUser) {
      console.log("✅ Test user already exists");
      process.exit(0);
    }

    // Create test user
    const user = await User.create({
      username: "john_doe",
      email: "john@example.com",
      fullname: "John Doe",
      password: "Test@123",
      role: "user",
      avatar: `https://avatar.iran.liara.run/public/10.png`,
    });

    console.log("✅ Test user created successfully!");
    console.log("Username: john_doe");
    console.log("Password: Test@123");
    console.log("Email: john@example.com");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createTestUser();
