import express from "express";
import {
  getAllRecipes,
  getRecipeById,
} from "../controllers/recipeController.js";
import { optionalAuthenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalAuthenticateToken, getAllRecipes);
router.get("/:id", optionalAuthenticateToken, getRecipeById);

export default router;