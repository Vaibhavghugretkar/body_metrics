import express from "express";
import {
  upsertCompanyProfile,
  getCompanyProfile,
  generateApiKey,
} from "../controllers/companyController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/profile", verifyToken, upsertCompanyProfile);
router.get("/profile", verifyToken, getCompanyProfile);
router.post("/generate-api-key", verifyToken, generateApiKey);

export default router;
