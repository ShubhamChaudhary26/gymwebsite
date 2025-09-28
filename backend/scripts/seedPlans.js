import dotenv from "dotenv";
import { Plan } from "../src/models/plan.model.js";
import { connectDB } from "../src/database/db.js";

dotenv.config();

const plans = [
  {
    name: "Basic",
    price: 999,
    duration: 30,
    features: [
      "Access to gym equipment",
      "Locker facility",
      "Basic fitness assessment",
    ],
    isActive: true,
  },
  {
    name: "Premium",
    price: 2499,
    duration: 90,
    features: [
      "All Basic features",
      "Personal trainer (2 sessions/week)",
      "Diet consultation",
      "Group classes access",
    ],
    isActive: true,
  },
  {
    name: "Pro",
    price: 4999,
    duration: 180,
    features: [
      "All Premium features",
      "Unlimited personal training",
      "Customized diet plan",
      "Body composition analysis",
      "Priority support",
    ],
    isActive: true,
  },
];

const seedPlans = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    // Clear existing plans
    await Plan.deleteMany({});
    console.log("Cleared existing plans");

    // Insert new plans
    const createdPlans = await Plan.insertMany(plans);
    console.log(`Created ${createdPlans.length} plans successfully`);

    // Show plan IDs for testing
    createdPlans.forEach((plan) => {
      console.log(`${plan.name} Plan ID: ${plan._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding plans:", error);
    process.exit(1);
  }
};

seedPlans();
