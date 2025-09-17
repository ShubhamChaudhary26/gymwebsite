// utils/cronJobs.js
import cron from "node-cron";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "./sendEmail.js";

// Run daily at midnight
export const startCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running subscription check...");

    // Find expiring subscriptions (3 days before)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const expiringSoon = await Subscription.find({
      status: "active",
      endDate: {
        $gte: new Date(),
        $lte: threeDaysFromNow,
      },
    }).populate("userId planId");

    // Send reminder emails
    for (const sub of expiringSoon) {
      await sendEmail(
        sub.userId.email,
        "Subscription Expiring Soon",
        `Your ${
          sub.planId.name
        } plan expires on ${sub.endDate.toLocaleDateString()}`,
        `<p>Your subscription expires in 3 days. Renew now to continue.</p>`
      );
    }

    // Mark expired subscriptions
    const expired = await Subscription.updateMany(
      {
        status: "active",
        endDate: { $lt: new Date() },
      },
      { status: "expired" }
    );

    console.log(`Marked ${expired.modifiedCount} subscriptions as expired`);
  });
};
