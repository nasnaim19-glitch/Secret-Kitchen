import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import cuisineRoutes from "./routes/cuisineRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import logger from "./config/logger.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(
  morgan(":method :url :status :response-time ms", {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
  })
);

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "Secret Kitchen API is running 🚀",
  });
});

// API Routes
app.use("/api/cuisines", cuisineRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/auth", authRoutes);

// Route not found
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);

  return res.status(404).json({
    message: "Route not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error(error);

  return res.status(500).json({
    message: "Internal server error",
  });
});

export default app;