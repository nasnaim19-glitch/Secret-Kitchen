import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import cuisineRoutes from "./routes/cuisineRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "Secret Kitchen API is running 🚀",
  });
});

// API Routes
app.use("/api/cuisines", cuisineRoutes);
app.use("/api/recipes", recipeRoutes);

export default app;