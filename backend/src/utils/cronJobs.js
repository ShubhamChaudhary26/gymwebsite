// utils/cronJobs.js
import cron from "node-cron";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "./sendEmail.js";

export const startCronJobs = () => {
  // Run every day at 2 AM
  cron.schedule("0 2 * * *", async () => {
    console.log("🔄 Starting daily subscription maintenance...");

    try {
      // 1. Send all reminders
      await sendSevenDayReminders();
      await sendThreeDayReminders();
      await sendOneDayReminders();

      // 2. Handle expired subscriptions
      await handleExpiredSubscriptions();

      // 3. Handle grace period
      await handleGracePeriod();

      // 4. Check auto-renewals
      await processAutoRenewals();

      console.log("✅ Daily maintenance completed");
    } catch (error) {
      console.error("❌ Cron job error:", error);
    }
  });

  console.log("⏰ Cron jobs started");
};

// 7 DAYS BEFORE EXPIRY
async function sendSevenDayReminders() {
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const startOfDay = new Date(sevenDaysFromNow);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(sevenDaysFromNow);
  endOfDay.setHours(23, 59, 59, 999);

  const subscriptions = await Subscription.find({
    status: "active",
    endDate: { $gte: startOfDay, $lte: endOfDay },
    "remindersSent.sevenDay": { $ne: true },
  }).populate("userId planId");

  for (const sub of subscriptions) {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { background: #ff5722; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Subscription Reminder</h1>
          </div>
          <div class="content">
            <h2>Hi ${sub.userId.fullname}!</h2>
            <p>Your <strong>${
              sub.planId.name
            }</strong> plan expires in <strong>7 days</strong> on ${sub.endDate.toLocaleDateString()}.</p>
            
            <p>To avoid any interruption in your gym access, please renew your subscription before it expires.</p>
            
            <h3>Your current plan includes:</h3>
            <ul>
              ${sub.planId.features.map((f) => `<li>${f}</li>`).join("")}
            </ul>
            
            <center>
              <a href="${process.env.USER_FRONTEND_URL}/renew?subscription=${
      sub._id
    }" class="button">
                Renew Subscription
              </a>
            </center>
            
            <p><small>Don't lose your gym access and membership benefits!</small></p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(
      sub.userId.email,
      "⏰ Your Gym Subscription Expires in 7 Days",
      `Your ${sub.planId.name} plan expires in 7 days. Renew now to continue.`,
      emailHtml
    );

    sub.remindersSent.sevenDay = true;
    sub.lastReminderSent = new Date();
    await sub.save();
  }

  console.log(`📧 Sent ${subscriptions.length} seven-day reminders`);
}

// 3 DAYS BEFORE EXPIRY
async function sendThreeDayReminders() {
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  const startOfDay = new Date(threeDaysFromNow);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(threeDaysFromNow);
  endOfDay.setHours(23, 59, 59, 999);

  const subscriptions = await Subscription.find({
    status: "active",
    endDate: { $gte: startOfDay, $lte: endOfDay },
    "remindersSent.threeDay": { $ne: true },
  }).populate("userId planId");

  for (const sub of subscriptions) {
    const emailHtml = `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <div style="background: #ff9800; color: white; padding: 20px; text-align: center;">
          <h1>⚠️ Urgent: 3 Days Left!</h1>
        </div>
        <div style="padding: 20px; background: #fff3e0;">
          <h2>Hi ${sub.userId.fullname}!</h2>
          <p style="font-size: 18px; color: #ff5722;">
            Your <strong>${
              sub.planId.name
            }</strong> plan expires in just <strong>3 DAYS!</strong>
          </p>
          
          <p>Act now to ensure uninterrupted access to your gym membership.</p>
          
          <center>
            <a href="${process.env.USER_FRONTEND_URL}/renew" 
               style="background: #ff5722; color: white; padding: 15px 40px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Renew Now - Don't Lose Access!
            </a>
          </center>
          
          <p>Your subscription expires on: <strong>${sub.endDate.toLocaleDateString()}</strong></p>
        </div>
      </div>
    `;

    await sendEmail(
      sub.userId.email,
      "⚠️ Only 3 Days Left - Gym Subscription Expiring!",
      `URGENT: Your ${sub.planId.name} plan expires in 3 days!`,
      emailHtml
    );

    sub.remindersSent.threeDay = true;
    sub.lastReminderSent = new Date();
    await sub.save();
  }

  console.log(`📧 Sent ${subscriptions.length} three-day reminders`);
}

