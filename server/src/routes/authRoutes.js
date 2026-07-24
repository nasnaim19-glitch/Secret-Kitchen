import express from "express";
import {
  register,
  login,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authenticateToken, (req, res) => {
  return res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

export default router;