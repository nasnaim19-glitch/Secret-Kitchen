import express from "express";
import { getAllCuisines } from "../controllers/cuisineController.js";

const router = express.Router();

router.get("/", getAllCuisines);

export default router;