// 1 DAY BEFORE EXPIRY
async function sendOneDayReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startOfDay = new Date(tomorrow);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(tomorrow);
  endOfDay.setHours(23, 59, 59, 999);

  const subscriptions = await Subscription.find({
    status: "active",
    endDate: { $gte: startOfDay, $lte: endOfDay },
    "remindersSent.oneDay": { $ne: true },
  }).populate("userId planId");

  for (const sub of subscriptions) {
    const emailHtml = `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <div style="background: #f44336; color: white; padding: 20px; text-align: center;">
          <h1>🚨 FINAL REMINDER: Expires Tomorrow!</h1>
        </div>
        <div style="padding: 20px; background: #ffebee;">
          <h2>${sub.userId.fullname}, this is your final reminder!</h2>
          <p style="font-size: 20px; color: #d32f2f;">
            Your subscription expires <strong>TOMORROW!</strong>
          </p>
          
          <div style="background: white; padding: 15px; border-left: 4px solid #f44336; margin: 20px 0;">
            <strong>What happens when your subscription expires:</strong>
            <ul>
              <li>❌ No gym access</li>
              <li>❌ Lose member benefits</li>
              <li>❌ Need to re-register after grace period</li>
            </ul>
          </div>
          
          <center>
            <a href="${process.env.USER_FRONTEND_URL}/renew" 
               style="background: #f44336; color: white; padding: 15px 50px; 
                      text-decoration: none; border-radius: 5px; display: inline-block; font-size: 18px;">
              🔄 Renew Now - Last Chance!
            </a>
          </center>
          
          <p style="text-align: center; margin-top: 20px;">
            <strong>Act now to avoid interruption!</strong>
          </p>
        </div>
      </div>
    `;

    await sendEmail(
      sub.userId.email,
      "🚨 FINAL NOTICE: Subscription Expires Tomorrow!",
      `FINAL REMINDER: Your gym subscription expires tomorrow!`,
      emailHtml
    );

    sub.remindersSent.oneDay = true;
    sub.lastReminderSent = new Date();
    await sub.save();
  }

  console.log(`📧 Sent ${subscriptions.length} one-day reminders`);
}

// HANDLE EXPIRED SUBSCRIPTIONS
async function handleExpiredSubscriptions() {
  const now = new Date();

  const expiredSubs = await Subscription.find({
    status: "active",
    endDate: { $lt: now },
  }).populate("userId planId");

  for (const sub of expiredSubs) {
    // 1. Start grace period (3 days)
    const gracePeriodDays = 3;
    const gracePeriodEnd = new Date();
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + gracePeriodDays);

    sub.status = "grace_period";
    sub.expiredAt = now;
    sub.gracePeriodEnd = gracePeriodEnd;
    await sub.save();

    // 2. DON'T clear user subscription yet (grace period active)

    // 3. Send expiry notification
    if (!sub.remindersSent.expiryDay) {
      const emailHtml = `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
          <div style="background: #9e9e9e; color: white; padding: 20px; text-align: center;">
            <h1>Subscription Expired</h1>
          </div>
          <div style="padding: 20px; background: #f5f5f5;">
            <h2>Hi ${sub.userId.fullname},</h2>
            <p>Your <strong>${sub.planId.name}</strong> subscription has expired.</p>
            
            <div style="background: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              ⏰ <strong>Grace Period Active:</strong> You have 3 days to renew your subscription without losing your membership benefits!
            </div>
            
            <p>During the grace period, you have limited access to gym facilities.</p>
            
            <center>
              <a href="${process.env.USER_FRONTEND_URL}/renew" 
                 style="background: #ff5722; color: white; padding: 15px 40px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Reactivate Subscription
              </a>
            </center>
            
            <p><small>After the grace period ends, you'll need to purchase a new subscription.</small></p>
          </div>
        </div>
      `;

      await sendEmail(
        sub.userId.email,
        "Subscription Expired - Grace Period Active",
        `Your gym subscription has expired. 3-day grace period is now active.`,
        emailHtml
      );

      sub.remindersSent.expiryDay = true;
      await sub.save();
    }

    // 4. Notify admins
    const admins = await User.find({ role: "admin" }).select("email fullname");
    for (const admin of admins) {
      await sendEmail(
        admin.email,
        "User Subscription Expired",
        `${sub.userId.fullname}'s subscription has expired`,
        `<p>User: ${sub.userId.fullname} (${sub.userId.email})</p>
         <p>Plan: ${sub.planId.name}</p>
         <p>Status: Grace Period (3 days)</p>`
      );
    }
  }

  console.log(`⏰ Processed ${expiredSubs.length} expired subscriptions`);
}

// HANDLE GRACE PERIOD END
async function handleGracePeriod() {
  const now = new Date();

  const gracePeriodEnded = await Subscription.find({
    status: "grace_period",
    gracePeriodEnd: { $lt: now },
  }).populate("userId");

  for (const sub of gracePeriodEnded) {
    // 1. Mark as fully expired
    sub.status = "expired";
    await sub.save();

    // 2. NOW clear user's subscription
    await User.findByIdAndUpdate(sub.userId._id, {
      $unset: { currentSubscription: 1 },
    });

    // 3. Send final notification
    if (!sub.remindersSent.gracePeriod) {
      await sendEmail(
        sub.userId.email,
        "Grace Period Ended - Membership Terminated",
        "Your gym membership grace period has ended",
        `<div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
          <h2>Grace Period Ended</h2>
          <p>Your grace period has ended and your gym membership has been terminated.</p>
          <p>To regain access, please purchase a new subscription.</p>
          <a href="${process.env.USER_FRONTEND_URL}/plans" 
             style="background: #4CAF50; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px;">
            Get New Subscription
          </a>
        </div>`
      );

      sub.remindersSent.gracePeriod = true;
      await sub.save();
    }
  }

  console.log(
    `🔒 Terminated ${gracePeriodEnded.length} subscriptions after grace period`
  );
}

// AUTO-RENEWAL (Optional - implement if needed)
async function processAutoRenewals() {
  // Implementation for auto-renewal if enabled
  console.log("Auto-renewal check completed");
}
