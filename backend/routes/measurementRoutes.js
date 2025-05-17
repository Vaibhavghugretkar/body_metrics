import express from "express";
import {
  addMeasurement,
  getMeasurements,
  getLatestMeasurement,
} from "../controllers/measurementController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addMeasurement);
router.get("/", verifyToken, getMeasurements);
router.get("/latest", verifyToken, getLatestMeasurement);

export default router;
