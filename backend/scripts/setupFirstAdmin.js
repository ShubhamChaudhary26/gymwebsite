import readline from "readline";
import { User } from "../src/models/user.model.js";
import { connectDB } from "../src/database/db.js";
import dotenv from "dotenv";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const setupFirstAdmin = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("❌ Admin already exists!");
      console.log(`Existing admin: ${adminExists.email}`);

      const answer = await question(
        "Do you want to create another admin? (yes/no): "
      );
      if (answer.toLowerCase() !== "yes") {
        rl.close();
        process.exit(0);
      }
    }

    console.log("\n🏋️ === Gym Management System - Admin Setup ===\n");

    const username = await question("Enter username: ");
    const email = await question("Enter email: ");
    const fullname = await question("Enter full name: ");
    const password = await question("Enter password: ");

    const admin = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      fullname,
      password,
      role: "admin",
      avatar: `https://avatar.iran.liara.run/public/1.png`,
    });

    console.log("\n✅ Admin created successfully!");
    console.log(`📧 Email: ${admin.email}`);
    console.log(`👤 Username: ${admin.username}`);
    console.log(
      `🌐 Admin Panel URL: ${
        process.env.ADMIN_PANEL_URL || "http://localhost:5174"
      }`
    );
    console.log("\n🔐 Please login to admin panel with these credentials");

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    rl.close();
    process.exit(1);
  }
};

setupFirstAdmin();
