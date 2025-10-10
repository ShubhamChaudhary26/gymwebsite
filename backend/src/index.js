import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { connectDB } from "./database/db.js";
import uploadsRouter from "./routes/uploads.routes.js";

dotenv.config();

const requiredEnvVars = [
  "MONGODB_URI",
  "PORT",
  "SUPABASE_URL",
  "SENDGRID_API_KEY",
  "EMAIL_FROM",
  "SUPABASE_KEY",
  "SUPABASE_SERVICE_KEY",
];

console.log("Environment:", process.env.NODE_ENV);

requiredEnvVars.forEach((envVariable) => {
  if (!process.env[envVariable]) {
    console.error(
      `Error: ${envVariable} is not defined in environment variables`
    );
    process.exit(1);
  }
});

// Initialize the express app
const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV === "development";

// ========== MIDDLEWARES (CORRECT ORDER) ==========

// ✅ 1. CORS - MUST BE FIRST!
const allowedOrigins = [
  "http://localhost:3001", // Next.js frontend
  "http://localhost:5173", // Vite admin
  "http://localhost:5174", // Vite user
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        console.log(`✅ CORS allowed: ${origin}`);
        return callback(null, true);
      } else {
        console.log(`❌ CORS blocked: ${origin}`);
        return callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// ✅ 2. Body parsers
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 3. Helmet (security headers) - AFTER CORS
app.use(
  helmet({
    contentSecurityPolicy: isDev
      ? {
          directives: {
            defaultSrc: ["'self'"],
            imgSrc: [
              "'self'",
              "http://localhost:3000",
              "http://localhost:3001",
              "data:",
            ],
            connectSrc: [
              "'self'",
              "http://localhost:3000",
              "http://localhost:3001",
            ],
          },
        }
      : {
          directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
          },
        },
    crossOriginResourcePolicy: { policy: "cross-origin" }, // ✅ Changed from false
  })
);

// ✅ 4. Rate limiter
const globalRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDev ? 10000 : 5000, // Higher limit in dev
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return (
      req.url === "/" ||
      req.url === "/health" ||
      req.url.startsWith("/Uploads/")
    );
  },
});

app.use(globalRateLimiter);

// ========== ROUTES IMPORT ==========
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import subscriberRouter from "./routes/subscriber.route.js";
import quotesRouter from "./routes/quote.routes.js";
import trainerRouter from "./routes/trainer.routes.js";
import productRouter from "./routes/product.routes.js";
import adminSubscriptionRouter from "./routes/adminSubscription.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import planRouter from "./routes/plan.routes.js";
import adminAuthRouter from "./routes/adminAuth.routes.js";
import adminRouter from "./routes/admin.routes.js";
import { startCronJobs } from "./utils/cronJobs.js";

// ========== APPLY ROUTERS ==========
app.get("/", async (req, res) => {
  res.json({ message: "Running", environment: process.env.NODE_ENV });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1", subscriberRouter);
app.use("/api/v1/quotes", quotesRouter);
app.use("/api/v1/trainers", trainerRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/plans", planRouter);
app.use("/api/v1/admin/auth", adminAuthRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/admin/subscriptions", adminSubscriptionRouter);
app.use("/Uploads", uploadsRouter);

// Start cron jobs
startCronJobs();

// ========== ERROR HANDLERS ==========

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error Handler:");
  console.error("  - URL:", req.url);
  console.error("  - Method:", req.method);
  console.error("  - Message:", err.message);
  console.error("  - Status:", err.statusCode);

  if (isDev) {
    console.error("  - Stack:", err.stack);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message: message,
    statusCode: statusCode,
    ...(isDev && {
      stack: err.stack,
      error: err,
    }),
  });
});

// ========== START SERVER ==========
const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app
      .listen(PORT, () => {
        console.log(`✅ Server running on PORT ${PORT}`);
        console.log(`✅ Environment: ${process.env.NODE_ENV || "development"}`);
        console.log(`✅ CORS enabled for:`, allowedOrigins);
      })
      .on("error", (error) => {
        console.log("❌ Error starting server:", error);
        process.exit(1);
      });
  } catch (error) {
    console.log("❌ Error connecting to database:", error);
    process.exit(1);
  }
};

startServer();
