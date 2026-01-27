import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// routers
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import amenityRouter from "./routes/amenity.routes.js";
import availabilityRouter from "./routes/availability.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import reviewRouter from "./routes/review.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import hostVerificationRouter from "./routes/hostVerification.routes.js";

const app = express();

/* =======================
   CORS CONFIG
======================= */
// Parse CORS_ORIGIN - can be comma-separated list or single value or *
const parseCorsOrigin = () => {
  const origin = process.env.CORS_ORIGIN || "http://localhost:5173";
  
  if (origin === "*") {
    return "*";
  }
  
  // Parse comma-separated origins
  if (origin.includes(",")) {
    return origin.split(",").map(o => o.trim());
  }
  
  return origin;
};

const corsOrigin = parseCorsOrigin();
const corsOptions = {
  origin: corsOrigin,
  credentials: corsOrigin !== "*",  // Only allow credentials if not wildcard
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

console.log("🔒 CORS Configuration:", { 
  origin: corsOptions.origin, 
  credentials: corsOptions.credentials 
});

app.use(cors(corsOptions));

/* =======================
   BODY PARSERS
======================= */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

/* =======================
   STATIC FILES
======================= */
app.use(express.static("public"));

/* =======================
   COOKIES
======================= */
app.use(cookieParser());

/* =======================
   CSP (DEV SAFE)
======================= */
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:8000 http://localhost:8080; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (_req, res) => {
  res.send("EasyStay API running 🚀");
});

/* Test endpoint to verify backend connectivity */
app.get("/api/v1/test", (_req, res) => {
  res.json({ success: true, message: "Backend is connected" });
});

/* =======================
   AUTH + USER ROUTES
======================= */
app.use("/api/v1/auth", authRouter); // register, login, logout, refresh
app.use("/api/v1/users", authRouter); // register, login, logout, refresh
app.use("/api/v1/users", userRouter); // me, update, delete

/* =======================
   OTHER MODULE ROUTES
======================= */
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/amenities", amenityRouter);
app.use("/api/v1/availability", availabilityRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/host-verification", hostVerificationRouter);

/* =======================
   ERROR HANDLING MIDDLEWARE
======================= */
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

export { app };
