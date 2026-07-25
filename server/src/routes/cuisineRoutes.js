import express from "express";
import {
  getAllCuisines,
  getCuisineById,
} from "../controllers/cuisineController.js";
import { optionalAuthenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCuisines);
router.get("/:id", optionalAuthenticateToken, getCuisineById);

export default router;