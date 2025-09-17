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

// Global rate limiter for all routes
const globalRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === "production" ? 5000 : 1000, // Higher limit for production
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks and uploads
    return (
      req.url === "/" ||
      req.url === "/health" ||
      req.url.startsWith("/Uploads/")
    );
  },
});

// MIDDLEWARES
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000", // Add server origin
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
const isDev = process.env.NODE_ENV === "development";

app.use(
  helmet({
    contentSecurityPolicy: isDev
      ? {
          directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "http://localhost:3000", "data:"],
            connectSrc: ["'self'", "http://localhost:3000"],
          },
        }
      : {
          directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
          },
        },
    crossOriginResourcePolicy: false,
  })
);
app.use(globalRateLimiter);

// Routes Import
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import subscriberRouter from "./routes/subscriber.route.js";
import quotesRouter from "./routes/quote.routes.js";
import trainerRouter from "./routes/trainer.routes.js";
import productRouter from "./routes/product.routes.js";
import adminSubscriptionRouter from "./routes/adminSubscription.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import planRouter from "./routes/plan.routes.js";
import { startCronJobs } from "./utils/cronJobs.js";
// Add these imports
import adminAuthRouter from "./routes/adminAuth.routes.js";
import adminRouter from "./routes/admin.routes.js";
// Apply routers
app.get("/", async (req, res, next) => {
  res.json({ message: "Running" });
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
app.use("/api/v1/admin", adminSubscriptionRouter);
app.use("/Uploads", uploadsRouter);

startCronJobs();
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found 404",
    errorMessage: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      error: err.message,
    });
  }
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      message: "Unauthorized",
      error: err.message,
    });
  }
  console.error("Server Error:", err.stack);
  return res.status(500).json({
    message: "Internal Server Error",
    errorMessage: err.message,
  });
});

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app
      .listen(PORT, () => {
        console.log(`Server is running on PORT ${process.env.PORT}`);
      })
      .on("error", (error) => {
        console.log("Error starting server", error);
        process.exit(1);
      });
  } catch (error) {
    console.log("Error starting server", error);
    process.exit(1);
  }
};
startServer();
