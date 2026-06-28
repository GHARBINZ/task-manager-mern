import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

// Core middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`📩 Incoming Request: ${req.method} ${req.path}`);
  console.log("Current body:", req.body);
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Centralized error handler (must have 4 args)
app.use((err, req, res, next) => {
  console.error("❌ الخطأ الحقيقي هو:", err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
