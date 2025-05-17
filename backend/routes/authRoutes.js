import express from "express";
import {
  signup,
  login,
  getProfile,
  logout,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.post("/logout", logout);

export default router;
