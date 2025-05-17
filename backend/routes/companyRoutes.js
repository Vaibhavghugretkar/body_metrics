import express from "express";
import {
  upsertCompanyProfile,
  getCompanyProfile,
  generateApiKey,
  predictMeasurementByApiKey,
} from "../controllers/companyController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyApiKey } from "../middleware/apiKeyMiddleware.js";
import { uploadMiddleware } from "../utils/multer.js";

const router = express.Router();

router.post("/profile", verifyToken, upsertCompanyProfile);
router.get("/profile", verifyToken, getCompanyProfile);
router.post("/generate-api-key", verifyToken, generateApiKey);

router.post(
  "/predict",
  verifyApiKey,
  uploadMiddleware,
  predictMeasurementByApiKey
);

export default router;
